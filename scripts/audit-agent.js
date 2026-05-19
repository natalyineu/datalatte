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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound', 'qwen/qwen3-32b', 'llama-3.1-8b-instant', 'groq/compound-mini'];

let _groqTokens = 0;

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
      _groqTokens += res.data?.usage?.total_tokens ?? 0;
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
  if (/^title:\s+[^"'\n][^\n]*:[^\n]/m.test(content)) issues.push('unquoted_title_colon');
  // MDX component checks
  issues.push(...mdxComponentAudit(content));
  return issues;
}

// ── MDX component checks ──────────────────────────────────────────────────────

function mdxComponentAudit(content) {
  const issues = [];

  // BarChart/StatRow: CPA label with trend="up" at the same pipe-index — high CPA is bad
  // Uses position-aware parsing: "up" elsewhere in trends string is NOT a problem
  const componentBlocks = [...content.matchAll(/<(?:StatRow|BarChart)\s[^>]+?\/>/gs)];
  for (const m of componentBlocks) {
    const block = m[0];
    const labelsM = block.match(/labels="([^"]+)"/);
    const trendsM = block.match(/trends?="([^"]+)"/);
    if (!labelsM || !trendsM) continue;
    const lbls = labelsM[1].split('|').map(s => s.trim());
    const trds = trendsM[1].split('|').map(s => s.trim());
    lbls.forEach((lbl, i) => {
      if (/CPA|cost per acq/i.test(lbl) && trds[i] === 'up') {
        issues.push('mdx_cpa_trend_up');
      }
    });
  }

  // BarChart: CPA in highlights — presenting high CPA as "best"
  const cpaBest = /(?:StatRow|BarChart)[^>]*highlights?="[^"]*CPA[^"]*"/i;
  if (cpaBest.test(content)) issues.push('mdx_cpa_highlighted_best');

  // BarChart with unit="%" — value renders as %85 instead of 85% (now fixed in component, flag old occurrences for tracking)
  // Removed — bug is fixed in BarChart.tsx; no need to flag

  // StatRow: CPA label paired with a plain % value (e.g. "50%" for CPA makes no sense)
  const statRowMatches = [...content.matchAll(/<StatRow[^/]*\/>/gs)];
  for (const m of statRowMatches) {
    const block = m[0];
    const labels = (block.match(/labels="([^"]+)"/) || [])[1] || '';
    const values = (block.match(/values="([^"]+)"/) || [])[1] || '';
    if (!labels || !values) continue;
    const labelArr = labels.split('|');
    const valueArr = values.split('|');
    labelArr.forEach((label, i) => {
      if (/CPA|cost per acq/i.test(label)) {
        const val = (valueArr[i] || '').trim();
        // CPA should be a dollar amount, not a bare percentage
        if (/^\d+%$/.test(val)) issues.push('mdx_cpa_nonsense_percent_value');
      }
    });
  }

  // Generic: any component using "CPA" near positive language suggesting high is good
  if (/CPA[^.!?\n]{0,40}(?:achiev|target|goal|aim|great|strong|win)[^.!?\n]{0,40}(?:high|higher|\d{3,})/i.test(content)) {
    issues.push('mdx_cpa_possibly_positive_high');
  }

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
${stripped.slice(0, 3500)}
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

// ── Persist quality scores to GitHub ──────────────────────────────────────────

async function persistQualityScores(scores) {
  // scores = [{ file: 'slug.mdx', score: 8, has_cta: true, on_topic: true }]
  const url = `https://api.github.com/repos/${REPO}/contents/content/quality-scores.json`;

  // GET existing
  const getRes = await fetchJson(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${GH_TOKEN}` },
  });

  let existing = { _schema: 'Quality scores from Agent 2 — Auditor', scores: {} };
  let sha = '';

  if (getRes.status === 200) {
    try {
      existing = JSON.parse(Buffer.from(getRes.data.content, 'base64').toString('utf8'));
      sha = getRes.data.sha;
    } catch {
      // keep defaults
    }
  }

  const now = new Date().toISOString();
  for (const s of scores) {
    const slug = s.file.replace('.mdx', '');
    existing.scores[slug] = {
      score: s.score,
      has_cta: s.has_cta ?? true,
      on_topic: s.on_topic ?? true,
      checkedAt: now,
    };
  }

  const body = JSON.stringify({
    message: 'Update quality scores [vercel skip]',
    content: Buffer.from(JSON.stringify(existing, null, 2) + '\n').toString('base64'),
    ...(sha && { sha }),
  });

  await fetchJson(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }, body);
}

// ── Local quality scores ──────────────────────────────────────────────────────

function loadLocalScores() {
  const scoresPath = path.join(process.cwd(), 'content/quality-scores.json');
  if (!fs.existsSync(scoresPath)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
    return data.scores ?? {};
  } catch { return {}; }
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

  // Step 3: Audit oldest-unchecked articles first (full rotation, 40/run)
  const BATCH_SIZE = 40;
  const existingScores = loadLocalScores();
  const cleanFiles = files.filter(f => !syntaxProblems.find(p => p.file === f));
  const sample = cleanFiles
    .sort((a, b) => {
      const aTime = existingScores[a.replace('.mdx', '')]?.checkedAt ?? '1970-01-01';
      const bTime = existingScores[b.replace('.mdx', '')]?.checkedAt ?? '1970-01-01';
      return aTime.localeCompare(bTime); // oldest / never-checked first
    })
    .slice(0, BATCH_SIZE);

  const lowQuality = [];
  const allQualityScores = [];
  const sampleAssessments = []; // { file, assessment }

  const uncheckedCount = cleanFiles.filter(f => !existingScores[f.replace('.mdx', '')]).length;
  console.log(`Auditing ${sample.length} articles (${uncheckedCount} never checked, ${cleanFiles.length} total clean)...`);
  for (const file of sample) {
    await new Promise(r => setTimeout(r, 400)); // stay under Groq rate limit
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const assessment = await assessArticleQuality(file, content);
    sampleAssessments.push({ file, assessment });
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

  // Persist quality scores to GitHub (best-effort, don't fail if it errors)
  if (GH_TOKEN && sampleAssessments.length > 0) {
    const richScores = sampleAssessments.map(({ file, assessment }) => ({
      file,
      score: assessment.quality ?? 5,
      has_cta: assessment.has_cta ?? true,
      on_topic: assessment.on_topic ?? true,
    }));
    persistQualityScores(richScores).catch(e => console.log('Quality persist failed:', e.message));
  }

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
    auditedThisRun: sample.length,
    totalScored: Object.keys(existingScores).length,
  };
  fs.writeFileSync(path.join(process.cwd(), 'scripts/.audit-report.json'), JSON.stringify(report, null, 2));

  // Step 6: Build Telegram message
  const qualityEmoji = qualityAvg === null ? '❓' : qualityAvg >= 7 ? '✅' : qualityAvg >= 5 ? '⚠️' : '🔴';
  const qualityStr   = qualityAvg !== null ? `${qualityAvg}/10` : 'n/a';
  const time         = new Date().toUTCString().slice(0, 25);

  if (totalIssues === 0) {
    console.log('✅ All clean');
    // Still report quality data — silence isn't useful
    let cleanMsg = `🔍 <b>Auditor</b> — all clean ✅\n`;
    cleanMsg += `🕐 ${time}\n\n`;
    cleanMsg += `${qualityEmoji} Avg quality: <b>${qualityStr}</b> · ${sample.length} articles audited this run · ${Object.keys(existingScores).length} total scored\n`;
    cleanMsg += `📋 0 syntax issues · 0 duplicates · 0 low quality`;
    await telegram(cleanMsg);
    console.log('✅ Audit Agent done');
    return;
  }

  let msg = `🔍 <b>Auditor</b> — ${totalIssues} issue(s) found\n`;
  msg += `🕐 ${time}\n\n`;
  msg += `${qualityEmoji} Avg quality: <b>${qualityStr}</b> · ${sample.length} articles audited this run · ${Object.keys(existingScores).length} total scored\n`;

  if (lowQuality.length > 0) {
    msg += `\n⚠️ Low quality (&lt;6/10):\n`;
    msg += lowQuality.slice(0, 4).map(p => `  • ${p.file.replace('content/blog/', '').replace('.mdx', '')} → <b>${p.assessment.quality}/10</b>`).join('\n') + '\n';
  }
  if (toFix.length > 0) {
    msg += `\n🔧 MDX issues (${toFix.length}):\n`;
    msg += toFix.slice(0, 4).map(p => `  • ${p.file.replace('content/blog/', '').replace('.mdx', '')}: ${p.issues.join(', ')}`).join('\n') + '\n';
  }
  if (toRegenerate.length > 0) {
    msg += `\n♻️ Queued for regen (${toRegenerate.length}):\n`;
    msg += toRegenerate.slice(0, 3).map(p => `  • ${p.file.replace('content/blog/', '').replace('.mdx', '')} — ${p.assessment.reason}`).join('\n') + '\n';
  }
  if (dupes.length > 0) {
    msg += `\n🔁 Duplicate slugs: ${dupes.length}\n`;
  }

  if (toFix.length > 0 || toRegenerate.length > 0 || dupes.length > 0) {
    msg += `\n🔧 Triggering Fixer Agent...`;
    await telegram(msg);
    const triggered = await triggerFixer();
    console.log(`Triggering Fixer agent — ${triggered ? 'success' : 'failed'}`);
    if (!triggered) await telegram('🔍 <b>Auditor</b> — ⚠️ Could not trigger Fixer. Check PAT_TOKEN.');
  } else {
    await telegram(msg);
  }

  console.log('✅ Audit Agent done');
}

main().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch(async e => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  console.error('Audit Agent error:', e.message);
  await telegram(`🔍 <b>Auditor</b> — failed ❌\n${e.message}`);
  process.exit(1);
});
