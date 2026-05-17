#!/usr/bin/env node
/**
 * Agent 6 — Improver (Sales Engineer)
 * Runs weekly. Reads 15 published articles, uses Groq to assess
 * conversion effectiveness, writes proposals to content/proposals.json.
 * Proposals require human approval before applying.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GROQ_KEY = process.env.GROQ_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const QUEUE_PATH = path.join(process.cwd(), 'content/queue.json');

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama3-70b-8192', 'gemma2-9b-it'];

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-Improver', ...options.headers },
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Groq ──────────────────────────────────────────────────────────────────────

async function callGroq(prompt, maxTokens = 600) {
  for (const model of GROQ_MODELS) {
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: maxTokens,
    });
    const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    }, body);
    if (res.status === 200) {
      return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    }
    const code = res.data?.error?.code;
    if (res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned') continue;
    throw new Error(`Groq error ${res.status}`);
  }
  throw new Error('All Groq models unavailable');
}

// ── GitHub file read/write ────────────────────────────────────────────────────

async function ghGetFile(filePath) {
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`;
  const res = await fetchJson(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${GH_TOKEN}` },
  });
  if (res.status === 200) {
    const content = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf8'));
    return { content, sha: res.data.sha };
  }
  return { content: null, sha: '' };
}

async function ghPutFile(filePath, content, sha, message) {
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`;
  const body = JSON.stringify({
    message,
    content: Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64'),
    ...(sha && { sha }),
  });
  const res = await fetchJson(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }, body);
  return res.status === 200 || res.status === 201;
}

// ── Conversion assessment ─────────────────────────────────────────────────────

async function assessConversion(slug, content) {
  const truncated = content.slice(0, 3000);

  const prompt = `You are a conversion optimization expert for DataLatte.pro — a marketing blog for local small businesses (coffee shops, salons, pet groomers, fitness studios). Nataliia offers paid ads, local SEO, and marketing automation services.

Analyze this article for conversion potential. Look for:
1. CTA strength — does it ask the reader to DO something specific?
2. Internal links — does it link to relevant service pages (/services/google-ads etc)?
3. Conversion language — specific numbers, urgency, direct recommendations?
4. Missing opportunities — what one addition would most increase leads?

Article content (first 3000 chars):
---
${truncated}
---

Respond in JSON only (no extra text):
{
  "cta_score": <1-5>,
  "link_score": <0-3>,
  "conversion_score": <1-5>,
  "overall": <1-10>,
  "top_issue": "<one sentence describing the biggest conversion problem>",
  "proposal": "<specific actionable improvement: exact text to add, where to put it, what type of Callout or CTA>",
  "impact": <1-10>,
  "type": "cta" | "internal_link" | "conversion_language" | "social_proof"
}`;

  try {
    const response = await callGroq(prompt, 600);
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.log(`Conversion assessment failed for ${slug}: ${e.message}`);
  }

  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎯 Improver Agent starting...');

  if (!GROQ_KEY) throw new Error('GROQ_API_KEY is required');
  if (!GH_TOKEN) throw new Error('GH_TOKEN is required');

  // 1. Read queue to get published slugs
  if (!fs.existsSync(QUEUE_PATH)) {
    console.log('No queue.json found — nothing to analyze');
    return;
  }
  const queueData = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const publishedEntries = (queueData.queue || []).filter(e => e.status === 'published');

  if (publishedEntries.length === 0) {
    console.log('No published articles — nothing to analyze');
    return;
  }

  // 2. Load existing proposals to skip slugs that already have pending ones
  const { content: proposalsData, sha: proposalsSha } = await ghGetFile('content/proposals.json');
  const existingProposals = proposalsData?.proposals || [];
  const pendingSlugs = new Set(
    existingProposals.filter(p => ['pending', 'approved'].includes(p.status)).map(p => p.slug)
  );

  // 3. Pick 15 random published articles (skip those with pending proposals)
  const eligible = publishedEntries.filter(e => !pendingSlugs.has(e.slug));
  const shuffled = eligible.sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 15);

  let analyzed = 0;
  let added = 0;
  const newProposals = [];

  // 4. Analyze each article
  for (const entry of sample) {
    const mdxPath = path.join(BLOG_DIR, `${entry.slug}.mdx`);

    if (!fs.existsSync(mdxPath)) {
      // Try to find without exact match
      const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : [];
      const match = files.find(f => f.replace('.mdx', '') === entry.slug);
      if (!match) {
        console.log(`⏭ Skipping: ${entry.slug} (MDX file not found)`);
        continue;
      }
    }

    if (pendingSlugs.has(entry.slug)) {
      console.log(`⏭ Skipping: ${entry.slug} (already has pending proposal)`);
      continue;
    }

    const content = fs.readFileSync(mdxPath, 'utf8');
    const assessment = await assessConversion(entry.slug, content);

    if (!assessment) {
      console.log(`⚠️ Could not assess: ${entry.slug}`);
      continue;
    }

    analyzed++;
    console.log(`📖 Analyzing: ${entry.slug} — overall ${assessment.overall}/10`);

    // 5. Only propose if overall < 8 and impact >= 6
    if (assessment.overall < 8 && assessment.impact >= 6) {
      const proposal = {
        id: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        slug: entry.slug,
        title: entry.title,
        cluster: entry.cluster,
        issue: assessment.top_issue,
        proposal: assessment.proposal,
        type: assessment.type,
        impactScore: assessment.impact,
        ctaScore: assessment.cta_score,
        linkScore: assessment.link_score,
        conversionScore: assessment.conversion_score,
        overallScore: assessment.overall,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      newProposals.push(proposal);
      pendingSlugs.add(entry.slug);
      added++;
      console.log(`💡 Proposal added: ${entry.slug} (impact: ${assessment.impact}/10, type: ${assessment.type})`);
    }

    await sleep(2000);
  }

  // 6. Write proposals to GitHub
  if (newProposals.length > 0) {
    const updatedProposals = {
      _schema: 'Improvement proposals from Agent 6 — Improver',
      proposals: [...existingProposals, ...newProposals],
    };
    const ok = await ghPutFile(
      'content/proposals.json',
      updatedProposals,
      proposalsSha,
      `Add ${newProposals.length} improvement proposals [vercel skip]`
    );
    if (!ok) {
      console.log('⚠️ Failed to write proposals to GitHub');
    }
  }

  console.log(`✅ Done — analyzed ${analyzed}, proposals added: ${added}`);
  console.log(`PROPOSALS_ADDED: ${added}`);
  console.log(`ARTICLES_ANALYZED: ${analyzed}`);

  // 7. Telegram summary
  await telegram(`🎯 <b>Improver Agent</b>\nAnalyzed ${analyzed} articles · Added ${added} proposals`);
}

main().catch(async e => {
  console.error('Improver Agent error:', e.message);
  await telegram(`❌ <b>Improver Agent failed</b>\n${e.message}`);
  process.exit(1);
});
