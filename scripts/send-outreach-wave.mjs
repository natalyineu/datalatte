#!/usr/bin/env node
/**
 * Sends one approved cold-outreach wave (data/outreach/<wave>.json) through Resend, one e-mail at a time,
 * and logs every send to Supabase outreach_emails (+ marks local_businesses as contacted).
 * Safe to re-run: recipients already logged for the campaign are skipped; Resend idempotency keys prevent duplicates.
 *
 *   node scripts/send-outreach-wave.mjs data/outreach/poznan-wave2-2026-11.json --dry   # render only, no env needed
 *   node scripts/send-outreach-wave.mjs data/outreach/poznan-wave2-2026-11.json         # send (needs env)
 * Env: RESEND_API_KEY, SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY. Optional FORCE=1 to ignore send_after.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const file = process.argv[2];
const dry = process.argv.includes("--dry");
if (!file) { console.error("usage: send-outreach-wave.mjs <wave.json> [--dry]"); process.exit(1); }
const wave = JSON.parse(readFileSync(file, "utf8"));
const FROM = "Nataliia at DataLatte <hi@datalatte.pro>";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sigRaw = readFileSync(".claude/skills/datalatte-account-manager/signature.html", "utf8");
const sigHtml = sigRaw.slice(sigRaw.indexOf("<table"), sigRaw.indexOf("</table>") + 8).replaceAll("{campaign}", wave.campaign);
const sigText = sigRaw.slice(sigRaw.indexOf("Plain-text version:") + 19, sigRaw.lastIndexOf("-->")).trim().replaceAll("{campaign}", wave.campaign);

function render(r) {
  const url = wave.article ? `${wave.article}?utm_source=email&utm_medium=outreach&utm_campaign=${wave.campaign}&utm_content=${r.slug}` : "";
  // {field} placeholders are filled from the recipient (name, article_title, ...)
  const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => (k === "article_link" || k === "article_title_link" ? m : r[k] ?? m));
  const subject = fill(wave.subject);
  const textParas = wave.paragraphs.map((p) => fill(p).replace("{article_link}", url).replace("{article_title_link}", `${r.article_title || ""} (${r.article_url || ""})`));
  const htmlParas = wave.paragraphs.map((p) => {
    const t = esc(fill(p))
      .replace("{article_link}", `<a href="${url}" style="color:#8b5e3c">artykuł</a>`)
      .replace("{article_title_link}", `<a href="${r.article_url || ""}" style="color:#8b5e3c">${esc(r.article_title || "")}</a>`);
    return `<p style="margin:0 0 12px">${t.replace(/\n/g, "<br>")}</p>`;
  });
  return {
    subject,
    text: `${textParas.join("\n\n")}\n\n${sigText}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:600px">${htmlParas.join("")}${sigHtml}</div>`,
  };
}

if (dry) {
  mkdirSync(process.env.OUT_DIR || "/tmp", { recursive: true });
  const r = render(wave.recipients[0]);
  writeFileSync(`${process.env.OUT_DIR || "/tmp"}/wave-preview.html`, r.html);
  console.log(`${wave.recipients.length} recipients\nSUBJECT: ${r.subject}\n\n${r.text}`);
  process.exit(0);
}

if (!process.env.FORCE && wave.send_after && Date.now() < Date.parse(wave.send_after)) { console.log(`Not before ${wave.send_after}, skipping.`); process.exit(0); }
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY, RESEND = process.env.RESEND_API_KEY;
if (!SB || !KEY || !RESEND) { console.error("Missing env"); process.exit(1); }
const sbH = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const wait = (ms) => new Promise((s) => setTimeout(s, ms));

const done = await (await fetch(`${SB}/rest/v1/outreach_emails?select=to_email&campaign=eq.${encodeURIComponent(wave.campaign)}`, { headers: sbH })).json();
const sent = new Set((done || []).map((r) => r.to_email.toLowerCase()));
let ok = 0, fail = 0;
for (const r of wave.recipients) {
  if (sent.has(r.email.toLowerCase())) continue;
  const m = render(r);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json", "Idempotency-Key": `${wave.campaign}:${r.email}`.slice(0, 256) },
    body: JSON.stringify({ from: FROM, to: [r.email], subject: m.subject, html: m.html, text: m.text, tags: [{ name: "campaign", value: wave.campaign.replace(/[^a-zA-Z0-9_-]/g, "_") }] }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { fail++; console.log(`FAIL ${r.email}: ${res.status} ${JSON.stringify(body).slice(0, 200)}`); await wait(1500); continue; }
  ok++;
  const now = new Date().toISOString();
  await fetch(`${SB}/rest/v1/outreach_emails`, { method: "POST", headers: sbH, body: JSON.stringify({
    sent_at: now, campaign: wave.campaign, to_email: r.email, business_name: r.name, niche: wave.niche, city: wave.city,
    country_code: wave.country_code, subject: m.subject, resend_id: body.id, status: "sent", source_table: wave.source_table || "local_businesses", source_id: r.id || null,
  }) });
  if (r.id && (wave.source_table || "local_businesses") === "local_businesses") await fetch(`${SB}/rest/v1/local_businesses?id=eq.${r.id}`, { method: "PATCH", headers: sbH, body: JSON.stringify({ status: "contacted", last_contacted_at: now }) });
  console.log(`sent ${r.email}`);
  await wait(1500);
}
console.log(`\n${ok} sent, ${fail} failed, ${sent.size} already sent before`);
if (fail) process.exit(1);
