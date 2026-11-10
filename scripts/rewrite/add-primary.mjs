// Appends primary sources (via Jina Reader) to research packs by topic keywords. Usage: node add-primary.mjs
import fs from "fs"; import path from "path";
const ROOT = process.cwd(), D = path.join(ROOT, "data/research"), TODAY = new Date().toISOString().slice(0, 10);
const SRC = {
  gbp: ["google business|my-business|gbp|maps|local-seo|review", ["https://support.google.com/business/answer/3039617", "https://support.google.com/business/answer/7091", "https://support.google.com/business/answer/9657066"]],
  gads: ["google-ads|ppc|search-ads|cpc", ["https://support.google.com/google-ads/answer/6167118"]],
  meta: ["facebook|meta|instagram", ["https://www.facebook.com/business/help/218843592171538"]],
  hair: ["salon|hair|barber|beauty|spa", ["https://www.bls.gov/ooh/personal-care-and-service/barbers-hairstylists-and-cosmetologists.htm"]],
  fit: ["fitness|gym|yoga|trainer|studio", ["https://www.bls.gov/ooh/personal-care-and-service/fitness-trainers-and-instructors.htm"]],
  pet: ["pet|groom|dog|vet", ["https://www.bls.gov/ooh/personal-care-and-service/animal-care-and-service-workers.htm"]],
  sba: ["marketing|advertis|small-business|local", ["https://www.sba.gov/business-guide/grow-your-business/marketing-your-business"]],
  ftc: ["review|testimonial|influencer", ["https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews"]],
};
const cache = {};
async function get(u) {
  if (cache[u]) return cache[u];
  const r = await fetch("https://r.jina.ai/" + u, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) return null; const t = await r.text(); const title = (t.match(/^Title:\s*(.*)$/m) || [])[1] || u;
  return (cache[u] = { url: u, title, fetchedAt: TODAY, markdown: t.slice(0, 7000), primary: true });
}
const nums = (s) => (s.match(/\$?\d[\d,.]*\s?(%|percent|million|billion|k\b)?/g) || []).length;
let upd = 0, newReady = 0;
for (const f of fs.readdirSync(D)) {
  const p = path.join(D, f); let j; try { j = JSON.parse(fs.readFileSync(p, "utf8")); } catch { continue; }
  if (j.primaryAdded) continue;
  const slug = f.replace(".json", ""); const add = [];
  for (const [k, [re, urls]] of Object.entries(SRC)) if (new RegExp(re).test(slug)) for (const u of urls) { if (add.length < 3 && k !== "sba" || add.length < 3 && k === "sba") { const g = await get(u).catch(() => null); if (g && !add.find((x) => x.url === u)) add.push(g); } }
  if (!add.length) continue;
  const was = j.ready; j.results = [...(j.results || []), ...add.slice(0, 3)];
  j.pages = j.results.length; j.facts = j.results.reduce((a, x) => a + Math.min(nums(x.markdown), 40), 0);
  j.ready = j.pages >= 3 && j.facts >= 12; j.primaryAdded = add.length; upd++; if (!was && j.ready) newReady++;
  fs.writeFileSync(p, JSON.stringify(j, null, 1));
}
console.log({ updated: upd, newReady });
