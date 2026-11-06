---
name: datalatte-research-article
description: Write a long, data-driven DataLatte article from our own dataset (city rankings, audits, benchmarks) with charts, BigStat pull-quotes, tables, sourced playbooks and a validation pass. Use when asked to make a research article, ranking, "analysis of N businesses", pillar article, or when a chart, BigStat or big-number block is wanted in a blog post.
---

> **Frozen paid placements.** Never edit, reword, move, delete or restyle partner-supplied blocks listed in `data/protected-placements.json` (Spotify section, Vibe blocks, Flodesk bullet). Keep them byte-for-byte in place when rewriting a host article, and do not add the partner's name anywhere else in it. Run `node scripts/check-protected-placements.mjs` before committing.


# DataLatte research article skill

For articles built on **our own data** (Google Maps listings, website audits, GSC) rather than rewriting vendor facts. The plain rewrite rules live in `.claude/skills/datalatte-article/SKILL.md` and still apply (sources, no first person, structure, FAQ). This skill adds the data workflow, the readability layer (BigStat, charts) and the quality gates learned on the Poznań cafés article.

Components and their props: `components.md` in this folder. Verified Google quotes you can reuse: `google-facts.md`.

## 0. Principles
1. **Every number traces to a query or a fetched page.** Keep the SQL or script that produced it. Recompute after any cleaning.
2. **Clean the dataset before you analyse it, and show the cleaning.** The Poznań first draft counted 304 "cafés" that included filling stations, a 10-outlet chain, pizzerias and a PC repair shop. After cleaning it was 210. Publish a table: collected -> removed (by reason) -> analysed.
3. **Name only positives.** Rankings and "best examples" may name businesses. Weak profiles are shown as **aggregates only** (counts, shares). A thin profile can be a new business, a choice or a collection gap, so naming it is unfair and risky.
4. **Say what the data cannot show.** Age of business, follower counts, causes. Correlation is not cause: write "association".
5. **Methods are transparent.** If you score things, list every signal and its points, say it measures profile completeness, not quality of the product.
6. **No invented numbers anywhere**, including chart values and BigStat figures. Worked examples are labelled **assumption**.
7. **Honest framing beats a bigger number.** Do not round up to a nicer figure; pick a different true period or metric instead (e.g. 90 days instead of 28).
8. If a finding contradicts the first hypothesis, change the article (the Poznań draft first implied "own website = success"; the data showed social-page cafés had as many reviews).

## 1. Collect (when the dataset does not exist yet)
- Google Maps via Apify: `data/local-businesses-queue.json` (country, city, niche, terms, `locationQuery`) -> push -> workflow "Collect local businesses" -> table `local_businesses` (Supabase project `olsxxfwvwsycwzihbmdn`). Keep `locationQuery` exact, or the search returns the whole country.
- Enrichment from each business's own site (e-mail, phone, Instagram, Facebook, contact page) is the second workflow step. One request per site, plain client name, no logins, no bypassing blocks.
- Outreach to the businesses is a separate decision and needs explicit approval and a legal basis (Poland/EU: consent rules apply).

## 2. Clean (always)
- Mark non-targets with `status='skip'` and a note; never delete. Typical removals: fuel stations, chains, supermarkets, restaurants/fast food, ice-cream-only, services and wholesalers, vending, canteens, public places, closed places.
- Mark type-adjacent but out-of-scope places with another `niche` (e.g. `restaurant`).
- Print the removed names and read them: a regex catches real targets too ("Restauracja - Kawiarnia" style).
- Normalise URLs (Instagram handles) before counting.
- Treat a Facebook/Instagram page in the website field as "social page as website", not as an own website.

## 3. Analyse (decide the story from the data)
Minimum set that worked for a local-business ranking:
- Headline shares: own website, phone, Instagram, full set; rating bands; review distribution with quartiles/percentiles.
- Score method (completeness + proof) and a **sensitivity check** (rank by reviews only vs completeness only vs combined).
- Segments: by review volume, by presence group (full / partial / social-as-site / none), by postal area (>=10 listings), by type (keywords in name).
- Optional audit layer: fetch each distinct home page once and record HTTPS, viewport, meta description, Open Graph, JSON-LD, analytics, tap-to-call, maps link, menu, ordering, booking, English, cookie notice. Report failures in aggregate and note the test environment may cause some.
- Ranking tables: top 10, ranks 11-24, "highest rated with N+ reviews", "most reviewed". Exclude entries whose type you cannot confirm.

## 4. Structure of the article
1. Frontmatter (see datalatte-article). `readTime` honest.
2. First 100 words answer the question; one `StatRow`.
3. First `BigStat` right after the intro (the single most striking true number).
4. **Main findings** list (6-9 bullets) before the method.
5. Method + cleaning table + limits stated early, details later.
6. Source quotes (Google help) in their own H2.
7. Ranking tables, then analysis sections, each with one chart and, after the major ones, one `BigStat`.
8. Playbook sections sourced from first-party help pages (see `google-facts.md`), then checklist table, worked examples (assumption), 90-day plan, tracker metrics.
9. Poland/market context only from already-verified articles, cited as secondary.
10. "What this data cannot tell you", how to repeat the analysis, key terms, FAQ (one `## FAQ`), Sources, closing CTA with service link.
Length: as long as the data supports. 10,000 words was reached with real sections; do not pad. Tables and charts count; keep paragraphs <=70 words.

## 5. Readability layer
- `BigStat`: 6-9 per long article. One striking fact each, phrased as a quote ("One in four Poznań cafés is not represented online ..."), the exact count in `note`, the dataset in `source`.
- A chart every 600-900 words, different types (see `components.md`). Charts must restate numbers already in a table.
- Short paragraphs, H2s as questions, bullets for parallel items, tables for comparisons.
- Plain words, no first person ("we tested"), no filler openers.

## 6. Validate (all of these)
```bash
node scripts/audit/check-article.mjs <slug> --date <today>      # 0 errors
node scripts/audit/content-quality.mjs --lenient-seo --base HEAD
npm run build
```
- Code fences are allowed now (the checker skips fenced lines for the brace check).
- Every internal `/blog/<slug>` link must point to an **indexable** post. Check `noindex`.
- Re-read each table against the SQL output once more (rates and counts are where mistakes hide).

## 7. Visual QA (charts and layout)
Run `npm run build`, start `npx next start -p 3999` (stop with `fuser -k 3999/tcp`, never `pkill -f`), then Playwright (`createRequire` from the project, chromium pre-installed):
- Context init script: `sessionStorage.setItem("exit-popup-dismissed","1")`, and hide `.fixed.inset-0`, so the exit popup does not cover the page.
- Scroll to every `figure.mdx-chart`, wait ~1.5 s, screenshot desktop (1100 px, light) and mobile (390 px, dark).
- Assert `documentElement.scrollWidth - innerWidth == 0` on mobile; wide SVGs sit in an `overflow-x-auto` wrapper.
- Charts must be paused until `.is-in` is set, then animate (chart should be "paused" before scroll, "running" after).
- Check at least one chart in dark mode for contrast.

## 8. Publish and report
- Commit straight to `main` with `[vercel skip]` and the Co-Authored-By / Claude-Session lines; `git pull --rebase origin main` first; also `git push -f origin HEAD:<session branch>`.
- Report to the user in short Russian: link, what was added, the data caveats (what was removed in cleaning, what is secondary), what the user must check.
- Reuse the dataset: the article is also the best hook for outreach ("you are in our ranking, here are your numbers") but sending emails needs explicit approval.

## 9. Pitfalls that cost time
- Counting non-targets (chains, fuel stations) inflates every percentage.
- Postal-code grouping: use the first 4 characters, only areas with >=10 listings, call them "postal areas", not districts.
- Duplicates: one business with several listings counts several times; say "listings".
- Instagram/e-mail counts are lower bounds (only when linked from the listing or the site).
- A third-party ordering page counts as a website unless you decide otherwise; state the rule.
- MDX: double-quoted attributes, no `|` inside labels, matrices as `a,b,c;d,e,f`.
- Ad blockers hide CSS classes containing `adv-`; do not use such names.
- A scroll animation that starts on load is invisible to the reader; use `ChartRoot` (class `is-in`).
- Do not state what Google "requires" unless the quote is in `google-facts.md` (verified).
