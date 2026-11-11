// Uploads data/research/facts/*.json to Supabase (research_sources + research_facts) with the anon key.
// Requires temporary anon policies on both tables (create before, drop right after). Usage: SUPABASE_URL=... SUPABASE_ANON=... node upload-facts.mjs
import fs from "fs"; import path from "path"; import crypto from "crypto";
const ROOT = process.cwd(), F = path.join(ROOT, "data/research/facts"), D = path.join(ROOT, "data/research");
const URL0 = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_ANON;
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const PRIMARY = /(\.gov|\.edu)(\/|$)|support\.google\.com|business\.google\.com|developers\.google\.com|facebook\.com\/business|nrf\.com|sba\.gov|bls\.gov|census\.gov|ftc\.gov|fcc\.gov|ctia\.org|pewresearch\.org|americanexpress\.com|advertising\.roku\.com|ads\.amazon\.com|business\.adobe\.com/i;
const topicsByUrl = new Map(), lenByUrl = new Map();
for (const f of fs.readdirSync(D).filter((x) => x.endsWith(".json"))) { let j; try { j = JSON.parse(fs.readFileSync(path.join(D, f), "utf8")); } catch { continue; } const id = (j.id || f.replace(".json", "")).replace(/^new-/, ""); for (const r of j.results || []) { const u = r.url.split("#")[0]; (topicsByUrl.get(u) || topicsByUrl.set(u, new Set()).get(u)).add(id); lenByUrl.set(u, Math.max(lenByUrl.get(u) || 0, (r.markdown || "").length)); } }
const files = fs.readdirSync(F).filter((x) => x.endsWith(".json")); let ns = 0, nf = 0;
async function api(method, p, body, extra = {}) { const r = await fetch(URL0 + "/rest/v1/" + p, { method, headers: { ...H, ...extra }, body: body ? JSON.stringify(body) : undefined }); if (!r.ok) throw new Error(method + " " + p.slice(0, 40) + " " + r.status + " " + (await r.text()).slice(0, 200)); const txt = await r.text(); return txt ? JSON.parse(txt) : null; }
for (let i = 0; i < files.length; i += 20) {
  const batch = files.slice(i, i + 20).map((f) => JSON.parse(fs.readFileSync(path.join(F, f), "utf8")));
  const rows = batch.map((b) => ({ url: b.url, domain: new URL(b.url).hostname.replace(/^www\./, ""), title: (b.title || "").slice(0, 300), is_primary: PRIMARY.test(b.url), content_hash: b.hash, char_len: lenByUrl.get(b.url) || null, fetched_at: b.fetchedAt ? new Date(b.fetchedAt).toISOString() : new Date().toISOString(), topics: [...(topicsByUrl.get(b.url) || [])].slice(0, 12), facts_extracted_at: new Date().toISOString() }));
  const saved = await api("POST", "research_sources?on_conflict=url", rows, { Prefer: "resolution=merge-duplicates,return=representation" });
  const idByUrl = new Map(saved.map((s) => [s.url, s.id])); ns += saved.length;
  await api("DELETE", "research_facts?source_id=in.(" + saved.map((s) => s.id).join(",") + ")", null);
  const facts = batch.flatMap((b) => (b.facts || []).map((f) => ({ source_id: idByUrl.get(b.url), fact: String(f.fact).slice(0, 600), value: f.value ? String(f.value).slice(0, 80) : null, unit: f.unit ? String(f.unit).slice(0, 40) : null, as_of: f.as_of ? String(f.as_of).slice(0, 40) : null, quote: String(f.quote || "").slice(0, 300), topic: f.topic || null })));
  for (let k = 0; k < facts.length; k += 200) { await api("POST", "research_facts", facts.slice(k, k + 200), { Prefer: "return=minimal" }); }
  nf += facts.length; console.log("batch", i / 20 + 1, "sources", ns, "facts", nf);
}
console.log("UPLOADED sources", ns, "facts", nf);
