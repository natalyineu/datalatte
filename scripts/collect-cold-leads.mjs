#!/usr/bin/env node
/**
 * Collect cold-outreach leads: Google Maps (Apify, with contact emails) -> Supabase `leads` (status "new").
 * Sends NOTHING. Dedupes against every email already in `leads` (emailed, bounced, replied...).
 * Config: data/cold-queue.json. Env: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const q = JSON.parse(fs.readFileSync(path.join(root, "data/cold-queue.json"), "utf8"));
const { APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: KEY } = process.env;
if (!APIFY_TOKEN || !SUPABASE_URL || !KEY) { console.error("Missing APIFY_TOKEN / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const sb = (p, opt = {}) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { ...opt, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(opt.headers || {}) } });

const CHAINS = /starbucks|dunkin|peet'?s|caribou|tim hortons|panera|subway|mcdonald|great clips|supercuts|sport clips|fantastic sams|regis|petco|petsmart|planet fitness|anytime fitness|orangetheory|f45|la fitness|equinox|crunch|snap fitness|ulta|massage envy|european wax|drybar|blue bottle|philz|la colombe|dutch bros|scooter'?s|tully|biggby|7 brew|jazzercise|lifetime|ymca|gold'?s gym|barry'?s|solidcore|pure barre|club pilates|yogasix|cyclebar|burn boot|title boxing|massage heights/i;
const JUNK = /(sentry|wixpress|example|domain|yourname|email@|user@|@2x|\.png|\.jpg|\.gif|\.webp|noreply|no-reply|donotreply|godaddy|squarespace|wix\.com|shopify)/i;
const FREE = /@(gmail|yahoo|hotmail|outlook|aol|icloud|me|live|msn)\./i;

const pickEmail = (emails) => {
  const ok = (emails || []).map((e) => String(e).trim().toLowerCase()).filter((e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e) && !JUNK.test(e));
  return ok.find((e) => !FREE.test(e)) || ok[0] || null;
};

async function existingEmails() {
  const set = new Set();
  for (let from = 0; ; from += 1000) {
    const r = await sb(`leads?select=email&email=not.is.null`, { headers: { Range: `${from}-${from + 999}` } });
    if (!r.ok) throw new Error(`leads read ${r.status}`);
    const rows = await r.json();
    rows.forEach((x) => set.add(String(x.email).toLowerCase()));
    if (rows.length < 1000) break;
  }
  return set;
}

async function scrape(term, city) {
  const run = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${APIFY_TOKEN}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchStringsArray: [`${term} in ${city.city}, ${city.stateCode}`], maxCrawledPlacesPerSearch: q.maxPlacesPerSearch, language: "en", countryCode: "us", scrapeContacts: true, maxReviews: 0 }),
  });
  if (!run.ok) throw new Error(`Apify start ${run.status}`);
  const { data } = await run.json();
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const s = await (await fetch(`https://api.apify.com/v2/actor-runs/${data.id}?token=${APIFY_TOKEN}`)).json();
    if (["SUCCEEDED"].includes(s.data.status)) {
      const items = await (await fetch(`https://api.apify.com/v2/datasets/${s.data.defaultDatasetId}/items?token=${APIFY_TOKEN}&format=json`)).json();
      return items;
    }
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(s.data.status)) throw new Error(`Apify run ${s.data.status}`);
  }
  throw new Error("Apify run timeout");
}

const seen = await existingEmails();
console.log(`Existing lead emails: ${seen.size}`);
let added = 0, places = 0;
const byNiche = {};

outer: for (const city of q.cities) {
  for (const [niche, term] of Object.entries(q.niches)) {
    if (added >= q.target || places >= q.maxPlacesTotal) break outer;
    try {
      console.log(`→ ${term} in ${city.city}`);
      const items = await scrape(term, city);
      places += items.length;
      const rows = [];
      for (const it of items) {
        if (!it.title || CHAINS.test(it.title) || it.permanentlyClosed || it.temporarilyClosed) continue;
        const email = pickEmail(it.emails);
        if (!email || seen.has(email)) continue;
        seen.add(email);
        rows.push({ business_name: it.title, niche, city: it.city || city.city, state: it.state || city.stateCode, country_code: "us", address: it.address || null, website: it.website || null, phone: it.phone || null, google_maps_url: it.url || null, rating: it.totalScore || null, reviews_count: it.reviewsCount || null, email, instagram: it.instagrams?.[0] || null, facebook: it.facebooks?.[0] || null, source: "google_maps", status: "new" });
      }
      if (rows.length) {
        const r = await sb("leads?on_conflict=email", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(rows.slice(0, q.target - added)) });
        if (!r.ok) { console.error(`  save failed ${r.status}: ${(await r.text()).slice(0, 200)}`); continue; }
        const n = Math.min(rows.length, q.target - added);
        added += n; byNiche[niche] = (byNiche[niche] || 0) + n;
      }
      console.log(`  ${items.length} places, ${rows.length} new emails (total ${added}/${q.target})`);
    } catch (e) { console.error(`  failed: ${e.message}`); }
  }
}
console.log(`\nDone: ${added} new leads saved, ${places} places scraped`, byNiche);
