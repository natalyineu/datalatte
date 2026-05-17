#!/usr/bin/env node
/**
 * Agent 3 — Fixer
 * Triggered by Auditor. Auto-fixes common MDX issues, commits, reports.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

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

function fixContent(content) {
  let fixed = content;
  const appliedFixes = [];

  // Strip <think>...</think> blocks
  if (/<think>/i.test(fixed)) {
    fixed = fixed.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trimStart();
    appliedFixes.push('stripped think tags');
  }

  // Fix double ## headings
  if (/^## ##/m.test(fixed)) {
    fixed = fixed.replace(/^## ## /gm, '## ');
    appliedFixes.push('fixed double headings');
  }

  // Fix bare <$N> or <N> patterns that break MDX
  if (/<\$\d|\s<\d/.test(fixed)) {
    fixed = fixed.replace(/<\$(\d)/g, 'under $$$$1').replace(/(\s)<(\d)/g, '$1under $2');
    appliedFixes.push('fixed bare JSX patterns');
  }

  // Fix missing frontmatter closing ---
  if (fixed.trimStart().startsWith('---')) {
    const firstEnd = fixed.indexOf('---', 3);
    if (firstEnd === -1) {
      // Try to detect end of frontmatter by finding first non-yaml line
      fixed = fixed.replace(/^(---\n[\s\S]*?\n)(\n[^-])/, '$1---\n$2');
      appliedFixes.push('added missing frontmatter closing');
    }
  }

  return { fixed, appliedFixes };
}

function fixQueueDuplicates() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return 0;

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const seen = {};
  const PRIORITY = { published: 3, generating: 2, pending: 1 };
  let removed = 0;

  for (const e of queue.queue) {
    const existing = seen[e.slug];
    if (existing) {
      const keep = (PRIORITY[e.status] || 0) > (PRIORITY[existing.status] || 0) ? e : existing;
      const remove = keep === e ? existing : e;
      queue.queue.splice(queue.queue.indexOf(remove), 1);
      removed++;
    } else {
      seen[e.slug] = e;
    }
  }

  if (removed > 0) {
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n');
  }
  return removed;
}

async function main() {
  console.log('🔧 Fixer Agent starting...');

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory — nothing to fix');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const fixedFiles = [];
  let totalFixes = 0;

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const original = fs.readFileSync(fullPath, 'utf8');
    const { fixed, appliedFixes } = fixContent(original);

    if (fixed !== original) {
      fs.writeFileSync(fullPath, fixed);
      fixedFiles.push({ file, fixes: appliedFixes });
      totalFixes += appliedFixes.length;
    }
  }

  // Fix queue duplicates
  const dupeFixed = fixQueueDuplicates();
  if (dupeFixed > 0) {
    fixedFiles.push({ file: 'queue.json', fixes: [`removed ${dupeFixed} duplicate slug(s)`] });
    totalFixes += dupeFixed;
  }

  if (totalFixes === 0) {
    console.log('✅ Nothing to fix');
    await telegram('🔧 <b>Fixer Agent</b> — ran but found nothing to fix ✅');
    return;
  }

  // Configure git and commit
  execSync('git config user.email "fixer-agent@datalatte.pro"');
  execSync('git config user.name "DataLatte Fixer"');
  execSync('git add content/blog/ content/queue.json');

  const commitMsg = `Fix: auto-fix ${fixedFiles.length} file(s) — ${totalFixes} issue(s) resolved [skip ci]`;
  execSync(`git commit -m "${commitMsg}"`);

  const sha = execSync('git rev-parse --short HEAD').toString().trim();

  // Push
  try {
    execSync('git pull --rebase origin main');
    execSync('git push origin main');
    console.log(`✅ Pushed fixes: ${sha}`);
  } catch (e) {
    console.error('Push failed:', e.message);
  }

  // Telegram report
  const fixList = fixedFiles.slice(0, 8).map(f => `• ${f.file}: ${f.fixes.join(', ')}`).join('\n');
  const msg = `🔧 <b>Fixer Agent</b>
📅 ${new Date().toUTCString()}

✅ Fixed ${fixedFiles.length} file(s), ${totalFixes} issue(s):
${fixList}

🔗 Commit: ${sha}`;

  await telegram(msg);
  console.log('✅ Fixer Agent done');
}

main().catch(async e => {
  console.error('Fixer Agent error:', e.message);
  await telegram(`❌ <b>Fixer Agent failed</b>\n${e.message}`);
  process.exit(1);
});
