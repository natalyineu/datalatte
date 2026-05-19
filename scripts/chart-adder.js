#!/usr/bin/env node
/**
 * Chart Adder — adds BarChart + StatRow components to articles that have none.
 * Processes 5 articles per run. Self-chains like faq-fixer.
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const GROQ_KEY      = process.env.GROQ_API_KEY;
const GH_TOKEN      = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO          = 'natalyineu/datalatte';
const BLOG_DIR      = path.join(process.cwd(), 'content/blog');
const BATCH         = 3;   // smaller batch — chart generation is slower than FAQ
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT  = process.env.TELEGRAM_CHAT_ID;

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'qwen/qwen3-32b',
  'openai/gpt-oss-120b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant',
];

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-ChartAdder', ...options.headers },
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
  }, JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg, parse_mode: 'HTML' })).catch(() => {});
}

// ── Groq ─────────────────────────────────────────────────────────────────────

async function callGroq(prompt, maxTokens = 600) {
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
        temperature: 0.3,
        max_tokens: maxTokens,
      });
      const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      }, body);
      if (res.status === 200) {
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

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { fm: {}, content: raw, fmRaw: '' };
  const fmRaw = match[1];
  const content = match[2];
  const fm = {};
  fmRaw.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
  return { fm, content, fmRaw };
}

function hasCharts(content) {
  return /<BarChart|<StatRow|<Funnel|<DonutChart|<LineChart|<CompareBar/.test(content);
}

// ── Chart generation ──────────────────────────────────────────────────────────

// Pick the best pair of chart types for a given article topic
function pickChartTypes(title, content) {
  const t = (title + ' ' + content.slice(0, 500)).toLowerCase();

  // Comparison articles → CompareBar
  const isComparison = /vs\.?|versus|compare|comparison|which is better|better than/.test(t);
  // Trend / over time articles → LineChart
  const isTrend = /over time|month|quarter|year|trend|growth|season|weekly|monthly|annual/.test(t);
  // Budget / breakdown articles → DonutChart
  const isBreakdown = /budget|breakdown|split|allocat|spend|portion|percentage of|share of/.test(t);

  if (isComparison) return ['CompareBar', 'StatRow'];
  if (isTrend)      return ['LineChart', 'StatRow'];
  if (isBreakdown)  return ['DonutChart', 'StatRow'];
  // default: classic bar + stat
  return ['BarChart', 'StatRow'];
}

const CHART_FORMATS = {
  BarChart: `<BarChart
  title="Descriptive chart title"
  labels="Label 1|Label 2|Label 3|Label 4|Label 5"
  values="45|38|62|29|51"
  unit="%"
  highlights="Label 3"
  caption="Source or context note"
/>`,

  DonutChart: `<DonutChart
  title="Descriptive donut chart title"
  labels="Category A|Category B|Category C|Category D"
  values="40|25|20|15"
  unit="%"
  centerLabel="Budget"
  caption="Source or context note"
/>`,

  LineChart: `<LineChart
  title="Trend over time"
  labels="Jan|Feb|Mar|Apr|May|Jun|Jul|Aug"
  values="12|18|15|24|30|28|35|40"
  unit="%"
  area="true"
  caption="Source or context note"
/>`,

  CompareBar: `<CompareBar
  title="Side-by-side comparison"
  leftLabel="Option A"
  rightLabel="Option B"
  metrics="Avg CPC|CTR|Conversion Rate|ROI"
  leftValues="3.50|4.2|6.1|210"
  rightValues="1.20|1.8|3.4|140"
  unit="$"
  caption="Source or context note"
/>`,

  StatRow: `<StatRow
  title="KEY NUMBERS"
  values="$3.50|82%|4.2×|14 days"
  labels="Avg CPC|Conversion rate|ROI|Time to results"
  subs="per click|for local searches|vs. no ads|typical"
  trends="neutral|up|up|neutral"
/>`,
};

async function generateCharts(title, category, content) {
  const snippet = content.slice(0, 1000).replace(/[<>]/g, '').trim();
  const [type1, type2] = pickChartTypes(title, content);

  const prompt = `You are adding visual data components to a blog post on DataLatte.pro, a local marketing agency for small businesses.

Article title: "${title}"
Category: "${category}"
Article excerpt: "${snippet}"

Generate EXACTLY 2 visual components for this article. Output ONLY the raw MDX — no explanation, no prose, no markdown headers, no backticks.

Component 1 — use this EXACT component type: <${type1}>
Component 2 — use this EXACT component type: <${type2}>

Format examples (use the same attribute names and pipe-separated values):

${CHART_FORMATS[type1]}

${CHART_FORMATS[type2]}

Rules:
- Use real-world benchmark numbers relevant to the article topic
- All values are pipe-separated strings
- unit can be: "%", "$", "" (blank for plain numbers)
- StatRow trends must each be: "up", "down", or "neutral"
- CompareBar leftLabel/rightLabel must reflect the two things being compared in the article
- DonutChart centerLabel: short word (e.g. "Budget", "Traffic", "Leads")
- LineChart labels should be time periods relevant to the topic
- highlights (BarChart) must exactly match one of the labels
- Output ONLY the two components, separated by a blank line`;

  const raw = await callGroq(prompt, 600);

  // Extract the two component blocks
  const comp1Match = raw.match(new RegExp(`<${type1}[\\s\\S]*?\\/>`));
  const comp2Match = raw.match(new RegExp(`<${type2}[\\s\\S]*?\\/>`));

  if (!comp1Match || !comp2Match) {
    // fallback: try BarChart + StatRow
    const barMatch  = raw.match(/<BarChart[\s\S]*?\/>/);
    const statMatch = raw.match(/<StatRow[\s\S]*?\/>/);
    if (!barMatch || !statMatch) {
      throw new Error(`Chart generation returned unexpected format:\n${raw.slice(0, 300)}`);
    }
    return { chart1: barMatch[0].trim(), chart2: statMatch[0].trim() };
  }

  return { chart1: comp1Match[0].trim(), chart2: comp2Match[0].trim() };
}

// ── Inject charts into content ────────────────────────────────────────────────

function injectCharts(content, chart1, chart2) {
  const barChart = chart1, statRow = chart2;
  const lines = content.split('\n');

  // Find positions of all ## headings
  const h2Positions = [];
  lines.forEach((line, i) => {
    if (/^##\s/.test(line)) h2Positions.push(i);
  });

  if (h2Positions.length < 2) {
    // Fewer than 2 headings — inject both after the first paragraph break
    const firstBlank = lines.findIndex((l, i) => i > 5 && l.trim() === '');
    const insertAt = firstBlank > 0 ? firstBlank + 1 : Math.floor(lines.length / 2);
    lines.splice(insertAt, 0, '', barChart, '', statRow, '');
    return lines.join('\n');
  }

  // Inject BarChart after the paragraph following the 2nd heading
  const h2 = h2Positions[1];
  // Find end of first paragraph after this heading (next blank line after some content)
  let insertBar = h2 + 2;
  for (let i = h2 + 2; i < Math.min(h2 + 15, lines.length); i++) {
    if (lines[i].trim() === '' && i > h2 + 2) { insertBar = i + 1; break; }
  }

  // Inject StatRow after the paragraph following the 3rd heading (or last heading)
  const h2b = h2Positions[Math.min(2, h2Positions.length - 1)];
  let insertStat = h2b + 2;
  for (let i = h2b + 2; i < Math.min(h2b + 15, lines.length); i++) {
    if (lines[i].trim() === '' && i > h2b + 2) { insertStat = i + 1; break; }
  }

  // Insert from bottom to top so positions don't shift
  if (insertStat > insertBar) {
    lines.splice(insertStat, 0, '', statRow, '');
    lines.splice(insertBar, 0, '', barChart, '');
  } else {
    lines.splice(insertBar, 0, '', barChart, '');
    lines.splice(insertStat, 0, '', statRow, '');
  }

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!GROQ_KEY) { console.error('❌ GROQ_API_KEY not set'); process.exit(1); }
  if (!GH_TOKEN) { console.error('❌ GH_TOKEN not set'); process.exit(1); }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const noCharts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { content } = parseFrontmatter(raw);
    if (!hasCharts(content)) noCharts.push(file);
  }

  console.log(`📊 Articles without charts: ${noCharts.length}`);
  if (noCharts.length === 0) {
    console.log('✅ All articles have charts — nothing to do.');
    await telegram('Chart Adder ✅ — all articles have charts.');
    return;
  }

  const batch = noCharts.slice(0, BATCH);
  console.log(`🔧 Processing ${batch.length} articles this run...`);

  let fixed = 0;
  let failed = 0;

  for (const file of batch) {
    const ghPath = `content/blog/${file}`;
    try {
      const ghFile = await ghGet(ghPath);
      if (!ghFile) { console.log(`⚠️  ${file}: not found on GitHub`); failed++; continue; }

      const { fm, content, fmRaw } = parseFrontmatter(ghFile.content);

      if (hasCharts(content)) {
        console.log(`⏭️  ${file}: already has charts (skip)`);
        continue;
      }

      const title    = fm.title    || file.replace('.mdx', '').replace(/-/g, ' ');
      const category = fm.category || '';

      console.log(`📈 Generating charts for: ${title.slice(0, 60)}...`);
      const { chart1, chart2 } = await generateCharts(title, category, content);
      const chartType = chart1.match(/<(\w+)/)?.[1] || 'BarChart';
      console.log(`   Chart type: ${chartType} + StatRow`);

      const updatedContent = injectCharts(content, chart1, chart2);
      const updatedRaw     = `---\n${fmRaw}\n---\n${updatedContent}`;

      await ghPut(ghPath, updatedRaw, `Add charts: ${file.replace('.mdx','')} [vercel skip]`, ghFile.sha);
      console.log(`✅ Fixed: ${file}`);
      fixed++;

      if (batch.indexOf(file) < batch.length - 1) await sleep(5000);

    } catch (err) {
      console.error(`❌ Failed ${file}: ${err.message}`);
      failed++;
    }
  }

  const remaining = noCharts.length - fixed;
  console.log(`\n=== Run complete: ${fixed} fixed, ${failed} failed, ${remaining} remaining ===`);
  console.log(`CHARTS_FIXED:${fixed}`);
  console.log(`CHARTS_REMAINING:${remaining}`);

  await telegram(
    `Chart Adder 📊\n` +
    `Fixed: ${fixed} articles\n` +
    `Failed: ${failed}\n` +
    `Remaining: ${remaining}\n` +
    (remaining > 0 ? `Next run triggered automatically.` : `✅ All articles now have charts!`)
  );
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
