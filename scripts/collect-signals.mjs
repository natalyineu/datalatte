#!/usr/bin/env node
/**
 * Manually collect radar signals: RSS → Groq classification → JSON output
 * Run: node scripts/collect-signals.mjs
 * Then pipe to Supabase via insert-signals.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
const envVars = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    envVars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).replace(/^["']|["']$/g, "");
  }
}

const GROQ_API_KEY = envVars.GROQ_API_KEY || process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing");
  process.exit(1);
}

const RSS_SOURCES = [
  { url: "https://www.searchenginejournal.com/feed/",         name: "Search Engine Journal",  category: "seo" },
  { url: "https://searchengineland.com/feed",                 name: "Search Engine Land",     category: "seo" },
  { url: "https://feeds.feedburner.com/blogspot/amDG",        name: "Google Search Central",  category: "google" },
  { url: "https://ads-developers.googleblog.com/feeds/posts/default", name: "Google Ads Blog", category: "google" },
  { url: "https://moz.com/blog/feed",                         name: "Moz Blog",               category: "seo" },
  { url: "https://www.semrush.com/blog/feed/",                name: "Semrush Blog",           category: "seo" },
  { url: "https://www.brightlocal.com/blog/feed/",            name: "BrightLocal Blog",       category: "seo" },
  { url: "https://martech.org/feed/",                         name: "MarTech",                category: "seo" },
  { url: "https://www.socialmediaexaminer.com/feed/",         name: "Social Media Examiner",  category: "meta" },
  { url: "https://sproutsocial.com/insights/feed/",           name: "Sprout Social",          category: "meta" },
  { url: "https://blog.hubspot.com/marketing/rss.xml",        name: "HubSpot Marketing",      category: "meta" },
  { url: "https://blog.hootsuite.com/feed/",                  name: "Hootsuite Blog",         category: "meta" },
  { url: "https://neilpatel.com/blog/feed/",                  name: "Neil Patel Blog",        category: "seo" },
  { url: "https://newsroom.tiktok.com/feed/",                 name: "TikTok Newsroom",        category: "tiktok" },
  { url: "https://zapier.com/blog/feeds/latest/",             name: "Zapier Blog",            category: "ai" },
  { url: "https://blog.google/rss/",                          name: "Google Blog",            category: "google" },
  { url: "https://www.wordstream.com/blog/feed",              name: "WordStream Blog",        category: "google" },
  { url: "https://www.adexchanger.com/feed/",                 name: "AdExchanger",            category: "ctv" },
  { url: "https://digiday.com/feed/",                         name: "Digiday",                category: "ctv" },
  { url: "https://www.nexttv.com/rss",                        name: "Next TV",                category: "ctv" },
];

const MAX_AGE_HOURS = parseInt(process.env.MAX_AGE_HOURS || "26"); // override: MAX_AGE_HOURS=168 for catch-up runs
const MAX_PER_SOURCE = parseInt(process.env.MAX_PER_SOURCE || "3");
const BATCH_SIZE = 8;

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

async function fetchFeed(source) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "User-Agent": "DataLatte-Radar/1.0" },
    });
    clearTimeout(timer);
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = (/<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(item) || /<title>(.*?)<\/title>/.exec(item))?.[1]?.trim();
      const link = (/<link>(.*?)<\/link>/.exec(item) || /<link[^>]+href="(.*?)"/.exec(item))?.[1]?.trim();
      const pubDate = (/<pubDate>(.*?)<\/pubDate>/.exec(item) || /<published>(.*?)<\/published>/.exec(item))?.[1]?.trim();
      const desc = (/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(item) || /<description>([\s\S]*?)<\/description>/.exec(item))?.[1]?.trim()?.replace(/<[^>]+>/g, "")?.slice(0, 400);
      if (title && link) items.push({ title, link, pubDate, desc });
    }
    return items;
  } catch {
    return [];
  }
}

async function classifyBatch(articles) {
  const list = articles.map((a, i) =>
    `[${i}] SOURCE: ${a.source}\nTITLE: ${a.title}\nCONTENT: ${(a.desc || "").slice(0, 350)}`
  ).join("\n\n---\n\n");

  const prompt = `You are a marketing intelligence analyst for DataLatte — local marketing agency for coffee shops, hair salons, pet groomers, and fitness studios in US/UK/AU.

Evaluate these ${articles.length} articles. For each, decide if it's relevant to LOCAL BUSINESS MARKETING (digital ads, local SEO, Google Business Profile, AI tools for small business, social media marketing, CTV/OTT, review management, booking tools).

NOT relevant: enterprise B2B, stock markets, politics, pure tech.

Return a JSON object with key "results" containing an array, one object per article:
{
  "results": [
    {
      "index": 0,
      "relevant": false
    },
    {
      "index": 1,
      "relevant": true,
      "category": "meta"|"google"|"ai"|"tiktok"|"seo"|"ctv",
      "impact": "breaking"|"high"|"medium"|"fyi",
      "niches": ["coffee","salons","pet","fitness"],
      "headline": "punchy headline max 90 chars",
      "summary": "1-2 sentences — what changed and why local businesses care",
      "body": ["context paragraph", "data/specifics paragraph", "implications for local businesses"],
      "insight": "1-2 sentences of concrete actionable advice for a local business owner"
    }
  ]
}

Articles:
${list}`;

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
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error(`  Groq error ${res.status}: ${err.slice(0, 200)}`);
    return articles.map((_, i) => ({ index: i, relevant: false }));
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return articles.map((_, i) => ({ index: i, relevant: false }));

  try {
    const parsed = JSON.parse(content);
    const results = Array.isArray(parsed) ? parsed : (parsed.results ?? parsed);
    console.log(`  Groq: ${results.filter(r => r.relevant).length}/${articles.length} relevant`);
    return results;
  } catch {
    console.error("  Groq: JSON parse failed");
    return articles.map((_, i) => ({ index: i, relevant: false }));
  }
}

async function main() {
  const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 3_600_000);
  console.log(`\n🔍 Collecting signals — window: last ${MAX_AGE_HOURS}h (since ${cutoff.toISOString()})\n`);

  const allArticles = [];
  let sourceOk = 0;

  for (const source of RSS_SOURCES) {
    process.stdout.write(`  ${source.name}...`);
    const items = await fetchFeed(source);
    const recent = items
      .filter(i => i.pubDate && new Date(i.pubDate) > cutoff)
      .slice(0, MAX_PER_SOURCE);
    if (recent.length > 0) {
      for (const item of recent) {
        allArticles.push({ ...item, source: source.name, sourceUrl: source.url });
      }
      console.log(` ${recent.length} articles`);
      sourceOk++;
    } else {
      console.log(` 0`);
    }
  }

  console.log(`\n📰 Total articles: ${allArticles.length} from ${sourceOk} sources\n`);

  if (allArticles.length === 0) {
    console.log("No articles found. Exiting.");
    return;
  }

  const signals = [];
  for (let i = 0; i < allArticles.length; i += BATCH_SIZE) {
    const batch = allArticles.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allArticles.length / BATCH_SIZE)} (${batch.length} articles)...`);
    const results = await classifyBatch(batch);

    for (const result of results) {
      const article = batch[result.index];
      if (!article || !result.relevant || !result.headline) continue;
      const slug = `${toSlug(result.headline)}-${Date.now().toString(36)}`;
      signals.push({
        slug,
        status: "published",
        source: article.source,
        source_url: article.link,
        category: result.category,
        published_at: article.pubDate ? new Date(article.pubDate).toISOString() : new Date().toISOString(),
        impact: result.impact,
        headline: result.headline,
        summary: result.summary,
        body: result.body,
        insight: result.insight,
        niches: result.niches,
      });
      console.log(`  ✅ [${result.impact}] ${result.headline.slice(0, 70)}`);
    }

    if (i + BATCH_SIZE < allArticles.length) await sleep(2000);
  }

  console.log(`\n✨ Collected ${signals.length} relevant signals`);

  const outPath = path.join(__dirname, "signals-output.json");
  fs.writeFileSync(outPath, JSON.stringify(signals, null, 2));
  console.log(`📄 Saved to ${outPath}\n`);
}

main().catch(console.error);
