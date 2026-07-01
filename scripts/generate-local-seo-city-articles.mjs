#!/usr/bin/env node
/**
 * generate-local-seo-city-articles.mjs
 * Generates "Local SEO for [Niche] in [City]" articles — 4 niches × 51 cities = 204 articles
 * Usage: node scripts/generate-local-seo-city-articles.mjs [--dry-run]
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
  { name: 'Albuquerque', state: 'NM', slug: 'albuquerque-nm', comp: 'medium', mapPack: 'moderate', pop: '565K', demo: 'Hispanic-majority market with strong community ties and local-first shopping habits' },
  { name: 'Anaheim', state: 'CA', slug: 'anaheim-ca', comp: 'high', mapPack: 'competitive', pop: '350K', demo: 'Disney/tourism-heavy area; local businesses compete with international chains' },
  { name: 'Anchorage', state: 'AK', slug: 'anchorage-ak', comp: 'low', mapPack: 'low competition', pop: '290K', demo: 'isolated market; locals rely heavily on Google to find trusted businesses' },
  { name: 'Atlanta', state: 'GA', slug: 'atlanta-ga', comp: 'high', mapPack: 'very competitive', pop: '500K city / 6.1M metro', demo: 'fast-growing diverse metro; neighborhood identity drives local search behavior' },
  { name: 'Austin', state: 'TX', slug: 'austin-tx', comp: 'high', mapPack: 'very competitive', pop: '1M city / 2.4M metro', demo: 'tech-savvy, review-heavy market; businesses live and die by their Google ratings' },
  { name: 'Baltimore', state: 'MD', slug: 'baltimore-md', comp: 'medium', mapPack: 'moderate', pop: '580K city / 2.9M metro', demo: 'strong neighborhood identity; Fells Point, Canton, Hampden residents stay hyper-local' },
  { name: 'Boston', state: 'MA', slug: 'boston-ma', comp: 'high', mapPack: 'very competitive', pop: '680K city / 4.9M metro', demo: 'transient student population + established residents; high review volume market' },
  { name: 'Charlotte', state: 'NC', slug: 'charlotte-nc', comp: 'medium', mapPack: 'growing competition', pop: '900K city / 2.8M metro', demo: 'fastest-growing SE city; new residents actively searching for local services' },
  { name: 'Chicago', state: 'IL', slug: 'chicago-il', comp: 'high', mapPack: 'very competitive', pop: '2.7M city / 9.5M metro', demo: 'neighbourhood-level search behavior; Wicker Park and Bucktown are different markets' },
  { name: 'Cleveland', state: 'OH', slug: 'cleveland-oh', comp: 'medium', mapPack: 'moderate', pop: '370K city / 2M metro', demo: 'strong local loyalty; reviews and word-of-mouth drive discovery' },
  { name: 'Colorado Springs', state: 'CO', slug: 'colorado-springs-co', comp: 'medium', mapPack: 'moderate', pop: '480K', demo: 'military and outdoor community; trusted, established businesses win map pack' },
  { name: 'Columbus', state: 'OH', slug: 'columbus-oh', comp: 'medium', mapPack: 'growing competition', pop: '900K city / 2.1M metro', demo: 'large university city; high volume of "near me" searches from students and young professionals' },
  { name: 'Dallas', state: 'TX', slug: 'dallas-tx', comp: 'high', mapPack: 'very competitive', pop: '1.3M city / 7.8M metro', demo: 'sprawling metro; suburb-level targeting (Plano, Frisco, Southlake) often more effective than city-wide' },
  { name: 'Denver', state: 'CO', slug: 'denver-co', comp: 'high', mapPack: 'competitive', pop: '750K city / 2.9M metro', demo: 'health-conscious, digitally native; Google Maps is the default discovery tool' },
  { name: 'El Paso', state: 'TX', slug: 'el-paso-tx', comp: 'low', mapPack: 'low competition', pop: '680K', demo: 'bilingual market; Google My Business in Spanish gives advantage over English-only competitors' },
  { name: 'Fort Worth', state: 'TX', slug: 'fort-worth-tx', comp: 'medium', mapPack: 'moderate', pop: '920K city / 7.8M DFW metro', demo: 'family-oriented suburban market; local service searches spike on weekends' },
  { name: 'Fresno', state: 'CA', slug: 'fresno-ca', comp: 'medium', mapPack: 'moderate', pop: '540K', demo: 'Central Valley hub; local businesses with complete GBPs dominate over chain listings' },
  { name: 'Honolulu', state: 'HI', slug: 'honolulu-hi', comp: 'medium', mapPack: 'moderate', pop: '350K city / 1M Oahu', demo: 'tourist vs. local search split; targeting "for locals" in copy outperforms generic messaging' },
  { name: 'Houston', state: 'TX', slug: 'houston-tx', comp: 'high', mapPack: 'very competitive', pop: '2.3M city / 7.3M metro', demo: 'most diverse US city; multilingual GBP and citations needed for full coverage' },
  { name: 'Indianapolis', state: 'IN', slug: 'indianapolis-in', comp: 'medium', mapPack: 'moderate', pop: '880K city / 2.1M metro', demo: 'events-driven city; local search volume spikes around Indy 500, conventions, and NBA season' },
  { name: 'Jacksonville', state: 'FL', slug: 'jacksonville-fl', comp: 'medium', mapPack: 'moderate', pop: '950K city / 1.6M metro', demo: 'large geographic spread; neighbourhood-level service area pages matter here' },
  { name: 'Kansas City', state: 'MO', slug: 'kansas-city-mo', comp: 'medium', mapPack: 'moderate', pop: '500K city / 2.2M metro', demo: 'KC metro straddles Missouri and Kansas; dual-state citations and GBP service areas needed' },
  { name: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv', comp: 'high', mapPack: 'competitive', pop: '650K city / 2.3M metro', demo: 'high tourist-to-resident ratio; local businesses must target residents using "for locals" signals' },
  { name: 'Lexington', state: 'KY', slug: 'lexington-ky', comp: 'low', mapPack: 'low competition', pop: '320K', demo: 'college town with tight community; GBP optimisation alone can achieve map pack position 1–3' },
  { name: 'Long Beach', state: 'CA', slug: 'long-beach-ca', comp: 'high', mapPack: 'competitive', pop: '460K', demo: 'distinct identity from LA; "Long Beach" searches are separate from LA searches — treat as its own market' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca', comp: 'high', mapPack: 'most competitive in US', pop: '3.9M city / 13M metro', demo: 'neighbourhood-level strategy essential; "Silver Lake coffee shop" beats "Los Angeles coffee shop" for conversions' },
  { name: 'Louisville', state: 'KY', slug: 'louisville-ky', comp: 'medium', mapPack: 'moderate', pop: '620K metro', demo: 'horse racing and bourbon culture; local references in GBP content improve engagement' },
  { name: 'Memphis', state: 'TN', slug: 'memphis-tn', comp: 'low', mapPack: 'low competition', pop: '630K city / 1.3M metro', demo: 'underserved local SEO market; businesses with 20+ reviews often dominate their category' },
  { name: 'Mesa', state: 'AZ', slug: 'mesa-az', comp: 'medium', mapPack: 'moderate', pop: '510K', demo: 'suburban Phoenix; residents search by suburb (Mesa, Chandler, Gilbert) not city-wide' },
  { name: 'Miami', state: 'FL', slug: 'miami-fl', comp: 'high', mapPack: 'very competitive', pop: '460K city / 6.2M metro', demo: 'bilingual required; Spanish GBP descriptions and reviews dramatically improve local reach' },
  { name: 'Milwaukee', state: 'WI', slug: 'milwaukee-wi', comp: 'medium', mapPack: 'moderate', pop: '580K city / 1.6M metro', demo: 'strong neighbourhood identity (Bay View, Riverwest); hyper-local keywords outperform city-wide' },
  { name: 'Minneapolis', state: 'MN', slug: 'minneapolis-mn', comp: 'medium', mapPack: 'growing competition', pop: '430K city / 3.6M metro', demo: 'tech-forward city; high percentage of local searches happen on mobile during commutes' },
  { name: 'Nashville', state: 'TN', slug: 'nashville-tn', comp: 'high', mapPack: 'competitive', pop: '690K city / 2.1M metro', demo: 'rapid growth influx; new residents aggressively searching for local businesses' },
  { name: 'New Orleans', state: 'LA', slug: 'new-orleans-la', comp: 'medium', mapPack: 'moderate', pop: '380K city / 1.3M metro', demo: 'tourism overlay; locals use Yelp and Google equally — both citation channels matter' },
  { name: 'New York City', state: 'NY', slug: 'new-york-city-ny', comp: 'high', mapPack: 'most competitive in US', pop: '8.3M city / 20M metro', demo: 'borough and neighbourhood-level strategy essential; "Upper West Side" not "Manhattan" is the keyword' },
  { name: 'Oklahoma City', state: 'OK', slug: 'oklahoma-city-ok', comp: 'low', mapPack: 'low competition', pop: '680K city / 1.4M metro', demo: 'underserved market; local businesses with complete GBPs can achieve map pack top 3 within 60 days' },
  { name: 'Omaha', state: 'NE', slug: 'omaha-ne', comp: 'low', mapPack: 'low competition', pop: '490K city / 950K metro', demo: 'Midwest family market; review volume is the primary map pack ranking factor here' },
  { name: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa', comp: 'high', mapPack: 'competitive', pop: '1.6M city / 6.2M metro', demo: 'fierce neighbourhood identity (South Philly, Fishtown, Manayunk); neighbourhood keywords essential' },
  { name: 'Phoenix', state: 'AZ', slug: 'phoenix-az', comp: 'high', mapPack: 'competitive', pop: '1.6M city / 5M metro', demo: 'sprawling metro; suburb-specific strategy (Scottsdale, Tempe, Chandler) outperforms metro-wide targeting' },
  { name: 'Pittsburgh', state: 'PA', slug: 'pittsburgh-pa', comp: 'medium', mapPack: 'moderate', pop: '300K city / 2.4M metro', demo: 'strong neighbourhood loyalty (Shadyside, Lawrenceville, Squirrel Hill); community-specific citations' },
  { name: 'Portland', state: 'OR', slug: 'portland-or', comp: 'high', mapPack: 'competitive', pop: '650K city / 2.5M metro', demo: 'independent-business-loving market; Yelp + Google Maps equally dominant; anti-chain sentiment benefits locals' },
  { name: 'Raleigh', state: 'NC', slug: 'raleigh-nc', comp: 'medium', mapPack: 'growing competition', pop: '470K city / 1.4M metro', demo: 'Research Triangle growth corridor; tech professionals use Google as primary local discovery' },
  { name: 'Sacramento', state: 'CA', slug: 'sacramento-ca', comp: 'medium', mapPack: 'moderate', pop: '520K city / 2.4M metro', demo: 'government + agriculture economy; local community emphasis in GBP content performs well' },
  { name: 'San Antonio', state: 'TX', slug: 'san-antonio-tx', comp: 'medium', mapPack: 'moderate', pop: '1.4M city / 2.6M metro', demo: 'military base + tourism overlay; Spanish-language GBP content reaches broader local audience' },
  { name: 'San Diego', state: 'CA', slug: 'san-diego-ca', comp: 'high', mapPack: 'competitive', pop: '1.4M city / 3.3M metro', demo: 'military + biotech + beach; neighbourhood-level targeting (Pacific Beach, North Park, La Jolla) converts higher' },
  { name: 'San Francisco', state: 'CA', slug: 'san-francisco-ca', comp: 'high', mapPack: 'most competitive', pop: '870K city / 4.7M Bay Area', demo: 'review-obsessed market; 4.5 stars minimum to compete in most categories; neighbourhood level is essential' },
  { name: 'Seattle', state: 'WA', slug: 'seattle-wa', comp: 'high', mapPack: 'competitive', pop: '730K city / 4M metro', demo: 'high income, tech-savvy; reviews heavily weighted in local decision-making; Amazon reviews culture spills into local' },
  { name: 'St. Louis', state: 'MO', slug: 'st-louis-mo', comp: 'medium', mapPack: 'moderate', pop: '300K city / 2.8M metro', demo: 'strong neighbourhood identity (The Loop, Soulard, Clayton); local citation building straightforward' },
  { name: 'Tampa', state: 'FL', slug: 'tampa-fl', comp: 'medium', mapPack: 'growing competition', pop: '400K city / 3.2M metro', demo: 'growing remote-worker influx; new residents searching for trusted local services in an unfamiliar city' },
  { name: 'Tucson', state: 'AZ', slug: 'tucson-az', comp: 'low', mapPack: 'low competition', pop: '550K city / 1M metro', demo: 'university town; moderate competition; well-maintained GBP plus 30+ reviews often wins category' },
  { name: 'Virginia Beach', state: 'VA', slug: 'virginia-beach-va', comp: 'medium', mapPack: 'moderate', pop: '460K', demo: 'beach tourism + suburban military families; seasonal search volume peaks in summer' },
];

// ── Niche data ─────────────────────────────────────────────────────────────
const NICHES = [
  {
    key: 'coffee-shops',
    label: 'Coffee Shops',
    plural: 'coffee shops and cafés',
    category: 'LocalBusiness',
    keywords: [
      { kw: 'Coffee shop near me', vol: 'Very High', intent: 'immediate' },
      { kw: 'Best café [city]', vol: 'High', intent: 'research' },
      { kw: 'Specialty coffee [city]', vol: 'Medium', intent: 'discovery' },
      { kw: 'Coffee shop open now', vol: 'High', intent: 'immediate' },
      { kw: '[Neighbourhood] coffee', vol: 'Medium', intent: 'hyper-local' },
    ],
    gbpCategory: '"Coffee shop" (primary) + "Café" + "Espresso bar" (secondary)',
    reviewTriggers: 'great oat milk latte, best pour-over in [city], cozy atmosphere, fast wifi, good for remote work',
    citations: ['Yelp', 'TripAdvisor', 'Foursquare', 'Zomato', 'OpenTable (if food menu)', 'Bing Places'],
    photos: 'Interior (light, cozy), espresso drinks close-up, menu board, exterior storefront, barista making drinks',
    schema: 'CafeOrCoffeeShop (most specific schema type — use instead of generic LocalBusiness)',
    seasonalPeaks: 'Back-to-school (Aug–Sep) and winter holiday season (Nov–Dec) drive 30–40% more local searches.',
    quickWins: [
      'Add "latte art" and "pour-over" to your GBP services section to capture specialty search intent',
      'Reply to every review mentioning "wifi" or "work" — signals to Google that you attract remote workers',
      'Upload new photos weekly; Google rewards actively-managed profiles with higher map placement',
    ],
    cta: 'Want a free local SEO audit for your [city] coffee shop? [Book a 30-minute call](/free-audit) — I\'ll review your GBP, citation health, and map pack position and show you exactly what\'s holding you back.',
  },
  {
    key: 'hair-salons',
    label: 'Hair Salons',
    plural: 'hair salons and barbershops',
    category: 'HairSalon',
    keywords: [
      { kw: 'Hair salon near me', vol: 'Very High', intent: 'immediate' },
      { kw: 'Balayage [city]', vol: 'High', intent: 'service-specific' },
      { kw: 'Hair cut [city]', vol: 'High', intent: 'immediate' },
      { kw: 'Keratin treatment near me', vol: 'Medium', intent: 'service-specific' },
      { kw: 'Best hair salon [city]', vol: 'High', intent: 'research' },
    ],
    gbpCategory: '"Hair salon" (primary) + "Beauty salon" + "Hairdresser" (secondary)',
    reviewTriggers: 'best balayage in [city], exactly what I asked for, fast appointment, amazing highlights, colour correction, kids haircut',
    citations: ['Yelp', 'StyleSeat', 'Vagaro', 'Booksy', 'Facebook', 'Bing Places', 'Apple Maps'],
    photos: 'Before/after colour work, stylists in action, clean salon interior, reception area, product display',
    schema: 'HairSalon (use this — not LocalBusiness)',
    seasonalPeaks: 'Prom season (Apr–May), holiday parties (Nov–Dec), and Valentine\'s week create natural demand spikes.',
    quickWins: [
      'List every service as a GBP service item — "Balayage", "Brazilian Blowout", "Color Correction" each rank separately',
      'Post before/after photos directly to GBP (not just Instagram) — this drives map pack CTR significantly',
      'Collect reviews mentioning specific services — "best balayage in [city]" in a review is a ranking signal',
    ],
    cta: 'Ready to fill your appointment book in [city] through Google? [Book a free SEO audit](/free-audit) — I\'ll show you which changes will move you into the map pack within 60 days.',
  },
  {
    key: 'pet-groomers',
    label: 'Pet Groomers',
    plural: 'pet groomers and pet care businesses',
    category: 'PetGrooming',
    keywords: [
      { kw: 'Dog groomer near me', vol: 'Very High', intent: 'immediate' },
      { kw: 'Pet grooming [city]', vol: 'High', intent: 'discovery' },
      { kw: 'Mobile dog grooming [city]', vol: 'High', intent: 'service-specific' },
      { kw: 'Dog grooming prices [city]', vol: 'Medium', intent: 'research' },
      { kw: 'Cat grooming near me', vol: 'Medium', intent: 'service-specific' },
    ],
    gbpCategory: '"Pet groomer" (primary) + "Dog groomer" + "Pet store" or "Veterinarian" (secondary if applicable)',
    reviewTriggers: 'gentle with anxious dogs, my dog loves it here, first-time grooming, puppy groom, mobile grooming service',
    citations: ['Yelp', 'Rover', 'Wag!', 'Petfinder', 'Nextdoor', 'Bing Places', 'Apple Maps'],
    photos: 'Happy clean dogs post-groom, grooming process shots (with owner consent), before/after, mobile van (if mobile), grooming station',
    schema: 'LocalBusiness with additionalType PetGrooming — or AnimalShelter if rescue element exists',
    seasonalPeaks: 'Spring shedding season (Mar–May) and holiday grooming appointments (Nov–Dec) are the two biggest demand surges.',
    quickWins: [
      'Add "dog breeds you specialise in" to GBP attributes — doodle owners search "doodle groomer [city]" specifically',
      'Request reviews mentioning breed names — "best groomer for golden retrievers in [city]" is a real keyword',
      'List mobile grooming as a separate service item if offered — this is a distinct high-intent keyword cluster',
    ],
    cta: 'Want more pet owners in [city] finding your grooming business on Google? [Book a free audit](/free-audit) — I specialise in local SEO for pet businesses and know what moves the needle in this niche.',
  },
  {
    key: 'fitness-studios',
    label: 'Fitness Studios',
    plural: 'fitness studios and gyms',
    category: 'ExerciseGym',
    keywords: [
      { kw: 'Gym near me', vol: 'Very High', intent: 'immediate' },
      { kw: 'Yoga studio [city]', vol: 'High', intent: 'service-specific' },
      { kw: 'Personal trainer [city]', vol: 'High', intent: 'service-specific' },
      { kw: 'HIIT classes [city]', vol: 'Medium', intent: 'service-specific' },
      { kw: 'Pilates near me', vol: 'High', intent: 'immediate' },
    ],
    gbpCategory: '"Gym" or "Fitness centre" (primary) + your specific modality (Yoga studio, Pilates studio, CrossFit gym)',
    reviewTriggers: 'great coaches, welcoming to beginners, flexible schedule, 30-day trial, good locker rooms, small class size',
    citations: ['Yelp', 'Mindbody', 'ClassPass', 'Facebook', 'Bing Places', 'Apple Maps', 'MapQuest'],
    photos: 'Classes in session, gym floor/equipment, coaches, before/after transformation stories, exterior and parking',
    schema: 'ExerciseGym (use this) — or SportsClub, or a specialised type like YogaStudio using additionalType',
    seasonalPeaks: 'New Year (Jan) is by far the largest demand spike; Back-to-school (Sep) and pre-summer (Apr–May) follow.',
    quickWins: [
      'List every class type as a GBP service — "HIIT", "Barre", "Hot Yoga", "Personal Training" rank as separate intent clusters',
      'Turn your GBP Q&A into a mini FAQ — answer common questions like "Is there a free trial?" directly on your profile',
      'Set your service area beyond your immediate address — if clients come from a 5-mile radius, add those zip codes',
    ],
    cta: 'Want your [city] fitness studio ranking higher on Google Maps? [Book a free SEO consultation](/free-audit) — I work specifically with local studios and gyms and know the fastest paths to the map pack.',
  },
];

// ── Article template ───────────────────────────────────────────────────────
function article(city, niche) {
  const { name, state, slug: citySlug, comp, mapPack, pop, demo } = city;
  const { key, label, plural, gbpCategory, reviewTriggers, citations, photos, schema, seasonalPeaks, quickWins, keywords, cta } = niche;
  const fullCity = `${name}, ${state}`;
  const slug = `local-seo-for-${key}-in-${citySlug}`;
  const date = '2026-07-01';

  const kwRows = keywords.map(({ kw, vol, intent }) => `| ${kw} | ${vol} | ${intent} |`).join('\n');
  const citList = citations.map(c => `- **${c}**`).join('\n');
  const photoList = photos;
  const qwList = quickWins.map((w, i) => `**${i + 1}. ${w}**`).join('\n\n');

  return `---
title: "Local SEO for ${label} in ${fullCity}: 2026 Map Pack Guide"
date: "${date}"
lastModified: "${date}"
description: "How ${plural} in ${fullCity} rank higher on Google Maps in 2026. GBP optimisation checklist, keyword strategy, citation sources, and what it actually takes to win the map pack in ${name}."
author: "Nataliia"
category: "Local SEO"
tags: ["local seo ${key}", "google maps ${name.toLowerCase()}", "${key} seo ${name.toLowerCase()}", "google business profile ${state.toLowerCase()}"]
slug: "${slug}"
image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80&auto=format&fit=crop"
readTime: "7 min read"
---

If you run a ${label.toLowerCase().replace(/s$/, '')} in ${fullCity}, local SEO is the highest-ROI marketing channel available to you — because when someone searches "near me," they're ready to book, not browse. This guide covers exactly what it takes to rank in the Google Maps pack in ${name}'s ${mapPack} market in 2026.

<StatRow
  values="${pop}|${comp === 'high' ? '3–7' : comp === 'medium' ? '1–4' : '1–3'}|76%|4.3+"
  labels="${name} market size|Competitors in map pack top 3|Local searches leading to same-day visit|Minimum star rating to compete"
  subs="Population served|Typical ${label.toLowerCase()} category|Google data on local intent|${name} market benchmark"
  trends="up|neutral|up|up"
/>

## The ${name} Local SEO Landscape for ${label}

${fullCity} is ${demo}. This context directly shapes your local SEO strategy — the tactics that work in Los Angeles don't always translate to ${name}.

Map pack competition in ${name} for ${plural} is **${mapPack}**. ${comp_context(comp, name)}

The good news: most ${plural} in ${name} are not doing local SEO well. A systematic approach — even at a basic level — creates meaningful separation from competitors within 60–90 days.

## Your Google Business Profile Checklist for ${name}

Your GBP is the #1 ranking factor for local search. Here's the optimisation checklist specific to ${plural} in ${name}:

**Category Selection**
Use ${gbpCategory}.

**Business Description (750 characters)**
Lead with your service, your ${name} location or neighbourhood, and your key differentiator. Example: *"[Name] is [city]'s premier [service type], located in [neighbourhood]. We specialise in [specific service] for [target customer]."* Include "${name}" and your specific service type naturally — don't keyword-stuff.

**Service Area Configuration**
Even if you're a physical location, set a service area to capture radius-based searches. A 5–8 mile radius around your ${name} location typically covers your realistic customer draw area.

**Photos: Upload at Least 20**
${photoList}. Update photos seasonally. Google rewards fresh visual content with higher map placement.

**Posts: Weekly Updates**
Post once per week minimum — an offer, a new service, a seasonal message, or a local event mention. Active profiles rank higher. Reference ${name} landmarks or events when natural.

**Q&A Section**
Seed your own Q&As with the 5 questions customers ask most. This controls the messaging and captures featured snippet opportunities for question-based searches.

## Keyword Strategy for ${label} in ${name}

The keywords that drive bookings for ${plural} in ${name}:

| Keyword | Search Volume | Search Intent |
|---|---|---|
${kwRows}

**The near-me modifier is your most valuable keyword cluster.** Someone searching "near me" on mobile is requesting location-based results — Google interprets this as high intent and heavily weights proximity and GBP completeness.

**Neighbourhood-level keywords** often convert better than city-wide terms in ${name}. Research which neighbourhoods your customers come from and incorporate those area names naturally into your website's title tags, service pages, and GBP description.

## Citation Building for ${name}

Citations are mentions of your business Name, Address, and Phone number (NAP) on external sites. Consistency is everything — one transposed digit across 20 directories will suppress your map ranking.

**Priority citation sources for ${plural} in ${name}:**
${citList}

**NAP consistency rule**: Your business name, address, and phone must be identical character-for-character across every citation. "St." vs "Street", "Ave" vs "Avenue", or "(555) 123-4567" vs "555-123-4567" all count as inconsistencies.

**Local citations for ${name}**: Beyond the national directories, look for:
- ${name} Chamber of Commerce member directory
- ${state} state business directory
- Local neighbourhood association directories
- Industry-specific directories (e.g., Booksy, Mindbody, ClassPass for fitness; StyleSeat for salons)

<Callout type="tip">
Run a free citation audit at BrightLocal or Moz Local before building new citations. Fix inconsistencies in existing listings first — adding more bad citations makes the problem worse, not better.
</Callout>

## Review Strategy for ${name}

Reviews are the second-most-important ranking factor for local search. In ${name}'s ${mapPack} market, the number and recency of reviews directly determines your map pack position.

**Target**: 50+ reviews with a 4.5+ average before expecting top-3 map placement in competitive ${name} categories.

**What to ask for**: When requesting reviews, prompt customers to mention specific services. The review text signals to Google what searches your business is relevant for. Trigger phrases that help: *${reviewTriggers}*.

**Review velocity matters**: 3 new reviews per week consistently beats 10 reviews in one week then nothing. Set up a simple follow-up system (text or email) 24 hours after each service.

**Responding to reviews**: Respond to every review within 24 hours — good or bad. In your responses, naturally include your service type and city name. Google reads these responses as content.

## On-Page SEO: Your Website's Role

Your GBP and your website work together. Your website reinforces the signals your GBP sends:

**Title tag format**: \`[Primary Service] in ${name}, ${state} | [Business Name]\`
Example: \`Hair Salon in ${name}, ${state} | The Style Studio\`

**H1**: Lead with your service and city. "Award-Winning [Service] in ${fullCity}"

**Service pages**: Create a dedicated page for each major service. A hair salon gets separate pages for "Balayage ${name}," "Keratin Treatment ${name}," and "Men's Haircut ${name}" — each targeting a separate keyword cluster.

**Schema markup**: Use ${schema} structured data. This helps Google understand exactly what type of business you are, which improves category matching in local search.

**Embed your Google Map**: A Google Maps embed on your contact/location page is a minor ranking signal but easy to implement.

## ${name}-Specific Seasonality

${seasonalPeaks}

Build your local SEO calendar around these peaks: update GBP photos and posts 4–6 weeks ahead of high-demand periods, run review-collection pushes during busy periods when customer satisfaction is highest, and refresh your service page content with seasonal keywords.

## Quick Wins for ${label} in ${name}

${qwList}

## Tracking Your Progress

Set up these measurements before you start, so you can prove what's working:

1. **Google Search Console**: Track impressions and clicks from organic search by page
2. **GBP Insights**: Monitor "searches," "views," and "actions" (calls, direction requests, website visits) monthly
3. **Rank tracking**: Use BrightLocal or a free tool like Google Search itself (private browsing) to check your map pack position for your top 5 keywords weekly

A successful local SEO campaign in ${name} should show measurable GBP view increases within 30 days of consistent optimisation, and map pack movement within 60–90 days.

## Next Steps

${cta.replace(/\[city\]/g, name)}

---

*Helping ${plural} in ${fullCity} rank higher on Google Maps. DataLatte specialises in local SEO for small businesses across the US. [View our Local SEO service](/services/local-seo) or [contact us directly](/contact).*
`;
}

function comp_context(comp, name) {
  if (comp === 'high') return `${name} is a high-competition market — you'll need 40+ reviews, a fully-optimised GBP, and consistent citation building to crack the top 3. The good news: many competitors have weak fundamentals.`;
  if (comp === 'medium') return `${name} has moderate competition — a systematic approach combining GBP optimisation, citations, and review collection can achieve top-3 placement within 60–90 days for most service categories.`;
  return `${name} has relatively low local SEO competition — a well-optimised GBP with 25–30 reviews often achieves map pack position 1–3 within 30–60 days. This is a significant opportunity for businesses willing to invest even basic effort.`;
}

// ── Run ───────────────────────────────────────────────────────────────────
for (const city of CITIES) {
  for (const niche of NICHES) {
    emit(`local-seo-for-${niche.key}-in-${city.slug}`, article(city, niche));
  }
}

console.log(`\nDone: ${written} written, ${skipped} skipped`);
