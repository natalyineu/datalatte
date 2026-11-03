#!/usr/bin/env node
/**
 * Enrich pl_cafes from each cafe's own public website: e-mails (mailto, page text, scripts, JSON-LD),
 * phone numbers, Instagram and Facebook pages, and the contact page URL. Reads at most 3 public pages per site,
 * one at a time with a pause. Never logs in, never works around blocks: a site that refuses is marked and skipped.
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: KEY } = process.env;
if (!SUPABASE_URL || !KEY) { console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const sb = (p, opt = {}) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { ...opt, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(opt.headers || {}) } });
const UA = "DataLatteResearch/1.0 (+https://datalatte.pro)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const JUNK = /(sentry|wixpress|example|domain|yourname|email@|user@|@2x|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg|noreply|no-reply|donotreply|godaddy|squarespace|wix\.com|shopify|schema\.org|w3\.org)/i;

async function get(url) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "text/html,*/*", "Accept-Language": "pl,en;q=0.8" }, redirect: "follow", signal: ctrl.signal });
    if (!r.ok) return { status: r.status, html: "" };
    const ct = r.headers.get("content-type") || "";
    if (!/html|text/i.test(ct)) return { status: r.status, html: "" };
    return { status: r.status, html: (await r.text()).slice(0, 1_500_000), url: r.url };
  } catch (e) { return { status: 0, html: "", err: e.name }; } finally { clearTimeout(t); }
}

const decode = (s) => s.replace(/&#0*64;|&commat;|\[at\]|\(at\)| \[@\] /gi, "@").replace(/&#0*46;|\[dot\]|\(dot\)/gi, ".").replace(/&amp;/g, "&");
function extract(html, base) {
  const h = decode(html);
  const emails = new Set();
  for (const m of h.matchAll(/mailto:([^"'?\s>]+)/gi)) emails.add(decodeURIComponent(m[1]).trim().toLowerCase());
  for (const m of h.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g)) emails.add(m[0].toLowerCase());
  const phones = new Set();
  for (const m of h.matchAll(/tel:([+\d][\d\s().-]{6,})/gi)) phones.add(m[1].trim());
  const ig = [...h.matchAll(/https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]{2,30})\/?(?=["'\s<?#])/g)].map((m) => m).find((m) => !/^(p|reel|reels|explore|accounts|tv|stories|share|about|developer|direct)$/i.test(m[1]));
  const fb = [...h.matchAll(/https?:\/\/(?:www\.|pl-pl\.)?facebook\.com\/((?:profile\.php\?id=\d+)|(?:[A-Za-z0-9.\-]{3,80}))\/?(?=["'\s<?#&])/g)].find((m) => !/^(sharer|share|plugins|tr|dialog|login|policies|about|pages|groups|events|watch|reel|hashtag)/i.test(m[1]));
  const contact = [...h.matchAll(/href=["']([^"'#]+)["']/gi)].map((m) => m[1]).find((u) => /(kontakt|contact)/i.test(u) && !/\.(jpg|png|pdf|css|js)$/i.test(u));
  let contactUrl = null;
  if (contact) { try { contactUrl = new URL(contact, base).toString(); } catch { /* ignore */ } }
  return { emails: [...emails].filter((e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e) && !JUNK.test(e)), phones: [...phones], instagram: ig ? `https://www.instagram.com/${ig[1]}` : null, facebook: fb ? `https://www.facebook.com/${fb[1]}` : null, contactUrl };
}

const r = await sb("pl_cafes?select=*&enriched_at=is.null&order=reviews_count.desc.nullslast&limit=500");
if (!r.ok) { console.error("read failed", r.status, await r.text()); process.exit(1); }
const rows = await r.json();
console.log(`To enrich: ${rows.length}`);
let withNewEmail = 0, withIg = 0;
for (const c of rows) {
  const patch = { enriched_at: new Date().toISOString() };
  let note = "";
  const emails = new Set(c.emails_all || []);
  let ig = c.instagram, fb = c.facebook, phone = c.phone, contactPage = null;
  const site = c.website;
  if (!site) note = "no website";
  else if (/instagram\.com/i.test(site)) { ig = ig || site.split("?")[0]; note = "website is an Instagram page (not read)"; }
  else if (/facebook\.com/i.test(site)) { fb = fb || site.split("?")[0]; note = "website is a Facebook page (not read)"; }
  else {
    const pages = [site]; const seen = new Set();
    for (let i = 0; i < pages.length && i < 3; i++) {
      const u = pages[i]; if (seen.has(u)) continue; seen.add(u);
      const res = await get(u);
      if (!res.html) { note += `${i === 0 ? "site" : "page"} ${res.status || res.err || "unreachable"}; `; if (i === 0) break; continue; }
      const x = extract(res.html, res.url || u);
      x.emails.forEach((e) => emails.add(e));
      if (!ig && x.instagram) ig = x.instagram;
      if (!fb && x.facebook) fb = x.facebook;
      if (!phone && x.phones[0]) phone = x.phones[0];
      if (i === 0 && x.contactUrl) { contactPage = x.contactUrl; pages.push(x.contactUrl); }
      if (i === 0) { for (const p of ["/kontakt", "/contact"]) { try { const cu = new URL(p, res.url || u).toString(); if (!pages.includes(cu)) pages.push(cu); } catch { /* ignore */ } } }
      await sleep(1200);
    }
  }
  const all = [...emails];
  if (all.length && !c.email) withNewEmail++;
  if (ig && !c.instagram) withIg++;
  Object.assign(patch, { emails_all: all, email: c.email || all[0] || null, instagram: ig || null, facebook: fb || null, phone: phone || null, contact_page: contactPage, enrich_note: note.trim() || null });
  const u = await sb(`pl_cafes?id=eq.${c.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
  console.log(`${u.ok ? "✓" : "✗"} ${c.business_name} | emails:${all.length} ig:${ig ? "y" : "n"} ${note}`);
  await sleep(500);
}
console.log(`\nDone. New e-mails found: ${withNewEmail}, new Instagram pages: ${withIg}`);
