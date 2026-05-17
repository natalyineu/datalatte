#!/usr/bin/env node
/**
 * Agent 5 — Pipeline Manager (with brain)
 * Runs every hour. Checks pipeline health, auto-restarts if stuck.
 * Uses Groq to generate smart strategic insights in the hourly report.
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GROQ_KEY = process.env.GROQ_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

// ── HTTP ──────────────────────────────────────────────────────────────────────

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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama3-70b-8192', 'gemma2-9b-it'];

async function callGroq(prompt, maxTokens = 300) {
  for (const model of GROQ_MODELS) {
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
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
  return null; // non-critical, ok to skip
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function getQueueStats() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return { published: 0, pending: 0, generating: 0, byCategory: {} };
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

  const byCategory = {};
  for (const e of queue.queue.filter(e => e.status === 'pending')) {
    const cat = e.category || 'Unknown';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  }

  return {
    published: queue.queue.filter(e => e.status === 'published').length,
    pending: queue.queue.filter(e => e.status === 'pending').length,
    generating: queue.queue.filter(e => e.status === 'generating').length,
    byCategory,
  };
}

function countTodayArticles() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const result = execSync(
      `git log --since="${today}T00:00:00Z" --oneline -- content/blog/ | grep -c "Add article:" || true`,
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
    if (!result) return { ageMinutes: 999, title: 'unknown' };

    const sha = result.split(' ')[0];
    const title = result.replace(/^[a-f0-9]+ Add article: /, '').trim();
    const dateStr = execSync(`git show -s --format=%cI ${sha}`, { encoding: 'utf8' }).trim();
    const ageMinutes = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
    return { ageMinutes, title };
  } catch { return { ageMinutes: 999, title: 'unknown' }; }
}

function getRecentlyGeneratedTopics() {
  try {
    const result = execSync(
      'git log --oneline --since="24 hours ago" -- content/blog/ | grep "Add article:" | head -10',
      { encoding: 'utf8' }
    ).trim();
    return result ? result.split('\n').map(l => l.replace(/^[a-f0-9]+ Add article: /, '')) : [];
  } catch { return []; }
}

async function getRecentRuns(workflow, limit = 15) {
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

// ── Groq insight ──────────────────────────────────────────────────────────────

async function generateInsight(data) {
  const topPending = Object.entries(data.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, n]) => `${cat}: ${n}`)
    .join(', ');

  const recentTopics = data.recentTopics.slice(0, 5).join('; ');

  const prompt = `You are a content strategist for DataLatte.pro — a local marketing blog targeting coffee shops, salons, pet groomers, and fitness studios.

Current pipeline data:
- Published articles: ${data.published}
- Pending queue: ${data.pending} articles
- Generated today: ${data.todayCount}
- Pending by category: ${topPending}
- Recent articles: ${recentTopics || 'none yet today'}
- Pipeline status: ${data.statusText}
- Errors in last 15 runs: ${data.recentErrors}

Write ONE short strategic insight (2-3 sentences max) that would be genuinely useful for Nataliia.
Focus on: queue balance, content gaps, momentum, or a specific action to take.
Be direct and specific. No fluff. Start with an emoji.`;

  try {
    return await callGroq(prompt, 150);
  } catch { return null; }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📊 Pipeline Manager starting...');

  const now = new Date();
  const timeStr = now.toUTCString().slice(5, 22) + ' UTC';

  // Collect all stats
  const stats = getQueueStats();
  const todayCount = countTodayArticles();
  const lastArticle = getLastArticleAge();
  const ageMinutes = lastArticle.ageMinutes;
  const recentTopics = getRecentlyGeneratedTopics();

  // Recent runs
  const runs = await getRecentRuns('auto-generate.yml', 15);
  const recentErrors = runs.slice(0, 10).filter(r => r.conclusion === 'failure').length;
  const isRunning = runs.slice(0, 3).some(r => r.status === 'in_progress' || r.status === 'queued');

  // Pipeline health check
  const STUCK_THRESHOLD = 90;
  const isStuck = !isRunning && ageMinutes > STUCK_THRESHOLD && stats.pending > 0;
  const queueLow = stats.pending < 15;

  let statusIcon = '✅';
  let statusText = 'Running';

  if (isStuck) {
    statusIcon = '🔴';
    statusText = `STUCK (${ageMinutes}min idle)`;
  } else if (queueLow) {
    statusIcon = '⚠️';
    statusText = `Queue low (${stats.pending} left)`;
  } else if (recentErrors >= 4) {
    statusIcon = '⚠️';
    statusText = `${recentErrors} recent errors`;
  } else if (!isRunning) {
    statusIcon = '⏸️';
    statusText = 'Idle';
  }

  // Auto-restart if stuck
  let restarted = false;
  if (isStuck) {
    console.log('Pipeline stuck — auto-restarting...');
    restarted = await triggerWorkflow('auto-generate.yml');
    if (restarted) statusText += ' → restarted ✓';
  }

  // Groq insight
  const insight = await generateInsight({
    published: stats.published,
    pending: stats.pending,
    todayCount,
    byCategory: stats.byCategory,
    recentTopics,
    statusText,
    recentErrors,
  });

  // Format age
  const ageStr = ageMinutes < 999
    ? ageMinutes < 60 ? `${ageMinutes}min ago` : `${Math.round(ageMinutes / 60)}h ago`
    : 'none today';

  // Build Telegram message
  let msg = `📊 <b>DataLatte</b> — ${timeStr}\n\n`;
  msg += `${statusIcon} <b>${statusText}</b>\n`;
  msg += `📝 Today: ${todayCount} articles generated\n`;
  msg += `⏱️ Last article: ${ageStr}\n`;
  msg += `📋 Queue: ${stats.pending} pending | ${stats.published} published\n`;
  if (recentErrors > 0) msg += `❗ Errors: ${recentErrors}/10 runs\n`;
  if (restarted) msg += `🔄 Auto-restarted pipeline\n`;
  if (queueLow) msg += `⚠️ Queue running low!\n`;

  if (insight) {
    msg += `\n💡 <i>${insight}</i>`;
  }

  await telegram(msg);
  console.log(`✅ Report sent — ${statusText}, today: ${todayCount}, pending: ${stats.pending}`);

  if (isStuck && !restarted) process.exit(1);
}

main().catch(async e => {
  console.error('Pipeline Manager error:', e.message);
  await telegram(`❌ <b>Pipeline Manager failed</b>\n${e.message}`);
  process.exit(1);
});
