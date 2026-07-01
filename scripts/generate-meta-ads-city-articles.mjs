#!/usr/bin/env node
/**
 * generate-meta-ads-city-articles.mjs
 * Generates "Meta Ads for [Niche] in [City]" articles — 4 niches × 51 cities = 204 articles
 * Usage: node scripts/generate-meta-ads-city-articles.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, '../content/blog');
const DRY_RUN = process.argv.includes('--dry-run');
let written = 0, skipped = 0;

function emit(slug, content) {
  const out = path.join(CONTENT, `${slug}.mdx`);
  if (fs.existsSync(out)) { skipped++; return; }
  if (DRY_RUN) { console.log(`[dry] ${slug}`); written++; return; }
  fs.writeFileSync(out, content, 'utf8');
  console.log(`[ok]  ${slug}`);
  written++;
}

// ── City data ──────────────────────────────────────────────────────────────
const CITIES = [
  { name: 'Albuquerque', state: 'NM', slug: 'albuquerque-nm', cpm: '$9–$14', tier: 'medium', pop: '565K', demo: 'diverse Hispanic-majority market with strong local loyalty' },
  { name: 'Anaheim', state: 'CA', slug: 'anaheim-ca', cpm: '$14–$22', tier: 'high', pop: '350K', demo: 'tourism-heavy market with high out-of-state visitor traffic' },
  { name: 'Anchorage', state: 'AK', slug: 'anchorage-ak', cpm: '$8–$13', tier: 'low', pop: '290K', demo: 'isolated market with loyal local customer base and little national competition' },
  { name: 'Atlanta', state: 'GA', slug: 'atlanta-ga', cpm: '$13–$20', tier: 'high', pop: '500K city / 6.1M metro', demo: 'fast-growing metro with high social media engagement and diverse demographics' },
  { name: 'Austin', state: 'TX', slug: 'austin-tx', cpm: '$15–$23', tier: 'high', pop: '1M city / 2.4M metro', demo: 'tech-savvy, high-income audience with strong appetite for premium local brands' },
  { name: 'Baltimore', state: 'MD', slug: 'baltimore-md', cpm: '$12–$18', tier: 'medium', pop: '580K city / 2.9M metro', demo: 'working-class core with affluent suburban ring; strong neighborhood identity' },
  { name: 'Boston', state: 'MA', slug: 'boston-ma', cpm: '$16–$25', tier: 'high', pop: '680K city / 4.9M metro', demo: 'highly educated, younger demographic; strong Instagram and social media usage' },
  { name: 'Charlotte', state: 'NC', slug: 'charlotte-nc', cpm: '$11–$17', tier: 'medium', pop: '900K city / 2.8M metro', demo: 'fastest-growing major city in the Southeast; young professional influx' },
  { name: 'Chicago', state: 'IL', slug: 'chicago-il', cpm: '$15–$23', tier: 'high', pop: '2.7M city / 9.5M metro', demo: 'large diverse metro with strong neighborhood-level targeting opportunities' },
  { name: 'Cleveland', state: 'OH', slug: 'cleveland-oh', cpm: '$9–$14', tier: 'medium', pop: '370K city / 2M metro', demo: 'value-conscious market; strong local loyalty when trust is established' },
  { name: 'Colorado Springs', state: 'CO', slug: 'colorado-springs-co', cpm: '$10–$16', tier: 'medium', pop: '480K', demo: 'military and outdoor-lifestyle audience; family-oriented demographics' },
  { name: 'Columbus', state: 'OH', slug: 'columbus-oh', cpm: '$10–$16', tier: 'medium', pop: '900K city / 2.1M metro', demo: 'large college population; younger demographic with high social media usage' },
  { name: 'Dallas', state: 'TX', slug: 'dallas-tx', cpm: '$13–$20', tier: 'high', pop: '1.3M city / 7.8M metro', demo: 'business-friendly metro with affluent suburban rings (Plano, Frisco, Southlake)' },
  { name: 'Denver', state: 'CO', slug: 'denver-co', cpm: '$13–$20', tier: 'high', pop: '750K city / 2.9M metro', demo: 'young, health-conscious, high-income; strong Instagram engagement' },
  { name: 'El Paso', state: 'TX', slug: 'el-paso-tx', cpm: '$7–$12', tier: 'low', pop: '680K', demo: 'bilingual border market; Spanish-language ad copy often outperforms English-only' },
  { name: 'Fort Worth', state: 'TX', slug: 'fort-worth-tx', cpm: '$11–$17', tier: 'medium', pop: '920K city / 7.8M DFW metro', demo: 'family-oriented with strong local pride; more suburban than Dallas proper' },
  { name: 'Fresno', state: 'CA', slug: 'fresno-ca', cpm: '$9–$14', tier: 'medium', pop: '540K', demo: 'Central Valley agricultural hub; value-conscious, diverse demographics' },
  { name: 'Honolulu', state: 'HI', slug: 'honolulu-hi', cpm: '$12–$19', tier: 'medium', pop: '350K city / 1M Oahu', demo: 'tourism-heavy; locals respond well to community-focused messaging vs. tourist-facing ads' },
  { name: 'Houston', state: 'TX', slug: 'houston-tx', cpm: '$12–$19', tier: 'high', pop: '2.3M city / 7.3M metro', demo: 'most diverse large US city; multilingual audiences; oil & energy professional segment' },
  { name: 'Indianapolis', state: 'IN', slug: 'indianapolis-in', cpm: '$9–$15', tier: 'medium', pop: '880K city / 2.1M metro', demo: 'Midwest family values; events-driven market (Indy 500, large conventions)' },
  { name: 'Jacksonville', state: 'FL', slug: 'jacksonville-fl', cpm: '$10–$16', tier: 'medium', pop: '950K city / 1.6M metro', demo: 'military presence (NAS Jacksonville); growing remote-worker population' },
  { name: 'Kansas City', state: 'MO', slug: 'kansas-city-mo', cpm: '$9–$14', tier: 'medium', pop: '500K city / 2.2M metro', demo: 'Midwest stronghold; food and sports culture drive local engagement' },
  { name: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv', cpm: '$13–$20', tier: 'high', pop: '650K city / 2.3M metro', demo: 'high transient population; local businesses must target residents vs. tourists specifically' },
  { name: 'Lexington', state: 'KY', slug: 'lexington-ky', cpm: '$8–$13', tier: 'low', pop: '320K', demo: 'college town (UK) + horse racing culture; approachable, community-first messaging wins' },
  { name: 'Long Beach', state: 'CA', slug: 'long-beach-ca', cpm: '$14–$22', tier: 'high', pop: '460K', demo: 'port city with diverse working-class and arts community; distinct from LA identity' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca', cpm: '$18–$28', tier: 'high', pop: '3.9M city / 13M metro', demo: 'most competitive US market; neighbourhood-level targeting essential to avoid wasted spend' },
  { name: 'Louisville', state: 'KY', slug: 'louisville-ky', cpm: '$9–$14', tier: 'medium', pop: '620K metro', demo: 'bourbon culture and horse racing; strong local pride; sports-connected audience' },
  { name: 'Memphis', state: 'TN', slug: 'memphis-tn', cpm: '$8–$13', tier: 'low', pop: '630K city / 1.3M metro', demo: 'value-driven market; music and food heritage creates strong local identity hooks' },
  { name: 'Mesa', state: 'AZ', slug: 'mesa-az', cpm: '$10–$16', tier: 'medium', pop: '510K', demo: 'largest suburb in the US; family-oriented; retirement community segment' },
  { name: 'Miami', state: 'FL', slug: 'miami-fl', cpm: '$15–$24', tier: 'high', pop: '460K city / 6.2M metro', demo: 'bilingual (English/Spanish); high social media engagement; luxury and lifestyle positioning' },
  { name: 'Milwaukee', state: 'WI', slug: 'milwaukee-wi', cpm: '$9–$14', tier: 'medium', pop: '580K city / 1.6M metro', demo: 'working-class Midwest; beer and sports culture; budget-conscious consumer base' },
  { name: 'Minneapolis', state: 'MN', slug: 'minneapolis-mn', cpm: '$12–$18', tier: 'high', pop: '430K city / 3.6M metro', demo: 'high education levels; sustainability-conscious; above-average social media spend' },
  { name: 'Nashville', state: 'TN', slug: 'nashville-tn', cpm: '$12–$19', tier: 'high', pop: '690K city / 2.1M metro', demo: 'rapidly growing; music/tourism overlay; bachelorette-party economy creates seasonal demand' },
  { name: 'New Orleans', state: 'LA', slug: 'new-orleans-la', cpm: '$10–$16', tier: 'medium', pop: '380K city / 1.3M metro', demo: 'tourism-heavy; locals identify strongly with neighbourhoods; Mardi Gras seasonality' },
  { name: 'New York City', state: 'NY', slug: 'new-york-city-ny', cpm: '$20–$35', tier: 'high', pop: '8.3M city / 20M metro', demo: 'highest-CPM market in the US; borough-level targeting essential; multilingual audiences' },
  { name: 'Oklahoma City', state: 'OK', slug: 'oklahoma-city-ok', cpm: '$8–$13', tier: 'low', pop: '680K city / 1.4M metro', demo: 'oil-economy market; family-oriented; lower competition than coastal cities' },
  { name: 'Omaha', state: 'NE', slug: 'omaha-ne', cpm: '$8–$12', tier: 'low', pop: '490K city / 950K metro', demo: 'Midwest family market; Warren Buffett hometown; business and finance culture underpins local economy' },
  { name: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa', cpm: '$13–$20', tier: 'high', pop: '1.6M city / 6.2M metro', demo: 'strong neighbourhood identity (South Philly, Fishtown); proud local consumer base' },
  { name: 'Phoenix', state: 'AZ', slug: 'phoenix-az', cpm: '$11–$17', tier: 'medium', pop: '1.6M city / 5M metro', demo: 'fastest-growing major US city; sun-belt retiree + young professional mix; seasonal patterns' },
  { name: 'Pittsburgh', state: 'PA', slug: 'pittsburgh-pa', cpm: '$10–$16', tier: 'medium', pop: '300K city / 2.4M metro', demo: 'steel-city pride; strong neighbourhood loyalty; college population from CMU and Pitt' },
  { name: 'Portland', state: 'OR', slug: 'portland-or', cpm: '$13–$20', tier: 'high', pop: '650K city / 2.5M metro', demo: 'eco-conscious, independent-business-supporting audience; anti-chain sentiment drives local preference' },
  { name: 'Raleigh', state: 'NC', slug: 'raleigh-nc', cpm: '$11–$17', tier: 'medium', pop: '470K city / 1.4M metro', demo: 'Research Triangle professionals; high education; tech industry growth influx' },
  { name: 'Sacramento', state: 'CA', slug: 'sacramento-ca', cpm: '$12–$18', tier: 'medium', pop: '520K city / 2.4M metro', demo: 'government and agriculture economy; progressive urban core; farm-to-table identity' },
  { name: 'San Antonio', state: 'TX', slug: 'san-antonio-tx', cpm: '$10–$16', tier: 'medium', pop: '1.4M city / 2.6M metro', demo: 'military-heavy (Fort Sam Houston, Lackland AFB); Hispanic majority; tourism from Riverwalk' },
  { name: 'San Diego', state: 'CA', slug: 'san-diego-ca', cpm: '$15–$23', tier: 'high', pop: '1.4M city / 3.3M metro', demo: 'military + biotech + tourism mix; outdoor-lifestyle audience; beach culture' },
  { name: 'San Francisco', state: 'CA', slug: 'san-francisco-ca', cpm: '$20–$32', tier: 'high', pop: '870K city / 4.7M Bay Area', demo: 'highest household income in the US; tech industry dominates; premium positioning justifiable' },
  { name: 'Seattle', state: 'WA', slug: 'seattle-wa', cpm: '$16–$25', tier: 'high', pop: '730K city / 4M metro', demo: 'Amazon/Boeing economy; high disposable income; progressive and sustainability-focused' },
  { name: 'St. Louis', state: 'MO', slug: 'st-louis-mo', cpm: '$9–$14', tier: 'medium', pop: '300K city / 2.8M metro', demo: 'strong neighbourhood loyalty; Cardinals/Blues sports culture drives social engagement' },
  { name: 'Tampa', state: 'FL', slug: 'tampa-fl', cpm: '$11–$17', tier: 'medium', pop: '400K city / 3.2M metro', demo: 'growing remote-worker influx from Northeast; retiree + young professional mix' },
  { name: 'Tucson', state: 'AZ', slug: 'tucson-az', cpm: '$8–$13', tier: 'low', pop: '550K city / 1M metro', demo: 'University of Arizona town; value-oriented; outdoor recreation lifestyle' },
  { name: 'Virginia Beach', state: 'VA', slug: 'virginia-beach-va', cpm: '$10–$16', tier: 'medium', pop: '460K', demo: 'military base (NAS Oceana, Joint Expeditionary Base); beach tourism + suburban family base' },
];

// ── Niche data ─────────────────────────────────────────────────────────────
const NICHES = [
  {
    key: 'coffee-shops',
    label: 'Coffee Shops',
    plural: 'coffee shops',
    audience: 'coffee drinkers aged 22–45 within 3 miles of your café',
    ctr: '2–4%',
    avgTicket: '$6–$14',
    bestFormats: 'Story ads (drive morning impulse), Carousel (show menu items), Reels (atmosphere)',
    topObjectives: 'Traffic (drive-to-location), Reach (brand awareness within 3km), Conversions (order online)',
    seasonality: 'Back-to-school (Aug–Sep) and holiday season (Nov–Dec) show 30–40% higher engagement for coffee brands.',
    keywords: [
      { kw: 'Coffee near me', intent: 'Very High' },
      { kw: 'Best café [city]', intent: 'High' },
      { kw: 'Specialty coffee [city]', intent: 'Medium' },
      { kw: 'Coffee shop open now', intent: 'High' },
      { kw: 'Latte art [city]', intent: 'Low-Medium' },
    ],
    hooks: [
      '"Your morning just got better. ☕ Freshly roasted, 2 blocks from you."',
      '"Skip the chain. [City]\'s best independent coffee is [0.3 miles / your area]."',
      '"New to [city]? Locals here start their day at [Shop Name]."',
    ],
    mistakes: [
      'Targeting by interest "coffee" nationally instead of radius around your location',
      'Running ads 24/7 instead of during morning rush (6–10am) and afternoon slump (2–4pm)',
      'Using stock imagery instead of genuine shots of your actual space and baristas',
    ],
    cta: 'Want help setting up Meta Ads for your [city] coffee shop? [Book a free 30-minute consultation](/free-audit) — I\'ll audit your current setup and show you what\'s wasting budget.',
  },
  {
    key: 'hair-salons',
    label: 'Hair Salons',
    plural: 'hair salons and barbershops',
    audience: 'women 25–55 and men 20–45 within 5 miles seeking hair services',
    ctr: '2.5–5%',
    avgTicket: '$45–$180',
    bestFormats: 'Before/after Reels (highest engagement), Stories with booking CTA, Carousel (service menu)',
    topObjectives: 'Lead Generation (booking form), Traffic (book appointment), Conversions (online booking)',
    seasonality: 'Prom season (Apr–May), holiday parties (Nov–Dec), and Valentine\'s Day create natural demand spikes.',
    keywords: [
      { kw: 'Hair salon near me', intent: 'Very High' },
      { kw: 'Hair cut [city]', intent: 'High' },
      { kw: 'Balayage near me', intent: 'High' },
      { kw: 'Keratin treatment [city]', intent: 'Medium' },
      { kw: 'Best hair salon [city]', intent: 'High' },
    ],
    hooks: [
      '"New colour, new you. Book your balayage in [city] this week."',
      '"[City]\'s most-reviewed salon just opened new appointment slots."',
      '"Finally — a cut that actually lasts. See why [city] clients keep coming back."',
    ],
    mistakes: [
      'Not using Lead Gen ads with a pre-filled booking form (reduces friction dramatically)',
      'Targeting all women without filtering by income or interest in beauty/wellness',
      'Running the same ad creative for 3+ months without refreshing (creative fatigue kills CTR)',
    ],
    cta: 'Ready to fill your appointment book in [city]? [Book a free audit](/free-audit) and I\'ll show you exactly which Meta Ads setup gets new clients through the door fastest.',
  },
  {
    key: 'pet-groomers',
    label: 'Pet Groomers',
    plural: 'pet groomers and pet care businesses',
    audience: 'dog and cat owners aged 25–55 within 8 miles',
    ctr: '3–5%',
    avgTicket: '$55–$120',
    bestFormats: 'Video/Reels of happy dogs post-groom (massive organic engagement), Photo ads showing before/after',
    topObjectives: 'Lead Generation (first grooming appointment), Traffic (website booking), Retargeting (past clients)',
    seasonality: 'Spring shedding season (Mar–May) and holiday season (Nov–Dec for holiday grooming specials) are peak periods.',
    keywords: [
      { kw: 'Dog groomer near me', intent: 'Very High' },
      { kw: 'Pet grooming [city]', intent: 'High' },
      { kw: 'Mobile dog grooming [city]', intent: 'High' },
      { kw: 'Cat grooming near me', intent: 'Medium' },
      { kw: 'Dog grooming prices [city]', intent: 'High' },
    ],
    hooks: [
      '"Your pup deserves to look (and smell) amazing. 🐾 Book their groom in [city] today."',
      '"Freshly groomed dogs and happy owners — that\'s what [city] pet parents say about us."',
      '"Spring is here and so is shedding season. Book your [city] grooming appointment now."',
    ],
    mistakes: [
      'Not using pet owner audience targeting (Facebook has a "Pet Owner" detailed targeting option)',
      'Forgetting to target dog/cat owners specifically instead of all animal lovers',
      'Missing retargeting campaigns for past customers (grooming is a repeat-purchase service)',
    ],
    cta: 'Want a full Meta Ads strategy for your [city] grooming business? [Book a free consultation](/free-audit) — I work with pet groomers specifically and know what converts in this niche.',
  },
  {
    key: 'fitness-studios',
    label: 'Fitness Studios',
    plural: 'fitness studios and gyms',
    audience: 'health-conscious adults 22–50 within 5 miles interested in fitness/wellness',
    ctr: '2–4%',
    avgTicket: '$30–$150 per month',
    bestFormats: 'Reels/Video (transformation stories, class energy), Lead Gen (trial membership offer), Stories (class schedule)',
    topObjectives: 'Lead Generation (free trial or first class), Conversions (membership sign-up), Awareness (new location launch)',
    seasonality: 'New Year (Jan) is the #1 month for fitness ads; Back-to-school (Sep) and summer prep (Apr–May) follow.',
    keywords: [
      { kw: 'Gym near me', intent: 'Very High' },
      { kw: 'Yoga studio [city]', intent: 'High' },
      { kw: 'Personal trainer [city]', intent: 'High' },
      { kw: 'HIIT classes [city]', intent: 'Medium' },
      { kw: 'Pilates near me', intent: 'High' },
    ],
    hooks: [
      '"Your first class is free. No commitment. Just show up. 💪"',
      '"[City] people who joined [Studio] in January saw [X] results by March."',
      '"Stop searching for a gym near [city]. We\'re [X] minutes from you."',
    ],
    mistakes: [
      'Running membership ads without a free trial offer (too high a commitment for cold traffic)',
      'Targeting "fitness" interest broadly instead of narrowing to your specific modality',
      'Not running a January campaign with at least 6-week lead time (competition spikes dramatically)',
    ],
    cta: 'Want a Meta Ads strategy that fills your [city] fitness studio with real, long-term members? [Book a free audit](/free-audit) — I\'ve built ad systems specifically for studios and gyms.',
  },
];

// ── Article template ────────────────────────────────────────────────────────
function article(city, niche) {
  const { name, state, slug: citySlug, cpm, pop, demo } = city;
  const { key, label, plural, audience, ctr, avgTicket, bestFormats, topObjectives, seasonality, keywords, hooks, mistakes, cta } = niche;
  const fullCity = `${name}, ${state}`;
  const slug = `meta-ads-for-${key}-in-${citySlug}`;
  const date = '2026-07-01';

  const kwRows = keywords.map(({ kw, intent }) => `| ${kw} | ${intent} |`).join('\n');
  const hookLines = hooks.map((h, i) => `**Hook ${i + 1}:** ${h}`).join('\n\n');
  const mistakeLines = mistakes.map((m, i) => `**${i + 1}. ${m}**`).join('\n\n');

  return `---
title: "Meta Ads for ${label} in ${fullCity}: 2026 Facebook & Instagram Guide"
date: "${date}"
lastModified: "${date}"
description: "How ${plural} in ${fullCity} can use Facebook and Instagram ads to get more clients in 2026. CPM benchmarks ($${cpm.replace('$', '')}), best ad formats, and targeting strategies for the ${name} market."
author: "Nataliia"
category: "Meta Ads"
tags: ["meta ads ${key}", "facebook ads ${name.toLowerCase()}", "${key} marketing ${name.toLowerCase()}", "instagram ads ${state.toLowerCase()}"]
slug: "${slug}"
image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&auto=format&fit=crop"
readTime: "7 min read"
---

Meta Ads (Facebook and Instagram) are the highest-ROI paid channel for most ${plural} in ${fullCity} — if they're set up correctly. The problem is that most small businesses in ${name} run Meta ads the wrong way: wrong audience, wrong placement, wrong offer. This guide covers what actually works for ${plural} in the ${name} market in 2026.

<StatRow
  values="${cpm}|${ctr}|${avgTicket}|${pop}"
  labels="Typical CPM in ${name}|Average CTR for ${label}|Average client ticket|${name} population"
  subs="${name} Meta Ads benchmark|Well-optimised campaigns|Per visit or booking|Market size context"
  trends="neutral|neutral|neutral|neutral"
/>

## Why ${name} Is a Different Meta Ads Market

${fullCity} is ${demo}. This shapes everything about how you should run Meta Ads here — from the imagery and copy tone to the time-of-day targeting and bid strategy.

The CPM in ${name} runs **${cpm}** — meaning for every 1,000 times your ad appears, you're paying in that range. ${tier_context(city.tier, name)} This has direct implications for your budget planning.

Your target audience for ${plural} in ${name}: **${audience}**.

## Best Ad Formats for ${label} in ${name}

${bestFormats}.

The format that consistently outperforms for ${plural} is video/Reels — specifically authentic, unpolished footage of your actual business. Stock photos underperform by 40–60% compared to genuine content from local ${plural} in comparable markets.

**Recommended campaign objective sequence:**
${topObjectives}.

## Targeting Strategy for ${name}

### Demographic Targeting
- **Age range:** Varies by service, but ${audience.split('within')[0].trim()} is your core.
- **Location:** Set radius to 3–8 miles around your ${name} location. In dense urban areas, tighten to 2–3 miles.
- **Placement:** Prioritise Instagram Reels and Facebook Feed. Avoid Audience Network for local service businesses.

### Detailed Targeting That Works
Facebook's detailed targeting options for your niche in ${name}:
- Behaviours: "Engaged shoppers" within your local radius
- Demographics: Income targeting if available (useful in ${name}'s market context)
- Life events: "New mover to area" (reaches people actively building new local routines — high-value for recurring services)
- Custom audiences: Your past customers (re-engage for repeat purchases)

### Lookalike Audiences
Once you have 100+ past customers in your CRM or Facebook Pixel data, build a 1–2% lookalike audience from your ${name} customer list. This consistently outperforms interest-based targeting for established businesses.

## Top Keywords (Paid Search Intent Mapping for Your Meta Ads Copy)

Use these search intent signals to inform your ad creative — they tell you what your ${name} audience is thinking when they need a ${label.toLowerCase().replace(/s$/, '')}:

| Search Keyword | Buyer Intent |
|---|---|
${kwRows}

## Ad Copy That Works in ${name}

The ${name} market responds to messaging that feels local and specific — not generic national brand language. Here are three proven hook structures for ${plural} in your market:

${hookLines}

**Call-to-action copy:** "Book Now" consistently outperforms "Learn More" for local service businesses. For first-time customer offers, "Claim Your Free [Trial/Consultation/Session]" works even better.

## Budget Planning for ${name}

With CPMs of ${cpm} in ${name}, here's what different budgets realistically deliver:

| Monthly Budget | Estimated Impressions | Estimated Clicks | Estimated New Clients |
|---|---|---|---|
| $300/mo | 15,000–25,000 | 300–750 | 2–5 |
| $600/mo | 30,000–50,000 | 600–1,500 | 4–10 |
| $1,200/mo | 60,000–100,000 | 1,200–3,000 | 8–20 |
| $2,500/mo | 120,000–200,000 | 2,500–6,000 | 15–40 |

*Estimates based on ${ctr} CTR and 1.5–2.5% conversion rate from click to booking, typical for well-optimised ${label.toLowerCase()} campaigns.*

## Seasonality in ${name}

${seasonality}

Plan your Meta Ads budget to surge 50–100% in the 2 weeks before these peak periods — don't start your campaign on the day the peak hits.

## Common Meta Ads Mistakes for ${label} in ${name}

${mistakeLines}

## Tracking and Measurement

Before running any Meta Ads in ${name}, verify that:
1. **Meta Pixel is installed** on your website and firing on key pages (booking confirmation, contact form)
2. **Conversion events are configured** — at minimum, a "Lead" event when someone submits a booking form
3. **UTM parameters** are on all ad URLs so Google Analytics can also track Meta-sourced traffic

Without proper tracking, you can't optimise and you'll end up making decisions based on vanity metrics (impressions, reach) instead of real business outcomes (bookings, new clients).

## Next Steps

${cta.replace(/\[city\]/g, name)}

---

*Running Meta Ads for ${plural} in ${fullCity}? I specialise in data-driven local marketing for small businesses across the US. [See how DataLatte works](/about) or [get in touch](/contact) directly.*
`;
}

function tier_context(tier, name) {
  if (tier === 'high') return `${name} is a competitive market — higher CPMs reflect strong advertiser demand, but also a larger addressable audience.`;
  if (tier === 'medium') return `${name} is a medium-competition market — CPMs are reasonable, and there's real upside for well-targeted campaigns against less sophisticated local competitors.`;
  return `${name} is a lower-competition market — CPMs are favourable, and local businesses with good creative can achieve exceptional cost-per-lead.`;
}

// ── Run ────────────────────────────────────────────────────────────────────
for (const city of CITIES) {
  for (const niche of NICHES) {
    emit(`meta-ads-for-${niche.key}-in-${city.slug}`, article(city, niche));
  }
}

console.log(`\nDone: ${written} written, ${skipped} skipped`);
