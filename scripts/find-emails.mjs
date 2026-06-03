#!/usr/bin/env node
/**
 * Scrape contact emails from websites of leads that have no email in Supabase.
 *
 * Usage:
 *   node scripts/find-emails.mjs [niche]   # default: coffee
 *   node scripts/find-emails.mjs --dry-run # print found emails, don't save
 *
 * Strategy: fetch homepage + /contact page, grep for email addresses.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const DRY_RUN = process.argv.includes("--dry-run");
const NICHE = process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]) || "coffee";

const EMAIL_RE = /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g;
const IGNORE_DOMAINS = new Set(["sentry.io", "wix.com", "squarespace.com", "wordpress.com", "shopify.com", "example.com", "schema.org", "google.com", "facebook.com", "instagram.com", "twitter.com", "yelp.com", "tripadvisor.com"]);
const IGNORE_PREFIXES = ["noreply", "no-reply", "donotreply", "info@wix", "support@", "privacy@", "legal@", "admin@mailchimp", "postmaster", "abuse@"];

function isValidEmail(email) {
  const lower = email.toLowerCase();
  if (IGNORE_PREFIXES.some((p) => lower.startsWith(p))) return false;
  const domain = lower.split("@")[1];
  if (!domain) return false;
  if (IGNORE_DOMAINS.has(domain)) return false;
  if (domain.includes("sentry") || domain.includes("wix") || domain.includes("square")) return false;
  return true;
}

async function fetchText(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DataLatte-emailbot/1.0)" },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function extractEmails(html) {
  if (!html) return [];
  const decoded = html.replace(/&#64;/g, "@").replace(/%40/g, "@").replace(/\[at\]/gi, "@");
  const found = [...new Set(decoded.match(EMAIL_RE) || [])];
  return found.filter(isValidEmail);
}

function preferBusinessEmail(emails, websiteDomain) {
  if (!emails.length) return null;
  // prefer email matching the website domain
  const domainMatch = emails.find((e) => e.toLowerCase().endsWith(`@${websiteDomain}`));
  if (domainMatch) return domainMatch;
  // prefer non-generic providers
  const business = emails.find((e) => !/@(gmail|yahoo|hotmail|outlook|icloud)\./i.test(e));
  if (business) return business;
  return emails[0];
}

function getDomain(websiteUrl) {
  try {
    return new URL(websiteUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function findEmailForLead(lead) {
  if (!lead.website) return null;

  // Skip Instagram/Facebook links — no email there
  if (/instagram\.com|facebook\.com|twitter\.com|yelp\.com/.test(lead.website)) return null;

  const domain = getDomain(lead.website);
  if (!domain) return null;

  const base = lead.website.replace(/\/$/, "");
  const pagesToTry = [base, `${base}/contact`, `${base}/contact-us`, `${base}/about`];

  for (const url of pagesToTry) {
    const html = await fetchText(url);
    const emails = extractEmails(html);
    if (emails.length) {
      return preferBusinessEmail(emails, domain);
    }
  }
  return null;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("Missing SUPABASE env vars"); process.exit(1); }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, business_name, website, niche, city")
    .eq("niche", NICHE)
    .is("email", null)
    .not("website", "is", null)
    .order("reviews_count", { ascending: false });

  if (error) { console.error("Supabase error:", error.message); process.exit(1); }

  console.log(`\n🔍 Searching emails for ${leads.length} ${NICHE} leads without email...\n`);

  let found = 0, updated = 0, notFound = 0;

  for (const lead of leads) {
    process.stdout.write(`  ${lead.business_name.padEnd(45)} `);
    const email = await findEmailForLead(lead);

    if (email) {
      found++;
      process.stdout.write(`✅ ${email}\n`);
      if (!DRY_RUN) {
        const { error: updateErr } = await supabase
          .from("leads")
          .update({ email })
          .eq("id", lead.id);
        if (!updateErr) updated++;
        else console.error(`    ❌ Save failed: ${updateErr.message}`);
      }
    } else {
      notFound++;
      process.stdout.write(`— not found\n`);
    }
  }

  console.log(`\n✅ Found: ${found} | Saved: ${updated} | Not found: ${notFound}`);
  if (DRY_RUN) console.log("(dry-run — nothing saved)");
}

main().catch((err) => { console.error(err); process.exit(1); });
