#!/usr/bin/env node
/**
 * Agent 5 — Pipeline Manager
 * Runs every hour. Checks pipeline health, auto-restarts if stuck,
 * sends hourly Telegram report.
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-PipelineManager', ...options.headers },
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

async function getRecentRuns(workflow, limit = 10) {
  const res = await fetchJson(
    `https://api.github.com/repos/${REPO}/actions/workflows/${workflow}/runs?per_page=${limit}`,
    { method: 'GET', headers: { 'Authorization': `Bearer ${GH_TOKEN}` } }
  );
  return res.data?.workflow_runs || [];
}

async function triggerWorkflow(workflow) {
  const res = await fetchJson(
    `https://api.github.com/repos/${REPO}/actions/workflows/${workflow}/dispatches`,
    { method: 'POST', headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Content-Type': 'application/json' } },
    JSON.stringify({ ref: 'main' })
  );
  return res.status === 204;
}

function getQueueStats() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return { published: 0, pending: 0, generating: 0 };
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  return {
    published: queue.queue.filter(e => e.status === 'published').length,
    pending: queue.queue.filter(e => e.status === 'pending').length,
    generating: queue.queue.filter(e => e.status === 'generating').length,
  };
}

function countTodayArticles() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(blogDir)) return 0;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const result = execSync(
      `git log --since="${today}T00:00:00Z" --oneline -- content/blog/ | grep "Add article:" | wc -l`,
      { encoding: 'utf8' }
    ).trim();
    return parseInt(result) || 0;
  } catch { return 0; }
}

function getLastArticleAge() {
  try {
    const result = execSync(
      'git log --oneline -- content/blog/ | grep "Add article:" | head -1',
      { encoding: 'utf8' }
    ).trim();
    if (!result) return null;

    const sha = result.split(' ')[0];
    const dateStr = execSync(
      `git show -s --format=%cI ${sha}`,
      { encoding: 'utf8' }
    ).trim();
    const commitDate = new Date(dateStr);
    const ageMinutes = Math.round((Date.now() - commitDate.getTime()) / 60000);
    return { ageMinutes, dateStr };
  } catch { return null; }
}

async function getErrorCount(runs) {
  return runs.filter(r =>
    r.conclusion === 'failure' ||
    (r.conclusion === 'success' && r.name?.includes('failed'))
  ).length;
}

async function isGeneratorRunning(runs) {
  return runs.some(r => r.status === 'in_progress' || r.status === 'queued');
}

async function main() {
  console.log('📊 Pipeline Manager starting...');

  const now = new Date();
  const timeStr = now.toUTCString().slice(0, 25);

  // Get recent generator runs
  const runs = await getRecentRuns('auto-generate.yml', 20);
  const recentRuns = runs.slice(0, 10);

  // Queue stats
  const stats = getQueueStats();

  // Today's article count
  const todayCount = countTodayArticles();

  // Last article age
  const lastArticle = getLastArticleAge();
  const ageMinutes = lastArticle?.ageMinutes ?? 999;

  // Error count in last 10 runs
  const recentErrors = recentRuns.filter(r => r.conclusion === 'failure').length;

  // Is pipeline currently running?
  const isRunning = await isGeneratorRunning(recentRuns);

  // Determine pipeline status
  const STUCK_THRESHOLD_MINUTES = 90; // stuck if no article in 90 min AND pending items exist
  const isStuck = !isRunning && ageMinutes > STUCK_THRESHOLD_MINUTES && stats.pending > 0;

  let statusIcon = '✅';
  let statusText = 'Running';
  let restarted = false;

  if (isStuck) {
    statusIcon = '🔴';
    statusText = `STUCK (no article in ${ageMinutes}min)`;
    console.log('Pipeline stuck — auto-restarting...');
    restarted = await triggerWorkflow('auto-generate.yml');
  } else if (stats.pending === 0) {
    statusIcon = '⚠️';
    statusText = 'Queue empty';
  } else if (recentErrors >= 3) {
    statusIcon = '⚠️';
    statusText = `${recentErrors} recent errors`;
  }

  // Build Telegram message
  const ageStr = ageMinutes < 999
    ? ageMinutes < 60 ? `${ageMinutes}min ago` : `${Math.round(ageMinutes / 60)}h ago`
    : 'unknown';

  let msg = `📊 <b>DataLatte Pipeline</b> — ${timeStr}\n\n`;
  msg += `${statusIcon} Status: ${statusText}\n`;
  msg += `📝 Generated today: ${todayCount} articles\n`;
  msg += `📋 Queue: ${stats.pending} pending | ${stats.published} published\n`;
  msg += `⏱️ Last article: ${ageStr}\n`;
  if (recentErrors > 0) msg += `❗ Recent errors: ${recentErrors}/10 runs\n`;
  if (restarted) msg += `\n🔄 Pipeline auto-restarted`;
  if (stats.pending < 10) msg += `\n⚠️ Queue running low — consider adding articles`;

  await telegram(msg);
  console.log(`✅ Report sent — Status: ${statusText}, Today: ${todayCount}, Pending: ${stats.pending}`);

  // Exit with error code if critical issue detected (for visibility in Actions log)
  if (isStuck && !restarted) {
    process.exit(1);
  }
}

main().catch(async e => {
  console.error('Pipeline Manager error:', e.message);
  await telegram(`❌ <b>Pipeline Manager failed</b>\n${e.message}`);
  process.exit(1);
});
