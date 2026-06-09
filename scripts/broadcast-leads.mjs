#!/usr/bin/env node
/**
 * Create per-niche Resend Audiences → add ALL leads → send Broadcast
 *
 * Usage:
 *   node scripts/broadcast-leads.mjs            # add contacts + send to 'new'
 *   node scripts/broadcast-leads.mjs --dry-run  # preview only
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "Nataliia at DataLatte <hi@datalatte.pro>";

const DRY_RUN = process.argv.includes("--dry-run");

const NICHE_CONFIG = {
  coffee: {
    audienceName: "DataLatte — Coffee Shops Denver",
    utm: "utm_source=broadcast&utm_medium=email&utm_campaign=denver-coffee-2026-05",
    scene: "Denver's independent coffee scene",
    service: "small coffee shops",
    result: "doubled their new customer count in 90 days",
    subject: "quick question about your coffee shop",
  },
  salon: {
    audienceName: "DataLatte — Hair Salons Denver",
    utm: "utm_source=broadcast&utm_medium=email&utm_campaign=denver-salon-2026-05",
    scene: "Denver's independent salon scene",
    service: "hair salons and barbershops",
    result: "grew their booking calendar by 40% in 60 days",
    subject: "quick question about your salon",
  },
  pet: {
    audienceName: "DataLatte — Pet Groomers Denver",
    utm: "utm_source=broadcast&utm_medium=email&utm_campaign=denver-pet-2026-05",
    scene: "Denver's independent pet care scene",
    service: "pet groomers and dog daycares",
    result: "filled their schedule with repeat clients in 60 days",
    subject: "quick question about your grooming business",
  },
  fitness: {
    audienceName: "DataLatte — Fitness Studios Denver",
    utm: "utm_source=broadcast&utm_medium=email&utm_campaign=denver-fitness-2026-05",
    scene: "Denver's independent fitness scene",
    service: "gyms, yoga and pilates studios",
    result: "grew their membership by 30% in 90 days",
    subject: "quick question about your studio",
  },
};

function buildHtml(cfg) {
  return `
<div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#333;font-size:15px;line-height:1.6">
  <p>Hi,</p>

  <p>Found <strong>{{ contact.first_name }}</strong> while researching ${cfg.scene} — love what you're doing.</p>

  <p>Quick question: are you happy with how many new customers find you online each month, or is that something you'd like to grow?</p>

  <p>I help ${cfg.service} in the US get more foot traffic through Google and social ads — without the big agency price tag. A few of my clients ${cfg.result}.</p>

  <p>If it's relevant, happy to share what's working. If not, no worries at all.</p>

  <p style="margin-top:32px">
    — Nataliia, DataLatte<br>
    <a href="https://datalatte.pro/free-audit?${cfg.utm}" style="color:#7c4a2d">Free local marketing audit →</a>
  </p>

  <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#aaa">
    You're receiving this because {{ contact.first_name }} is listed on Google Maps in Denver.
    <a href="{{{ unsubscribe_url }}}" style="color:#aaa">Unsubscribe</a>
  </p>
</div>`.trim();
}

async function resend(path, method = "GET", body = null) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend ${method} ${path}: ${JSON.stringify(data)}`);
  return data;
}

// Free plan = 3 audiences max. Map niches to existing audience IDs.
// coffee → c04189c3-23e7-4585-a85d-2f73bdb43b1b (created)
// salon  → 3619e191-4475-4829-aa87-75a3875f5f77 (created)
// fitness + pet → original audience (reused)
const AUDIENCE_MAP = {
  coffee:  "c04189c3-23e7-4585-a85d-2f73bdb43b1b",
  salon:   "3619e191-4475-4829-aa87-75a3875f5f77",
  fitness: "0cdfd587-fb63-4330-917e-df4e88bf96e8",
  pet:     "0cdfd587-fb63-4330-917e-df4e88bf96e8",
};

async function getAudienceId(niche) {
  const id = AUDIENCE_MAP[niche];
  console.log(`  Audience: ${id}`);
  return id;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("Missing SUPABASE env vars"); process.exit(1); }
  if (!RESEND_API_KEY) { console.error("Missing RESEND_API_KEY"); process.exit(1); }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch ONLY new leads (not yet emailed)
  const { data: allLeads, error } = await supabase
    .from("leads")
    .select("id, business_name, email, niche, status")
    .eq("status", "new")
    .not("email", "is", null);

  if (error) { console.error("Supabase error:", error.message); process.exit(1); }

  const byNiche = {};
  for (const lead of allLeads) {
    if (!byNiche[lead.niche]) byNiche[lead.niche] = [];
    byNiche[lead.niche].push(lead);
  }

  console.log("\n📊 Leads by niche:");
  for (const [niche, leads] of Object.entries(byNiche)) {
    const newCount = leads.filter(l => l.status === "new").length;
    console.log(`  ${niche}: ${leads.length} total, ${newCount} new`);
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would create audiences + broadcasts for each niche above.");
    return;
  }

  // Load existing broadcasts once to check for duplicates
  const existingBroadcasts = await resend("/broadcasts");
  const sentToday = new Set(
    (existingBroadcasts.data || [])
      .filter(b => b.sent_at && b.sent_at.startsWith(new Date().toISOString().slice(0, 10)))
      .map(b => b.name)
  );
  if (sentToday.size > 0) {
    console.log(`\n⚠️  Already sent today: ${[...sentToday].join(", ")}`);
  }

  for (const [niche, leads] of Object.entries(byNiche)) {
    const cfg = NICHE_CONFIG[niche];
    if (!cfg) { console.log(`\nSkipping unknown niche: ${niche}`); continue; }

    const newLeads = leads.filter(l => l.status === "new");
    console.log(`\n=== ${niche.toUpperCase()} (${leads.length} total, ${newLeads.length} new) ===`);

    // 1. Get audience
    console.log("Getting audience...");
    const audienceId = await getAudienceId(niche);

    // 2. Add ALL leads as contacts (idempotent — duplicates are ignored)
    console.log(`Adding ${leads.length} contacts...`);
    let added = 0, failed = 0;
    for (const lead of leads) {
      try {
        await resend(`/audiences/${audienceId}/contacts`, "POST", {
          email: lead.email,
          first_name: lead.business_name,
          unsubscribed: false,
        });
        added++;
      } catch (e) {
        // Already exists is fine
        if (!e.message.includes("already exists")) {
          console.error(`  ❌ ${lead.email}: ${e.message}`);
          failed++;
        } else {
          added++;
        }
      }
    }
    console.log(`  ✅ ${added} contacts ready, ${failed} failed`);

    // 3. Create broadcast — skip if already sent today for this niche
    const broadcastName = `Denver ${niche} — ${new Date().toISOString().slice(0, 10)}`;
    if (sentToday.has(broadcastName)) {
      console.log(`  ⏭️  Broadcast "${broadcastName}" already sent today — skipping to prevent duplicate.`);
      continue;
    }
    console.log(`Creating broadcast "${broadcastName}"...`);
    const broadcast = await resend("/broadcasts", "POST", {
      audience_id: audienceId,
      from: FROM,
      name: broadcastName,
      subject: cfg.subject,
      html: buildHtml(cfg),
    });
    console.log(`  ✅ Broadcast created: ${broadcast.id}`);

    // 4. Send to ALL contacts in audience
    console.log("Sending broadcast to ALL contacts...");
    await resend(`/broadcasts/${broadcast.id}/send`, "POST");
    console.log(`  ✅ Broadcast sent!`);

    // 5. Mark all leads as emailed
    const allIds = leads.map(l => l.id);
    await supabase
      .from("leads")
      .update({ status: "emailed", emailed_at: new Date().toISOString() })
      .in("id", allIds);
    console.log(`  ✅ Marked ${allIds.length} leads as emailed in Supabase`);
  }

  console.log("\n✅ All done! Check Resend dashboard for open/click stats.");
}

main().catch(err => { console.error(err); process.exit(1); });
