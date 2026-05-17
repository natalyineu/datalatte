#!/usr/bin/env node
/**
 * Agent 2 — Auditor (with brain)
 * Runs every 2 hours. Scans MDX files for issues.
 * Uses Groq to assess article quality and decide: fix vs regenerate.
 * Silent when all is clean.
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

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-Audit', ...options.headers },
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

async function triggerFixer() {
  const res = await fetchJson(
    `https://api.github.com/repos/${REPO}/actions/workflows/fixer.yml/dispatches`,
    { method: 'POST', headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Content-Type': 'application/json' } },
    JSON.stringify({ ref: 'main' })
  );
  return res.status === 204;
}

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama3-70b-8192', 'gemma2-9b-it'];

async function callGroq(prompt, maxTokens = 800) {
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

// ── Syntax audit ──────────────────────────────────────────────────────────────

function syntaxAudit(content) {
  const issues = [];
  if (/<think>/i.test(content)) issues.push('think_tags');
  if (/^## ##/m.test(content)) issues.push('double_heading');
  if (!content.trimStart().startsWith('---')) issues.push('missing_frontmatter');
  if (/<\$\d|\s<\d/.test(content)) issues.push('bare_jsx');
  const firstDash = content.indexOf('---');
  const secondDash = content.indexOf('---', firstDash + 3);
  if (firstDash === -1 || secondDash === -1) issues.push('incomplete_frontmatter');
  // Unquoted title with colon breaks YAML parser
  if (/^title:\s*[^"'\n][^\n]*:[^\n]/m.test(content)) issues.push('unquoted_title_colon');
  return issues;
}

// ── Groq quality check ────────────────────────────────────────────────────────

async function assessArticleQuality(filename, content) {
  // Strip think tags and frontmatter for assessment
  const stripped = content
    .replace(/<think>[\s\S]*?<\/think>\s*/gi, '')
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/<[A-Z][^>]*\/>/g, '') // remove MDX components
    .trim();

  const wordCount = stripped.split(/\s+/).filter(Boolean).length;

  // If very short after stripping, it's almost certainly broken — no need to ask Groq
  if (wordCount < 150) {
    return { action: 'regenerate', reason: `Only ${wordCount} words after cleanup — content too thin`, quality: 2 };
  }

  const prompt = `You are a content quality auditor for DataLatte.pro — a marketing blog for local small businesses (coffee shops, salons, pet groomers, fitness studios).

Assess this article excerpt (first 600 words):
---
${stripped.slice(0, 2000)}
---

Filename: ${filename}
Word count: ~${wordCount}

Answer in JSON only:
{
  "quality": <1-10 score>,
  "action": "keep" | "fix" | "regenerate",
  "reason": "<one sentence>",
  "has_cta": <true|false>,
  "on_topic": <true|false>
}

Rules:
- "keep" if quality >= 7, on-topic, has clear value for small business owners
- "fix" if quality 4-6, minor issues but core content is salvageable
- "regenerate" if quality < 4, off-topic, or content is mostly AI thinking/planning text
- "on_topic" = relevant to local small business marketing`;

  try {
    const response = await callGroq(prompt, 300);
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.log(`Quality check failed for ${filename}: ${e.message}`);
  }

  return { action: 'fix', reason: 'Quality check inconclusive', quality: 5, has_cta: true, on_topic: true };
}

// ── Queue helpers ─────────────────────────────────────────────────────────────

function checkQueueDuplicates() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return [];
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const seen = {};
  const dupes = [];
  for (const e of queue.queue) {
    if (seen[e.slug]) dupes.push(e.slug);
    else seen[e.slug] = true;
  }
  return dupes;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Audit Agent starting...');

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory — nothing to audit');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const syntaxProblems = [];
  const toRegenerate = [];
  const toFix = [];

  // Step 1: Syntax scan all files
  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const issues = syntaxAudit(content);
    if (issues.length > 0) {
      syntaxProblems.push({ file, issues, content });
    }
  }

  // Step 2: For each syntax problem, ask Groq what to do
  console.log(`Found ${syntaxProblems.length} files with syntax issues`);
  for (const problem of syntaxProblems) {
    console.log(`  Assessing: ${problem.file}...`);
    const assessment = await assessArticleQuality(problem.file, problem.content);
    console.log(`  → ${assessment.action} (quality: ${assessment.quality}/10) — ${assessment.reason}`);

    if (assessment.action === 'regenerate') {
      toRegenerate.push({ ...problem, assessment });
    } else {
      toFix.push({ ...problem, assessment });
    }
  }

  // Step 3: Sample 8 random clean articles for quality check
  const cleanFiles = files.filter(f => !syntaxProblems.find(p => p.file === f));
  const sample = cleanFiles.sort(() => Math.random() - 0.5).slice(0, 8);
  const lowQuality = [];
  const allQualityScores = [];

  console.log(`Sampling ${sample.length} random articles for quality...`);
  for (const file of sample) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const assessment = await assessArticleQuality(file, content);
    if (assessment.quality) allQualityScores.push(assessment.quality);
    if (assessment.quality < 5 || !assessment.on_topic) {
      lowQuality.push({ file, assessment });
      console.log(`  ⚠️ Low quality: ${file} (${assessment.quality}/10)`);
    } else {
      console.log(`  ✅ ${file} (${assessment.quality}/10)`);
    }
  }

  const qualityAvg = allQualityScores.length > 0
    ? Math.round((allQualityScores.reduce((a, b) => a + b, 0) / allQualityScores.length) * 10) / 10
    : null;

  // Step 4: Check queue duplicates
  const dupes = checkQueueDuplicates();

  const totalIssues = syntaxProblems.length + dupes.length + lowQuality.length;
  console.log(`Total issues: ${totalIssues}`);

  // Step 5: Save report for Fixer + Pipeline Manager
  const report = {
    timestamp: new Date().toISOString(),
    toFix: toFix.map(p => ({ file: p.file, issues: p.issues, assessment: p.assessment })),
    toRegenerate: toRegenerate.map(p => ({ file: p.file, issues: p.issues, assessment: p.assessment })),
    lowQuality,
    duplicateSlugs: dupes,
    qualityAvg,
    sampledFiles: sample.length,
  };
  fs.writeFileSync(path.join(process.cwd(), 'scripts/.audit-report.json'), JSON.stringify(report, null, 2));

  if (totalIssues === 0) {
    console.log('✅ All clean');
    return;
  }

  // Step 6: Build Telegram message
  let msg = `🔍 <b>Audit Agent</b>\n📅 ${new Date().toUTCString().slice(0, 25)}\n\n`;

  if (toFix.length > 0) {
    msg += `🔧 ${toFix.length} file(s) to fix:\n`;
    msg += toFix.slice(0, 4).map(p => `• ${p.file.slice(0, 45)}: ${p.issues.join(', ')}`).join('\n') + '\n\n';
  }
  if (toRegenerate.length > 0) {
    msg += `♻️ ${toRegenerate.length} file(s) to regenerate:\n`;
    msg += toRegenerate.slice(0, 3).map(p => `• ${p.file.slice(0, 45)} — ${p.assessment.reason}`).join('\n') + '\n\n';
  }
  if (qualityAvg !== null) {
    const qualityEmoji = qualityAvg >= 7 ? '✅' : qualityAvg >= 5 ? '⚠️' : '🔴';
    msg += `${qualityEmoji} Avg quality (${sample.length} sampled): <b>${qualityAvg}/10</b>\n\n`;
  }
  if (lowQuality.length > 0) {
    msg += `⚠️ ${lowQuality.length} low-quality article(s):\n`;
    msg += lowQuality.map(p => `• ${p.file.slice(0, 45)} (${p.assessment.quality}/10)`).join('\n') + '\n\n';
  }
  if (dupes.length > 0) {
    msg += `🔁 ${dupes.length} duplicate slug(s) in queue\n\n`;
  }

  if (toFix.length > 0 || toRegenerate.length > 0 || dupes.length > 0) {
    msg += `🔧 Triggering Fixer...`;
    await telegram(msg);
    const triggered = await triggerFixer();
    if (!triggered) await telegram('⚠️ Could not trigger Fixer — check PAT_TOKEN');
  } else {
    await telegram(msg);
  }

  console.log('✅ Audit Agent done');
}

main().catch(async e => {
  console.error('Audit Agent error:', e.message);
  await telegram(`❌ <b>Audit Agent failed</b>\n${e.message}`);
  process.exit(1);
});
