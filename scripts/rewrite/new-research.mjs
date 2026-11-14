// Writes NEW articles from explicit research packs (data/research/new-<id>.json) with Sonnet 5.5. Output: data/triage/new/<slug>.mdx
// Usage: NODE_USE_ENV_PROXY=1 node new-article.mjs <jobs.json>
import fs from "fs"; import path from "path";
import { factsBlock } from "../research/facts-lib.mjs";
const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), TODAY = new Date().toISOString().slice(0, 10);
const LINKS = ["how-much-does-ctv-advertising-cost-real-cpm-data","ctv-advertising-platforms-compared-2026","ctv-ads-for-restaurants","ctv-ads-for-fitness-studios","is-ctv-advertising-worth-it-small-budget-2026","nfl-ctv-advertising-local-business","march-madness-ctv-advertising-local-business","new-ctv-ad-formats-2026-pause-ads-qr-codes-shoppable","ctv-advertising-creative-specs-guide-2026","connected-tv-ads-vs-traditional-tv-ads-why-ctv-wins-for-local-business","amazon-prime-video-ads-small-business","ott-advertising-local-business","live-sports-advertising-local-business","google-analytics-4-for-small-business","ctv-vs-ott-advertising-explained","roku-ads-local-business"];
const COMPONENTS = fs.readFileSync(".claude/skills/datalatte-research-article/components.md", "utf8");
const SYS = `You write one LONG research-style article for DataLatte (marketing for local businesses, startups and growing brands; US audience). It must read as a big analysis, not a summary: structured findings, tables, many charts, pull-quote numbers, playbooks. Output ONLY the full MDX file (frontmatter + body).
HARD RULES
- Every number, price, date, percentage or claim must come from the FACTS block (cite as markdown link to the source URL; mark vendor/blog/retelling sources "(secondary)") or be clearly labelled "assumption" inside a worked example or model. If sources lack a fact, leave it out. Never invent stats, cases, quotes, clients, studies. Never state predictions as fact.
- Never name or link these partner brands anywhere: Vibe, Spotify Advertising, Flodesk, AirOps, PRNEWS.IO (if a source mentions them, ignore that part). Do not describe the research process (no "source pack", "pages failed to load").
- No first person (I, we, our, my), no "picture this", no filler openers, no rule-of-three padding, no bold-label bullet spam.
- Frontmatter exactly: title (<=55 chars, main query first), seoTitle (same as title), date: "${TODAY}", lastModified: "${TODAY}", description (120-155 chars with a number), author: "Nataliia", category (use the job category), tags [5 lowercase], slug, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop", readTime (honest, e.g. "22 min read"). No noindex.
- Body: no H1. First 100 words answer the query. H2s are questions, one per 200-400 words, paragraphs <=70 words. TARGET 4500-6000 words in total (HARD CAP 6500). Do not repeat sections, do not restate tables in prose, and stop immediately after the Sources section. Use real depth: definitions, how it works, comparison table of methods, what each needs (data, budget, skills), limits and pitfalls, decision guide by budget, playbook by business type (coffee shop, salon, pet groomer, fitness studio, startup), 90-day plan, tracker metrics.
- Exactly one <StatRow values="a|b|c|d" labels="..." subs="..." trends="neutral|up|down|neutral" /> near the top with 4 sourced figures (subs name the source).
- A "Key findings" bullet list (6-8 bullets) right after the intro, each with a sourced figure or a clear statement from a source.
- 6-8 <BigStat .../> blocks (value, label as a one-sentence quote, note, source). Values ONLY from sources, never an assumption. Place one right after the intro and one after most major sections; none back to back.
- 8-12 charts from the component catalog below, DIFFERENT types, never the same type twice in a row. Charts may only restate numbers that appear in a table or sentence of the article; anything illustrative (worked example, model) must say "(assumption)" in the title or caption. Add caption with the denominator/source. Use double quotes in attributes and no | inside labels.
- Include: a comparison table of the main methods/models; a worked example with inputs labelled assumption for ONE business type with a chart (ProjectionChart, StackedBar or ScoreBreakdown); a decision table "if budget is X use Y"; a 90-day plan table; a "What this guide cannot tell you" section.
- Exactly one ## FAQ (5-6 ### questions) and one ## Sources with markdown links (secondary sources marked). 5-8 inline internal links from ALLOWED LINKS (never others) and a closing link to /free-audit or /services/analytics.
- Valid MDX: no bare { } or < in prose; matrices as a,b,c;d,e,f.
COMPONENT CATALOG (props and rules):
${COMPONENTS}`;
async function call(model, user) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: [{ role: "system", content: SYS }, { role: "user", content: user }], max_tokens: 20000, temperature: 0.4, usage: { include: true } }), signal: AbortSignal.timeout(1200000) });
  const j = await r.json(); if (!j.choices?.[0]?.message?.content) throw new Error("empty " + JSON.stringify(j).slice(0, 160)); if (j.choices[0].finish_reason !== "stop") console.error("finish", j.choices[0].finish_reason, j.usage?.completion_tokens); console.error("tokens in", j.usage?.prompt_tokens, "out", j.usage?.completion_tokens); return { text: j.choices[0].message.content, cost: j.usage?.cost || 0, fin: j.choices[0].finish_reason };
}
fs.mkdirSync("data/triage/research", { recursive: true }); let total = 0;
for (const job of jobs) {
  if (fs.existsSync(`data/triage/research/${job.slug}.mdx`) && !process.env.FORCE) { console.log('exists', job.slug); continue; }
  const pk = JSON.parse(fs.readFileSync(`data/research/new-${job.pack}.json`, "utf8"));
  const src = pk.results.map((x, i) => `[S${i + 1}] ${x.url} (${x.title}, opened ${x.fetchedAt})\n${x.markdown}`).join("\n\n---\n\n");
  const fb = process.env.USE_FACTS ? factsBlock(job.pack, { maxPerSource: 25 }) : null; if (fb) console.log("facts mode", job.slug, fb.sources, "sources", fb.facts, "facts", fb.missing.length, "pages without facts");
  const user = `SLUG: ${job.slug}\nCATEGORY: ${job.category || "Analytics & Measurement"}\nWORKING TITLE: ${job.title}\nANGLE: ${job.angle}\nALLOWED LINKS: ${(job.links || LINKS).map((x) => "/blog/" + x).join(", ")}\n\n${fb ? "FACTS (each extracted from the cited page with a verbatim quote; cite the page link; use only these)" : "SOURCES"}:\n${fb ? fb.text : src}`;
  let o; for (let a = 0; a < 3 && !o; a++) { try { o = await call(job.model || "anthropic/claude-sonnet-5.5", user + (a ? `\n\n(Attempt ${a + 1}: write the complete article through the Sources section.)` : "")); if (!/^## Sources/m.test(o.text)) { console.error("incomplete, retry", job.slug); fs.writeFileSync(`/tmp/partial-${job.slug}-${a}.mdx`, o.text); total += o.cost; o = null; } } catch (e) { console.error("retry", job.slug, String(e).slice(0, 100)); } }
  if (!o) { console.log("fail", job.slug); continue; } total += o.cost;
  fs.writeFileSync(`data/triage/research/${job.slug}.mdx`, o.text.replace(/^```(?:mdx|markdown)?\n/, "").replace(/\n```\s*$/, "")); console.log("gen", job.slug, o.cost);
}
console.log("cost", total);
