#!/usr/bin/env node
/**
 * Send cold emails to leads from Supabase → mark as emailed
 *
 * Usage:
 *   node scripts/send-cold-emails.mjs [--limit 10] [--dry-run]
 *
 * --dry-run  Print emails without sending
 * --limit N  Max emails to send per run (default 20, safety cap)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "Nataliia at DataLatte <hi@datalatte.pro>";

const NICHE_CONFIG = {
  coffee: {
    utm: "utm_source=cold-email&utm_medium=email&utm_campaign=denver-coffee-2026-05&utm_content=audit-link",
    scene: "Denver's independent coffee scene",
    service: "small coffee shops",
    result: "doubled their new customer count in 90 days",
    cta: "free local marketing audit",
  },
  salon: {
    utm: "utm_source=cold-email&utm_medium=email&utm_campaign=denver-salon-2026-05&utm_content=audit-link",
    scene: "Denver's independent salon scene",
    service: "hair salons and barbershops",
    result: "grew their booking calendar by 40% in 60 days",
    cta: "free local marketing audit",
  },
  pet: {
    utm: "utm_source=cold-email&utm_medium=email&utm_campaign=denver-pet-2026-05&utm_content=audit-link",
    scene: "Denver's independent pet care scene",
    service: "pet groomers and dog daycares",
    result: "filled their schedule with repeat clients in 60 days",
    cta: "free local marketing audit",
  },
  fitness: {
    utm: "utm_source=cold-email&utm_medium=email&utm_campaign=denver-fitness-2026-05&utm_content=audit-link",
    scene: "Denver's independent fitness scene",
    service: "gyms and yoga studios",
    result: "grew their membership by 30% in 90 days",
    cta: "free local marketing audit",
  },
};

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = parseInt(args[args.indexOf("--limit") + 1] || "20", 10);

// Safety: never send more than 50 at once
const HARD_CAP = 50;
const batchLimit = Math.min(LIMIT, HARD_CAP);

function buildSubject(businessName) {
  return `quick question about ${businessName} — from datalatte.pro`;
}

function buildHtml(businessName, niche) {
  const cfg = NICHE_CONFIG[niche] || NICHE_CONFIG.coffee;
  return `
<div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#333;font-size:15px;line-height:1.6">
  <p>Hi,</p>

  <p>Found <strong>${businessName}</strong> while researching ${cfg.scene} — love what you're doing.</p>

  <p>Quick question: are you happy with how many new customers find you online each month, or is that something you'd like to grow?</p>

  <p>I help ${cfg.service} in the US get more foot traffic through Google and social ads — without the big agency price tag. A few of my clients ${cfg.result}.</p>

  <p>If it's relevant, happy to share what's working. If not, no worries at all.</p>

  <p style="margin-top:32px">
    — Nataliia, DataLatte<br>
    <a href="https://datalatte.pro/contact?${cfg.utm}" style="color:#7c4a2d">Free local marketing audit →</a>
  </p>

  <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#aaa">
    You're receiving this because ${businessName} is listed on Google Maps in Denver.
    To opt out, reply with "unsubscribe" and I'll remove you immediately.
  </p>
</div>
  `.trim();
}

function buildText(businessName, niche) {
  const cfg = NICHE_CONFIG[niche] || NICHE_CONFIG.coffee;
  return `Hi,

Found ${businessName} while researching ${cfg.scene} — love what you're doing.

Quick question: are you happy with how many new customers find you online each month, or is that something you'd like to grow?

I help ${cfg.service} in the US get more foot traffic through Google and social ads — without the big agency price tag. A few of my clients ${cfg.result}.

If it's relevant, happy to share what's working. If not, no worries at all.

— Nataliia, DataLatte
https://datalatte.pro/contact?${cfg.utm}

---
To opt out, reply with "unsubscribe".
`;
}

async function sendEmail(to, subject, html, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
  return res.json();
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("Missing SUPABASE env vars"); process.exit(1); }
  if (!RESEND_API_KEY) { console.error("Missing RESEND_API_KEY"); process.exit(1); }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, business_name, email, niche")
    .eq("status", "new")
    .not("email", "is", null)
    .limit(batchLimit);

  if (error) { console.error("Supabase error:", error.message); process.exit(1); }
  if (!leads.length) { console.log("No leads to email."); return; }

  console.log(`\n${DRY_RUN ? "DRY RUN — " : ""}Sending to ${leads.length} leads (cap: ${batchLimit})\n`);

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const subject = buildSubject(lead.business_name);
    const html = buildHtml(lead.business_name, lead.niche);
    const text = buildText(lead.business_name, lead.niche);

    if (DRY_RUN) {
      console.log(`  [DRY] → ${lead.email} | [${lead.niche}] | ${subject}`);
      continue;
    }

    try {
      await sendEmail(lead.email, subject, html, text);

      await supabase
        .from("leads")
        .update({ status: "emailed", emailed_at: new Date().toISOString() })
        .eq("id", lead.id);

      console.log(`  ✅ [${lead.niche}] ${lead.business_name} → ${lead.email}`);
      sent++;

      // 1 sec delay between sends — avoid rate limits
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ❌ ${lead.business_name}: ${err.message}`);
      failed++;
    }
  }

  if (!DRY_RUN) {
    console.log(`\nDone: ${sent} sent, ${failed} failed`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
