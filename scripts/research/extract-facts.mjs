// Extracts verifiable facts from every unique source page in data/research/*.json (once per URL) with Haiku 5.5.
// Each fact must carry a verbatim quote that exists in the page text, otherwise it is dropped (anti-hallucination).
// Output: data/research/facts/<sha1(url)>.json  {url,title,hash,fetchedAt,facts:[...]}. Usage: NODE_USE_ENV_PROXY=1 node extract-facts.mjs [--limit N]
import fs from "fs"; import path from "path"; import crypto from "crypto";
const ROOT = process.cwd(), D = path.join(ROOT, "data/research"), OUT = path.join(D, "facts"); fs.mkdirSync(OUT, { recursive: true });
const LIM = process.argv.includes("--limit") ? +process.argv[process.argv.indexOf("--limit") + 1] : 1e9;
const SKIP = /(instagram|linkedin|reddit|facebook\.com\/(?!business)|pinterest|medium\.com|github\.com|t\.me|twitter|x\.com|tiktok|youtube|quora)/i;
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
const pages = new Map();
for (const f of fs.readdirSync(D).filter((x) => x.endsWith(".json"))) { let j; try { j = JSON.parse(fs.readFileSync(path.join(D, f), "utf8")); } catch { continue; } for (const r of j.results || []) { const u = r.url.split("#")[0]; if (SKIP.test(u) || (r.markdown || "").length < 800) continue; if (!pages.has(u) || r.markdown.length > pages.get(u).markdown.length) pages.set(u, { ...r, url: u }); } }
const todo = [...pages.values()].filter((p) => !fs.existsSync(path.join(OUT, sha(p.url) + ".json"))).slice(0, LIM);
console.log("pages", pages.size, "todo", todo.length);
const SYS = `You extract checkable facts from one web page for a marketing research library. Return ONLY JSON: {"facts":[{"fact":"one self-contained sentence","value":"the number/price/date or ''","unit":"%, $, USD, million, per month, ...","as_of":"year/date the page ties the fact to, or ''","quote":"a verbatim excerpt of <=200 chars copied exactly from the page that supports the fact","topic":"pricing|audience|benchmark|rules|forecast|definition|other"}]}
Rules: at most 25 facts; only explicit statements on the page (prices, minimum budgets, percentages, dates, policies, counts); skip opinions, navigation text, ads, marketing claims without a number; keep the vendor's own numbers separate from third-party claims inside the fact sentence; never infer or compute.`;
let cost = 0, done = 0, kept = 0, dropped = 0;
async function one(p) {
  const text = p.markdown.slice(0, 9000);
  for (let a = 0; a < 2; a++) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 4000, temperature: 0, usage: { include: true }, messages: [{ role: "system", content: SYS }, { role: "user", content: `URL: ${p.url}\nTITLE: ${p.title}\n\nPAGE TEXT:\n${text}` }] }), signal: AbortSignal.timeout(120000) });
      const j = await r.json(); cost += j.usage?.cost || 0; const raw = j.choices?.[0]?.message?.content || ""; const m = raw.match(/\{[\s\S]*\}/); if (!m) throw new Error("nojson");
      const facts = (JSON.parse(m[0]).facts || []).filter((f) => f.fact && f.quote);
      const norm = (s) => s.replace(/[\s*_`>#|]+/g, " ").toLowerCase().trim(); const nt = norm(text);
      const good = facts.filter((f) => nt.includes(norm(f.quote).slice(0, 60))); dropped += facts.length - good.length; kept += good.length;
      fs.writeFileSync(path.join(OUT, sha(p.url) + ".json"), JSON.stringify({ url: p.url, title: p.title, hash: sha(text), fetchedAt: p.fetchedAt, facts: good }, null, 1)); done++; return;
    } catch (e) { if (a) console.error("fail", p.url.slice(0, 70), String(e).slice(0, 60)); }
  }
}
const q = [...todo]; await Promise.all(Array.from({ length: 6 }, async () => { for (let p; (p = q.shift()); ) { await one(p); if (done % 25 === 0 && done) console.log("progress", done, "facts", kept, "dropped", dropped, "cost", cost.toFixed(3)); } }));
console.log("DONE pages", done, "facts kept", kept, "dropped(no verbatim quote)", dropped, "cost", cost.toFixed(3));
