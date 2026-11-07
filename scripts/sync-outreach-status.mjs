#!/usr/bin/env node
/**
 * Syncs delivery status of cold outreach e-mails (Supabase outreach_emails) from Resend.
 * For every row with resend_id and a non-final status, GET /emails/{id} and store last_event.
 * Env: RESEND_API_KEY, SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY.
 */
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND = process.env.RESEND_API_KEY;
if (!SB || !KEY || !RESEND) { console.error("Missing env"); process.exit(1); }
const sbH = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const FINAL = ["clicked", "bounced", "complained", "failed"];
const KNOWN = ["sent", "delivered", "delivery_delayed", "bounced", "complained", "opened", "clicked", "failed"];

const q = `${SB}/rest/v1/outreach_emails?select=id,resend_id,status&resend_id=not.is.null&status=not.in.(${FINAL.join(",")})&sent_at=gte.${new Date(Date.now() - 60 * 864e5).toISOString()}`;
const rows = await (await fetch(q, { headers: sbH })).json();
if (!Array.isArray(rows)) { console.log("outreach_emails not readable yet:", JSON.stringify(rows).slice(0, 200)); process.exit(0); }
let changed = 0;
for (const r of rows) {
  const res = await fetch(`https://api.resend.com/emails/${r.resend_id}`, { headers: { Authorization: `Bearer ${RESEND}` } });
  if (!res.ok) { console.log(`skip ${r.resend_id}: ${res.status}`); continue; }
  const e = await res.json();
  const status = KNOWN.includes(e.last_event) ? e.last_event : "unknown";
  if (status !== r.status) {
    await fetch(`${SB}/rest/v1/outreach_emails?id=eq.${r.id}`, { method: "PATCH", headers: sbH, body: JSON.stringify({ status, last_event_at: new Date().toISOString() }) });
    changed++;
  }
  await new Promise((s) => setTimeout(s, 600)); // Resend rate limit: 2 req/s
}
console.log(`${rows.length} checked, ${changed} updated`);
