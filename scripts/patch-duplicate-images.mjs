/**
 * Finds duplicate images in image-cache.json and replaces them with unique
 * Unsplash photos by fetching additional pages for each topic group.
 *
 * Usage: node scripts/patch-duplicate-images.mjs
 * Rate: uses ~15–20 API calls (well within 50/hour free limit)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE_FILE = path.join(ROOT, "content/blog/image-cache.json");

const envRaw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const KEY = envRaw.match(/UNSPLASH_ACCESS_KEY=(.+)/)?.[1]?.trim();
if (!KEY) { console.error("UNSPLASH_ACCESS_KEY not found in .env.local"); process.exit(1); }

// Same category→group mapping as fetch-unsplash.mjs
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

// Wider queries to mine more unique photos (pages 2–4)
const GROUP_QUERIES = {
  "Paid Ads":        ["digital advertising", "online marketing campaign", "pay per click ads", "google ads laptop", "advertising billboard", "marketing analytics"],
  "SEO & Content":   ["content writing blog", "seo search engine", "copywriting desk", "blogging workspace", "content creator laptop"],
  "Social":          ["social media phone", "instagram influencer", "community people", "social network", "content creator filming"],
  "AI & Automation": ["artificial intelligence technology", "automation robot", "machine learning", "ai chatbot", "smart technology", "future tech"],
  "Email & SMS":     ["email newsletter laptop", "messaging app phone", "inbox communication", "email marketing", "smartphone messaging"],
  "Analytics":       ["data analytics chart", "business dashboard", "statistics report", "data visualization", "business metrics"],
  "Niches":          ["coffee shop interior", "hair salon beauty", "pet grooming dog", "fitness studio gym", "small business owner", "barbershop"],
  "Strategy":        ["business strategy meeting", "marketing plan whiteboard", "growth planning", "entrepreneur office", "startup team"],
};

async function searchUnsplash(query, page) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results.map(p => p.urls.regular);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  const allUsedUrls = new Set(Object.values(cache));

  // Find duplicates: for each URL used >1 time, keep the first slug, patch the rest
  const urlToSlugs = {};
  for (const [slug, url] of Object.entries(cache)) {
    if (!urlToSlugs[url]) urlToSlugs[url] = [];
    urlToSlugs[url].push(slug);
  }

  // Build list of slugs needing a new unique photo, with their group
  const BLOG_DIR = path.join(ROOT, "content/blog");
  function readCategory(slug) {
    const file = path.join(BLOG_DIR, slug + ".mdx");
    if (!fs.existsSync(file)) return "";
    const raw = fs.readFileSync(file, "utf8");
    const m = raw.match(/^category:\s*["']?(.+?)["']?\s*$/m);
    return m ? m[1].trim() : "";
  }

  const needsNew = []; // [{ slug, group }]
  for (const [, slugs] of Object.entries(urlToSlugs)) {
    if (slugs.length < 2) continue;
    for (const slug of slugs.slice(1)) {
      const cat = readCategory(slug);
      const group = CATEGORY_TO_GROUP[cat] ?? "Strategy";
      needsNew.push({ slug, group });
    }
  }
  console.log(`Posts needing unique photos: ${needsNew.length}`);

  // Group them by topic group
  const byGroup = {};
  for (const item of needsNew) {
    if (!byGroup[item.group]) byGroup[item.group] = [];
    byGroup[item.group].push(item.slug);
  }

  // Fetch extra pages per group until we have enough unique photos
  const freshPool = {}; // group -> [url, ...]

  let apiCalls = 0;
  for (const [group, slugs] of Object.entries(byGroup)) {
    console.log(`\nGroup "${group}": need ${slugs.length} extra photos`);
    const queries = GROUP_QUERIES[group] ?? GROUP_QUERIES["Strategy"];
    const pool = [];

    for (let page = 2; page <= 5 && pool.length < slugs.length + 10; page++) {
      for (const q of queries) {
        if (pool.length >= slugs.length + 10) break;
        const results = await searchUnsplash(q, page);
        apiCalls++;
        const fresh = results.filter(u => !allUsedUrls.has(u));
        pool.push(...fresh);
        fresh.forEach(u => allUsedUrls.add(u));
        await sleep(250);
      }
    }

    console.log(`  → fetched ${pool.length} fresh photos (used ${apiCalls} API calls so far)`);
    freshPool[group] = pool;
  }

  // Assign fresh photos to duplicate slugs
  let patched = 0;
  const groupIdx = {};
  for (const { slug, group } of needsNew) {
    const pool = freshPool[group] ?? [];
    const idx = groupIdx[group] ?? 0;
    if (idx < pool.length) {
      cache[slug] = pool[idx];
      groupIdx[group] = idx + 1;
      patched++;
    } else {
      console.warn(`  ⚠ No fresh photo for ${slug} (group: ${group})`);
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`\nDone — patched ${patched} posts, used ${apiCalls} API calls.`);

  // Verify uniqueness
  const finalUrls = Object.values(cache);
  const finalUnique = new Set(finalUrls).size;
  console.log(`Unique images: ${finalUnique}/${finalUrls.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
