#!/usr/bin/env node
/**
 * uniquify-geo-articles.mjs
 *
 * Rewrites the 80 template-generated geo articles (US states, Canada,
 * UK regions, Australia) to make them genuinely unique.
 *
 * Strategy (fast & cheap):
 *   - Keep MDX structure and components
 *   - Replace identical BarChart/StatRow numbers with location-specific data
 *   - Add 2–3 unique paragraphs with real local business context
 *   - Expand to ~2,200 words
 *
 * Speed: CONCURRENCY=10, deepseek-v4-flash → ~3-5 min for 80 articles
 * Cost:  ~$0.03 total
 *
 * Usage:
 *   OPENROUTER_API_KEY=sk-or-... node scripts/uniquify-geo-articles.mjs
 *   node scripts/uniquify-geo-articles.mjs --dry-run
 *   node scripts/uniquify-geo-articles.mjs --slug small-business-marketing-california
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content/blog');
const PROGRESS_FILE = path.join(__dirname, '.uniquify-progress.json');

const DRY_RUN    = process.argv.includes('--dry-run');
const FORCE      = process.argv.includes('--force');
const SLUG_ARG   = (() => { const i = process.argv.indexOf('--slug'); return i !== -1 ? process.argv[i + 1] : null; })();
const CONCURRENCY = 10;
const DELAY_MS   = 500;
const RETRY_LIMIT = 2;

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

// ── Detect template articles ─────────────────────────────────────────────────
const TEMPLATE_PATTERNS = [
  /values="820\|540\|390\|310"/,
  /values="740\|480\|320\|290"/,
  /values="720\|460\|310\|280"/,
  /values="680\|420\|290\|260"/,
];

function isTemplate(content) {
  return TEMPLATE_PATTERNS.some(p => p.test(content));
}

// ── API call ─────────────────────────────────────────────────────────────────
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callAI(slug, content) {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set');

  // Extract location from slug for context
  const location = slug
    .replace('small-business-marketing-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const systemPrompt = `You are a senior local marketing consultant writing for DataLatte.pro.
You write authoritative, specific, data-rich marketing guides for small business owners.
Output ONLY the complete rewritten MDX article — no commentary, no markdown fences.`;

  const userPrompt = `Rewrite this marketing guide for ${location} to make it genuinely unique and valuable.

RULES:
1. Keep ALL frontmatter exactly as-is (title, date, slug, image, etc.)
2. Keep ALL MDX components (StatRow, BarChart, Callout, tables) but REPLACE the fake identical numbers with realistic location-specific values:
   - BarChart search volumes: use realistic numbers that reflect the actual market size of ${location}
   - BarChart ROAS values: vary them realistically (retargeting should be highest, awareness lowest)
   - StatRow: keep existing values
3. Add 2–3 genuinely unique sections with specific local business examples, neighbourhood names, local events, or cultural context for ${location}
4. Expand to ~2,200 words minimum
5. Every paragraph should feel written specifically for ${location} — not generic
6. Keep the same overall structure and all internal links (/services/..., /contact, /for/...)
7. No emojis. Professional tone.

ORIGINAL ARTICLE:
${content}`;

  for (let attempt = 1; attempt <= RETRY_LIMIT + 1; attempt++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://datalatte.pro',
          'X-Title': 'DataLatte Geo Uniquifier',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v4-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 3500,
          temperature: 0.7,
        }),
      });

      if (res.status === 429 || res.status >= 500) {
        if (attempt <= RETRY_LIMIT) {
          const wait = attempt * 3000;
          console.log(`   ⏳ Rate limit (${res.status}), retry ${attempt}/${RETRY_LIMIT} in ${wait/1000}s...`);
          await sleep(wait);
          continue;
        }
        throw new Error(`API ${res.status} after retries`);
      }

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const json = await res.json();
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty response from API');

      // Strip markdown fences if model wrapped it
      return text.replace(/^```(?:mdx|markdown)?\n?/, '').replace(/\n?```$/, '');
    } catch (err) {
      if (attempt <= RETRY_LIMIT) { await sleep(attempt * 3000); continue; }
      throw err;
    }
  }
}

// ── Process one file ─────────────────────────────────────────────────────────
async function processFile(slug, progress) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) { console.log(`⚠️  Not found: ${slug}`); return; }

  const original = fs.readFileSync(filePath, 'utf8');

  if (!FORCE && progress[slug]) {
    console.log(`  ⏭  ${slug} (already done)`);
    return;
  }

  if (DRY_RUN) {
    console.log(`  [dry-run] Would rewrite: ${slug}`);
    return;
  }

  try {
    console.log(`  ✍️  ${slug}...`);
    const rewritten = await callAI(slug, original);

    // Sanity check: must have frontmatter
    if (!rewritten.startsWith('---')) {
      console.log(`  ⚠️  ${slug}: response missing frontmatter, skipping`);
      return;
    }

    fs.writeFileSync(filePath, rewritten, 'utf8');
    progress[slug] = new Date().toISOString();
    saveProgress(progress);
    const words = rewritten.split(/\s+/).length;
    console.log(`  ✅ ${slug} (${words} words)`);
  } catch (err) {
    console.log(`  ❌ ${slug}: ${err.message}`);
  }
}

// ── Progress tracking ────────────────────────────────────────────────────────
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch {}
  }
  return {};
}
function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!OPENROUTER_KEY && !DRY_RUN) {
    console.error('❌ OPENROUTER_API_KEY not set. Add it to .env.local or pass as env var.');
    process.exit(1);
  }

  // Find template articles
  let slugs;
  if (SLUG_ARG) {
    slugs = [SLUG_ARG];
  } else {
    slugs = fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
      .filter(slug => {
        const content = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
        return isTemplate(content);
      })
      .sort();
  }

  const progress = loadProgress();
  const todo = FORCE ? slugs : slugs.filter(s => !progress[s]);

  console.log(`\n🌍 Uniquifying geo articles`);
  console.log(`   Total template articles: ${slugs.length}`);
  console.log(`   Already done: ${slugs.length - todo.length}`);
  console.log(`   To process: ${todo.length}`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  console.log(`   Model: deepseek/deepseek-v4-flash`);
  console.log(`   Est. time: ~${Math.ceil(todo.length / CONCURRENCY * 12 / 60)} min\n`);

  if (todo.length === 0) { console.log('✅ All done!'); return; }

  const start = Date.now();

  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batch = todo.slice(i, i + CONCURRENCY);
    console.log(`\nBatch ${Math.floor(i/CONCURRENCY)+1}/${Math.ceil(todo.length/CONCURRENCY)} [${batch.length} articles]`);
    await Promise.all(batch.map(s => processFile(s, progress)));
    if (i + CONCURRENCY < todo.length) await sleep(DELAY_MS);
  }

  const mins = ((Date.now() - start) / 60000).toFixed(1);
  const done  = Object.keys(progress).length;
  console.log(`\n✅ Done — ${done} articles rewritten in ${mins} min`);
  console.log('   Run: git add content/blog && git commit -m "feat: uniquify 80 geo articles via AI"');
}

main().catch(err => { console.error(err); process.exit(1); });
