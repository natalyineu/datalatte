#!/usr/bin/env node
/**
 * Fetch Apify dataset → filter → save to Supabase leads table
 *
 * Usage:
 *   node scripts/collect-leads.mjs <datasetId> <niche>
 *   node scripts/collect-leads.mjs b69qeB8qlhzQ9ziec coffee
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CHAIN_BLACKLIST = new Set([
  "starbucks", "dunkin", "dunkin'", "caribou coffee", "mcdonald's",
  "mcdonalds", "peet's coffee", "peets coffee", "tim hortons",
  "panera bread", "panera", "costa coffee", "lavazza", "subway",
  "domino's", "burger king", "kfc", "chipotle", "sweetgreen",
]);

function isChain(name) {
  return CHAIN_BLACKLIST.has(name?.toLowerCase().trim());
}

async function fetchDataset(datasetId) {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?format=json&limit=1000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apify fetch failed: ${res.status}`);
  return res.json();
}

function extractFirstEmail(emails) {
  if (!Array.isArray(emails) || emails.length === 0) return null;
  // prefer non-gmail/yahoo business emails
  const business = emails.find(
    (e) => !/@(gmail|yahoo|hotmail|outlook)\./i.test(e)
  );
  return business || emails[0];
}

function mapToLead(item, niche, datasetId) {
  const email = extractFirstEmail(item.emails);
  return {
    business_name: item.title,
    niche,
    city: item.city,
    state: item.state,
    country_code: item.countryCode?.toLowerCase() || "us",
    address: item.address,
    website: item.website || null,
    phone: item.phone || null,
    google_maps_url: item.url || null,
    rating: item.totalScore || null,
    reviews_count: item.reviewsCount || null,
    email,
    instagram: item.instagrams?.[0] || null,
    facebook: item.facebooks?.[0] || null,
    source: "google_maps",
    apify_dataset_id: datasetId,
    status: "new",
  };
}

async function main() {
  const [, , datasetId, niche = "coffee"] = process.argv;

  if (!datasetId) {
    console.error("Usage: node scripts/collect-leads.mjs <datasetId> <niche>");
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing SUPABASE env vars");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(`\nFetching dataset ${datasetId}...`);
  const items = await fetchDataset(datasetId);
  console.log(`Total items: ${items.length}`);

  // filter
  const filtered = items.filter((item) => {
    if (isChain(item.title)) return false;
    if (!item.website && !item.emails?.length) return false;
    return true;
  });
  console.log(`After filtering chains/no-contact: ${filtered.length}`);

  const withEmail = filtered.filter((i) => i.emails?.length > 0);
  console.log(`With email: ${withEmail.length}`);

  const leads = filtered.map((item) => mapToLead(item, niche, datasetId));

  // upsert — skip duplicates by email or business+city
  let saved = 0;
  let skipped = 0;

  for (const lead of leads) {
    const { error } = await supabase
      .from("leads")
      .upsert(lead, {
        onConflict: lead.email ? "email" : "business_name,city",
        ignoreDuplicates: true,
      });

    if (error) {
      // duplicate key = expected, skip silently
      if (error.code === "23505") {
        skipped++;
      } else {
        console.error(`Error saving ${lead.business_name}:`, error.message);
      }
    } else {
      saved++;
    }
  }

  console.log(`\n✅ Saved: ${saved} | Skipped (duplicates): ${skipped}`);
  console.log(`📧 Leads with email: ${withEmail.length}`);

  // summary table
  const emailLeads = leads.filter((l) => l.email);
  if (emailLeads.length > 0) {
    console.log("\n--- Email leads ---");
    emailLeads.forEach((l) => {
      console.log(`  ${l.business_name} | ${l.email} | ${l.website || ""}`);
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
