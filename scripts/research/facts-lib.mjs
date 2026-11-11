import fs from "fs"; import path from "path"; import crypto from "crypto";
const D = path.join(process.cwd(), "data/research"), F = path.join(D, "facts");
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
/** Compact FACTS block (a few KB) for a pack id (data/research/<id>.json or new-<id>.json), built from extracted facts. Pages without extracted facts are returned in `missing`. */
export function factsBlock(packId, { maxPerSource = 18 } = {}) {
  const f = [path.join(D, "new-" + packId + ".json"), path.join(D, packId + ".json")].find((x) => fs.existsSync(x));
  if (!f) throw new Error("no pack " + packId);
  const pack = JSON.parse(fs.readFileSync(f, "utf8")); const out = [], missing = []; let n = 0, i = 0;
  for (const r of pack.results || []) {
    const u = r.url.split("#")[0]; const fp = path.join(F, sha(u) + ".json");
    if (!fs.existsSync(fp)) { missing.push(u); continue; }
    const j = JSON.parse(fs.readFileSync(fp, "utf8")); i++;
    const lines = j.facts.slice(0, maxPerSource).map((x) => `- ${x.fact}${x.as_of ? ` [as of ${x.as_of}]` : ""} (quote: "${String(x.quote).slice(0, 160)}")`); n += lines.length;
    out.push(`[S${i}] ${u} (${j.title}, opened ${j.fetchedAt})\n${lines.join("\n")}`);
  }
  return { text: out.join("\n\n---\n\n"), facts: n, sources: i, missing };
}
