/**
 * expand-to-3500.mjs
 *
 * Rewrites every blog post to ~3500 words with Nataliia's specific voice.
 * Processes in parallel batches, tracks progress, resumes on restart.
 *
 * Supported API providers (in priority order):
 *   1. OPENROUTER_API_KEY  → deepseek/deepseek-chat (best quality, cheapest)
 *   2. CEREBRAS_API_KEY    → llama-3.3-70b (fastest)
 *   3. GROQ_API_KEY        → llama-3.3-70b-versatile
 *
 * Usage:
 *   OPENROUTER_API_KEY=sk-or-... node scripts/expand-to-3500.mjs
 *   GROQ_API_KEY=gsk_...        node scripts/expand-to-3500.mjs
 *   CEREBRAS_API_KEY=...        node scripts/expand-to-3500.mjs
 *   node scripts/expand-to-3500.mjs --limit 20
 *   node scripts/expand-to-3500.mjs --slug coffee-shop-cro-techniques
 *   node scripts/expand-to-3500.mjs --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../content/blog");
const PROGRESS_FILE = path.join(__dirname, "../content/expand-progress.json");

// ── Provider detection ──────────────────────────────────────────────────────
function detectProvider() {
  if (process.env.OPENROUTER_API_KEY) {
    return {
      name: "OpenRouter",
      key: process.env.OPENROUTER_API_KEY,
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.EXPAND_MODEL || "deepseek/deepseek-chat",
      extraHeaders: { "X-Title": "DataLatte Expander" },
    };
  }
  if (process.env.CEREBRAS_API_KEY) {
    return {
      name: "Cerebras",
      key: process.env.CEREBRAS_API_KEY,
      url: "https://api.cerebras.ai/v1/chat/completions",
      model: process.env.EXPAND_MODEL || "llama-3.3-70b",
      extraHeaders: {},
    };
  }
  if (process.env.GROQ_API_KEY) {
    return {
      name: "Groq",
      key: process.env.GROQ_API_KEY,
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: process.env.EXPAND_MODEL || "llama-3.3-70b-versatile",
      extraHeaders: {},
    };
  }
  return null;
}

const PROVIDER = detectProvider();

// ── Config ─────────────────────────────────────────────────────────────────
const TARGET_WORDS = 3500;
const SKIP_ABOVE = 3200;       // skip posts already at/above this
const CONCURRENCY = process.env.CEREBRAS_API_KEY ? 5 : 3; // cerebras is faster
const RETRY_LIMIT = 2;
const DELAY_MS = process.env.GROQ_API_KEY ? 1500 : 800; // groq needs more breathing room

// ── CLI args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = (() => { const i = args.indexOf("--limit"); return i !== -1 ? parseInt(args[i + 1]) : null; })();
const MIN_WORDS = (() => { const i = args.indexOf("--min-words"); return i !== -1 ? parseInt(args[i + 1]) : 0; })();
const SINGLE_SLUG = (() => { const i = args.indexOf("--slug"); return i !== -1 ? args[i + 1] : null; })();
const FORCE = args.includes("--force"); // re-expand even if already done

// ── Helpers ────────────────────────────────────────────────────────────────
function countWords(text) {
  return text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function parseMdx(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: "", body: raw };
  return { frontmatter: match[1], body: match[2].trim() };
}

function estimateReadTime(words) {
  return `${Math.max(7, Math.ceil(words / 220))} min read`;
}

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")); }
  catch { return { done: [], failed: [] }; }
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Prompt ─────────────────────────────────────────────────────────────────
// This captures Nataliia's specific voice from the /about page:
// - 10+ yrs at OMD, Dentsu, BBDO, GroupM
// - Dry wit, concrete specifics, direct opinions
// - No generic listicle tone, no "as we've seen"
// - Real numbers, real scenarios
// - Coffee obsession where natural
function buildPrompt(frontmatter, body, currentWords) {
  const fm = {};
  frontmatter.split("\n").forEach(line => {
    const [k, ...v] = line.split(":");
    if (k && v.length) fm[k.trim()] = v.join(":").trim().replace(/^['"]|['"]$/g, "");
  });

  return `You are rewriting a blog article for DataLatte.pro.

## WHO IS NATALIIA (the author / brand voice)

Nataliia runs DataLatte from Poznań, Poland. She spent 10+ years at OMD, Dentsu, BBDO, and GroupM — Fortune 500 budgets, full-funnel campaigns across Europe and the US. She started DataLatte to work directly with small businesses who are tired of being handed off to juniors and fed generic decks.

Her writing voice:
- Dry, specific, occasionally self-deprecating. "I ordered a second coffee I did not need. No regrets."
- Gives real opinions, not "it depends on your goals" non-answers
- References actual agency experience: "I've seen this budget mistake kill campaigns at three different clients"
- Uses concrete numbers and real scenarios, not vague statistics
- Talks to business owners like a smart colleague, not a textbook
- Occasionally uses coffee as a metaphor but never forces it
- Does NOT say: "in today's digital landscape", "it's more important than ever", "let's dive in", "at the end of the day", "game-changer", "leverage", "synergy"
- DOES say things like: "Here's what actually happened when I tested this", "The uncomfortable truth is...", "Most guides skip this part — don't"

## ARTICLE TO EXPAND

Title: ${fm.title || ""}
Category: ${fm.category || ""}
Description: ${fm.description || ""}
Target audience: Small business owners in US, UK, Canada, Australia (coffee shops, hair salons, pet groomers, fitness studios)

Current article (${currentWords} words):
${body}

## YOUR TASK

Rewrite and expand this article to exactly ${TARGET_WORDS}–${TARGET_WORDS + 300} words total.

Structure requirements:
1. Keep the original intro paragraph(s) — you may polish the wording slightly
2. Keep all existing MDX components exactly as they are (do not modify props or add new component types)
3. Add 5–7 new substantive H2 sections. Each section should be 400–500 words with:
   - A specific, non-obvious insight (not "make sure you use keywords")
   - A real-world scenario or example with numbers
   - 1–2 actionable steps the reader can do this week
4. Add a "## Common Mistakes (And What to Do Instead)" section — 3 mistakes, each with a short story of what happens when you make it
5. Add a "## Frequently Asked Questions" section with 5–6 real questions a skeptical business owner would ask, with direct answers (no fluff)
6. End with a CTA paragraph that sounds like Nataliia: personal, direct, no hype

MDX component rules (CRITICAL):
- ONLY use these components if they already appear in the original: <Callout>, <StatRow>, <BarChart>, <Funnel>, <DonutChart>, <LineChart>, <CompareBar>, <StepPlan>
- Do NOT add new component instances
- Write FAQ as plain markdown (## Frequently Asked Questions, then **Q:** bold question, then answer paragraph)
- All other content is standard markdown (##, ###, **bold**, *italic*, bullet lists, numbered lists)

Output ONLY the article body — no frontmatter, no code fences, no preamble. Start directly with the first heading or paragraph.`;
}

// ── API call ───────────────────────────────────────────────────────────────
async function callOpenRouter(prompt, attempt = 1) {
  const res = await fetch(PROVIDER.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PROVIDER.key}`,
      "Content-Type": "application/json",
      ...PROVIDER.extraHeaders,
    },
    body: JSON.stringify({
      model: PROVIDER.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10000,
      temperature: 0.7,
    }),
  });

  if (res.status === 429 || res.status >= 500) {
    if (attempt <= RETRY_LIMIT) {
      const wait = attempt * 3000;
      console.log(`   ⏳ Rate limit / server error (${res.status}), retry ${attempt}/${RETRY_LIMIT} in ${wait / 1000}s...`);
      await sleep(wait);
      return callOpenRouter(prompt, attempt + 1);
    }
    throw new Error(`API ${res.status} after ${RETRY_LIMIT} retries`);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from API");
  return content;
}

// ── Process one file ───────────────────────────────────────────────────────
async function processFile(file, progress) {
  const slug = file.replace(".mdx", "");
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseMdx(raw);
  const currentWords = countWords(body);

  const tag = `[${slug.slice(0, 45)}]`;

  if (!FORCE && progress.done.includes(slug)) {
    console.log(`⏭  ${tag} already done, skipping`);
    return "skip";
  }

  if (currentWords >= SKIP_ABOVE && !FORCE) {
    console.log(`⏭  ${tag} ${currentWords} words — already long enough`);
    progress.done.push(slug);
    return "skip";
  }

  console.log(`✏️  ${tag} ${currentWords}w → targeting ${TARGET_WORDS}w`);

  if (DRY_RUN) {
    console.log(`   [DRY RUN] would call API`);
    return "dry";
  }

  try {
    const prompt = buildPrompt(frontmatter, body, currentWords);
    const expanded = await callOpenRouter(prompt);
    const newWords = countWords(expanded);

    if (newWords < 1500) {
      console.error(`   ❌ ${tag} suspiciously short result: ${newWords} words`);
      progress.failed.push(slug);
      saveProgress(progress);
      return "fail";
    }

    // backup
    fs.writeFileSync(`${filePath}.bak`, raw);

    // update readTime in frontmatter
    const updatedFm = frontmatter.replace(
      /readTime:.*$/m,
      `readTime: '${estimateReadTime(newWords)}'`
    );

    fs.writeFileSync(filePath, `---\n${updatedFm}\n---\n\n${expanded}\n`);
    progress.done.push(slug);
    saveProgress(progress);

    console.log(`   ✅ ${tag} ${currentWords}w → ${newWords}w`);
    return "done";
  } catch (err) {
    console.error(`   ❌ ${tag} failed: ${err.message}`);
    progress.failed.push(slug);
    saveProgress(progress);
    return "fail";
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!PROVIDER && !DRY_RUN) {
    console.error("❌ No API key found. Set one of:");
    console.error("   OPENROUTER_API_KEY=sk-or-...");
    console.error("   CEREBRAS_API_KEY=...");
    console.error("   GROQ_API_KEY=gsk_...");
    process.exit(1);
  }

  const progress = loadProgress();

  console.log(`🚀 DataLatte Blog Expander`);
  console.log(`   Provider:    ${PROVIDER?.name || "DRY RUN"}`);
  console.log(`   Model:       ${PROVIDER?.model || "-"}`);
  console.log(`   Target:      ${TARGET_WORDS} words`);
  console.log(`   Skip above:  ${SKIP_ABOVE} words`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  console.log(`   Already done: ${progress.done.length}`);
  console.log(`   Failed prev:  ${progress.failed.length}`);
  if (DRY_RUN) console.log(`   MODE: DRY RUN`);
  console.log();

  let files;

  if (SINGLE_SLUG) {
    files = [`${SINGLE_SLUG}.mdx`];
  } else {
    const allFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));

    // sort by word count ascending (shortest first)
    const withCounts = allFiles.map(f => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
      const { body } = parseMdx(raw);
      return { file: f, words: countWords(body) };
    });

    withCounts.sort((a, b) => a.words - b.words);

    files = withCounts
      .filter(({ file, words }) => {
        const slug = file.replace(".mdx", "");
        if (!FORCE && progress.done.includes(slug)) return false;
        if (words >= SKIP_ABOVE && !FORCE) return false;
        if (words < MIN_WORDS) return false;
        return true;
      })
      .map(({ file }) => file);

    if (LIMIT) files = files.slice(0, LIMIT);
  }

  console.log(`📋 Posts to process: ${files.length}\n`);

  if (files.length === 0) {
    console.log("Nothing to do. Use --force to re-expand already-done posts.");
    return;
  }

  let done = 0, skipped = 0, failed = 0;
  const startTime = Date.now();

  // process in batches of CONCURRENCY
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(f => processFile(f, progress)));

    results.forEach(r => {
      if (r === "done") done++;
      else if (r === "skip" || r === "dry") skipped++;
      else if (r === "fail") failed++;
    });

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const processed = i + batch.length;
    const pct = Math.round((processed / files.length) * 100);
    console.log(`   📊 Progress: ${processed}/${files.length} (${pct}%) | done:${done} skipped:${skipped} failed:${failed} | ${elapsed}s elapsed\n`);

    if (i + CONCURRENCY < files.length) await sleep(DELAY_MS);
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 Complete in ${totalTime}s`);
  console.log(`   ✅ Expanded: ${done}`);
  console.log(`   ⏭  Skipped:  ${skipped}`);
  console.log(`   ❌ Failed:   ${failed}`);

  if (progress.failed.length > 0) {
    console.log(`\n⚠️  Failed slugs (retry with --slug <name> --force):`);
    progress.failed.slice(-10).forEach(s => console.log(`   - ${s}`));
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
