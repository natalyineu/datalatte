// Translates rewritten EN articles to Polish MDX in content/blog-pl. Usage: SLUGS=a,b NODE_USE_ENV_PROXY=1 node translate-pl.mjs
import fs from "fs"; import path from "path";
const ROOT = process.cwd(), slugs = process.env.SLUGS.split(",").filter(Boolean), TODAY = new Date().toISOString().slice(0, 10);
const SYS = `You translate an English blog article (MDX) into natural, professional Polish for owners of small local businesses in Poland. Output ONLY the full MDX file.
RULES
- Keep every number, price, source link and MDX component (StatRow, BigStat, Callout, tables) exactly; translate only the visible text (StatRow labels and subs too). Keep currency as in the source (USD/EUR/GBP), do not convert.
- Do not add facts. Do not use first person singular. Use "Ty/Twój" forms sparingly, neutral business tone.
- Internal links: keep /blog/<slug> as is. Keep /services/... and /free-audit as is.
- Frontmatter: title <=60 chars Polish, description 120-155 chars Polish with a number, keep date, image, category (translate to Polish), tags (Polish), set: author: "Natalia Rumiancewa", locale: "pl", translationOf: "<ENGLISH_SLUG>", slug: "<polish-ascii-slug>" (lowercase, no diacritics, hyphens), readTime: "<N> min czytania", lastModified: "${TODAY}". No noindex.
- At the very top of the body add one <Callout type="warning"> (2 sentences): the data come from US/UK sources; prices and rules in Poland may differ, check local offers before deciding.
- Headings stay questions, one ## FAQ section (translate), one ## Sources section (keep link text, mark "(secondary)" as "(źródło wtórne)").`;
async function call(user) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 16000, temperature: 0.2, usage: { include: true }, messages: [{ role: "system", content: SYS }, { role: "user", content: user }] }), signal: AbortSignal.timeout(420000) });
  const j = await r.json(); if (!j.choices?.[0]?.message?.content) throw new Error("empty " + JSON.stringify(j).slice(0, 150)); return { text: j.choices[0].message.content, cost: j.usage?.cost || 0 };
}
let total = 0;
for (const s of slugs) {
  try {
    const src = fs.readFileSync(path.join(ROOT, "content/blog", s + ".mdx"), "utf8");
    let o; for (let a = 0; a < 2 && !o; a++) { try { o = await call(`ENGLISH_SLUG: ${s}\n\n${src}`); } catch (e) { console.error("retry", s, String(e).slice(0, 80)); } }
    if (!o) { console.log("fail", s); continue; } total += o.cost;
    let t = o.text.replace(/^```(?:mdx|markdown)?\n/, "").replace(/\n```\s*$/, "");
    const slug = (t.match(/^slug:\s*"([^"]+)"/m) || [])[1]; if (!slug || !/^[a-z0-9-]+$/.test(slug)) { console.log("bad slug", s); continue; }
    if (!/^locale:\s*"pl"/m.test(t) || !new RegExp(`translationOf:\\s*"${s}"`).test(t)) { console.log("bad fm", s); continue; }
    fs.writeFileSync(path.join(ROOT, "content/blog-pl", slug + ".mdx"), t); console.log("pl", s, "->", slug, o.cost);
  } catch (e) { console.log("err", s, String(e).slice(0, 100)); }
}
console.log("cost", total);
