// Writes NEW articles from explicit research packs (data/research/new-<id>.json) with Sonnet 5.5. Output: data/triage/new/<slug>.mdx
// Usage: NODE_USE_ENV_PROXY=1 node new-article.mjs <jobs.json>
import fs from "fs"; import path from "path";
const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), TODAY = new Date().toISOString().slice(0, 10);
const LINKS = ["how-much-does-ctv-advertising-cost-real-cpm-data","ctv-advertising-platforms-compared-2026","ctv-ads-for-restaurants","ctv-ads-for-fitness-studios","is-ctv-advertising-worth-it-small-budget-2026","nfl-ctv-advertising-local-business","march-madness-ctv-advertising-local-business","new-ctv-ad-formats-2026-pause-ads-qr-codes-shoppable","ctv-advertising-creative-specs-guide-2026","connected-tv-ads-vs-traditional-tv-ads-why-ctv-wins-for-local-business","amazon-prime-video-ads-small-business","ott-advertising-local-business","live-sports-advertising-local-business","google-analytics-4-for-small-business","ctv-vs-ott-advertising-explained","roku-ads-local-business"];
const SYS = `You write one blog article for DataLatte (local marketing for small businesses: coffee shops, hair and beauty salons, pet groomers, fitness studios; US audience). Output ONLY the full MDX file (frontmatter + body).
HARD RULES
- Every number, price, date, percentage or claim must come from the SOURCES block (cite as markdown link, mark vendor/blog/retelling sources "(secondary)") or be clearly labelled "assumption" inside a worked example. If sources lack a fact, leave it out. Never invent stats, cases, quotes, clients. Never state a prediction as fact (for example, do NOT claim ad prices will fall after any date unless a source says so; say it is not documented and tell the reader to ask for current rates).
- Never name or link these partner brands anywhere: Vibe, Spotify Advertising, Flodesk, AirOps (if a source mentions them, ignore that part). Do not describe the research process (no "source pack", "pages failed to load").
- No first person (I, we, our, my), no "picture this", no filler openers, no rule-of-three padding, no bold-label bullet spam.
- Frontmatter exactly: title (<=55 chars, main query first), seoTitle (same as title), date: "${TODAY}", lastModified: "${TODAY}", description (120-155 chars with a number), author: "Nataliia", category: "Programmatic Advertising", tags [4-5 lowercase], slug, image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80&auto=format&fit=crop", readTime. No noindex.
- Body: no H1. First 100 words answer the query. H2s are questions, one per 150-250 words, paragraphs <=70 words. 1500-2200 words.
- Exactly one <StatRow values="a|b|c|d" labels="..." subs="..." trends="neutral|up|down|neutral" /> with 4 sourced figures (subs name the source; a figure that is an example must say assumption).
- UNIQUE ELEMENT required: a concrete table AND a week-by-week checklist or calendar specific to the topic; plus a worked example with inputs labelled assumption, built for one of: coffee shop, salon, pet groomer, fitness studio.
- Exactly one ## FAQ (3-5 ### questions) and one ## Sources with markdown links. 3-6 inline internal links from ALLOWED LINKS (never others) and a closing link to /free-audit or /services/google-ads.
- Valid MDX: no bare { } or < in prose.`;
async function call(model, user) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: [{ role: "system", content: SYS }, { role: "user", content: user }], max_tokens: 16000, temperature: 0.4, usage: { include: true } }), signal: AbortSignal.timeout(480000) });
  const j = await r.json(); if (!j.choices?.[0]?.message?.content) throw new Error("empty " + JSON.stringify(j).slice(0, 160)); return { text: j.choices[0].message.content, cost: j.usage?.cost || 0 };
}
fs.mkdirSync("data/triage/new", { recursive: true }); let total = 0;
for (const job of jobs) {
  const pk = JSON.parse(fs.readFileSync(`data/research/new-${job.pack}.json`, "utf8"));
  const src = pk.results.map((x, i) => `[S${i + 1}] ${x.url} (${x.title}, opened ${x.fetchedAt})\n${x.markdown}`).join("\n\n---\n\n");
  const user = `SLUG: ${job.slug}\nWORKING TITLE: ${job.title}\nANGLE: ${job.angle}\nALLOWED LINKS: ${LINKS.map((x) => "/blog/" + x).join(", ")}\n\nSOURCES:\n${src}`;
  let o; for (let a = 0; a < 2 && !o; a++) { try { o = await call(job.model || "anthropic/claude-sonnet-5.5", user); } catch (e) { console.error("retry", job.slug, String(e).slice(0, 100)); } }
  if (!o) { console.log("fail", job.slug); continue; } total += o.cost;
  fs.writeFileSync(`data/triage/new/${job.slug}.mdx`, o.text.replace(/^```(?:mdx|markdown)?\n/, "").replace(/\n```\s*$/, "")); console.log("gen", job.slug, o.cost);
}
console.log("cost", total);
