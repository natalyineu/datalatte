# DataLatte Site Inventory
> Last updated: 2026-07-22

Complete map of all pages, routes, and content. Update when adding new sections.

## Root Pages
| Route | File |
|---|---|
| `/` | src/app/page.tsx |
| `/about` | src/app/about/page.tsx |
| `/contact` | src/app/contact/page.tsx |
| `/pricing` | src/app/pricing/page.tsx |
| `/privacy` | src/app/privacy/page.tsx |
| `/terms` | src/app/terms/page.tsx |
| `/free-audit` | src/app/free-audit/page.tsx |
| `/results` | src/app/results/page.tsx |
| `/resources` | src/app/resources/page.tsx |
| `/reporting` | src/app/reporting/page.tsx |
| `/case-studies` | src/app/case-studies/page.tsx |

## Blog
| Route | Notes |
|---|---|
| `/blog` | Index page |
| `/blog/[slug]` | ~2,705 MDX posts in /content/blog/ |
| `/blog/category/[category]` | Category hub pages |
| `/blog/local-marketing-guides` | Country guides hub (150+ countries) |

## Services
| Route |
|---|
| `/services` |
| `/services/ai-agents` |
| `/services/ai-agents/booking` |
| `/services/ai-agents/lead-capture` |
| `/services/ai-agents/phone-answering` |
| `/services/ai-agents/review-management` |
| `/services/ai-agents/social-media` |
| `/services/analytics` |
| `/services/competitor-analysis` |
| `/services/content-marketing` |
| `/services/cro` |
| `/services/ctv-advertising` |
| `/services/email-sms` |
| `/services/google-ads` |
| `/services/google-business-profile` |
| `/services/local-seo` |
| `/services/meta-ads` |
| `/services/programmatic` |
| `/services/reputation-management` |
| `/services/social-media` |
| `/services/tiktok-ads` |
| `/services/video-marketing` |
| `/services/website` |

## Niche / For Pages
| Route | Sub-pages |
|---|---|
| `/for/barbershops` | — |
| `/for/cleaning-services` | — |
| `/for/coffee-shops` | `/ai-agents` |
| `/for/dentists` | — |
| `/for/electricians` | — |
| `/for/enterprise` | — |
| `/for/fitness-studios` | `/ai-agents` |
| `/for/freelancers` | — |
| `/for/hair-salons` | `/ai-agents` |
| `/for/medium-business` | — |
| `/for/multi-location` | — |
| `/for/nail-salons` | — |
| `/for/pet-groomers` | `/ai-agents` |
| `/for/plumbers` | — |
| `/for/real-estate-agents` | — |
| `/for/restaurants` | — |
| `/for/startups` | — |
| `/for/yoga-studios` | — |

## City Pages — 260 Total
Dynamic route: `/for/[niche]/[segment]` — reads from `src/lib/locationData.ts`

**4 niches:** coffee-shops, hair-salons, pet-groomers, fitness-studios  
**65 cities per niche = 260 pages**

### US Cities (50)
austin-tx, new-york-ny, los-angeles-ca, chicago-il, houston-tx, phoenix-az, philadelphia-pa, san-antonio-tx, san-diego-ca, dallas-tx, san-jose-ca, jacksonville-fl, fort-worth-tx, columbus-oh, san-francisco-ca, charlotte-nc, indianapolis-in, seattle-wa, denver-co, nashville-tn, oklahoma-city-ok, el-paso-tx, las-vegas-nv, louisville-ky, baltimore-md, milwaukee-wi, albuquerque-nm, tucson-az, sacramento-ca, kansas-city-mo, atlanta-ga, omaha-ne, colorado-springs-co, raleigh-nc, minneapolis-mn, tampa-fl, new-orleans-la, portland-or, miami-fl, orlando-fl, salt-lake-city-ut, richmond-va, pittsburgh-pa, cincinnati-oh, st-louis-mo, cleveland-oh, boise-id, chattanooga-tn, spokane-wa, anchorage-ak

### UK Cities (5)
london-england, manchester-england, birmingham-england, edinburgh-scotland, bristol-england

### Canada (5)
toronto-on, vancouver-bc, calgary-ab, montreal-qc, ottawa-on

### Australia (5)
sydney-nsw, melbourne-vic, brisbane-qld, perth-wa, adelaide-sa

## Tools
| Route |
|---|
| `/tools/ai-agent-builder` |
| `/tools/local-seo-grader` |
| `/tools/marketing-budget-calculator` |

## Compare
| Route |
|---|
| `/compare/ai-agents-platforms` |
| `/compare/freelance-vs-agency` |

## Radar (Weekly Insights)
| Route |
|---|
| `/radar` |
| `/radar/[slug]` |
| `/radar/feed.xml` |

## Checklists
| Route |
|---|
| `/checklists` |
| `/checklists/[slug]` |

## System / API
| Route | Notes |
|---|---|
| `/api/chat` | AI chat widget |
| `/api/contact` | Contact form → Supabase + Resend |
| `/api/cron/generate` | Content generation cron |
| `/api/subscribe` | Email subscribe |
| `/feed.xml` | RSS feed |
| `/llms.txt` | Dynamic AI-readable index |
| `/sitemap` | Dynamic sitemap |
| `/robots` | Dynamic robots.txt |

## Static Public Files
- `/public/llms-full.txt` — static full LLM index
- `/public/YOUR_INDEXNOW_KEY.txt` — IndexNow key
- `/public/.well-known/mcp.json` — MCP manifest
- `/public/blog/clusters/` — 55+ cluster cover images

## Key Scripts in /scripts/
| Script | Purpose |
|---|---|
| `generate-city-articles.mjs` | City × niche blog posts |
| `generate-ctv-city-articles.mjs` | CTV city articles |
| `generate-dooh-city-articles.mjs` | DOOH city articles |
| `generate-local-seo-city-articles.mjs` | Local SEO city articles |
| `generate-meta-ads-city-articles.mjs` | Meta Ads city articles |
| `generate-geo-articles.mjs` | Country-level articles |
| `fix-internal-links.mjs` | Internal link injection |
| `submit-indexnow.mjs` | IndexNow ping |
| `expand-thin-articles.mjs` | Expand short posts |
| `fetch-analytics.js` | GA4 + GSC data pull |
| `gsc_ga_report.py` | Full analytics report |
| `collect-leads.mjs` | Lead collection |
| `send-cold-emails.mjs` | Cold email outreach |
| `broadcast-leads.mjs` | Resend broadcast |

## Gaps (as of 2026-07-22)
- ❌ No `/guides/` section
- ❌ No CTV content hub (only `/services/ctv-advertising` service page)
- ❌ No Article + Author JSON-LD schema on blog posts
- ❌ No FAQ schema (intentionally — Google restricts to gov/healthcare)
