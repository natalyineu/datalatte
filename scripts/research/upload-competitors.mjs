// Uploads data/competitors/topics-*.json to Supabase competitor_topics (anon key + temp policy). Usage: SUPABASE_URL=... SUPABASE_ANON=... node upload-competitors.mjs <topics.json> <all.json>
import fs from "fs";
const [rowsF, allF] = process.argv.slice(2); const rows = JSON.parse(fs.readFileSync(rowsF, "utf8")); const all = JSON.parse(fs.readFileSync(allF, "utf8"));
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_ANON; const H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" };
const urlmap = new Map(); for (const [n, L] of Object.entries(all)) for (const [u, d] of L) urlmap.set(n + "|" + u.replace(/\/$/, "").split("/").pop(), [u, d]);
const HOT = /chatgpt|openai|ai-|agentic|mcp|generative|retail-media|attribution|brand-lift|roas|sports|streaming-statistics|holiday|black-friday|small-business|local|smb|pause|shoppable|measure/i;
const out = [];
for (const [n, d, s, sc, best] of rows) { const m = urlmap.get(n + "|" + s); if (!m || m[0].length > 300) continue; const [u, dd] = m; const status = sc >= 0.25 ? "covered" : "gap"; let pr = 0; if (status === "gap" && n !== "vibe") pr = 1 + (HOT.test(s) ? 3 : 0) + (dd && dd >= "2026-10-15" ? 2 : 0) + (dd && dd >= "2026-09-01" ? 1 : 0);
  out.push({ competitor: n, url: u, slug: s, published_at: dd ? dd.slice(0, 10) : null, our_best_match: best, match_score: sc, status, priority: pr, note: n === "vibe" ? "partner: never name in content" : null }); }
for (let i = 0; i < out.length; i += 300) { const r = await fetch(U + "/rest/v1/competitor_topics?on_conflict=url", { method: "POST", headers: H, body: JSON.stringify(out.slice(i, i + 300)) }); if (!r.ok) throw new Error(r.status + " " + (await r.text()).slice(0, 200)); console.log("batch", i / 300 + 1, out.length); }
console.log("UPLOADED", out.length, "gaps", out.filter((o) => o.status === "gap").length);
