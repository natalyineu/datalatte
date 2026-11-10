// Builds a research pack for a NEW article from explicit URLs via Jina Reader. Usage: SLUG=x URLS=u1,u2 node new-pack.mjs
import fs from "fs";
const slug = process.env.SLUG, urls = process.env.URLS.split(",").filter(Boolean), TODAY = new Date().toISOString().slice(0, 10);
const nums = (s) => (s.match(/\$?\d[\d,.]*\s?(%|percent|million|billion|k\b)?/g) || []).length;
const results = [];
for (const u of urls) { try { const r = await fetch("https://r.jina.ai/" + u, { signal: AbortSignal.timeout(60000) }); const t = r.ok ? await r.text() : ""; if (t.length < 1200 || /^Title:.*(404|not found|just a moment|attention required)/im.test(t)) { console.log("skip", u, t.length); continue; } results.push({ url: u, title: (t.match(/^Title:\s*(.*)$/m) || [])[1] || u, fetchedAt: TODAY, markdown: t.slice(0, 9000) }); console.log("ok", u, t.length); } catch (e) { console.log("fail", u); } }
fs.writeFileSync(`data/research/new-${slug}.json`, JSON.stringify({ id: slug, results, pages: results.length, facts: results.reduce((a, x) => a + Math.min(nums(x.markdown), 40), 0) }, null, 1));
