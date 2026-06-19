# SEO Full Audit Report — datalatte.pro
**Date:** 2026-06-19 | **Audited:** https://www.datalatte.pro/
**Previous audit:** 2026-06-02 (74/100) — this is a verified refresh, not a from-scratch redo.

---

## What changed since the last audit (2026-06-02)

| Item | June 2 status | June 19 status |
|---|---|---|
| Content-Security-Policy header | 🔴 Missing | ✅ Present (`security_headers.py`: 100/100) |
| CCBot in robots.txt | 🔴 Not managed | ✅ Managed |
| twitter:site / twitter:creator | 🔴 Missing | ✅ Present (`@datalattepro`) |
| Admin panel (`/admin`) | Flagged for removal in TASKS.md | ✅ Removed this session |
| Image optimization on hotlinked Unsplash images | Not flagged | ✅ Fixed — `unoptimized` now set correctly (was inflating Vercel quota, not an SEO issue per se) |
| FAQPage schema on service/niche pages | 🔴 Flagged | 🔴 **Still present** — not fixed |
| /radar orphan pages | 🔴 76 pages | 🔴 **85 pages** — got worse, not better |

---

## 🔴 Critical Issues

### 1. FAQPage schema is still live on every service, niche, and tool page
- **Finding:** `faqSchema()` (returns `@type: "FAQPage"`) is called in [ServicePage.tsx:76](src/components/ServicePage.tsx:76), [NichePage.tsx:52](src/components/NichePage.tsx:52), and [tools/local-seo-grader/page.tsx:90](src/app/tools/local-seo-grader/page.tsx:90).
- **Evidence:** `grep` on `src/lib/schema.ts:132` confirms `"@type": "FAQPage"`. This renders on all 9 service pages, all niche pages, and the SEO grader tool — confirmed first in the 2026-06-02 audit, still unfixed 17 days later.
- **Impact:** Google restricted FAQPage rich results to government/healthcare sites in August 2023. This is dead weight on every commercial page on the site — no rich-result benefit, and it's the kind of stale structured data Google's spam systems increasingly flag as a low-quality signal.
- **Confidence:** Confirmed (code-level).
- **Fix:** Remove the `<script type="application/ld+json">` block calling `faqSchema()` in all three files. Keep the visible FAQ content/UI — only remove the structured-data wrapper.

### 2. ~~85 orphan pages in /radar~~ — false positive, already fixed (correction)
- **Original finding (max-pages=30 crawl):** 85 pages with only 1 incoming link.
- **Re-verified at max-pages=120:** only **3** orphan pages site-wide, and none of them are `/radar` pages — they're three blog country-guide posts (`local-marketing-brunei-small-business-2026`, `-chad-`, `-guinea-`).
- **Why the first number was wrong:** `internal_links.py` only counts links *between pages it has crawled*. At a 30-page crawl limit it couldn't see the cross-links between radar signals that live beyond page 30, so it misreported nearly every signal as orphaned.
- **Current state:** [src/app/radar/[slug]/page.tsx:278-305](src/app/radar/%5Bslug%5D/page.tsx:278) already has a "Related signals" block (3 links, matched by category/niche) plus prev/next sequential navigation — this was already built, contrary to what the stale audit assumed.
- **Action needed:** None for `/radar`. The 3 real orphans (Brunei/Chad/Guinea blog posts) are low priority — add 1-2 cross-links from related country-guide posts when convenient.

### 3. Programmatic location pages (312 combos) are well past the safe scale threshold
- **Finding:** `NICHES` × city list in `src/lib/locationData.ts` = 4 niches × 78 cities = **312** `/for/[niche]/[segment]` pages.
- **Evidence:** `locationData.ts:90` defines 4 niches; grep count of `slug:` entries = 78 cities.
- **Impact:** Per programmatic SEO guidance, 30+ location pages is a warning threshold and 50+ is a hard stop unless every page has genuinely unique, non-templated content (unique local data, stats, testimonials — not just city name swapped into a template). At 312 pages, this is 6x past the hard-stop line. If these pages share the same template with only city/niche name substitution, Google's algorithm (especially post-2024 spam updates targeting "scaled content abuse") can flag the whole pattern, suppressing all 312 pages rather than ranking the good ones.
- **Confidence:** Likely — flagging the scale as confirmed risk; could not verify per-page content uniqueness within this audit's budget.
- **Fix:** Audit a random sample of 5-10 `/for/[niche]/[segment]` pages for genuinely unique content (local stats, unique testimonials, real local keyword data) vs templated filler. If mostly templated, either (a) add substantive unique data per city (population, local competitor names, real local search-volume data), or (b) prune to the highest-traffic 30-50 cities and noindex/remove the rest.

---

## ⚠️ Warnings

### 4. FacebookBot not explicitly managed in robots.txt
- **Finding:** `robots_checker.py` flags `FacebookBot` as "not managed (inherits * rules)" — even though `facebookexternalhit` (a related but differently-named UA) is already in the allowlist in [robots.ts](src/app/robots.ts).
- **Impact:** Low — it inherits the permissive `*` rule, so it's not blocked, just not explicitly declared. Cosmetic gap.
- **Fix:** Add `"FacebookBot"` to the `AI_CRAWLERS` array in `src/app/robots.ts` alongside `facebookexternalhit`.

### 5. HSTS missing `includeSubDomains`
- **Finding:** `security_headers.py`: `Strict-Transport-Security: max-age=63072000` present but without `includeSubDomains`.
- **Impact:** Low/cosmetic for SEO directly, but a minor security-posture gap — subdomains aren't covered by the HSTS policy.
- **Fix:** Update the HSTS header value to `max-age=63072000; includeSubDomains` (check where it's set — likely Vercel platform default or a header in `vercel.json`/`next.config.ts`).

### 6. Core Web Vitals data is stale (17 days old) and the prior root-cause analysis no longer matches the code
- **Finding:** The 2026-06-02 audit reported mobile LCP 4.7s and blamed `HeroAnimated.tsx` for an unoptimized Unsplash hero image with `fill` + lazy loading.
- **Evidence:** Current `HeroAnimated.tsx` contains **no `<Image>` element at all** — it's a pure text/Framer Motion animated hero. The actual LCP element today is more likely the niche-card image grid further down the homepage (which we touched this session — see below).
- **Impact:** Either the component was rewritten since the last audit (likely, given the pace of changes to this repo), or the original root-cause attribution was wrong. Either way, the fix prescribed in the last action plan (add `priority` to `HeroAnimated.tsx`) was targeting code that no longer exists in that form.
- **Confidence:** Confirmed code mismatch; Hypothesis on what the real LCP element is now (PageSpeed API was rate-limited during this audit — no API key configured).
- **Fix:** Re-run `pagespeed.py` once rate-limit window clears (or supply a PageSpeed API key) to get current LCP. In the meantime, add `priority` to the first `<Image>` in the niche-card grid on the homepage ([page.tsx:317](src/app/page.tsx:317)) since it's the most likely above-the-fold image now, and verify visually that the niche grid is in the initial viewport on mobile.

---

## ✅ Confirmed Good (unchanged or improved since June 2)

| Element | Status | Evidence |
|---|---|---|
| Security headers | ✅ 100/100 | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present |
| Open Graph | ✅ 7/7 | All tags present and correctly formed |
| Twitter Card | ✅ 6/6 | Including `twitter:site`/`twitter:creator` — fixed since last audit |
| robots.txt AI crawler coverage | ✅ | GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, CCBot, anthropic-ai, Amazonbot all explicitly managed |
| HTTPS/HSTS | ✅ | Configured |
| Admin attack surface | ✅ | `/admin` + `/api/admin/*` removed this session — reduces both build load and unnecessary public surface |
| Hotlinked image double-optimization | ✅ Fixed | `unoptimized` flag now correctly set on homepage/niche/geo hero images this session |

---

## Environment Limitations

- **PageSpeed Insights API was rate-limited** during this audit run (no API key configured) — Core Web Vitals data in this report is the prior audit's (17-day-old) numbers, flagged as stale above. Re-run `pagespeed.py` with an API key for current numbers.
- **Per-page content uniqueness on the 312 programmatic location pages was not individually verified** — flagged as a scale risk based on page count alone, not content sampling, due to audit budget.

---

*Audit refresh: 2026-06-19 | Tool: Agentic SEO Skill | Builds on verified audit v2 (2026-06-02)*
