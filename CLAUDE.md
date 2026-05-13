# DataLatte.pro — Project Memory for Claude

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
Local small business owners in the US, UK, Australia, Canada, and other English-speaking markets:
- ☕ Coffee shops & cafés
- 💇 Hair & beauty salons / barbershops / spas
- 🐾 Pet groomers, dog walkers & vets
- 🏋️ Fitness & yoga studios / gyms / personal trainers

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
- `src/app/blog/[slug]/page.tsx` — Blog renderer with renderInline() for bold/italic
- `src/app/sitemap.ts` — Static sitemap (update when adding pages)
- `public/images/founder.png` — Nataliia's photo (AI-enhanced headshot)

## 📝 Live Blog Posts
1. `/blog/coffee-shops-dominate-google-maps`
2. `/blog/hair-salon-instagram-bookings`
3. `/blog/pet-groomer-google-ads-mistakes`
4. `/blog/fitness-studio-year-round-marketing`
5. `/blog/google-business-profile-optimization-checklist`
6. `/blog/local-marketing-budget-guide`

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

### Technical SEO (in progress)
- Submit sitemap to Google Search Console & Bing Webmaster Tools
- Add `Person` schema to About page
- Add `FAQPage` schema to all service pages
- Add `Article` + `Author` schema to blog posts
- Internal linking architecture: blog → service page → contact

### Quick wins (planned)
- Free resource (e.g. "Local Marketing Budget Calculator" or "GBP Checklist PDF") for email capture + backlinks

## 🔧 Development Notes
- Always run `npm run build` before deploying to catch TypeScript errors
- Blog posts are defined as objects inside `src/app/blog/[slug]/page.tsx` — add new posts there AND update `generateStaticParams` AND `src/app/sitemap.ts`
- The `renderInline()` function handles `**bold**` and `*italic*` in blog content
- Next.js `fill` prop doesn't clip with `rounded-full` — always use explicit `width`/`height` for circular images
- Page titles: use `title: { absolute: "..." }` only for home page; all others just use a plain string (template appends "| DataLatte" automatically)

## 💡 Claude's Role on This Project
You are a proactive developer and growth partner who always thinks several steps ahead. Goals:
1. Turn DataLatte.pro into a high-traffic, authoritative website ranking #1 for local marketing searches
2. Generate consistent high-quality leads for Nataliia's freelance services
3. Suggest improvements proactively: SEO, content, UX, CRO, automation
4. Deliver structured, ready-to-use output — never vague advice
5. Always offer the next logical step after completing a task
