#!/usr/bin/env node
/**
 * Agent 5 — Pipeline Manager (with brain + scoring)
 * Runs every hour. Checks pipeline health, auto-restarts if stuck.
 * Calculates a 0–100 health score, tracks history, sends Telegram report with trend.
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GROQ_KEY = process.env.GROQ_API_KEY;
const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

const SCORES_FILE = path.join(process.cwd(), 'scripts/.scores.json');
const AUDIT_FILE  = path.join(process.cwd(), 'scripts/.audit-report.json');

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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound', 'qwen/qwen3-32b', 'llama-3.1-8b-instant', 'groq/compound-mini'];
const CEREBRAS_MODELS = ['llama-3.3-70b', 'llama3.1-70b', 'llama3.1-8b', 'qwen-3-32b'];

let _groqTokens = 0;

async function callGroq(prompt, maxTokens = 200) {
  if (CEREBRAS_KEY) {
    for (const model of CEREBRAS_MODELS) {
      const res = await fetchJson('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CEREBRAS_KEY}`, 'Content-Type': 'application/json' },
      }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: maxTokens }));
      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      if (res.status === 429 || res.data?.error?.code === 'rate_limit_exceeded') continue;
      if (res.status === 404 || res.data?.error?.code === 'model_decommissioned') continue;
    }
  }
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
      _groqTokens += res.data?.usage?.total_tokens ?? 0;
      return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    }
    const code = res.data?.error?.code;
    if (res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned') continue;
  }
  return null;
}

// ── Score history ─────────────────────────────────────────────────────────────

function loadScoreHistory() {
  if (fs.existsSync(SCORES_FILE)) {
    try { return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8')); }
    catch {}
  }
  return { entries: [] };
}

function saveScoreHistory(history) {
  // Keep last 168 entries (7 days × 24h)
  history.entries = history.entries.slice(-168);
  fs.writeFileSync(SCORES_FILE, JSON.stringify(history, null, 2));
}

function getPreviousScore(history) {
  if (history.entries.length < 2) return null;
  return history.entries[history.entries.length - 2]?.score ?? null;
}

function getScoreTrend(current, previous) {
  if (previous === null) return '';
  const diff = current - previous;
  if (Math.abs(diff) < 2) return '→';
  return diff > 0 ? `↑${diff}` : `↓${Math.abs(diff)}`;
}

function getScoreLabel(score) {
  if (score >= 90) return '🟢 Excellent';
  if (score >= 75) return '🟡 Good';
  if (score >= 55) return '🟠 Needs attention';
  return '🔴 Critical';
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
    pending:   queue.queue.filter(e => e.status === 'pending').length,
    generating:queue.queue.filter(e => e.status === 'generating').length,
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
      'git log --oneline --since="24 hours ago" -- content/blog/ | grep "Add article:" | head -8',
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

// ── Scoring ───────────────────────────────────────────────────────────────────

function calculateScore({ todayCount, recentErrors, pending, qualityAvg, bugsFound }) {
  const components = {};

  // Generation (25 pts) — target: 10 articles/day
  components.generation = Math.min(25, Math.round((todayCount / 10) * 25));

  // Reliability (25 pts) — based on last 10 runs
  components.reliability = Math.max(0, Math.round(((10 - recentErrors) / 10) * 25));

  // Queue health (15 pts) — healthy = 50+ pending
  components.queue = Math.min(15, Math.round((pending / 50) * 15));

  // Content quality (20 pts) — from Auditor's Groq quality scores (1–10 scale)
  // null = Auditor hasn't run yet; use neutral 14/20 (7/10 assumed) so score isn't penalised
  components.quality = qualityAvg != null ? Math.round((qualityAvg / 10) * 20) : 10;

  // Bug rate (15 pts) — 0 bugs = full score, -3 per bug found
  components.bugs = Math.max(0, 15 - bugsFound * 3);

  const total = Object.values(components).reduce((a, b) => a + b, 0);
  return { total: Math.min(100, total), components };
}

function loadAuditQualityData() {
  if (!fs.existsSync(AUDIT_FILE)) return { qualityAvg: null, bugsFound: 0 };
  try {
    const report = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
    const bugsFound = (report.toFix?.length || 0) + (report.toRegenerate?.length || 0) + (report.duplicateSlugs?.length || 0);

    // Prefer the Auditor's sampled qualityAvg (from clean random articles) — most representative
    if (report.qualityAvg != null && report.qualityAvg > 0) {
      return { qualityAvg: report.qualityAvg, bugsFound };
    }

    // Fallback: compute from issue assessments (will skew low — only flagged articles)
    const scores = [];
    for (const item of [...(report.toFix || []), ...(report.toRegenerate || []), ...(report.lowQuality || [])]) {
      if (item.assessment?.quality) scores.push(item.assessment.quality);
    }
    const qualityAvg = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : null; // null = no audit data yet

    return { qualityAvg, bugsFound };
  } catch { return { qualityAvg: null, bugsFound: 0 }; }
}

// ── Groq insight ──────────────────────────────────────────────────────────────

async function generateInsight({ score, scoreComponents, trend, published, pending, todayCount, byCategory, recentTopics, statusText, recentErrors, qualityAvg }) {
  const topPending = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([cat, n]) => `${cat}: ${n}`).join(', ');

  const weakest = Object.entries(scoreComponents)
    .sort((a, b) => {
      const max = { generation: 25, reliability: 25, queue: 15, quality: 20, bugs: 15 };
      return (a[1] / max[a[0]]) - (b[1] / max[b[0]]);
    })[0];

  const prompt = `You are a content strategist for DataLatte.pro — a local marketing blog for small businesses.

Pipeline snapshot:
- Health score: ${score}/100 (${trend || 'first run'})
- Weakest area: ${weakest[0]} (${weakest[1]} pts)
- Published: ${published} | Pending: ${pending}
- Generated today: ${todayCount}
- Content quality avg: ${qualityAvg != null ? `${qualityAvg}/10` : 'N/A (awaiting Auditor)'}
- Recent errors: ${recentErrors}/10 runs
- Pending by category: ${topPending}
- Recent articles: ${recentTopics.slice(0, 4).join('; ') || 'none yet'}
- Status: ${statusText}

Write ONE sharp insight (2 sentences max). Focus on the weakest score component or biggest opportunity.
Be specific, actionable, direct. Start with an emoji. No fluff.`;

  try { return await callGroq(prompt, 120); }
  catch { return null; }
}

// ── Score bar visual ──────────────────────────────────────────────────────────

function scoreBar(value, max, filled = '█', empty = '░', width = 8) {
  const filled_count = Math.round((value / max) * width);
  return filled.repeat(filled_count) + empty.repeat(width - filled_count);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📊 Pipeline Manager starting...');

  const now = new Date();
  const timeStr = now.toUTCString().slice(5, 22) + ' UTC';

  // Collect stats
  const stats       = getQueueStats();
  const todayCount  = countTodayArticles();
  const lastArticle = getLastArticleAge();
  const ageMinutes  = lastArticle.ageMinutes;
  const recentTopics = getRecentlyGeneratedTopics();
  const { qualityAvg, bugsFound } = loadAuditQualityData();

  // Recent workflow runs
  const runs = await getRecentRuns('auto-generate.yml', 15);
  const recentErrors = runs.slice(0, 10).filter(r => r.conclusion === 'failure').length;
  const isRunning = runs.slice(0, 3).some(r => r.status === 'in_progress' || r.status === 'queued');

  // Pipeline health check
  const STUCK_THRESHOLD = 90;
  const isStuck = !isRunning && ageMinutes > STUCK_THRESHOLD && stats.pending > 0;
  const queueLow = stats.pending < 15;

  let statusIcon = '✅';
  let statusText = 'Running';
  if (isStuck)         { statusIcon = '🔴'; statusText = `STUCK (${ageMinutes}min idle)`; }
  else if (queueLow)   { statusIcon = '⚠️'; statusText = `Queue low (${stats.pending} left)`; }
  else if (recentErrors >= 4) { statusIcon = '⚠️'; statusText = `${recentErrors} recent errors`; }
  else if (!isRunning) { statusIcon = '⏸️'; statusText = 'Idle'; }

  // Auto-restart
  let restarted = false;
  if (isStuck) {
    console.log('Pipeline stuck — auto-restarting...');
    restarted = await triggerWorkflow('auto-generate.yml');
    if (restarted) statusText += ' → restarted ✓';
  }

  // Calculate health score
  const { total: score, components } = calculateScore({
    todayCount,
    recentErrors,
    pending: stats.pending,
    qualityAvg,
    bugsFound,
  });

  // Load score history and update
  const history = loadScoreHistory();
  const previousScore = getPreviousScore(history);
  const trend = getScoreTrend(score, previousScore);
  const trendDisplay = trend ? ` ${trend}` : '';

  history.entries.push({
    timestamp: now.toISOString(),
    score,
    components,
    todayCount,
    pending: stats.pending,
    published: stats.published,
    recentErrors,
    qualityAvg,
    bugsFound,
  });
  saveScoreHistory(history);

  // Groq insight
  const insight = await generateInsight({
    score, scoreComponents: components, trend: trendDisplay.trim(),
    published: stats.published, pending: stats.pending, todayCount,
    byCategory: stats.byCategory, recentTopics, statusText, recentErrors, qualityAvg,
  });

  // Format age
  const ageStr = ageMinutes < 999
    ? ageMinutes < 60 ? `${ageMinutes}min ago` : `${Math.round(ageMinutes / 60)}h ago`
    : 'none today';

  // Score breakdown for display
  const scoreBreakdown = [
    `Generation  ${scoreBar(components.generation, 25)} ${components.generation}/25`,
    `Reliability ${scoreBar(components.reliability, 25)} ${components.reliability}/25`,
    `Quality     ${scoreBar(components.quality, 20)}  ${components.quality}/20${qualityAvg == null ? ' (est)' : ''}`,
    `Bugs        ${scoreBar(components.bugs, 15)}  ${components.bugs}/15`,
    `Queue       ${scoreBar(components.queue, 15)}  ${components.queue}/15`,
  ].join('\n');

  // Build Telegram message
  const topClusters = Object.entries(stats.byCategory || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([k, v]) => `${k} (${v})`).join(', ');

  let msg = `📊 <b>Pipeline</b> — ${timeStr}\n\n`;
  msg += `<b>Health: ${score}/100${trendDisplay} ${getScoreLabel(score)}</b>\n`;
  msg += `<pre>${scoreBreakdown}</pre>\n`;
  msg += `📝 Today: <b>${todayCount} articles</b>\n`;
  msg += `⏱️ Last article: ${ageStr}\n`;
  msg += `📋 ${stats.pending} pending · ${stats.published} published\n`;
  if (qualityAvg !== null) {
    const qe = qualityAvg >= 7 ? '✅' : qualityAvg >= 5 ? '⚠️' : '🔴';
    msg += `${qe} Avg quality: ${qualityAvg}/10\n`;
  }
  if (topClusters) msg += `📂 Top clusters: ${topClusters}\n`;
  if (recentErrors > 0) msg += `❗ Errors: ${recentErrors}/10 recent runs\n`;
  if (restarted)   msg += `🔄 Writer auto-restarted\n`;
  if (queueLow)    msg += `⚠️ Queue low — add new topics!\n`;
  if (insight)     msg += `\n💡 <i>${insight}</i>`;

  await telegram(msg);
  console.log(`✅ Score: ${score}/100${trendDisplay} | Status: ${statusText} | Today: ${todayCount}`);
  console.log(`PIPELINE_COMPONENTS: generation=${components.generation},reliability=${components.reliability},quality=${components.quality},bugs=${components.bugs},queue=${components.queue}`);
  console.log(`PIPELINE_QUALITY: ${qualityAvg ?? 'n/a'}`);
  console.log(`PIPELINE_PUBLISHED: ${stats.published}`);
  console.log(`PIPELINE_PENDING: ${stats.pending}`);

  // Commit scores file update
  try {
    execSync('git config user.email "pipeline-manager@datalatte.pro"');
    execSync('git config user.name "DataLatte Pipeline Manager"');
    execSync('git pull --rebase origin main');
    execSync('git add scripts/.scores.json');
    execSync(`git commit -m "Score: ${score}/100 — ${todayCount} articles today [vercel skip]"`);
    execSync('git push origin main');
  } catch (e) {
    if (!e.message.includes('nothing to commit')) console.log('Score commit note:', e.message.slice(0, 100));
  }

  if (isStuck && !restarted) process.exit(1);
}

main().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch(async e => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  console.error('Pipeline Manager error:', e.message);
  await telegram(`📊 <b>Pipeline</b> — failed ❌\n${e.message}`);
  process.exit(1);
});
