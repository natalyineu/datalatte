#!/usr/bin/env node
/**
 * FAQ Fixer — adds FAQ sections to articles that don't have one.
 * Processes 5 articles per run. Chained by its own workflow.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const GROQ_KEY  = process.env.GROQ_API_KEY;
const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
const GH_TOKEN  = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO      = 'natalyineu/datalatte';
const BLOG_DIR  = path.join(process.cwd(), 'content/blog');
const BATCH     = 5;   // articles per run
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT  = process.env.TELEGRAM_CHAT_ID;

let _groqTokens = 0;

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'qwen/qwen3-32b',
  'llama-3.1-8b-instant',
  'groq/compound-mini',
];

const CEREBRAS_MODELS = [
  'llama-3.3-70b',
  'llama3.1-70b',
  'llama3.1-8b',
  'qwen-3-32b',
];

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-FaqFixer', ...options.headers },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data, headers: res.headers }); }
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
  }, JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg })).catch(() => {});
}

// ── Groq with proper rate limit handling ─────────────────────────────────────

async function callGroq(prompt, maxTokens = 800) {
  if (CEREBRAS_KEY) {
    for (const model of CEREBRAS_MODELS) {
      const res = await fetchJson('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CEREBRAS_KEY}`, 'Content-Type': 'application/json' },
      }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: maxTokens }));
      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        console.log(`✅ Cerebras model used: ${model}`);
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      if (res.status === 429 || res.data?.error?.code === 'rate_limit_exceeded') continue;
      if (res.status === 404 || res.data?.error?.code === 'model_decommissioned') continue;
    }
    console.log('⚠️  All Cerebras models unavailable, falling back to Groq...');
  }
  let consecutiveFails = 0;
  for (const model of GROQ_MODELS) {
    if (consecutiveFails >= 3) {
      console.log('⏸️  3 models rate-limited, pausing 90s...');
      await sleep(90000);
      consecutiveFails = 0;
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const body = JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: maxTokens,
      });
      const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      }, body);
      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        const text = res.data.choices[0].message.content;
        return text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      const code = res.data?.error?.code;
      if (res.status === 429 || code === 'rate_limit_exceeded') {
        const retryAfter = res.headers?.['retry-after'];
        const waitMatch  = (res.data?.error?.message || '').match(/try again in ([\d.]+)s/i);
        const rawWaitMs = retryAfter
          ? Math.ceil(parseFloat(retryAfter) * 1000) + 2000
          : waitMatch ? Math.ceil(parseFloat(waitMatch[1]) * 1000) + 2000 : 60000;
        const MAX_WAIT_MS = 120000;
        if (rawWaitMs > MAX_WAIT_MS) {
          console.log(`⚡ ${model} quota exhausted (retry-after ${Math.round(rawWaitMs/1000)}s) — skipping to next model`);
          break;
        }
        console.log(`⏳ Rate limited on ${model}, waiting ${Math.round(rawWaitMs/1000)}s...`);
        await sleep(rawWaitMs);
        continue;
      }
      if (code === 'model_decommissioned' || res.status === 404) break;
      throw new Error(`Groq ${res.status}: ${JSON.stringify(res.data).slice(0, 120)}`);
    }
    consecutiveFails++;
    console.log(`⚠️  Giving up on ${model}, trying next...`);
  }
  throw new Error('All Groq models unavailable');
}

// ── GitHub helpers ────────────────────────────────────────────────────────────

async function ghGet(filePath) {
  const res = await fetchJson(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Accept': 'application/vnd.github+json' },
  });
  if (res.status !== 200) return null;
  return { sha: res.data.sha, content: Buffer.from(res.data.content, 'base64').toString('utf8') };
}

async function ghPut(filePath, content, message, sha) {
  const body = JSON.stringify({
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: 'main',
    ...(sha && { sha }),
  });
  const res = await fetchJson(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
  }, body);
  if (res.status > 299) throw new Error(`GitHub PUT failed ${res.status}: ${JSON.stringify(res.data).slice(0,120)}`);
  return true;
}

// ── Frontmatter parser (simple) ───────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { fm: {}, content: raw };
  const fmRaw = match[1];
  const content = match[2];
  const fm = {};
  fmRaw.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
  return { fm, content, fmRaw };
}

function hasFaq(content) {
  return /^##\s+(Frequently Asked Questions|FAQ)/im.test(content);
}

// ── FAQ generation ────────────────────────────────────────────────────────────

async function generateFaq(title, category, content) {
  // Summarise the article for context (first 800 chars of body)
  const snippet = content.slice(0, 800).replace(/[#*`<>]/g, '').trim();

  const prompt = `You are writing a FAQ section for a blog post on DataLatte.pro, a local marketing agency website.

Article title: "${title}"
Category: "${category}"
Article excerpt: "${snippet}"

Write EXACTLY 5 FAQ questions and answers for this article. Format them like this:

### Question one here?

Answer here. 2-3 sentences. Specific and practical.

### Question two here?

Answer here.

(repeat for all 5)

Rules:
- Questions must be what a local small business owner would actually Google
- Answers must be direct, 2-4 sentences, no fluff
- Use real numbers where possible
- Do NOT include any preamble, heading, or closing text — output ONLY the 5 Q&A blocks
- Do NOT use <Callout> or any JSX inside the FAQ`;

  const raw = await callGroq(prompt, 700);
  return '\n\n## Frequently Asked Questions\n\n' + raw.trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!GROQ_KEY) { console.error('❌ GROQ_API_KEY not set'); process.exit(1); }
  if (!GH_TOKEN) { console.error('❌ GH_TOKEN not set'); process.exit(1); }

  // Find articles without FAQ sections (from local checkout — fast)
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const noFaq = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { content } = parseFrontmatter(raw);
    if (!hasFaq(content)) noFaq.push(file);
  }

  console.log(`📋 Articles without FAQ: ${noFaq.length}`);
  if (noFaq.length === 0) {
    console.log('✅ All articles have FAQ sections — nothing to do.');
    await telegram('FAQ Fixer ✅ — all articles have FAQ sections.');
    return;
  }

  const batch = noFaq.slice(0, BATCH);
  console.log(`🔧 Processing ${batch.length} articles this run...`);

  let fixed = 0;
  let failed = 0;

  for (const file of batch) {
    const ghPath = `content/blog/${file}`;
    try {
      // Read from GitHub for fresh SHA
      const ghFile = await ghGet(ghPath);
      if (!ghFile) { console.log(`⚠️  ${file}: not found on GitHub`); failed++; continue; }

      const { fm, content, fmRaw } = parseFrontmatter(ghFile.content);

      // Double-check (GitHub version may already have FAQ if recently updated)
      if (hasFaq(content)) {
        console.log(`⏭️  ${file}: already has FAQ (skip)`);
        continue;
      }

      const title    = fm.title    || file.replace('.mdx', '').replace(/-/g, ' ');
      const category = fm.category || '';

      console.log(`✍️  Generating FAQ for: ${title.slice(0, 60)}...`);
      const faqSection = await generateFaq(title, category, content);

      // Append FAQ before any trailing whitespace
      const updatedContent = content.trimEnd() + faqSection + '\n';
      const updatedRaw     = `---\n${fmRaw}\n---\n${updatedContent}`;

      await ghPut(ghPath, updatedRaw, `Add FAQ section: ${file.replace('.mdx','')} [vercel skip]`, ghFile.sha);
      console.log(`✅ Fixed: ${file}`);
      fixed++;

      // Pace between articles to avoid rate limits
      if (batch.indexOf(file) < batch.length - 1) await sleep(5000);

    } catch (err) {
      console.error(`❌ Failed ${file}: ${err.message}`);
      failed++;
    }
  }

  const remaining = noFaq.length - fixed;
  console.log(`\n=== Run complete: ${fixed} fixed, ${failed} failed, ${remaining} remaining ===`);
  console.log(`FAQ_FIXED:${fixed}`);
  console.log(`FAQ_REMAINING:${remaining}`);

  await telegram(
    `FAQ Fixer 🔧\n` +
    `Fixed: ${fixed} articles\n` +
    `Failed: ${failed}\n` +
    `Remaining: ${remaining}\n` +
    (remaining > 0 ? `Next run triggered automatically.` : `✅ All articles now have FAQs!`)
  );
}

main().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch(err => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  console.error('Fatal:', err.message);
  process.exit(1);
});
