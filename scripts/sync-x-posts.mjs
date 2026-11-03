#!/usr/bin/env node
/**
 * Sync X (twitter) posts → Supabase social_posts.
 * Scrapes @datalattepro via Apify, matches tweets to draft/scheduled rows
 * (platform='twitter') by destination_url, marks them published.
 *
 * Env: APIFY_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Usage: node scripts/sync-x-posts.mjs [--dry]
 */
import { createClient } from "@supabase/supabase-js";

const HANDLE = "datalattepro";
const ACTOR = "apidojo~tweet-scraper";
const dry = process.argv.includes("--dry");

const { APIFY_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!APIFY_TOKEN || !NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing APIFY_TOKEN / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const res = await fetch(
  `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ twitterHandles: [HANDLE], maxItems: 30, sort: "Latest" }),
  }
);
if (!res.ok) throw new Error(`Apify failed: ${res.status} ${await res.text()}`);
const tweets = await res.json();
console.log(`Fetched ${tweets.length} tweets`);

const { data: rows, error } = await supabase
  .from("social_posts")
  .select("id, destination_url, content")
  .eq("platform", "twitter")
  .in("status", ["draft", "scheduled"]);
if (error) throw error;

const slugOf = (u) => (u || "").split("?")[0].replace(/\/$/, "").split("/").pop();

for (const row of rows) {
  const slug = slugOf(row.destination_url);
  const t = tweets.find((x) => {
    const text = [x.fullText, x.text, ...(x.entities?.urls || []).map((u) => u.expanded_url)].join(" ");
    return slug && text.includes(slug);
  });
  if (!t) { console.log(`No match: ${row.destination_url}`); continue; }
  const id = String(t.id ?? t.id_str);
  const patch = {
    status: "published",
    post_url: t.url || `https://x.com/${HANDLE}/status/${id}`,
    post_id_external: id,
    published_at: new Date(t.createdAt).toISOString(),
  };
  console.log(row.id, patch);
  if (!dry) {
    const { error: e } = await supabase.from("social_posts").update(patch).eq("id", row.id);
    if (e) throw e;
  }
}
