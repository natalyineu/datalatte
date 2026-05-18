/**
 * Fetches a unique Unsplash image for every blog post and writes
 * the result to content/blog/image-cache.json.
 *
 * Usage:  node scripts/fetch-unsplash.mjs
 *
 * Free tier allows 50 req/hour. This script uses ~24 requests total
 * (3 searches × 8 groups), collecting ~720 unique photos, then assigns
 * one photo per post by cycling through each group's pool.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/blog");
const CACHE_FILE = path.join(ROOT, "content/blog/image-cache.json");

// Load key from .env.local
const envRaw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const KEY = envRaw.match(/UNSPLASH_ACCESS_KEY=(.+)/)?.[1]?.trim();
if (!KEY) { console.error("UNSPLASH_ACCESS_KEY not found in .env.local"); process.exit(1); }

const CATEGORY_TO_GROUP = {
  "Google Ads": "Paid Ads", "Meta Ads": "Paid Ads", "Facebook Ads": "Paid Ads",
  "Instagram Ads": "Paid Ads", "TikTok Ads": "Paid Ads", "TikTok Marketing": "Paid Ads",
  "YouTube Ads": "Paid Ads", "Audio Advertising": "Paid Ads", "Snapchat Advertising": "Paid Ads",
  "Microsoft Ads": "Paid Ads", "Yahoo Advertising": "Paid Ads",
  "Programmatic Advertising": "Paid Ads", "CTV & OTT": "Paid Ads",
  "Retargeting": "Paid Ads", "Review Platform Ads": "Paid Ads",
  "Local SEO": "SEO & Content", "Content Marketing": "SEO & Content",
  "Reputation Management": "SEO & Content", "Offline Marketing": "SEO & Content",
  "Social Media": "Social", "Instagram Marketing": "Social",
  "Influencer Marketing": "Social", "Influencer & Creator Marketing": "Social",
  "Reddit & Community Marketing": "Social", "Nextdoor & Neighborhood Marketing": "Social",
  "Messaging & Community Marketing": "Social", "Pinterest Marketing": "Social",
  "AI & Automation": "AI & Automation", "Marketing Automation": "AI & Automation",
  "Email & SMS Marketing": "Email & SMS", "Email Marketing": "Email & SMS",
  "Analytics & Tracking": "Analytics", "Tool Comparisons": "Analytics",
  "Case Studies": "Analytics", "Website & CRO": "Analytics",
  "Coffee Shops": "Niches", "Coffee Shop Marketing": "Niches",
  "Hair Salons": "Niches", "Hair Salon Marketing": "Niches",
  "Pet Groomers": "Niches", "Pet Groomer Marketing": "Niches",
  "Fitness Studios": "Niches", "Fitness Studio Marketing": "Niches",
  "Marketing Strategy": "Strategy",
};

const GROUP_QUERIES = {
  "Paid Ads":       ["digital advertising", "online marketing campaign", "pay per click"],
  "SEO & Content":  ["content writing blog", "seo search engine", "copywriting desk"],
  "Social":         ["social media phone", "instagram influencer", "community people"],
  "AI & Automation":["artificial intelligence technology", "automation robot", "machine learning"],
  "Email & SMS":    ["email newsletter laptop", "messaging app phone", "inbox communication"],
  "Analytics":      ["data analytics chart", "business dashboard", "statistics report"],
  "Niches":         ["coffee shop interior", "hair salon beauty", "pet grooming dog"],
  "Strategy":       ["business strategy meeting", "marketing plan whiteboard", "growth planning"],
};

async function searchUnsplash(query, page = 1) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  if (!res.ok) throw new Error(`Unsplash error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results.map(p => p.urls.regular + "&w=800&q=75&fit=crop");
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function buildGroupPools() {
  const pools = {};
  for (const [group, queries] of Object.entries(GROUP_QUERIES)) {
    console.log(`Fetching pool for "${group}"…`);
    const photos = [];
    for (const q of queries) {
      const results = await searchUnsplash(q);
      photos.push(...results);
      await sleep(300); // stay well under rate limit
    }
    // deduplicate by URL
    pools[group] = [...new Set(photos)];
    console.log(`  → ${pools[group].length} unique photos`);
  }
  return pools;
}

function readFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const obj = {};
  for (const line of match[1].split("\n")) {
    const [k, ...v] = line.split(":");
    if (k && v.length) obj[k.trim()] = v.join(":").trim().replace(/^["']|["']$/g, "");
  }
  return obj;
}

async function main() {
  const pools = await buildGroupPools();

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
  const groupCounters = {};
  const cache = {};

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const fm = readFrontmatter(raw);
    const group = CATEGORY_TO_GROUP[fm.category] ?? "Strategy";

    if (!(group in groupCounters)) groupCounters[group] = 0;
    const pool = pools[group];
    if (!pool || pool.length === 0) { cache[slug] = null; continue; }

    cache[slug] = pool[groupCounters[group] % pool.length];
    groupCounters[group]++;
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`\nDone — wrote image-cache.json for ${files.length} posts.`);
}

main().catch(e => { console.error(e); process.exit(1); });
