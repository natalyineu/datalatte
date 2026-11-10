// No-source tasks: (1) retitle pages ranking 6-15 whose title misses the top GSC query, (2) add FAQ to posts without one. Haiku 5.5 via OpenRouter.
// Usage: MODE=title|faq SLUGS=a,b node tune.mjs   (NODE_USE_ENV_PROXY=1). Edits content/blog in place; check afterwards.
import fs from "fs"; import path from "path";
const ROOT = process.cwd(), MODE = process.env.MODE, slugs = process.env.SLUGS.split(",").filter(Boolean);
const Q = JSON.parse(fs.readFileSync(path.join(ROOT, "data/analytics/gsc-query-page-90d.json"), "utf8")).rows;
async function call(sys, user) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", max_tokens: 3000, temperature: 0.3, usage: { include: true }, messages: [{ role: "system", content: sys }, { role: "user", content: user }] }), signal: AbortSignal.timeout(180000) });
  const j = await r.json(); if (!j.choices?.[0]?.message?.content) throw new Error("empty"); return { text: j.choices[0].message.content.trim(), cost: j.usage?.cost || 0 };
}
let total = 0;
for (const s of slugs) {
  const f = path.join(ROOT, "content/blog", s + ".mdx"); if (!fs.existsSync(f)) continue; let t = fs.readFileSync(f, "utf8");
  try {
    if (MODE === "title") {
      const qs = Q.filter((r) => r[0] === "/blog/" + s).sort((a, b) => b[3] - a[3]).slice(0, 5).map((r) => `${r[1]} (${r[3]} impr, pos ${r[4]})`);
      const cur = { title: (t.match(/^title:\s*"(.*)"$/m) || [])[1], description: (t.match(/^description:\s*"(.*)"$/m) || [])[1] };
      const body = t.replace(/^---[\s\S]*?\n---/, "").slice(0, 3500);
      const { text, cost } = await call('Return ONLY JSON {"title":"...","description":"..."}. Rewrite the SEO title and meta description of a blog article so they match the top search queries. Rules: title <=55 chars, put the main query first, no clickbait, no year unless the query has it; description 120-155 chars, include one concrete number that appears in the article body, no first person, plain language. Do not promise anything the article does not contain.', `TOP QUERIES: ${qs.join("; ")}\nCURRENT TITLE: ${cur.title}\nCURRENT DESCRIPTION: ${cur.description}\nARTICLE START:\n${body}`);
      total += cost; const o = JSON.parse(text.replace(/^```json\s*|```$/g, "")); const ok = o.title.length <= 55 && o.title.length >= 20 && o.description.length >= 120 && o.description.length <= 155 && !/\b(we|our|I)\b/.test(o.description);
      if (!ok) { console.log("skip", s, o.title.length, o.description.length); continue; }
      t = t.replace(/^title:\s*".*"$/m, `title: "${o.title.replace(/"/g, "'")}"`).replace(/^description:\s*".*"$/m, `description: "${o.description.replace(/"/g, "'")}"`);
      fs.writeFileSync(f, t); console.log("title", s, "|", cur.title, "=>", o.title);
    } else {
      const { text, cost } = await call("Write an FAQ section for this blog article. Output ONLY markdown: '## FAQ' then 3-4 entries as '### Question?' followed by a 2-3 sentence answer. Use ONLY facts stated in the article; no new numbers, no first person, no invented claims. Questions must be ones a reader would search for.", t.replace(/^---[\s\S]*?\n---/, "").slice(0, 9000));
      total += cost; if (!/^## FAQ/.test(text) || (text.match(/^### /gm) || []).length < 3 || /\b(we|our|I)\b/.test(text)) { console.log("skip faq", s); continue; }
      t = /^## Sources/m.test(t) ? t.replace(/^## Sources/m, text + "\n\n## Sources") : t.trimEnd() + "\n\n" + text + "\n"; fs.writeFileSync(f, t); console.log("faq", s);
    }
  } catch (e) { console.log("fail", s, String(e).slice(0, 80)); }
}
console.log("cost", total);
