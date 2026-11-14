# DataLatte.pro — Project Memory for Claude

> **Task board**: [`TASKS.md`](TASKS.md) — обновляй при начале и конце каждой задачи.

## 🌐 Project Overview
- **Website**: https://www.datalatte.pro/
- **Brand**: DataLatte — "Data-Driven Local Marketing for Small Businesses"
- **Tagline**: "Brew up better business with data that works"
- **Stage**: Live & scaling — rapidly building topical authority through SEO content

## 👤 Founder
- **Name**: Nataliia
- **Vercel account**: rumiantsevanatali@gmail.com (team: natasha's projects)
- **GitHub**: natalyineu
- **Repo**: https://github.com/natalyineu/datalatte
- **Auto-deploy**: Every push to `main` → live on datalatte.pro

## 🎯 Target Audience
Local businesses, startups and growing brands in the US, UK, Australia, Canada and other English-speaking markets (not only four niches; /for hub lists all 18 industry pages, source of truth `src/lib/segments.ts`):
- ☕💇🐾🏋️ Core local niches: coffee shops & cafés, hair/beauty salons & barbershops, pet groomers, fitness & yoga studios
- 🍽️🦷🧼🔧⚡ Other local services: restaurants, dentists, cleaning, plumbers, electricians, nail salons
- 🚀 Startups, freelancers & consultants, real estate agents
- 📈 Growing/mid-market businesses, multi-location, enterprise & agencies
Positioning: "Data-Driven Marketing for Local Businesses & Startups". Partners shown in "Brands we work with" strip (`src/components/PartnerStrip.tsx`).

## 🛠️ Core Services Offered
1. Google Ads
2. Meta Ads (Facebook & Instagram)
3. Local SEO
4. Google Business Profile optimization
5. AI Agents & Automation
6. Analytics & Reporting
7. Email & SMS Marketing
8. Social Media Management
9. Website & Landing Pages

## 🗂️ Site Structure
```
/                          → Home
/about                     → Founder story (Nataliia's photo at /images/founder.png)
/contact                   → Contact form
/blog                      → Blog index
/blog/[slug]               → Blog posts (6 live)
/for/coffee-shops          → Niche landing page
/for/hair-salons           → Niche landing page
/for/pet-groomers          → Niche landing page
/for/fitness-studios       → Niche landing page
/services/google-ads       → Service page
/services/meta-ads         → Service page
/services/google-business-profile → Service page
/services/local-seo        → Service page
/services/analytics        → Service page
/services/ai-agents        → Service page
/services/email-sms        → Service page
/services/social-media     → Service page
/services/website          → Service page
```

## 🧱 Tech Stack
- **Framework**: Next.js 16.2.6 (App Router, fully static)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4.1 with custom `coffee-*` color scale
- **Hosting**: Vercel (Hobby plan)
- **Domain**: datalatte.pro via Namecheap DNS
  - A record: `@ → 76.76.21.21`
  - CNAME: `www → cname.vercel-dns.com`
- **Images**: next/image with explicit width/height (not fill) for circular crops

## 🎨 Design System
- **Color palette**: `coffee-*` (brown tones) + `gray-*` only — no blue/purple/green
- **coffee-* scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 (defined in tailwind.config.ts)
- **Key classes**: `hero-gradient`, `section-label`, `section-title`, `gradient-text`, `btn-primary`, `card`
- **Fonts**: System font stack (no Google Fonts)
- **Tone**: Professional, warm, data-oriented. Use coffee metaphors where natural.

## 📁 Key Files
- `src/app/layout.tsx` — Root layout with `title.template: "%s | DataLatte"`
- `src/app/page.tsx` — Home page (uses `title: { absolute: "..." }`)
- `src/components/Header.tsx` — Nav with 9-service dropdown (w-60)
- `src/components/ServicePage.tsx` — Reusable service page template
- `src/components/NichePage.tsx` — Reusable niche page template
- `src/components/CTABanner.tsx` — Reusable CTA section
- `src/components/SectionWrapper.tsx` — Consistent section padding
- `src/app/blog/[slug]/page.tsx` — MDX blog renderer (schema, TOC, MDX components)
- `src/app/sitemap.ts` — Static sitemap (update when adding pages)
- `src/app/api/inbound-email/route.ts` — Zoho → CRM + Telegram ping (shows new reply text only)
- `src/components/pl/*`, `src/app/pl/*`, `src/content/pl/*` — Polish site (`/pl`)
- `src/components/mdx/StatRow.tsx`, `Charts.tsx` (BigStat, Heatmap) — article stat blocks
- `public/images/founder.png` — Nataliia's photo (AI-enhanced headshot)

## 📝 Blog
- ~2,700 MDX posts in `content/blog` (~1,200 indexable; the rest `noindex: true`), Polish posts in `content/blog-pl`. List: `/blog`, sitemap: `src/app/sitemap.ts`.
- Quality rules and validation live in the skills `datalatte-article` / `datalatte-research-article` and `scripts/audit/check-article.mjs <slug> --date YYYY-MM-DD` (title ≤55, description 120–155, Sources, FAQ, StatRow, sourced facts only, no first person, no links to noindex posts).
- Every article should have a sourced `<StatRow>` (4 cards; cards labelled as examples show an "Assumption" badge) and, where a sourced number exists, a `<BigStat>` before the 2nd H2. Never use an assumption as BigStat.
- Change log: `docs/CHANGELOG-content.md`.

## 🚀 Growth Strategy
**Current phase**: Rapidly scaling content to build topical authority.

### Content Plan
- **Target**: 200+ articles over 90 days
- **Structure**: Pillar pages (existing /for/ pages) + cluster articles feeding each pillar
- **Priority content types**:
  - How-to guides for each niche × service combo
  - Budget/cost guides ("How much should a coffee shop spend on Google Ads?")
  - Comparison content ("Best marketing tools for pet groomers")
  - Local intent ("Google Business Profile for salons in NYC")

### Programmatic SEO (planned)
- Location × niche × service pages: `/for/coffee-shops/austin-tx`
- Target: ~50 cities × 4 niches = 200 location pages

### Technical SEO
- Done: sitemap, robots.ts (AI crawlers allowed), `llms.txt` route + `llms-full.txt`, hreflang EN/PL, schema (Article + Breadcrumb + FAQPage on blog via `src/lib/schema.ts`, Organization/Person/Service/WebSite elsewhere). FAQPage is generated only if the article has an `## FAQ` section (`**Question?**` or `### Question` format); ~55 older posts still have none.
- Open: internal linking architecture (blog → service → contact); GSC re-check of rewritten articles ~2 weeks after each deploy.

### Quick wins (planned)
- Free resource (e.g. "Local Marketing Budget Calculator" or "GBP Checklist PDF") for email capture + backlinks

## 🔧 Development Notes
- **Always commit & push directly to `main`** — no feature branches. The repo deploys on every push to `main` and Nataliia works solo, so PRs add friction with no review benefit. If a Claude Code session opens on a `claude/*` branch, merge into `main` (fast-forward) and push to `main`.
- **Vercel deploy trigger**: The Ignored Build Step is inverted — commits **with** `[vercel skip]` in the message **trigger** a build; commits **without** it are skipped. Always include `[vercel skip]` in commit messages that should deploy to production.
- Always run `npm run build` before deploying to catch TypeScript errors
- Blog posts are MDX files in `content/blog/<slug>.mdx` (frontmatter + body); `src/app/blog/[slug]/page.tsx` renders them with custom MDX components. Sitemap is generated from the content folder.
- Next.js `fill` prop doesn't clip with `rounded-full` — always use explicit `width`/`height` for circular images
- Page titles: use `title: { absolute: "..." }` only for home page; all others just use a plain string (template appends "| DataLatte" automatically)

## 🔒 Frozen paid placements (never modify)
The text supplied by partners under a paid agreement ("по ТЗ") must stay **byte-for-byte identical** in the article, in the same place, with the same label (or none, as published). Do not edit, reword, shorten, translate, reformat, move, merge, delete, or add links/attributes/figures to these blocks. This holds for every rewrite, title tune, link clean-up, FAQ or StatRow pass, and every agent.
- The exact protected texts are in `data/protected-placements.json` (Spotify Advertising section, three Vibe blocks, the Flodesk bullet). Check: `node scripts/check-protected-placements.mjs` (exit 1 if any block changed); `scripts/audit/check-article.mjs` also fails with "PROTECTED PLACEMENT altered or missing".
- The rest of a host article may be improved, but the placement must be kept as is. Do not add the partner's name in new places (cards, BigStat, FAQ, sources) without Nataliia's approval.
- A new paid placement is added to `data/protected-placements.json` right after it is published, and logged in `partner_deals`.
- Run the check before every push that touches `content/blog/`.

## 💰 Partnerships & paid placements
- Deals/invoices are tracked in Supabase table `partner_deals` (project `olsxxfwvwsycwzihbmdn`): contacts, brief link, articles, amount, invoice link/status, timeline, next step. Update it on every offer, reply, invoice and payment.
- Never send outreach/replies without Nataliia's explicit approval of text and recipients. Never delete data (mark skipped).
- Deploy rule: push to `main` only when Nataliia says so; if she says "don't push", keep commits local.

## 💡 Claude's Role on This Project
You are a proactive developer and growth partner who always thinks several steps ahead. Goals:
1. Turn DataLatte.pro into a high-traffic, authoritative website ranking #1 for local marketing searches
2. Generate consistent high-quality leads for Nataliia's freelance services
3. Suggest improvements proactively: SEO, content, UX, CRO, automation
4. Deliver structured, ready-to-use output — never vague advice
5. Always offer the next logical step after completing a task
