# SEO Research — DataLatte.pro

All keyword research, trend analysis, and content planning data.
Last updated: 2026-05-13

## Files

| File | Description |
|---|---|
| `01-trends-analysis.md` | Google Trends analysis: niche rankings, seasonality map, rising queries, geo hotspots |
| `02-keyword-clusters.md` | 10 keyword clusters with 168 real Google Autocomplete keywords + priority article titles |
| `03-content-calendar.md` | Publishing schedule based on seasonal peaks + Breakout trends |
| `raw/trends-niches.json` | Raw weekly Trends data: coffee shop, hair salon, pet groomer, fitness studio marketing |
| `raw/trends-services.json` | Raw weekly Trends data: gym, salon, dog grooming marketing + google ads |
| `raw/keywords-batch1.json` | 76 Google Autocomplete keywords (seeds: google ads, local seo, facebook ads, automation, GBP) |
| `raw/keywords-batch2.json` | 92 Google Autocomplete keywords (seeds: Breakout trend topics from Trends analysis) |

## Tools Used
- **Google Trends** (browser) — interest over time, seasonality, rising queries, geo data
- **Apify: crawlerbros/google-keywords-suggest-scraper-pro** — real Google Autocomplete keywords
  - Mode: questions (who/what/when/where/why/how expansion)
  - Cost: ~$0.16 for batch 1, ~$0.18 for batch 2

## Key Findings
1. **Best niche by search volume:** Coffee shop marketing (avg 47) and gym marketing (avg 45)
2. **Peak months:** Feb–Apr for coffee/salons, Jan for gyms, Nov–Dec for all
3. **Breakout opportunities:** Influencer marketing for salons (+650%), email marketing for coffee shops (+150%), responsive search ads (Breakout), viral gym marketing (Breakout)
4. **Terminology fixes:** Use "gym marketing" not "fitness studio marketing", "salon marketing" not just "hair salon marketing"
5. **Target states first:** NH, DC, ID, NE, OK (coffee) | DE, WV, NV, CT, LA (gym)

## Next Steps
- [ ] Run alphabet expansion mode on top 5 pillar keywords (~$0.80)
- [ ] Scrape People Also Ask for top 10 priority articles
- [ ] Build programmatic SEO city page template
- [ ] Write first 7 Breakout articles immediately
