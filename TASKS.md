# TASKS (update at the start and end of each task)

## In progress (2026-11-10 rewrite campaign, branch claude/laughing-lovelace-vaflrp)
- DEPLOYED: 68 Haiku-rewritten articles (`03b1b76`), crawl-waste fix: tags no longer link to `/blog?q=`, `/blog/category/*` noindex, niche hubs link to service/city pages (`0b94f3f`), 3 duplicates re-noindexed pending 301 (bing-ads, 7-best, make-com). IndexNow sent (68 URLs).
- DEPLOYED 2026-11-10 (`8bf0d4f`): wave 3 (78 rewrites) + 246 thin template posts removed with 301 (`data/triage/remove-301.csv`). Geo pages (570) left as is until GSC re-check ~2026-11-24.
- Lists for Nataliia to review: `data/triage/remove-301.csv` (246 noindex template posts, 0 impressions, 0 refdomains; `redirect_to` is a suggestion), `data/triage/geo-pages.csv` (570 geo posts; 212 have 10+ impressions, so do NOT merge blindly).
- Pipeline: `scripts/rewrite/pilot.mjs` (gen/check, validator + repair), `scripts/rewrite/add-primary.mjs`, `data/research/*.json` packs (214 ready). Apify cap used ($4.77/$5).
- GSC re-check of the 68 rewrites + hubs ~2026-11-24. Nataliia: request indexing in GSC for top-10 URLs (see chat).

- DEPLOYED 2026-11-10 (`bba4b48`) Stage 1 cleanup: 243 zero-impression indexable posts set `noindex` (`data/triage/stage1-noindexed.txt`, 301 them after GSC check ~2026-11-24), 483 zero-impression noindex posts removed with 301 (`data/triage/stage1-removed.csv`). Next: Stage 2 rewrite groups A+B (341, need Apify sources), then C (200).

- 2026-11-10 DEPLOYED also: SVG covers + image sitemap (`7a22de6`). Wave 4 (166 rewrites, `data/triage/wave4/`, applied to `content/blog` on branch, build OK, 13 likely duplicates kept `noindex`) waiting for Nataliia's deploy word. NOTE: never rewrite slugs that are redirect sources in `next.config.ts` (18 wasted); keep `noindex` on redirect-source files.

- 2026-11-10 DEPLOYED (`b474dcd`): 638 internal links for 319 orphan posts (`scripts/audit/link-orphans2.py`), redirect fixes, socials (Instagram `datalattepro`, Facebook id 1406384899231203, Threads `@datalattepro`; Medium dropped). Clutch/Crunchbase in sameAs unverified. Next: GSC re-check ~2026-11-24 (rewrites, images, indexed count); then decide on gea pages, group C, remaining P1 (needs sources).

- 2026-11-10 DEPLOYED (`643538c`): 7 new TV/seasonal articles (BF/CM, Small Business Saturday, Super Bowl LXI [merged], Q4 CTV, midterm CTV prices, measuring CTV, local ad forecast), wave 5 (49 rewrites), 155 weak posts noindexed, 8 Polish translations, seasonal posts reopened (holiday-marketing-strategy, pet gift certificates, holiday email, valentines), process-leak cleanup, IndexNow 338 URLs. Tools: `scripts/rewrite/new-pack.mjs`, `new-article.mjs`, `scripts/audit/verify-facts.py`, `strip-leaks.py`. Rules: never rewrite redirect-source slugs; no partner names (Vibe/Spotify Advertising/Flodesk/AirOps) in new content; verify numbers against sources. GSC re-check ~2026-11-24; ideas next: Netflix/Amazon local, NBA/March Madness 2027, FAST channels.

## HANDOFF 2026-11-11 (session limit) — continue from here
- DEPLOYED on main (`4057a56` build fix, `ed9ef1b` wave 6): everything up to wave 6 is live. Vercel build was failing because `supabase/functions` (Deno) was type-checked by Next; fixed by excluding it in `tsconfig.json`.
- In branch `claude/laughing-lovelace-vaflrp`, NOT deployed: (a) 164 closed posts reopened (had impressions or were new); (b) wave 7 = ~190 articles rewritten from the facts library in `data/triage/wave7/*.mdx` (NOT yet validated/applied; ~570 more candidates lacked facts and need sources).
- To finish wave 7: re-run `NODE_USE_ENV_PROXY=1 node scripts/rewrite/rewrite-from-facts.mjs /tmp/slugs7.json data/triage/wave7` only if /tmp is gone (rebuild list = CNI/closed pages, see session summary); then copy wave7/*.mdx to content/blog (apply `strip-leaks.py --apply`, partner-name grep `vibe|spotify|flodesk|airops` must be 0 — revert files that mention them), run `node scripts/audit/check-article.mjs`, `node scripts/check-protected-placements.mjs`, number check vs facts, covers/cards (`scripts/images/make-covers.mjs`, `make-cards.mjs`), `link-orphans2.py --apply`, `npm run build`, then restore `content/blog public/images/blog` onto `main` with `[vercel skip]`.
- Rules: never delete/close posts that have impressions or are new; focus on pages Google does not index (GSC "Crawled - not indexed"). Never rewrite redirect-source slugs. No partner names (Vibe, Spotify Advertising, Flodesk, AirOps) in new content. Supabase: two TEMP anon policies `tmp_anon_research_sources/facts` still exist — drop them when Nataliia confirms (`drop policy ...`).
- OpenRouter balance ~ $11 at the time. GSC re-check 2026-11-24 (Nataliia exports Pages report).

- 2026-11-12 Competitor topic monitoring started: `data/competitors/topics-2026-11-12.json` (1,702 topics from AdWave, StackAdapt, Universal Ads, Mountain, Vibe sitemaps vs our slugs; 925 with no close match on our site). Do NOT name Vibe in content (partner). First gap closed: `chatgpt-ads-small-business-guide` (deployed `0ef1b3c`). Next gap topics: agentic/MCP ad buying, generative AI ad creative, retail media for local brands, CTV attribution/brand lift, sports-fan streaming stats, industry ad pages (towing, HVAC, roofing, auto glass, restaurant TV), CTV vs OLV / AVOD-SVOD-TVOD, CTR and conversion rate by industry. Re-run sitemap diff weekly.

- 2026-11-12 DEPLOYED `1067196`: 10 more articles from competitor gap list (call tracking, AI writing tools, RFM, email frequency, CTR/conversion benchmarks, brand lift, sports streaming stats, billboard vs TV, ad frequency, NPS) + earlier ChatGPT ads, MCP ad buying, AI-generated TV ads. Supabase `competitor_topics` (916 gaps, 16 written) and `research_sources.kind='competitor'` drive priorities. Writing pipeline: `scripts/rewrite/new-pack.mjs` -> `scripts/research/extract-facts.mjs` -> `USE_FACTS=1 scripts/rewrite/new-article.mjs` -> `check-article` + `verify-facts.py` + `strip-leaks.py` -> covers/cards -> `link-orphans2.py` -> build -> deploy. Pending: wave 7 (190 rewrites in `data/triage/wave7`), 3 temp Supabase anon policies to drop (`tmp_anon_research_sources`, `tmp_anon_research_facts`, `tmp_anon_competitor_topics`).

## Waiting on others
- Spotify $150 (PayPal …CZVT8EVJ6TSQDK24), Biglinko $50 (…FASQSTWT4WX527JW), Vibe $600 (…MVVN4PWCFS7XXG4Z): mark paid in `partner_deals` when received.
- GSC: re-check rewritten/reopened articles ~2 weeks after the next deploy.
- Cafés in Poznań: replies to cold emails (mark `skip` on "nie").

## Next (one stage at a time)
- FAQ for ~55 older posts without an FAQ section (sourced from the article text).
- Articles at GSC positions 6–15: title/intro tuning.
- Stage V: QuickBooks-data article ("how much can a coffee shop spend on ads").
- Merge four AI-social-media twin posts (needs Nataliia's yes); decide 301s for overlapping pairs after GSC data.
- 2–3 more Polish translations from GSC top.
- Reconnect Indeed/JobsPipe, connect Ahrefs/Similarweb (Nataliia to authorize).

## Done recently
- 2026-11-09 DEPLOYED (commit `0e0eabc74`, from `natalyineu`): waves 5–8 live — 6 more posts reopened (AI assistant, cold email, Yelp, FB custom audiences, Tampa salons, Seattle coffee) + 2 old slugs (TikTok Spark, Wix/Squarespace/WordPress) found 308-redirecting to live canonicals, marked `noindex` duplicates (follow-up commit). IndexNow submitted.
- 2026-11-08 DEPLOYED (commit `c2f1ed230`, author rewritten to personal identity, force-pushed): crawl fix + waves 1–4 live. `/guides/fitness-ai` 200, `/blog?q=*` canonical live, legal pages indexed, 9 posts reopened directly + 7 old slugs found 308-redirecting to renamed canonicals (old files set `noindex: true` as duplicates). IndexNow: 9 URLs submitted. Old Vercel deployment record for superseded commit `58213a413` remains in Vercel dashboard history (delete manually if wanted). GSC re-check ~2026-11-22.
- Duplicates awaiting 301 decision: `programmatic-advertising-for-local-businesses`, `make-com-vs-zapier-for-local-business-automation`, `microsoft-bing-ads-for-local-business-guide` → `bing-ads-microsoft-advertising-local-business`, `7-best-marketing-automation-platforms...`. 6 orphan hub copies (`coffee-ads`, `fitness-email`, `pet-ai`, `pet-email`, `salon-ai`, `salon-email`). DOOH/CTV city noindex posts skipped — template rewrites, poor ROI.
- Polish site phases 1–2, waves 7/8/9a/R2 rewrites, Stage A (6 articles reopened), Stage B (117 titles/descriptions), BigStat in ~95 articles, new StatRow design, FAQPage parser fix, Vibe/Spotify/Biglinko placements, `partner_deals` table.
