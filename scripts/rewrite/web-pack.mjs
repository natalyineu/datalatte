// Builds research packs for thin/failed slugs: OpenRouter web-search plugin finds URLs, Jina Reader fetches raw pages.
// Usage: SLUGS=a,b node web-pack.mjs   (env NODE_USE_ENV_PROXY=1)
import fs from "fs"; import path from "path";
const ROOT = process.cwd(), D = path.join(ROOT, "data/research"), TODAY = new Date().toISOString().slice(0, 10);
const slugs = process.env.SLUGS.split(",");
const BAD = /reddit\.com|quora\.com|pinterest\.|youtube\.com|facebook\.com\/(?!business)|linkedin\.com|twitter\.com|x\.com/;
const nums = (s) => (s.match(/\$?\d[\d,.]*\s?(%|percent|million|billion|k\b)?/g) || []).length;
async function search(q) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 400, plugins: [{ id: "web", max_results: 8 }], usage: { include: true }, messages: [{ role: "user", content: `Search the web for authoritative statistics, benchmarks and guidance for: ${q}. Prefer vendor documentation, government, industry research reports. One short sentence only.` }] }), signal: AbortSignal.timeout(120000) });
  const j = await r.json(); const ann = j.choices?.[0]?.message?.annotations || [];
  return { urls: [...new Set(ann.filter((a) => a.type === "url_citation").map((a) => a.url_citation.url.split("#")[0]))], cost: j.usage?.cost || 0 };
}
async function fetchPage(u) { try { const r = await fetch("https://r.jina.ai/" + u, { signal: AbortSignal.timeout(60000) }); if (!r.ok) return null; const t = await r.text(); if (t.length < 800) return null; return { url: u, title: (t.match(/^Title:\s*(.*)$/m) || [])[1] || u, fetchedAt: TODAY, markdown: t.slice(0, 7000) }; } catch { return null; } }
let total = 0;
for (const s of slugs) {
  const f = path.join(D, s + ".json"); let j = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { id: s, query: s.replace(/-/g, " "), results: [] };
  const { urls, cost } = await search(j.query || s.replace(/-/g, " ")); total += cost;
  const have = new Set((j.results || []).map((x) => x.url)); const add = [];
  for (const u of urls.filter((u) => !BAD.test(u) && !have.has(u)).slice(0, 5)) { const p = await fetchPage(u); if (p) add.push(p); }
  j.results = [...(j.results || []), ...add]; j.pages = j.results.length; j.facts = j.results.reduce((a, x) => a + Math.min(nums(x.markdown), 40), 0); j.ready = j.pages >= 3 && j.facts >= 12; j.webAdded = add.length;
  fs.writeFileSync(f, JSON.stringify(j, null, 1)); console.log(s, "urls", urls.length, "added", add.length, "ready", j.ready, "cost", cost);
}
console.log("total cost", total);
