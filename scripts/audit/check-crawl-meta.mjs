#!/usr/bin/env node
/**
 * Crawl-meta regression checks (2026-11-08 audit).
 * Source mode (default): asserts the code/content invariants below.
 * Live mode: node scripts/audit/check-crawl-meta.mjs --url https://datalatte.pro
 *   fetches the three audit URLs and asserts status, robots meta, canonical.
 * Cases:
 *  1. normal (indexable) blog post -> index, follow + self-canonical
 *  2. /blog?q=test -> noindex, nofollow + canonical /blog
 *  3. /guides/fitness-ai -> exists (hub + copy + indexable metadata path)
 *  4. robots.ts must not disallow /blog or /guides (noindex needs discovery)
 */
import fs from "fs";

const read = (p) => fs.readFileSync(p, "utf8");
let fails = 0;
const ok = (cond, label) => { console.log(`${cond ? "✓" : "✗"} ${label}`); if (!cond) fails++; };

const slugPage = read("src/app/blog/[slug]/page.tsx");
const blogPage = read("src/app/blog/page.tsx");
const robots = read("src/app/robots.ts");
const INDEXABLE = "google-ads-for-hardware-stores";

// 1. Indexable post: explicit index,follow + self-canonical in metadata fn
ok(!/^noindex:\s*true/m.test(read(`content/blog/${INDEXABLE}.mdx`).slice(0, 1200)), `fixture post ${INDEXABLE} is indexable`);
ok(/robots:\s*frontmatter\.noindex[\s\S]{0,120}index:\s*true,\s*follow:\s*true/.test(slugPage), "blog/[slug] emits index,follow for indexable posts");
ok(/canonical:\s*url/.test(slugPage) && slugPage.includes("https://datalatte.pro/blog/${slug}"), "blog/[slug] self-canonical");

// 2. /blog?q=*: noindex,nofollow + canonical /blog
const qBranch = blogPage.slice(blogPage.indexOf("q !== undefined"), blogPage.indexOf("const page = Math.max"));
ok(/index:\s*false,\s*follow:\s*false/.test(qBranch), "/blog?q=* robots noindex,nofollow");
ok(/alternates:\s*\{\s*canonical:\s*BLOG_URL\s*\}/.test(qBranch), "/blog?q=* canonical -> /blog");

// 3. /guides/fitness-ai resolves
const hubs = JSON.parse(read("data/hubs.json"));
const hub = hubs.find((h) => h.slug === "fitness-ai");
const copy = JSON.parse(read("data/hub-copy/fitness-ai.json"));
ok(!!hub, "fitness-ai present in data/hubs.json (generateStaticParams source)");
ok((copy.intro?.length ?? 0) > 0, "fitness-ai hub copy has intro (indexable per guides/[slug] robots rule)");
ok(hub && hub.posts.every((s) => fs.existsSync(`content/blog/${s}.mdx`) && !/^noindex:\s*true/m.test(read(`content/blog/${s}.mdx`).slice(0, 1200))), "fitness-ai hub posts exist and are indexable");
ok(read("content/blog/fitness-studio-ai-powered-marketing-tools.mdx").includes("/guides/fitness-ai"), "source article still links /guides/fitness-ai");

// 4. robots.ts does not block discovery of noindex pages
ok(!/disallow:[^\]]*"\/(blog|guides)/.test(robots), "robots.ts does not disallow /blog or /guides");

const base = process.argv.includes("--url") ? process.argv[process.argv.indexOf("--url") + 1].replace(/\/$/, "") : null;
if (base) {
  const meta = (html, name) => html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)`, "i"))?.[1]
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"))?.[1] ?? "";
  const canon = (html) => html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? "";
  const check = async (path, wantRobots, wantCanon) => {
    const r = await fetch(base + path, { redirect: "follow" });
    const html = await r.text();
    ok(r.status === 200, `LIVE ${path} -> 200 (got ${r.status})`);
    ok(meta(html, "robots").replace(/\s/g, "") === wantRobots, `LIVE ${path} robots=${wantRobots} (got "${meta(html, "robots")} ")`);
    ok(canon(html) === wantCanon, `LIVE ${path} canonical=${wantCanon} (got "${canon(html)}")`);
  };
  await check(`/blog/${INDEXABLE}`, "index,follow", `https://datalatte.pro/blog/${INDEXABLE}`);
  await check("/blog?q=test", "noindex,nofollow", "https://datalatte.pro/blog");
  const g = await fetch(base + "/guides/fitness-ai");
  ok(g.status === 200, `LIVE /guides/fitness-ai -> 200 (got ${g.status})`);
}
console.log(fails ? `\n${fails} check(s) failed` : "\nAll crawl-meta checks pass");
process.exit(fails ? 1 : 0);
