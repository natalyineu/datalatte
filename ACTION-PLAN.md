# SEO Action Plan — datalatte.pro
**Date:** 2026-06-19 | **Builds on:** FULL-AUDIT-REPORT.md (refresh of 2026-06-02 audit)

Prioritized by impact × effort. Items already fixed since June 2 (CSP header, CCBot, twitter:site/creator, admin removal) are not repeated here — see the audit report's "What changed" table.

---

## ✅ DONE this session (2026-06-19)

### #1 — Removed FAQPage schema sitewide ✅
**Turned out far bigger than the original finding (9 service pages)** — `faqSchema()` was live on ~25 pages: homepage, all 9 service pages, all niche pages (`/for/*`), all 6 `/services/ai-agents/*` sub-pages, both `/compare/*` pages, `/pricing`, `/services` index, `/services/competitor-analysis`, the `/tools/local-seo-grader` and `/tools/marketing-budget-calculator` tools, every blog post (`/blog/[slug]`, via a 50-line `extractFaqItems()` parser), and `/for/[niche]/[segment]` (312 location pages). Removed the JSON-LD wrapper everywhere; visible FAQ content/UI untouched. Also deleted the now-dead `extractFaqItems()` and `stripMarkdown()` helper functions from the blog template. Build verified clean.

### #2 — /radar orphan pages: re-verified, turned out to be a false positive ✅
The "85 orphans" finding was a crawl-depth artifact (`internal_links.py` only saw 30 of ~120+ radar pages). Re-run at `--max-pages 120` found only 3 real orphans site-wide, none in `/radar` — the template already has a working "Related signals" block + prev/next navigation. **No code change needed.** The 3 real orphans are low-traffic country-guide blog posts (Brunei/Chad/Guinea) — low priority, optional cross-link later.

### #4 — Homepage LCP `priority` — already present ✅
Checked `src/app/page.tsx:320` — `priority={i === 0}` was already set on the first niche-card image. No action needed. Re-run `pagespeed.py` once the PageSpeed API rate limit clears to get a current LCP number (still pending — see below).

---

## 🟡 DECIDED: leave as-is for now

### #3 — 312 programmatic location pages (4 niches × 78 cities)
**Confirmed on inspection:** `src/lib/locationData.ts`'s `intro()` and `faq()` functions are pure templates — identical sentence structure across all 312 pages with only `{city}`/`{state}` swapped in. This is real templated-content scale risk (6x past the 50-page programmatic SEO threshold).

**Decision (2026-06-19): do nothing for now.** Pages are already indexed and contributing impressions; risk of a Google spam-pattern penalty is judged acceptable for the moment. Revisit if/when GSC shows a sitewide impressions drop correlated with these URLs, or before adding more cities/niches to the matrix.

---

## 🟢 Remaining — low priority

### #5 — Add FacebookBot to robots.txt allowlist
**Impact:** 🟡 Low/cosmetic | **Effort:** ⚡ 2 minutes

In [src/app/robots.ts](src/app/robots.ts), add `"FacebookBot"` next to the existing `"facebookexternalhit"` entry in the `AI_CRAWLERS` array.

---

## ⚠️ THIS MONTH

### #5 — Re-run Core Web Vitals check with a PageSpeed API key
**Impact:** 🟡 Unknown until re-measured | **Effort:** ⚡ 10 minutes (once API key available)

The June 2 LCP finding (4.7s mobile) blamed a hero image in `HeroAnimated.tsx` that no longer exists in that form — the component is now pure text/Framer Motion, no `<Image>`. Re-run `pagespeed.py --strategy mobile` against `https://www.datalatte.pro/` once the PageSpeed API rate limit clears, or add an API key, to get a current number instead of acting on stale/mismatched data.

In the meantime, add `priority` to the first `<Image>` in the niche-card grid on the homepage ([src/app/page.tsx:317](src/app/page.tsx:317)) since it's the most likely current above-the-fold LCP candidate.

### #6 — HSTS includeSubDomains
**Impact:** 🟢 Minor security hardening | **Effort:** ⚡ 5 minutes

Current: `max-age=63072000`. Add `; includeSubDomains` to the header value.

### #7 — Internal linking to 13 underlinked niche/service pages (carried over from June 2, status unverified this round)
**Impact:** ⚠️ Medium | **Effort:** ⏱️ 1-2 hours

Pages flagged June 2: `/for/restaurants`, `/for/dentists`, `/for/cleaning-services`, `/for/real-estate-agents`, `/for/startups`, `/for/freelancers`, `/for/medium-business`, `/services/tiktok-ads`, `/services/content-marketing`, `/services/reputation-management`, `/services/video-marketing`, `/services/cro`, `/services/competitor-analysis`. Not re-verified in this audit pass — re-check with `internal_links.py` on a full-site crawl before working through the list.

---

## Already fixed since June 2 (no action needed)

| Item | Verified this audit |
|---|---|
| Content-Security-Policy header | ✅ Present, 100/100 security score |
| CCBot in robots.txt | ✅ Managed |
| twitter:site / twitter:creator | ✅ Present |
| `/admin` dashboard + `/api/admin/*` | ✅ Removed this session (also cut Vercel CPU load) |
| Double image-optimization on hotlinked Unsplash photos | ✅ Fixed this session |

---

## Target

| Metric | June 2 | June 19 | Target |
|---|---|---|---|
| FAQPage schema pages | 9 (services only) | 9 + niche + tools = ~30 | 0 |
| /radar orphan pages | 76 | 85 | <10 |
| Programmatic location pages | not flagged | 312 (flagged new) | ≤50 or verified-unique |

---

*Action plan refresh: 2026-06-19 | datalatte.pro*
