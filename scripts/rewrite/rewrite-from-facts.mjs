// Rewrites existing articles from the facts library (no raw pages). Articles with too few relevant facts are listed for closing/sourcing.
// Usage: NODE_USE_ENV_PROXY=1 node rewrite-from-facts.mjs <slugs.json> [outDir=data/triage/wave6]
import fs from "fs"; import path from "path";
import { searchFacts } from "../research/facts-search.mjs";
const slugs = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), OUT = process.argv[3] || "data/triage/wave6"; fs.mkdirSync(OUT, { recursive: true });
const TODAY = new Date().toISOString().slice(0, 10);
const SYS = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "sys-rewrite.txt"), "utf8").replaceAll("__TODAY__", TODAY);
const cfg = fs.readFileSync("next.config.ts", "utf8"); const red = new Set([...cfg.matchAll(/source:\s*"\/blog\/([^"]+)"/g)].map((m) => m[1]));
const live = fs.readdirSync("content/blog").filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4)).filter((s) => !red.has(s) && !/^noindex: true$/m.test(fs.readFileSync(`content/blog/${s}.mdx`, "utf8").slice(0, 1500)));
const tk = (s) => new Set((s.toLowerCase().match(/[a-z]{4,}/g) || []));
function links(slug, tags) { const q = tk(slug + " " + tags); return live.filter((s) => s !== slug && !/(ctv-advertising-.*-guide|local-marketing-.*-2026|small-business-marketing-)/.test(s)).map((s) => [s, [...tk(s)].filter((w) => q.has(w)).length]).sort((a, b) => b[1] - a[1]).slice(0, 10).filter((x) => x[1] > 0).map((x) => "/blog/" + x[0]); }
async function call(user) { const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 16000, temperature: 0.3, usage: { include: true }, messages: [{ role: "system", content: SYS }, { role: "user", content: user }] }), signal: AbortSignal.timeout(420000) }); const j = await r.json(); if (!j.choices?.[0]?.message?.content) throw new Error("empty"); return { text: j.choices[0].message.content, cost: j.usage?.cost || 0 }; }
let total = 0; const close = [], done = [];
async function one(s) {
  if (fs.existsSync(path.join(OUT, s + ".mdx"))) return;
  const old = fs.readFileSync(`content/blog/${s}.mdx`, "utf8"); const title = (old.match(/^title:\s*"(.*)"/m) || [])[1] || s; const tags = (old.match(/^tags:\s*\[(.*)\]/m) || [])[1] || "";
  const r = searchFacts(s.replace(/-/g, " ") + " " + title + " " + tags);
  if (r.facts.length < 12 || r.sources < 3) { close.push({ slug: s, facts: r.facts.length, sources: r.sources }); return; }
  const bySrc = {}; for (const f of r.facts) (bySrc[f.url] ||= []).push(f);
  const block = Object.entries(bySrc).map(([u, fs_], i) => `[S${i + 1}] ${u} (${fs_[0].title}, opened ${fs_[0].fetchedAt})\n` + fs_.map((f) => `- ${f.fact}${f.as_of ? ` [as of ${f.as_of}]` : ""} (quote: "${String(f.quote).slice(0, 150)}")`).join("\n")).join("\n\n---\n\n");
  const user = `ALLOWED LINKS: ${links(s, tags).join(", ")}\n\nFACTS (each was extracted from the cited page with a verbatim quote; cite the page as a markdown link; use only these facts):\n${block}\n\nCURRENT ARTICLE (keep topic and frontmatter; rewrite body):\n${old}`;
  for (let a = 0; a < 2; a++) { try { const o = await call(user); total += o.cost; if (!/^## Sources/m.test(o.text)) { if (a) throw new Error("incomplete"); continue; } fs.writeFileSync(path.join(OUT, s + ".mdx"), o.text.replace(/^```(?:mdx|markdown)?\n/, "").replace(/\n```\s*$/, "")); done.push(s); console.log("gen", s, r.facts.length, "facts", o.cost.toFixed(4)); return; } catch (e) { if (a) { close.push({ slug: s, facts: r.facts.length, sources: r.sources, err: String(e).slice(0, 40) }); console.log("fail", s); } } }
}
const q = [...slugs]; await Promise.all(Array.from({ length: 4 }, async () => { for (let s; (s = q.shift()); ) await one(s); }));
fs.writeFileSync(path.join(OUT, "_close.json"), JSON.stringify(close, null, 1)); console.log("DONE generated", done.length, "to close/source", close.length, "cost", total.toFixed(3));
