// Keyword retrieval over the facts library. Exports searchFacts(query, {limit, minTokens}) -> {facts, sources}
import fs from "fs"; import path from "path";
const F = path.join(process.cwd(), "data/research/facts");
const STOP = new Set("with your from that this have what how best guide small business local local marketing complete 2026 about into more most than they their when which will should does using use for the and are not you can".split(" "));
export const toks = (s) => [...new Set((String(s).toLowerCase().match(/[a-z][a-z0-9]{3,}/g) || []).filter((w) => !STOP.has(w)))];
let CACHE = null;
function load() { if (CACHE) return CACHE; CACHE = []; for (const f of fs.readdirSync(F)) { if (!f.endsWith(".json")) continue; const j = JSON.parse(fs.readFileSync(path.join(F, f), "utf8")); if (/datalatte\.pro/.test(j.url)) continue; for (const x of j.facts) CACHE.push({ url: j.url, title: j.title, fetchedAt: j.fetchedAt, ...x, _t: new Set(toks(x.fact + " " + j.title)) }); } return CACHE; }
let IDF = null;
function idf() { if (IDF) return IDF; const df = {}; const all = load(); for (const x of all) for (const t of x._t) df[t] = (df[t] || 0) + 1; IDF = {}; for (const t in df) IDF[t] = Math.log(all.length / df[t]); return IDF; }
export function searchFacts(query, { limit = 45, minTokens = 2, perSource = 6, minScore = 9 } = {}) {
  const q = toks(query); const I = idf(); const scored = [];
  for (const x of load()) { let n = 0, s = 0; for (const t of q) if (x._t.has(t)) { n++; s += I[t] || 0; } if (n >= minTokens && s >= minScore) scored.push([s, x]); }
  scored.sort((a, b) => b[0] - a[0]); const per = {}, out = [];
  for (const [n, x] of scored) { per[x.url] = (per[x.url] || 0) + 1; if (per[x.url] > perSource) continue; out.push({ ...x, score: n }); if (out.length >= limit) break; }
  return { facts: out, sources: new Set(out.map((x) => x.url)).size, matched: scored.length };
}
