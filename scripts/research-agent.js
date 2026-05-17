#!/usr/bin/env node
/**
 * Agent 1 — Researcher
 * Runs daily. Reads Google Trends CSVs, checks queue balance,
 * uses Groq to suggest new articles, adds them to queue.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GROQ_KEY = process.env.GROQ_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-Research', ...options.headers },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function telegram(msg) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) return;
  await fetchJson(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg, parse_mode: 'HTML' }));
}

async function ghGetFile(filePath) {
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`;
  const res = await fetchJson(url, { method: 'GET', headers: { 'Authorization': `Bearer ${GH_TOKEN}` } });
  if (res.status !== 200) return null;
  return { content: Buffer.from(res.data.content, 'base64').toString('utf8'), sha: res.data.sha };
}

async function ghPutFile(filePath, content, message, sha) {
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`;
  const body = JSON.stringify({
    message, sha,
    content: Buffer.from(content).toString('base64'),
  });
  const res = await fetchJson(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Content-Type': 'application/json' },
  }, body);
  return res.status === 200 || res.status === 201;
}

async function callGroq(prompt) {
  const models = ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama3-70b-8192', 'gemma2-9b-it'];
  for (const model of models) {
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });
    const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    }, body);
    if (res.status === 200) return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    const code = res.data?.error?.code;
    if (res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned') continue;
    throw new Error(`Groq error ${res.status}: ${JSON.stringify(res.data)}`);
  }
  throw new Error('All Groq models unavailable');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔬 Research Agent starting...');

  // 1. Load queue from GitHub
  const queueFile = await ghGetFile('content/queue.json');
  if (!queueFile) throw new Error('Could not load queue.json');
  const queue = JSON.parse(queueFile.content);

  const published = queue.queue.filter(e => e.status === 'published');
  const pending = queue.queue.filter(e => e.status === 'pending');
  const existingSlugs = new Set(queue.queue.map(e => e.slug));

  // 2. Count by category
  const catCount = {};
  for (const e of [...published, ...pending]) {
    const cat = e.category || 'Unknown';
    catCount[cat] = (catCount[cat] || 0) + 1;
  }
  const catSummary = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([c, n]) => `  ${c}: ${n}`)
    .join('\n');

  // 3. Read Google Trends CSVs for rising topics
  let trendsContext = '';
  const trendsDir = 'seo-research/google-trends';
  try {
    const files = fs.readdirSync(trendsDir).filter(f => f.startsWith('rising_') && f.endsWith('.csv'));
    for (const f of files.slice(-10)) {
      const csv = fs.readFileSync(path.join(trendsDir, f), 'utf8');
      const lines = csv.split('\n').slice(1, 16).join('\n');
      trendsContext += `\n--- ${f} ---\n${lines}`;
    }
  } catch { trendsContext = 'No trends data available'; }

  // 4. Ask Groq to suggest new article slugs
  const prompt = `You are a content strategist for DataLatte.pro — a marketing blog for local small businesses (coffee shops, hair salons, pet groomers, fitness studios) in the US/UK/AU.

Current queue category counts:
${catSummary}

Recent rising Google Trends topics:
${trendsContext}

Based on gaps in coverage and trending topics, suggest exactly 10 new article ideas.
Focus on: AI agents for local business, marketing automation, specific niche + tool combinations.
Avoid: generic Google Ads content (we have too much already).

Return ONLY a JSON array of objects, no explanation:
[
  {"slug": "url-friendly-slug-here", "title": "Full Article Title Here", "category": "AI Agents", "niche": "general"},
  ...
]

Valid categories: AI Agents, AI Automation, Email Marketing, Local SEO, Instagram Ads, TikTok Ads, Facebook Ads, Programmatic Advertising, Marketing Automation, Coffee Shops, Hair Salons, Pet Groomers, Fitness Studios
Valid niches: general, coffee-shops, hair-salons, pet-groomers, fitness-studios`;

  console.log('🤖 Asking Groq for article suggestions...');
  const response = await callGroq(prompt);

  // 5. Parse suggestions
  let suggestions = [];
  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (match) suggestions = JSON.parse(match[0]);
  } catch (e) {
    console.log('Could not parse Groq response:', response.slice(0, 200));
  }

  // 6. Filter out existing slugs and add to queue
  const newArticles = suggestions.filter(a => a.slug && !existingSlugs.has(a.slug));
  for (const art of newArticles) {
    queue.queue.push({ slug: art.slug, title: art.title, status: 'pending', category: art.category, niche: art.niche || 'general' });
    existingSlugs.add(art.slug);
  }

  // 7. Push updated queue
  if (newArticles.length > 0) {
    const saved = await ghPutFile('content/queue.json', JSON.stringify(queue, null, 2) + '\n',
      `Research: add ${newArticles.length} new articles to queue [vercel skip]`, queueFile.sha);
    console.log(`✅ Added ${newArticles.length} articles, saved: ${saved}`);
  }

  // 8. Telegram report
  const addedList = newArticles.slice(0, 8).map(a => `• ${a.title}`).join('\n');
  const msg = newArticles.length > 0
    ? `🔬 <b>Research Agent</b>\n📅 ${new Date().toISOString().slice(0, 10)}\n\n📈 Added ${newArticles.length} new articles to queue:\n${addedList}\n\n📊 Queue: ${pending.length + newArticles.length} pending | ${published.length} published`
    : `🔬 <b>Research Agent</b>\n📅 ${new Date().toISOString().slice(0, 10)}\n\n✅ Queue looks balanced — no new articles added\n📊 ${pending.length} pending | ${published.length} published`;

  await telegram(msg);
  console.log('✅ Research Agent done');
}

main().catch(async e => {
  console.error('Research Agent error:', e.message);
  await telegram(`❌ <b>Research Agent failed</b>\n${e.message}`);
  process.exit(1);
});
