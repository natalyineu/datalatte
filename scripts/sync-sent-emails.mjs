#!/usr/bin/env node
/**
 * Copies every e-mail we sent through Resend into Supabase `sent_emails` (full text, no signature),
 * so the CRM can show complete conversations. Idempotent (resend_id unique). Also refreshes status.
 * Env: RESEND_API_KEY, SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY.
 */
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND = process.env.RESEND_API_KEY;
if (!SB || !KEY || !RESEND) { console.error("Missing env"); process.exit(1); }
const sbH = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const rH = { Authorization: `Bearer ${RESEND}` };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Our own notifications to the inbox are not conversations.
const SKIP_TO = /^(hi@datalatte\.pro)$/i;

function cleanText(t = "") {
  t = t.replace(/\r\n?/g, "\n");
  const sig = t.search(/\n\s*(Nataliia Rumiantsew?v?a|Nataliia\s*\n\s*(Founder|DataLatte))/);
  if (sig > 0) t = t.slice(0, sig);
  return t.replace(/\n(Best|Pozdrawiam|Thanks|Cheers|Kind regards),?\s*$/i, "").replace(/\n{3,}/g, "\n\n").trim();
}

const existing = await (await fetch(`${SB}/rest/v1/sent_emails?select=resend_id&limit=10000`, { headers: sbH })).json();
if (!Array.isArray(existing)) { console.log("sent_emails not readable yet:", JSON.stringify(existing).slice(0, 200)); process.exit(0); }
const have = new Set(existing.map((r) => r.resend_id));

let after = null, added = 0, pages = 0;
while (pages < 20) {
  const res = await fetch(`https://api.resend.com/emails?limit=100${after ? `&after=${after}` : ""}`, { headers: rH });
  if (!res.ok) { console.log("list failed", res.status, (await res.text()).slice(0, 200)); break; }
  const page = await res.json();
  const list = page.data || [];
  pages++;
  for (const e of list) {
    if (have.has(e.id)) continue;
    const to = Array.isArray(e.to) ? e.to : [e.to];
    if (to.every((x) => SKIP_TO.test(x))) continue;
    await wait(550);
    const full = await (await fetch(`https://api.resend.com/emails/${e.id}`, { headers: rH })).json();
    const row = {
      resend_id: e.id, sent_at: e.created_at, from_email: full.from || null, to_emails: to.map((x) => x.toLowerCase()),
      subject: full.subject || e.subject || null, body: cleanText(full.text || ""), status: full.last_event || e.last_event || null,
    };
    const ins = await fetch(`${SB}/rest/v1/sent_emails`, { method: "POST", headers: { ...sbH, Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify(row) });
    if (ins.ok) added++; else console.log("insert failed", ins.status, (await ins.text()).slice(0, 200));
  }
  if (!page.has_more || list.length === 0) break;
  after = list[list.length - 1].id;
  await wait(550);
}
console.log(`sent_emails: ${added} added`);
