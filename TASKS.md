# TASKS (update at the start and end of each task)

## In progress (2026-11-10 rewrite campaign, branch claude/laughing-lovelace-vaflrp)
- DEPLOYED: 68 Haiku-rewritten articles (`03b1b76`), crawl-waste fix: tags no longer link to `/blog?q=`, `/blog/category/*` noindex, niche hubs link to service/city pages (`0b94f3f`), 3 duplicates re-noindexed pending 301 (bing-ads, 7-best, make-com). IndexNow sent (68 URLs).
- DEPLOYED 2026-11-10 (`8bf0d4f`): wave 3 (78 rewrites) + 246 thin template posts removed with 301 (`data/triage/remove-301.csv`). Geo pages (570) left as is until GSC re-check ~2026-11-24.
- Lists for Nataliia to review: `data/triage/remove-301.csv` (246 noindex template posts, 0 impressions, 0 refdomains; `redirect_to` is a suggestion), `data/triage/geo-pages.csv` (570 geo posts; 212 have 10+ impressions, so do NOT merge blindly).
- Pipeline: `scripts/rewrite/pilot.mjs` (gen/check, validator + repair), `scripts/rewrite/add-primary.mjs`, `data/research/*.json` packs (214 ready). Apify cap used ($4.77/$5).
- GSC re-check of the 68 rewrites + hubs ~2026-11-24. Nataliia: request indexing in GSC for top-10 URLs (see chat).

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
