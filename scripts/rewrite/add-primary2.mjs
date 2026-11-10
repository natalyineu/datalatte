// Adds verified data-rich free sources (via Jina Reader) to packs of Stage-2 candidates (A+B groups), creating packs if missing.
import fs from "fs"; import path from "path";
const ROOT = process.cwd(), D = path.join(ROOT, "data/research"), TODAY = new Date().toISOString().slice(0, 10);
const U = { pew: "https://www.pewresearch.org/internet/fact-sheet/social-media/", bl: "https://www.brightlocal.com/research/local-consumer-review-survey/", ws: "https://www.wordstream.com/blog/ws/2016/02/29/google-adwords-industry-benchmarks", mc: "https://mailchimp.com/resources/email-marketing-benchmarks/", yelp: "https://business.yelp.com/advertise/", nd: "https://business.nextdoor.com/en-us/small-business/", sba: "https://advocacy.sba.gov/2023/03/07/frequently-asked-questions-about-small-business-2023/", bls: "https://www.bls.gov/bdm/", seo: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", lb: "https://developers.google.com/search/docs/appearance/structured-data/local-business", gbp: "https://support.google.com/business/answer/3038177", ga4: "https://support.google.com/analytics/answer/9267735", gdn: "https://support.google.com/google-ads/answer/2404190", ab: "https://www.facebook.com/business/help/1738164643098669" };
const MAP = [[/review|reputation|yelp|testimonial|rating/, ["bl", "yelp"]], [/social|instagram|facebook|tiktok|meta|pinterest|snapchat|reddit|youtube|influencer|x-ads|twitter/, ["pew", "ab"]], [/email|newsletter|sms|automation|crm|reactivation|retention/, ["mc"]], [/google-ads|ppc|ads|advert|keyword|budget|cost|cpc|cpm|bing|display|retarget/, ["ws", "gdn"]], [/nextdoor|hyperlocal/, ["nd"]], [/seo|schema|gbp|google-business|my-business|maps|local-search|citation/, ["seo", "lb", "gbp"]], [/analytics|ga4|tracking|attribution|roi|measure/, ["ga4"]], [/small-business|startup|owner|plan|strategy|budget|guide/, ["sba", "bls"]]];
const nums = (s) => (s.match(/\$?\d[\d,.]*\s?(%|percent|million|billion|k\b)?/g) || []).length;
const cache = {};
async function get(k) { if (cache[k] !== undefined) return cache[k]; try { const r = await fetch("https://r.jina.ai/" + U[k], { signal: AbortSignal.timeout(60000) }); const t = r.ok ? await r.text() : ""; cache[k] = t.length > 1500 ? { url: U[k], title: (t.match(/^Title:\s*(.*)$/m) || [])[1] || U[k], fetchedAt: TODAY, markdown: t.slice(0, 7000), primary: true } : null; } catch { cache[k] = null; } return cache[k]; }
const slugs = process.env.SLUGS.split(",").filter(Boolean); let made = 0, ready = 0;
for (const s of slugs) {
  const f = path.join(D, s + ".json"); const j = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { id: s, query: s.replace(/-/g, " "), results: [] };
  const have = new Set(j.results.map((x) => x.url)); const keys = [];
  for (const [re, ks] of MAP) if (re.test(s)) for (const k of ks) if (!keys.includes(k)) keys.push(k);
  let added = 0;
  for (const k of keys.slice(0, 4)) { const g = await get(k); if (g && !have.has(g.url) && j.results.length < 7) { j.results.push(g); have.add(g.url); added++; } }
  j.pages = j.results.length; j.facts = j.results.reduce((a, x) => a + Math.min(nums(x.markdown), 40), 0); j.ready = j.pages >= 3 && j.facts >= 12; j.primary2 = added;
  fs.writeFileSync(f, JSON.stringify(j, null, 1)); if (added) made++; if (j.ready) ready++;
}
console.log({ slugs: slugs.length, touched: made, ready });
