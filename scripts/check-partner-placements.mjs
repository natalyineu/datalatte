#!/usr/bin/env node
/**
 * Checks that every partner placement (Supabase partner_deals) is still live on the site.
 * For each URL in article_url (separated by ";"): HTTP 200, final URL, no noindex,
 * every string from placement_check ("a|b") present in the HTML, link rel of matching <a>.
 *
 * Usage:
 *   node scripts/check-partner-placements.mjs                 # reads deals from Supabase (env)
 *   node scripts/check-partner-placements.mjs deals.json      # deals exported as JSON array
 *   add --write to store last_checked_at / last_check_result in Supabase (env needed)
 * Env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY. Exit 1 if any placement fails.
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const write = args.includes("--write");
const file = args.find((a) => !a.startsWith("--"));
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sbHeaders = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function loadDeals() {
  if (file) return JSON.parse(readFileSync(file, "utf8"));
  if (!SB || !KEY) throw new Error("No deals file and no Supabase env");
  const r = await fetch(`${SB}/rest/v1/partner_deals?select=id,company,article_url,live_url,placement_check,deal_status&deal_status=not.in.(lost,cancelled)`, { headers: sbHeaders });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

const norm = (u) => u.trim().replace("://www.", "://").replace(/\/$/, "");

async function checkUrl(url, needles) {
  const problems = [];
  let res;
  try {
    res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "DataLatte placement check" } });
  } catch (e) {
    return [`fetch failed: ${e.message}`];
  }
  if (res.status !== 200) problems.push(`HTTP ${res.status}`);
  if (norm(res.url) !== norm(url)) problems.push(`redirects to ${res.url}`);
  const html = await res.text();
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) problems.push("noindex");
  for (const n of needles) {
    if (!html.toLowerCase().includes(n.toLowerCase())) { problems.push(`missing "${n}"`); continue; }
    const a = html.match(new RegExp(`<a[^>]+href=["'][^"']*${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"']*["'][^>]*>`, "i"));
    if (a) {
      const rel = (a[0].match(/rel=["']([^"']+)["']/i) || [])[1] || "none";
      problems.push(`info: link rel=${rel}`);
    }
  }
  return problems;
}

const deals = await loadDeals();
let failed = 0;
for (const d of deals) {
  if (!d.placement_check) { console.log(`? ${d.company}: placement_check empty, skipped`); continue; }
  const needles = d.placement_check.split("|").map((s) => s.trim()).filter(Boolean);
  const urls = (d.article_url || d.live_url || "").split(";").map((u) => u.trim()).filter(Boolean);
  const lines = [];
  let ok = true;
  for (const u of urls) {
    const p = await checkUrl(u, needles);
    const errs = p.filter((x) => !x.startsWith("info:"));
    if (errs.length) ok = false;
    lines.push(`${errs.length ? "FAIL" : "ok"} ${u}${p.length ? " — " + p.join("; ") : ""}`);
  }
  if (!ok) failed++;
  console.log(`${ok ? "✅" : "❌"} ${d.company}\n  ${lines.join("\n  ")}`);
  if (write && SB && KEY && d.id) {
    await fetch(`${SB}/rest/v1/partner_deals?id=eq.${d.id}`, {
      method: "PATCH", headers: sbHeaders,
      body: JSON.stringify({ last_checked_at: new Date().toISOString(), last_check_result: (ok ? "ok: " : "FAIL: ") + lines.join(" | ").slice(0, 1000) }),
    });
  }
}
console.log(`\n${deals.length} deals, ${failed} failed`);
process.exit(failed ? 1 : 0);
