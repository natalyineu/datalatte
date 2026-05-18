#!/usr/bin/env node
/**
 * Agent 3 — Fixer (with brain)
 * Triggered by Auditor. Fixes syntax issues, then uses Groq to verify
 * the result is worth keeping. Marks bad articles for regeneration.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

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
      headers: { 'User-Agent': 'DataLatte-Fixer', ...options.headers },
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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'meta-llama/llama-4-scout-17b-16e-instruct', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'];

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

// ── Fixes ─────────────────────────────────────────────────────────────────────

function applyFixes(content) {
  let fixed = content;
  const appliedFixes = [];

  if (/<think>/i.test(fixed)) {
    fixed = fixed.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trimStart();
    appliedFixes.push('stripped think tags');
  }
  if (/^## ##/m.test(fixed)) {
    fixed = fixed.replace(/^## ## /gm, '## ');
    appliedFixes.push('fixed double headings');
  }
  if (/<\$\d|\s<\d/.test(fixed)) {
    fixed = fixed.replace(/<\$(\d)/g, 'under $$$$1').replace(/(\s)<(\d)/g, '$1under $2');
    appliedFixes.push('fixed bare JSX patterns');
  }

  // Fix unquoted title with colon (breaks YAML parser)
  // Use \s+ (not \s*) to avoid backtracking that lets space match [^"'\n]
  if (/^title:\s+[^"'\n][^\n]*:[^\n]/m.test(fixed)) {
    fixed = fixed.replace(/^(title:\s+)([^"'\n][^\n]*)$/m, (_, prefix, title) => {
      return `${prefix}"${title.replace(/"/g, '\\"')}"`;
    });
    appliedFixes.push('quoted title containing colon');
  }

  // Fix missing closing --- in frontmatter (only one --- found = no closing delimiter)
  if (fixed.startsWith('---') && (fixed.match(/^---/gm) || []).length === 1) {
    const lines = fixed.split('\n');
    let insertAfter = 0;
    for (let i = 1; i < lines.length; i++) {
      if (/^[a-zA-Z][\w-]*\s*:/.test(lines[i]) || /^\s+[-"[{]/.test(lines[i])) {
        insertAfter = i;
      } else if (lines[i].trim() === '' && insertAfter > 0) {
        break;
      }
    }
    if (insertAfter > 0) {
      lines.splice(insertAfter + 1, 0, '---');
      fixed = lines.join('\n');
      appliedFixes.push('added missing frontmatter closing');
    }
  }

  return { fixed, appliedFixes };
}

// ── Groq: verify fixed content is worth keeping ───────────────────────────────

async function verifyFixed(filename, fixedContent, appliedFixes) {
  const stripped = fixedContent
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .trim();

  const wordCount = stripped.split(/\s+/).filter(Boolean).length;

  // Too short = definitely regenerate
  if (wordCount < 200) {
    return { keep: false, reason: `Only ${wordCount} words after fixing — needs regeneration` };
  }

  // If fixes were minor (no think tags), skip Groq check — it's fine
  if (!appliedFixes.includes('stripped think tags')) {
    return { keep: true, reason: 'Minor fixes applied, content intact' };
  }

  // After stripping think tags, ask Groq if remaining content is usable
  const prompt = `A blog article for local small business owners had AI thinking tags stripped.
Assess if the remaining content is a complete, useful article.

Article excerpt (post-fix):
---
${stripped.slice(0, 1500)}
---

Filename: ${filename}
Word count after fix: ~${wordCount}

Answer JSON only:
{
  "keep": true|false,
  "reason": "<one sentence>",
  "quality": <1-10>
}

Keep=true if: article has proper intro, substantive content, actionable advice, at least 300 words.
Keep=false if: content is incomplete, just an outline, mostly AI planning text, or too thin.`;

  try {
    const response = await callGroq(prompt, 200);
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.log(`Verify failed for ${filename}: ${e.message}`);
  }

  return { keep: wordCount > 400, reason: 'Verification inconclusive', quality: 5 };
}

// ── Queue: mark slug as pending for regeneration ──────────────────────────────

function markForRegeneration(slug) {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return false;

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const entry = queue.queue.find(e => e.slug === slug);
  if (entry) {
    entry.status = 'pending';
    delete entry.generatedDate;
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n');
    return true;
  }
  return false;
}

function fixQueueDuplicates() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return 0;
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const PRIORITY = { published: 3, generating: 2, pending: 1 };
  const seen = {};
  let removed = 0;
  for (let i = queue.queue.length - 1; i >= 0; i--) {
    const e = queue.queue[i];
    if (seen[e.slug]) {
      const keepPriority = PRIORITY[seen[e.slug].status] || 0;
      const thisPriority = PRIORITY[e.status] || 0;
      if (thisPriority <= keepPriority) {
        queue.queue.splice(i, 1);
        removed++;
      }
    } else {
      seen[e.slug] = e;
    }
  }
  if (removed > 0) fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n');
  return removed;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔧 Fixer Agent starting...');

  // Load audit report if available
  const reportPath = path.join(process.cwd(), 'scripts/.audit-report.json');
  let auditReport = null;
  if (fs.existsSync(reportPath)) {
    auditReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    console.log(`Loaded audit report: ${auditReport.toFix?.length || 0} to fix, ${auditReport.toRegenerate?.length || 0} to regenerate`);
  }

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory — nothing to fix');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const fixedFiles = [];
  const regenerateFiles = [];

  // Use audit report targets if available, else scan all
  const targets = auditReport?.toFix?.map(f => f.file) ||
    files.filter(file => {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return /<think>/i.test(content) || /^## ##/m.test(content) || /<\$\d/.test(content);
    });

  // Also add files Auditor flagged for regeneration
  const regenTargets = auditReport?.toRegenerate?.map(f => f.file) || [];

  // Delete files marked for regeneration (Auditor already assessed these with Groq)
  for (const filename of regenTargets) {
    const fullPath = path.join(BLOG_DIR, filename);
    if (fs.existsSync(fullPath)) {
      const slug = filename.replace('.mdx', '');
      fs.unlinkSync(fullPath);
      markForRegeneration(slug);
      regenerateFiles.push({ file: filename, reason: auditReport?.toRegenerate?.find(f => f.file === filename)?.assessment?.reason || 'Quality too low' });
      console.log(`♻️ Marked for regeneration: ${filename}`);
    }
  }

  // Fix syntax issues
  for (const filename of targets) {
    const fullPath = path.join(BLOG_DIR, filename);
    if (!fs.existsSync(fullPath)) continue;

    const original = fs.readFileSync(fullPath, 'utf8');
    const { fixed, appliedFixes } = applyFixes(original);

    if (fixed === original) continue;

    // Groq verify: is the fixed content worth keeping?
    console.log(`  Verifying fixed content: ${filename}...`);
    const verdict = await verifyFixed(filename, fixed, appliedFixes);

    if (verdict.keep) {
      fs.writeFileSync(fullPath, fixed);
      fixedFiles.push({ file: filename, fixes: appliedFixes, quality: verdict.quality });
      console.log(`✅ Fixed & kept: ${filename} (quality: ${verdict.quality}/10)`);
    } else {
      // Not worth keeping — delete and mark for regeneration
      fs.unlinkSync(fullPath);
      const slug = filename.replace('.mdx', '');
      markForRegeneration(slug);
      regenerateFiles.push({ file: filename, reason: verdict.reason });
      console.log(`♻️ Too thin after fix — queued for regeneration: ${filename}`);
    }
  }

  // Fix queue duplicates
  const dupeFixed = fixQueueDuplicates();

  const totalChanged = fixedFiles.length + regenerateFiles.length + dupeFixed;

  if (totalChanged === 0) {
    const time = new Date().toUTCString().slice(0, 25);
    console.log('✅ Nothing to fix');
    const qualityNote = auditReport?.qualityAvg != null
      ? `\nAvg quality: ${auditReport.qualityAvg}/10 · ${auditReport.sampledFiles || 0} articles sampled`
      : '';
    await telegram(`🔧 <b>Fixer</b> — nothing to fix ✅\n🕐 ${time}\n\nAll articles clean.${qualityNote}`);
    return;
  }

  // Commit
  execSync('git config user.email "fixer-agent@datalatte.pro"');
  execSync('git config user.name "DataLatte Fixer"');
  execSync('git add content/ scripts/.audit-report.json 2>/dev/null || git add content/');

  const commitMsg = `Fix: ${fixedFiles.length} fixed, ${regenerateFiles.length} queued for regen, ${dupeFixed} dupes removed [vercel skip]`;
  try {
    execSync(`git commit -m "${commitMsg}"`);
    execSync('git pull --rebase origin main');
    execSync('git push origin main');
  } catch (e) {
    if (!e.message.includes('nothing to commit')) throw e;
  }

  const sha = execSync('git rev-parse --short HEAD').toString().trim();

  // Telegram report
  const time = new Date().toUTCString().slice(0, 25);
  let msg = `🔧 <b>Fixer</b> — ${totalChanged} issue(s) resolved\n`;
  msg += `🕐 ${time}\n\n`;

  if (fixedFiles.length > 0) {
    msg += `\n✅ MDX fixed (${fixedFiles.length}):\n`;
    msg += fixedFiles.slice(0, 5).map(f => {
      const name = f.file.replace('content/blog/', '').replace('.mdx', '');
      return `  • ${name} (${f.quality}/10) — ${f.fixes.join(', ')}`;
    }).join('\n') + '\n';
  }
  if (regenerateFiles.length > 0) {
    msg += `\n♻️ Queued for regen (${regenerateFiles.length}):\n`;
    msg += regenerateFiles.slice(0, 4).map(f => {
      const name = f.file.replace('content/blog/', '').replace('.mdx', '');
      return `  • ${name}\n    ↳ ${f.reason}`;
    }).join('\n') + '\n';
  }
  if (dupeFixed > 0) msg += `\n🔁 Duplicate slugs removed: ${dupeFixed}\n`;
  msg += `\n🔗 Commit: ${sha}`;

  await telegram(msg);
  console.log('✅ Fixer Agent done');
}

main().catch(async e => {
  console.error('Fixer Agent error:', e.message);
  await telegram(`🔧 <b>Fixer</b> — failed ❌\n${e.message}`);
  process.exit(1);
});
