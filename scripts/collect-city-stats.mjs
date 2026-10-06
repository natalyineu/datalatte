#!/usr/bin/env node
/**
 * Collect Google Maps stats per niche x city with Apify and write data/city-stats.json.
 * The site reads that file (src/lib/cityStats.ts): a city page becomes indexable only when it has real data.
 *
 *   APIFY_TOKEN=... node scripts/collect-city-stats.mjs            # all missing combos in data/city-queue.json
 *   APIFY_TOKEN=... node scripts/collect-city-stats.mjs --limit 4  # at most 4 combos this run
 *
 * Cost: ~maxPlaces places per search on Apify (see data/city-queue.json).
 */
import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) { console.error("APIFY_TOKEN is not set"); process.exit(1); }

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const queuePath = path.join(root, "data/city-queue.json");
const statsPath = path.join(root, "data/city-stats.json");
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? +process.argv[limitArg + 1] : (queue.limitPerRun || Infinity);
const MAX_PLACES = queue.maxPlaces || 50;

const NICHES = {
  "coffee-shops": "coffee shops",
  "hair-salons": "hair salons",
  "pet-groomers": "pet groomers",
  "fitness-studios": "fitness studios",
};
const ASOF = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

async function scrape(term, city) {
  const url = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${TOKEN}&timeout=280`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchStringsArray: [`${term} in ${city.city}, ${city.stateCode}`],
      maxCrawledPlacesPerSearch: MAX_PLACES,
      language: "en",
      countryCode: "us",
      scrapeContacts: false,
      scrapePlaceDetailPage: false,
      maxReviews: 0,
    }),
  });
  if (!res.ok) throw new Error(`Apify HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return await res.json();
}

let done = 0, failed = 0;
for (const city of queue.cities) {
  for (const [niche, term] of Object.entries(NICHES)) {
    const key = `${niche}:${city.slug}`;
    if (stats[key]) continue;
    if (done >= LIMIT) break;
    try {
      console.log(`→ ${key}`);
      const items = (await scrape(term, city)).filter((p) => typeof p.reviewsCount === "number" && typeof p.totalScore === "number");
      if (items.length < 15) { console.log(`  skipped: only ${items.length} usable places`); continue; }
      const reviews = items.map((p) => p.reviewsCount);
      stats[key] = {
        businesses: items.length,
        avgRating: +(items.reduce((s, p) => s + p.totalScore, 0) / items.length).toFixed(2),
        medianReviews: Math.round(median(reviews)),
        under50: reviews.filter((r) => r < 50).length,
        over200: reviews.filter((r) => r >= 200).length,
        asOf: ASOF,
      };
      fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2) + "\n"); // save after every combo
      console.log(`  ok: ${items.length} places, median ${stats[key].medianReviews} reviews, avg ${stats[key].avgRating}`);
      done++;
    } catch (e) {
      console.error(`  failed: ${e.message}`);
      failed++;
    }
  }
}
console.log(`Done: ${done} collected, ${failed} failed.`);
