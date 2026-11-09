#!/usr/bin/env node
/**
 * Pilot: rewrite N articles with several OpenRouter models, validate each with check-article.
 * Steps: node pilot.mjs pack | gen | check | all.  Outputs to $OUT (default data/triage/pilot-out). Never commits.
 * Facts come only from the research pack (Apify rag-web-browser) so models cannot invent sources.
 */
import fs from "fs"; import path from "path"; import { execSync } from "child_process";
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = process.env.OUT || path.join(ROOT, "data/triage/pilot-out");
const MODELS = (process.env.MODELS || "deepseek/deepseek-v4-flash,qwen/qwen3.8-max-0902,google/gemini-3.5-flash,moonshotai/kimi-k3.1-pro,anthropic/claude-sonnet-5.5").split(",");
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, "data/triage/pilot-slugs.json"), "utf8"));
const TODAY = new Date().toISOString().slice(0, 10);
const art = (s) => path.join(ROOT, "content/blog", s + ".mdx");
const split = (t) => { const m = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/); return [m[1], m[2]]; };
const fmget = (fm, k) => (fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m")) || [])[1] || "";

async function pack() {
  fs.mkdirSync(path.join(ROOT, "data/research"), { recursive: true });
  for (const s of slugs) {
    const f = path.join(ROOT, "data/research", s + ".json"); if (fs.existsSync(f)) continue;
    const [fm] = split(fs.readFileSync(art(s), "utf8")); const title = fmget(fm, "title").replace(/["']/g, "");
    const query = title.replace(/\(.*?\)|:.*$|20\d\d/g, "").trim();
    const r = await fetch("https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?timeout=120", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, maxResults: 3, outputFormats: ["markdown"] }) });
    if (!r.ok) { console.error("pack fail", s, r.status); continue; }
    const rows = await r.json();
    fs.writeFileSync(f, JSON.stringify({ id: s, query, results: rows.map((x) => ({ url: x.metadata?.url || x.searchResult?.url || "", title: x.metadata?.title || "", fetchedAt: TODAY, markdown: String(x.markdown || "").slice(0, 7000) })).filter((x) => x.markdown.length > 300) }, null, 1));
    console.log("pack", s, rows.length);
  }
}
const SYS = `You rewrite one blog article for DataLatte (local marketing for small businesses). Output ONLY the full MDX file (frontmatter + body), nothing else.
HARD RULES
- Every number, price, percentage or rule must come from the SOURCES block (cite as markdown link) or be clearly labelled "assumption" in a worked example. If sources lack a fact, leave it out. Never invent stats, cases, quotes, clients, testimonials.
- No first person (I, we, our), no "picture this", no filler openers, no rule-of-three padding, no bold-label bullet lists.
- Frontmatter: keep date, author, category, tags, image, readTime, slug unchanged; set lastModified: "${TODAY}"; title <=55 chars with main query first; description 120-155 chars containing a number; do NOT add noindex.
- Body: no H1. First 100 words answer the query. H2s are questions, one per 150-250 words, paragraphs <=70 words.
- Exactly one <StatRow values="a|b|c|d" labels="..." subs="..." trends="neutral|up|down|neutral" /> with 4 items and equal counts, built only from sourced figures (put "assumption" in subs for example figures).
- A worked example with inputs labelled assumption. One "## FAQ" section with "### Question" entries (3-5). One "## Sources" section with markdown links (mark secondary sources "secondary").
- 3-6 internal links /blog/<slug> chosen ONLY from the ALLOWED LINKS list, plus a closing link to /services/google-ads, /services/local-seo or /free-audit as fits.
- Valid MDX: no bare { } or < in prose. 1200-2000 words.`;
function links(slug, fm) {
  const rows = fs.readFileSync(path.join(ROOT, "data/triage/triage.csv"), "utf8").split("\n").slice(1).map((l) => l.match(/^([^,]+),(KEEP-OK)/)).filter(Boolean).map((m) => m[1]);
  const tok = new Set((slug + " " + fmget(fm, "tags")).toLowerCase().match(/[a-z]{4,}/g));
  return rows.map((s) => [s, (s.match(/[a-z]{4,}/g) || []).filter((w) => tok.has(w)).length]).sort((a, b) => b[1] - a[1]).slice(0, 12).map((x) => x[0]);
}
async function call(model, user) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: [{ role: "system", content: SYS }, { role: "user", content: user }], max_tokens: 9000, temperature: 0.4 }) });
  const j = await r.json(); if (!j.choices) throw new Error(JSON.stringify(j).slice(0, 300));
  return { text: j.choices[0].message.content, usage: j.usage };
}
async function gen() {
  const cost = {};
  for (const s of slugs) {
    const old = fs.readFileSync(art(s), "utf8"); const [fm] = split(old);
    const pk = JSON.parse(fs.readFileSync(path.join(ROOT, "data/research", s + ".json"), "utf8"));
    const src = pk.results.map((x, i) => `[S${i + 1}] ${x.url} (${x.title}, opened ${x.fetchedAt})\n${x.markdown}`).join("\n\n---\n\n");
    const user = `ALLOWED LINKS: ${links(s, fm).map((x) => "/blog/" + x).join(", ")}\n\nSOURCES:\n${src}\n\nCURRENT ARTICLE (keep topic and frontmatter; rewrite body):\n${old}`;
    await Promise.all(MODELS.map(async (m) => {
      const dir = path.join(OUT, m.replace("/", "__")); fs.mkdirSync(dir, { recursive: true });
      const f = path.join(dir, s + ".mdx"); if (fs.existsSync(f)) return;
      try { const { text, usage } = await call(m, user); fs.writeFileSync(f, text.replace(/^```(?:mdx|markdown)?\n/, "").replace(/\n```\s*$/, "")); cost[m] = (cost[m] || 0) + (usage?.cost || 0); console.log("gen", m, s, usage?.cost); }
      catch (e) { console.error("gen fail", m, s, String(e).slice(0, 200)); }
    }));
  }
  console.log("cost", cost);
}
function check() {
  const res = [];
  for (const m of MODELS) for (const s of slugs) {
    const f = path.join(OUT, m.replace("/", "__"), s + ".mdx"); if (!fs.existsSync(f)) { res.push([m, s, "MISSING"]); continue; }
    const bak = fs.readFileSync(art(s), "utf8"); fs.copyFileSync(f, art(s));
    let out = ""; try { out = execSync(`node scripts/audit/check-article.mjs ${s} --date ${TODAY}`, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }); } catch (e) { out = (e.stdout || "") + (e.stderr || ""); }
    fs.writeFileSync(art(s), bak);
    const errs = (out.match(/ERROR[^\n]*/g) || []); res.push([m, s, errs.length ? errs.join(" | ").slice(0, 300) : "PASS"]);
  }
  for (const r of res) console.log(r.join("  "));
  const t = {}; for (const [m, , v] of res) { t[m] ??= [0, 0]; t[m][1]++; if (v === "PASS") t[m][0]++; } console.log(t);
}
const cmd = process.argv[2];
if (cmd === "pack" || cmd === "all") await pack();
if (cmd === "gen" || cmd === "all") await gen();
if (cmd === "check" || cmd === "all") check();
