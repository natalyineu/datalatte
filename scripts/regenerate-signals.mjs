#!/usr/bin/env node
/**
 * Re-fetch source URLs + regenerate all radar signals with improved Groq prompt.
 * Fixes thin content and cleans up ugly timestamp slugs.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... GROQ_API_KEY=... node scripts/regenerate-signals.mjs
 *   node scripts/regenerate-signals.mjs --dry-run   (preview only, no writes)
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local for local runs
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx < 0) continue;
    const key = t.slice(0, idx);
    const val = t.slice(idx + 1).replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("❌ Missing SUPABASE env vars"); process.exit(1); }
if (!GROQ_API_KEY) { console.error("❌ Missing GROQ_API_KEY"); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function toSlug(headline) {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 75);
}

async function fetchArticleText(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "DataLatte-Radar/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    // Strip tags, collapse whitespace, take first 1200 chars
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1200);
    return text || null;
  } catch {
    return null;
  }
}

async function regenerateSignal(signal, articleText) {
  const content = articleText
    ? articleText
    : signal.summary || signal.headline;

  const prompt = `You are a marketing intelligence analyst for DataLatte — a local marketing agency for coffee shops, hair salons, pet groomers, and fitness studios in US/UK/AU.

Rewrite this marketing news signal with SUBSTANTIAL, SPECIFIC content. A business owner should finish reading and know exactly what to do differently.

SOURCE: ${signal.source}
ORIGINAL HEADLINE: ${signal.headline}
ARTICLE CONTENT: ${content}

Write a complete signal with 5 body paragraphs minimum. Return JSON:
{
  "headline": "punchy, specific headline max 90 chars — name what changed",
  "summary": "2-3 sentences — what specifically changed, which platform/product, and the concrete effect on local business revenue or visibility",
  "body": [
    "Background: what this platform/feature is and why local businesses use it (2-3 sentences)",
    "What changed: the specific update, announcement, or shift described in the article (2-3 sentences)",
    "Why it matters: how this directly affects a local business's ad spend, reach, bookings, or search ranking (2-3 sentences)",
    "Niche breakdown: specific examples — how a hair salon, coffee shop, pet groomer, or fitness studio is affected differently (3-4 sentences)",
    "What to do: concrete next steps — name exact settings, features, or actions to take this week (2-3 sentences)"
  ],
  "insight": "2-3 sentences of SPECIFIC, ACTIONABLE advice — name the exact setting to change, the exact feature to enable, or the exact thing to do this week. No generic advice.",
  "category": "${signal.category}",
  "impact": "${signal.impact}",
  "niches": ${JSON.stringify(signal.niches)}
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Groq ${res.status}: ${err.slice(0, 150)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty Groq response");
  return JSON.parse(raw);
}

async function main() {
  console.log(`\n🔄 Regenerating all radar signals${DRY_RUN ? " [DRY RUN]" : ""}...\n`);

  // Fetch all signals
  const { data: signals, error } = await supabase
    .from("radar_signals")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) { console.error("Supabase error:", error.message); process.exit(1); }
  console.log(`📊 Found ${signals.length} signals to regenerate\n`);

  let updated = 0, failed = 0, skipped = 0;

  for (const signal of signals) {
    const oldSlug = signal.slug;
    console.log(`\n[${updated + failed + skipped + 1}/${signals.length}] ${oldSlug}`);

    if (DRY_RUN) {
      console.log(`  → Would regenerate: ${signal.headline}`);
      skipped++;
      continue;
    }

    // 1. Fetch article content
    process.stdout.write(`  Fetching ${signal.source_url?.slice(0, 60)}...`);
    const articleText = await fetchArticleText(signal.source_url);
    console.log(articleText ? ` ${articleText.length} chars` : " failed (using summary)");

    // 2. Regenerate via Groq
    try {
      process.stdout.write(`  Generating...`);
      const newData = await regenerateSignal(signal, articleText);
      const newSlug = toSlug(newData.headline);
      console.log(` ✅ "${newData.headline.slice(0, 60)}"`);

      // 3. Update in Supabase
      const { error: updateError } = await supabase
        .from("radar_signals")
        .update({
          slug: newSlug,
          headline: newData.headline,
          summary: newData.summary,
          body: newData.body,
          insight: newData.insight,
        })
        .eq("slug", oldSlug);

      if (updateError) {
        // Slug collision — just update content, keep old slug
        const { error: updateError2 } = await supabase
          .from("radar_signals")
          .update({
            headline: newData.headline,
            summary: newData.summary,
            body: newData.body,
            insight: newData.insight,
          })
          .eq("slug", oldSlug);
        if (updateError2) {
          console.error(`  ❌ DB error: ${updateError2.message}`);
          failed++;
        } else {
          console.log(`  ℹ️  Slug collision, content updated (kept slug: ${oldSlug})`);
          updated++;
        }
      } else {
        if (newSlug !== oldSlug) console.log(`  🔗 Slug: ${oldSlug} → ${newSlug}`);
        updated++;
      }
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      failed++;
    }

    // Rate limit: ~5s between requests to stay under Groq TPM
    await sleep(5000);
  }

  console.log(`\n✅ Done: ${updated} updated, ${failed} failed, ${skipped} skipped`);
}

main().catch(err => { console.error(err); process.exit(1); });
