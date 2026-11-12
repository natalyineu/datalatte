# Purchased links (guest posts / mentions)

Budget source: $800 from the Spotify, Biglinko (Flodesk) and Vibe placements, about $754 net after PayPal and Zen fees, about $719 after the $35 domain. Rule for choosing a site: Ahrefs organic traffic at least 2,000, topic fits, price up to about $150. Always check "Organic Traffic by Ahrefs" first, a high DR with organic near 0 is fake.

## Orders

| # | Date | Platform | Site | Format | Price | Paid (with fees) | Status | Our page | Anchor |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-11-12 | Collaborator.pro, deal 2858455 | ranktracker.com (DR 78, organic 104.5K) | Article, own text, 3-month Collaborator guarantee | $125 | $149 (PayPal + service fees, about 19%) | New task, not published yet | `/blog/local-seo-audit-tool-review` | local SEO audit tools |
| | | | | | | | | `/blog/best-marketing-automation-tools-small-business` | marketing automation tools for small business |
| 2 | 2026-11-12 | PRNEWS.io, order #551109 | homebusinessmag.com (DR 71, organic 9.7K, US 26%) | Mention in an existing article, dofollow, permanent, unlabeled, 1-year Guarantee ($9.80) | $98 | about $118 at checkout | On review (sent 20:45) | `/blog/ctv-advertising-platforms-compared-2026` | streaming TV ad platforms for small businesses |
| 3 | 2026-11-12 | PRNEWS.io, order #551110 | rrankvise.com (DR 32, organic 15.4K, US 17%) | Article, our text, 1 link, Guarantee | $84.28 | about $101 at checkout | On review (sent 20:47) | `/blog/digital-audio-advertising-2026-spotify-pandora-podcast-ads` | Spotify and Pandora ad costs |

Rejected after checks: Digital Ad Blog (DR 54, organic 20), SpeakRJ, ContentBase, Make Web Video, and the networks of $10 to $30 sites with zero traffic.

## Why these pages

Search Console, 90 days to 2026-11-10. Pages with impressions and a gap to the top.

- `ctv-advertising-platforms-compared-2026`: "best ctv advertising platforms" at position 65 to 84. Holds paid Spotify and Vibe blocks, they stay untouched.
- `digital-audio-advertising-2026-spotify-pandora-podcast-ads`: positions 3.6 to 7.
- `local-seo-audit-tool-review`: 4,156 impressions, position about 77, no clicks.
- `best-marketing-automation-tools-small-business`: positions 19 to 67.

## Check after publication

1. Link present, `rel` without nofollow/sponsored, anchors match.
2. Page indexed: `site:` search after 3 to 7 days.
3. Search Console: positions of the target pages, on 2026-11-22 and 2026-12-15.

## Tracking

- Baseline (2026-11-12): about 32 clicks and 6.8K impressions a week.
- Pay the next orders in one top-up, PayPal fees were about 19% on the first order.

## Collaborator API

The key is stored on the session environment as a network secret for `collaborator.pro` (header `X-Api-Key`). Docs: https://collaborator.pro/api/public/default/docs. `/api/public/creator/list` (catalog with filters) works since 2026-11-12. Array parameters do not filter (302), use plain `keywords=...` and filter countries locally.

## Baseline for tracking (Search Console, 90 days ending 2026-11-08)

Data comes from `data/analytics/gsc-pages-90d.json` and `gsc-query-page-90d.json`, refreshed daily by the "Daily Analytics Fetch" workflow (06:00 UTC).

| Target page | Clicks | Impressions | Avg position | Key queries (impressions, position) |
|---|---|---|---|---|
| `/blog/ctv-advertising-platforms-compared-2026` | 2 | 1,220 | 17.3 | best ctv advertising platforms (32, 84.4); top ctv advertising platforms (19, 66.2); best ctv & ott advertising platforms (17, 65.2) |
| `/blog/digital-audio-advertising-2026-spotify-pandora-podcast-ads` | 4 | 1,443 | 9.2 | audio ads for small business (28, 3.6); what is the minimum spend for audio ads? (26, 7.3) |
| `/blog/local-seo-audit-tool-review` | 0 | 4,156 | 77.6 | local seo audit (1,498, 86.5); local seo audit tools for agencies (511, 56.3) |
| `/blog/best-marketing-automation-tools-small-business` | 0 | 2,487 | 36.2 | marketing automation for small business (255, 66.8); best marketing automation for small business (179, 27.6); marketing automation software for small business (157, 25.4) |

Site total: about 32 clicks and 6.8K impressions a week (week of 2026-11-04).

## Check dates

- Each link is live: confirm the link, anchor, dofollow, and `site:` indexing after 3 to 7 days.
- 2026-11-22: first Search Console check (same date as the rewrite re-check).
- 2026-12-15: main comparison against the baseline above. Judge by position and impressions of the four pages, not by clicks.
- Success guess (estimate, not a promise): audio and CTV formats pages reach positions 3 to 7, automation 15 to 25, CTV platforms 30 to 50, local SEO audit 40 to 70.
