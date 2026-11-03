#!/usr/bin/env node
/**
 * Collect cafes in Poznań (Google Maps via Apify) -> Supabase `pl_cafes` (all places, with or without e-mail),
 * so they can be contacted by hand (Instagram, phone, contact form). Sends NOTHING.
 * Env: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Config: data/pl-cafes-queue.json.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const q = JSON.parse(fs.readFileSync(path.join(root, "data/pl-cafes-queue.json"), "utf8"));
const { APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: KEY } = process.env;
if (!APIFY_TOKEN || !SUPABASE_URL || !KEY) { console.error("Missing APIFY_TOKEN / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const sb = (p, opt = {}) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { ...opt, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(opt.headers || {}) } });
const CHAINS = /costa coffee|green caff|coffeeheaven|tchibo|starbucks|mcdonald|kfc|burger king|pizza hut/i;
const NOT_CAFE = /galeria|muzeum|centrum kultury|skatepark|padel|księgarnia|hotel|kościół/i;
const JUNK = /(sentry|wixpress|example|domain|yourname|email@|user@|@2x|\.png|\.jpg|\.gif|\.webp|noreply|no-reply|donotreply|godaddy|squarespace|wix\.com|shopify)/i;
const emailsOf = (arr) => [...new Set((arr || []).map((e) => String(e).trim().toLowerCase()).filter((e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e) && !JUNK.test(e)))];
const first = (v) => (Array.isArray(v) ? v[0] : v) || null;

async function scrape(term) {
  const run = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${APIFY_TOKEN}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchStringsArray: [term], locationQuery: q.locationQuery, maxCrawledPlacesPerSearch: q.maxPlacesPerSearch,
      language: "pl", countryCode: "pl", scrapeContacts: true, maxReviews: 0,
    }),
  });
  if (!run.ok) throw new Error(`Apify start ${run.status}: ${(await run.text()).slice(0, 300)}`);
  const { data } = await run.json();
  for (let i = 0; i < 180; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const s = await (await fetch(`https://api.apify.com/v2/actor-runs/${data.id}?token=${APIFY_TOKEN}`)).json();
    if (s.data.status === "SUCCEEDED") return await (await fetch(`https://api.apify.com/v2/datasets/${s.data.defaultDatasetId}/items?token=${APIFY_TOKEN}&format=json`)).json();
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(s.data.status)) throw new Error(`Apify run ${s.data.status}`);
  }
  throw new Error("Apify run timeout");
}

let saved = 0, seenPlaces = 0;
for (const term of q.terms) {
  console.log(`→ ${term} (${q.locationQuery})`);
  let items;
  try { items = await scrape(term); } catch (e) { console.error(`  failed: ${e.message}`); continue; }
  seenPlaces += items.length;
  const rows = [];
  for (const it of items) {
    const city = it.city || "";
    if (!it.title || !it.placeId) continue;
    if (!/pozna/i.test(city) && !/pozna/i.test(it.address || "")) continue; // only Poznań
    if (CHAINS.test(it.title) || NOT_CAFE.test(it.title) || it.permanentlyClosed || it.temporarilyClosed) continue;
    const emails = emailsOf(it.emails);
    const site = it.website || null;
    rows.push({
      business_name: it.title, address: it.address || null, city: "Poznań", place_id: it.placeId,
      google_maps_url: it.url || null, website: site, website_is_social: !!site && /facebook\.com|instagram\.com/i.test(site),
      phone: it.phone || null, email: emails[0] || null, emails_all: emails,
      instagram: first(it.instagrams), facebook: first(it.facebooks),
      rating: it.totalScore ?? null, reviews_count: it.reviewsCount ?? null, source: "apify-google-maps",
    });
  }
  if (rows.length) {
    const r = await sb("pl_cafes?on_conflict=place_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(rows) });
    if (!r.ok) { console.error(`  save failed ${r.status}: ${(await r.text()).slice(0, 300)}`); continue; }
    saved += rows.length;
  }
  console.log(`  ${items.length} places, ${rows.length} in Poznań saved (total ${saved})`);
}
console.log(`\nDone: ${saved} Poznań cafes saved, ${seenPlaces} places scraped`);
