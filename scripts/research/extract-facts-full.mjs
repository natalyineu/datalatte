// Re-extracts facts from FULL stored pages (data/research/raw/*.md.gz) in chunks of ~9000 chars (max 6 chunks per page).
// Overwrites data/research/facts/<sha1(url)>.json when the full page yields facts. Usage: NODE_USE_ENV_PROXY=1 node extract-facts-full.mjs [--limit N]
import fs from "fs"; import path from "path"; import crypto from "crypto"; import zlib from "zlib";
const D = path.join(process.cwd(), "data/research"), RAW = path.join(D, "raw"), OUT = path.join(D, "facts");
const idx = JSON.parse(fs.readFileSync(path.join(RAW, "index.json"), "utf8"));
const LIM = process.argv.includes("--limit") ? +process.argv[process.argv.indexOf("--limit") + 1] : 1e9;
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
const todo = Object.entries(idx).filter(([h]) => { const f = path.join(OUT, h + ".json"); if (!fs.existsSync(f)) return true; try { return !JSON.parse(fs.readFileSync(f, "utf8")).full; } catch { return true; } }).slice(0, LIM);
console.log("todo", todo.length);
const SYS = `You extract checkable facts from one chunk of a web page for a marketing research library. Return ONLY JSON: {"facts":[{"fact":"one self-contained sentence","value":"the number/price/date or ''","unit":"%, $, USD, million, per month, ...","as_of":"year/date the page ties the fact to, or ''","quote":"a verbatim excerpt of <=200 chars copied exactly from the chunk that supports the fact","topic":"pricing|audience|benchmark|rules|forecast|definition|other"}]}
Rules: at most 25 facts; only explicit statements in the chunk (prices, minimum budgets, percentages, dates, policies, counts); skip opinions, navigation text, ads, marketing claims without a number; keep the vendor's own numbers separate from third-party claims inside the fact sentence; never infer or compute.`;
function chunks(t) { const out = []; let cur = ""; for (const p of t.split(/\n\n/)) { if ((cur + p).length > 9000 && cur) { out.push(cur); cur = ""; } cur += p + "\n\n"; if (out.length >= 6) break; } if (cur && out.length < 6) out.push(cur); return out; }
const norm = (s) => s.replace(/[\s*_`>#|]+/g, " ").toLowerCase().trim();
let cost = 0, pages = 0, kept = 0, dropped = 0, chunksN = 0;
async function ask(url, title, text) {
  for (let a = 0; a < 2; a++) { try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 4000, temperature: 0, usage: { include: true }, messages: [{ role: "system", content: SYS }, { role: "user", content: `URL: ${url}\nTITLE: ${title}\n\nCHUNK:\n${text}` }] }), signal: AbortSignal.timeout(120000) });
    const j = await r.json(); cost += j.usage?.cost || 0; const m = (j.choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/); if (!m) throw new Error("nojson"); return (JSON.parse(m[0]).facts || []).filter((f) => f.fact && f.quote);
  } catch (e) { if (a) return []; } }
  return [];
}
async function one([h, meta]) {
  const text = zlib.gunzipSync(fs.readFileSync(path.join(RAW, h + ".md.gz"))).toString(); const nt = norm(text); const seen = new Set(); const facts = [];
  const old = fs.existsSync(path.join(OUT, h + ".json")) ? JSON.parse(fs.readFileSync(path.join(OUT, h + ".json"), "utf8")) : { title: meta.url };
  const cs = chunks(text); chunksN += cs.length;
  for (const c of cs) for (const f of await ask(meta.url, old.title, c)) { const q = norm(f.quote).slice(0, 60); if (!nt.includes(q)) { dropped++; continue; } if (seen.has(q)) continue; seen.add(q); facts.push(f); }
  kept += facts.length; pages++;
  fs.writeFileSync(path.join(OUT, h + ".json"), JSON.stringify({ url: meta.url, title: old.title, hash: meta.hash, fetchedAt: meta.fetchedAt, full: true, chars: meta.chars, chunks: cs.length, facts }, null, 1));
}
const q = [...todo]; await Promise.all(Array.from({ length: 6 }, async () => { for (let t; (t = q.shift()); ) { await one(t); if (pages % 25 === 0 && pages) console.log("progress", pages, "facts", kept, "cost", cost.toFixed(3)); } }));
console.log("DONE pages", pages, "chunks", chunksN, "facts", kept, "dropped", dropped, "cost", cost.toFixed(3), "per page", (cost / Math.max(1, pages)).toFixed(4));
