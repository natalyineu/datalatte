#!/usr/bin/env node
/**
 * Agent 2 — Auditor
 * Runs every 2 hours. Scans all MDX files for common issues.
 * Triggers Fixer if problems found. Silent when all is clean.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

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

function auditFile(filePath, content) {
  const issues = [];
  const name = path.basename(filePath);

  if (/<think>/i.test(content)) issues.push('has <think> tags');
  if (/^## ##/m.test(content)) issues.push('double ## heading');
  if (!content.trimStart().startsWith('---')) issues.push('missing frontmatter start');
  if (/<\$\d|<\d\s/g.test(content)) issues.push('bare JSX-like pattern (<$N or <N)');
  if (content.includes('</think>')) issues.push('has </think> remnant');

  // Check frontmatter has closing ---
  const firstDash = content.indexOf('---');
  const secondDash = content.indexOf('---', firstDash + 3);
  if (firstDash === -1 || secondDash === -1) issues.push('incomplete frontmatter');

  return issues.length > 0 ? { file: name, issues } : null;
}

function checkQueueDuplicates() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return [];
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const seen = {};
  const dupes = [];
  for (const e of queue.queue) {
    if (seen[e.slug]) dupes.push(e.slug);
    seen[e.slug] = true;
  }
  return dupes;
}

async function main() {
  console.log('🔍 Audit Agent starting...');

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory found');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const problems = [];

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const result = auditFile(fullPath, content);
    if (result) problems.push(result);
  }

  const dupes = checkQueueDuplicates();

  const totalIssues = problems.length + dupes.length;
  console.log(`Scanned ${files.length} files — found ${totalIssues} issue(s)`);

  if (totalIssues === 0) {
    console.log('✅ All clean — no Telegram message sent');
    return;
  }

  // Save report for Fixer
  const report = { timestamp: new Date().toISOString(), problems, duplicateSlugs: dupes };
  fs.writeFileSync(path.join(process.cwd(), 'scripts/.audit-report.json'), JSON.stringify(report, null, 2));

  // Build Telegram message
  const fileList = problems.slice(0, 6).map(p => `• ${p.file}: ${p.issues.join(', ')}`).join('\n');
  const dupeList = dupes.slice(0, 3).join(', ');
  let msg = `🔍 <b>Audit Agent</b> — issues found\n📅 ${new Date().toUTCString()}\n\n`;
  if (problems.length > 0) msg += `📄 ${problems.length} file(s) with problems:\n${fileList}\n`;
  if (dupes.length > 0) msg += `\n⚠️ ${dupes.length} duplicate slug(s) in queue: ${dupeList}\n`;
  msg += `\n🔧 Triggering Fixer...`;

  await telegram(msg);

  // Trigger fixer workflow
  const triggered = await triggerFixer();
  console.log(`Fixer triggered: ${triggered}`);

  if (!triggered) {
    await telegram('⚠️ Could not trigger Fixer workflow — check PAT_TOKEN');
  }
}

main().catch(async e => {
  console.error('Audit Agent error:', e.message);
  await telegram(`❌ <b>Audit Agent failed</b>\n${e.message}`);
  process.exit(1);
});
