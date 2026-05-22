export interface City {
  city: string;
  state: string;
  stateCode: string;
  slug: string; // e.g. "austin-tx"
  country?: "US" | "UK" | "AU"; // defaults to US
}

export const CITIES: City[] = [
  { city: "Austin", state: "Texas", stateCode: "TX", slug: "austin-tx" },
  { city: "New York", state: "New York", stateCode: "NY", slug: "new-york-ny" },
  { city: "Los Angeles", state: "California", stateCode: "CA", slug: "los-angeles-ca" },
  { city: "Chicago", state: "Illinois", stateCode: "IL", slug: "chicago-il" },
  { city: "Houston", state: "Texas", stateCode: "TX", slug: "houston-tx" },
  { city: "Phoenix", state: "Arizona", stateCode: "AZ", slug: "phoenix-az" },
  { city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", slug: "philadelphia-pa" },
  { city: "San Antonio", state: "Texas", stateCode: "TX", slug: "san-antonio-tx" },
  { city: "San Diego", state: "California", stateCode: "CA", slug: "san-diego-ca" },
  { city: "Dallas", state: "Texas", stateCode: "TX", slug: "dallas-tx" },
  { city: "San Jose", state: "California", stateCode: "CA", slug: "san-jose-ca" },
  { city: "Jacksonville", state: "Florida", stateCode: "FL", slug: "jacksonville-fl" },
  { city: "Fort Worth", state: "Texas", stateCode: "TX", slug: "fort-worth-tx" },
  { city: "Columbus", state: "Ohio", stateCode: "OH", slug: "columbus-oh" },
  { city: "San Francisco", state: "California", stateCode: "CA", slug: "san-francisco-ca" },
  { city: "Charlotte", state: "North Carolina", stateCode: "NC", slug: "charlotte-nc" },
  { city: "Indianapolis", state: "Indiana", stateCode: "IN", slug: "indianapolis-in" },
  { city: "Seattle", state: "Washington", stateCode: "WA", slug: "seattle-wa" },
  { city: "Denver", state: "Colorado", stateCode: "CO", slug: "denver-co" },
  { city: "Nashville", state: "Tennessee", stateCode: "TN", slug: "nashville-tn" },
  { city: "Oklahoma City", state: "Oklahoma", stateCode: "OK", slug: "oklahoma-city-ok" },
  { city: "El Paso", state: "Texas", stateCode: "TX", slug: "el-paso-tx" },
  { city: "Las Vegas", state: "Nevada", stateCode: "NV", slug: "las-vegas-nv" },
  { city: "Louisville", state: "Kentucky", stateCode: "KY", slug: "louisville-ky" },
  { city: "Baltimore", state: "Maryland", stateCode: "MD", slug: "baltimore-md" },
  { city: "Milwaukee", state: "Wisconsin", stateCode: "WI", slug: "milwaukee-wi" },
  { city: "Albuquerque", state: "New Mexico", stateCode: "NM", slug: "albuquerque-nm" },
  { city: "Tucson", state: "Arizona", stateCode: "AZ", slug: "tucson-az" },
  { city: "Sacramento", state: "California", stateCode: "CA", slug: "sacramento-ca" },
  { city: "Kansas City", state: "Missouri", stateCode: "MO", slug: "kansas-city-mo" },
  { city: "Atlanta", state: "Georgia", stateCode: "GA", slug: "atlanta-ga" },
  { city: "Omaha", state: "Nebraska", stateCode: "NE", slug: "omaha-ne" },
  { city: "Colorado Springs", state: "Colorado", stateCode: "CO", slug: "colorado-springs-co" },
  { city: "Raleigh", state: "North Carolina", stateCode: "NC", slug: "raleigh-nc" },
  { city: "Minneapolis", state: "Minnesota", stateCode: "MN", slug: "minneapolis-mn" },
  { city: "Tampa", state: "Florida", stateCode: "FL", slug: "tampa-fl" },
  { city: "New Orleans", state: "Louisiana", stateCode: "LA", slug: "new-orleans-la" },
  { city: "Portland", state: "Oregon", stateCode: "OR", slug: "portland-or" },
  { city: "Miami", state: "Florida", stateCode: "FL", slug: "miami-fl" },
  { city: "Orlando", state: "Florida", stateCode: "FL", slug: "orlando-fl" },
  { city: "Salt Lake City", state: "Utah", stateCode: "UT", slug: "salt-lake-city-ut" },
  { city: "Richmond", state: "Virginia", stateCode: "VA", slug: "richmond-va" },
  { city: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", slug: "pittsburgh-pa" },
  { city: "Cincinnati", state: "Ohio", stateCode: "OH", slug: "cincinnati-oh" },
  { city: "St. Louis", state: "Missouri", stateCode: "MO", slug: "st-louis-mo" },
  { city: "Cleveland", state: "Ohio", stateCode: "OH", slug: "cleveland-oh" },
  { city: "Boise", state: "Idaho", stateCode: "ID", slug: "boise-id" },
  { city: "Chattanooga", state: "Tennessee", stateCode: "TN", slug: "chattanooga-tn" },
  { city: "Spokane", state: "Washington", stateCode: "WA", slug: "spokane-wa" },
  { city: "Anchorage", state: "Alaska", stateCode: "AK", slug: "anchorage-ak" },
  // UK cities
  { city: "London",       state: "England",  stateCode: "UK", slug: "london-uk",       country: "UK" },
  { city: "Manchester",   state: "England",  stateCode: "UK", slug: "manchester-uk",   country: "UK" },
  { city: "Birmingham",   state: "England",  stateCode: "UK", slug: "birmingham-uk",   country: "UK" },
  { city: "Leeds",        state: "England",  stateCode: "UK", slug: "leeds-uk",        country: "UK" },
  { city: "Liverpool",    state: "England",  stateCode: "UK", slug: "liverpool-uk",    country: "UK" },
  { city: "Sheffield",    state: "England",  stateCode: "UK", slug: "sheffield-uk",    country: "UK" },
  { city: "Bristol",      state: "England",  stateCode: "UK", slug: "bristol-uk",      country: "UK" },
  { city: "Edinburgh",    state: "Scotland", stateCode: "UK", slug: "edinburgh-uk",    country: "UK" },
  { city: "Glasgow",      state: "Scotland", stateCode: "UK", slug: "glasgow-uk",      country: "UK" },
  { city: "Cardiff",      state: "Wales",    stateCode: "UK", slug: "cardiff-uk",      country: "UK" },
  { city: "Nottingham",   state: "England",  stateCode: "UK", slug: "nottingham-uk",   country: "UK" },
  { city: "Leicester",    state: "England",  stateCode: "UK", slug: "leicester-uk",    country: "UK" },
  { city: "Southampton",  state: "England",  stateCode: "UK", slug: "southampton-uk",  country: "UK" },
  { city: "Brighton",     state: "England",  stateCode: "UK", slug: "brighton-uk",     country: "UK" },
  { city: "Newcastle",    state: "England",  stateCode: "UK", slug: "newcastle-uk",    country: "UK" },
  // Australia cities
  { city: "Sydney",       state: "New South Wales",    stateCode: "NSW", slug: "sydney-nsw",       country: "AU" },
  { city: "Melbourne",    state: "Victoria",            stateCode: "VIC", slug: "melbourne-vic",    country: "AU" },
  { city: "Brisbane",     state: "Queensland",          stateCode: "QLD", slug: "brisbane-qld",     country: "AU" },
  { city: "Perth",        state: "Western Australia",   stateCode: "WA",  slug: "perth-wa",         country: "AU" },
  { city: "Adelaide",     state: "South Australia",     stateCode: "SA",  slug: "adelaide-sa",      country: "AU" },
  { city: "Gold Coast",   state: "Queensland",          stateCode: "QLD", slug: "gold-coast-qld",   country: "AU" },
  { city: "Canberra",     state: "ACT",                 stateCode: "ACT", slug: "canberra-act",     country: "AU" },
  { city: "Newcastle",    state: "New South Wales",    stateCode: "NSW", slug: "newcastle-nsw",    country: "AU" },
  { city: "Wollongong",   state: "New South Wales",    stateCode: "NSW", slug: "wollongong-nsw",   country: "AU" },
  { city: "Geelong",      state: "Victoria",            stateCode: "VIC", slug: "geelong-vic",      country: "AU" },
  { city: "Hobart",       state: "Tasmania",            stateCode: "TAS", slug: "hobart-tas",       country: "AU" },
  { city: "Sunshine Coast", state: "Queensland",        stateCode: "QLD", slug: "sunshine-coast-qld", country: "AU" },
];

export const NICHES = ["coffee-shops", "hair-salons", "pet-groomers", "fitness-studios", "barbershops", "yoga-studios", "nail-salons", "plumbers", "electricians"] as const;
export type NicheSlug = typeof NICHES[number];

export interface NicheInfo {
  slug: NicheSlug;
  label: string;
  labelPlural: string;
  emoji: string;
  primaryService: string;
  accentClass: string;
  heroImage: string;
  tagline: (city: string) => string;
  intro: (city: string, state: string) => string;
  services: string[];
  faq: (city: string, state: string) => { q: string; a: string }[];
}

export const NICHE_DATA: Record<NicheSlug, NicheInfo> = {
  "coffee-shops": {
    slug: "coffee-shops",
    label: "Coffee Shop",
    labelPlural: "Coffee Shops",
    emoji: "☕",
    primaryService: "Local SEO & Google Ads",
    accentClass: "bg-gradient-to-br from-coffee-800 to-coffee-950",
    heroImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    tagline: (city) => `Get more customers through your door in ${city}`,
    intro: (city, state) =>
      `Running a coffee shop in ${city}, ${state} means competing for every foot-traffic customer — against chains, other independents, and whoever optimized their Google Business Profile last week. DataLatte helps ${city} coffee shops and cafés dominate local search, run profitable Google Ads, and build the kind of online reputation that turns first-time visitors into regulars.`,
    services: [
      "Google Business Profile optimization for map pack visibility",
      "Local SEO to rank for 'coffee shop near me' in your neighborhood",
      "Google Ads targeting customers within 1–3 miles",
      "Meta Ads for seasonal promotions and new menu items",
      "Review generation strategy to build social proof",
      "Analytics to track calls, directions, and ad conversions",
    ],
    faq: (city, _state) => [
      {
        q: `How long until my coffee shop ranks in Google Maps in ${city}?`,
        a: `Most ${city} coffee shops see GBP improvements within 4–8 weeks of optimization. Ranking in the local map pack for competitive terms like "coffee shop near me" typically takes 2–4 months of consistent work.`,
      },
      {
        q: `What's a realistic Google Ads budget for a coffee shop in ${city}?`,
        a: `For most ${city} neighborhoods, $300–$700/month in Google Ads is enough to drive meaningful foot traffic if well-targeted. The exact amount depends on your location's competitiveness and your goals.`,
      },
      {
        q: `Do I need a website or just a Google Business Profile?`,
        a: `Both. Your GBP drives map pack traffic; your website converts it. We'll ensure both work together and that local keywords appear on both properties.`,
      },
      {
        q: `How do you measure success for a coffee shop?`,
        a: `We track GBP calls, direction requests, website visits from local search, and in-store revenue attribution where possible. Every monthly report shows what's working and what to adjust.`,
      },
    ],
  },

  "hair-salons": {
    slug: "hair-salons",
    label: "Hair Salon",
    labelPlural: "Hair Salons",
    emoji: "💇",
    primaryService: "Local SEO & Google Ads",
    accentClass: "bg-gradient-to-br from-pink-800 to-rose-900",
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
    tagline: (city) => `Fill your booking calendar in ${city}`,
    intro: (city, state) =>
      `Hair salons and barbershops in ${city}, ${state} live on repeat clients and a steady stream of new bookings. DataLatte helps ${city} salons rank higher in Google, run ads that target locals ready to book, and build the five-star reputation that keeps chairs full.`,
    services: [
      "Google Business Profile optimization to win the local map pack",
      "Local SEO for searches like 'hair salon near me' and 'best haircut in ${city}'",
      "Google Ads targeting people actively searching for hair services",
      "Meta & Instagram Ads to showcase your work and attract new clients",
      "Review strategy to grow your star rating and review count",
      "Analytics tracking calls, bookings, and ad performance",
    ],
    faq: (city, _state) => [
      {
        q: `How do I get my hair salon to the top of Google in ${city}?`,
        a: `The map pack (top 3 results) is driven by GBP completeness, review quantity/quality, and proximity. We optimize all three. Organic rankings take 3–6 months; GBP improvements are often visible in 4–8 weeks.`,
      },
      {
        q: `Are Instagram ads worth it for a ${city} hair salon?`,
        a: `Yes — especially for showcasing transformations and before/after content. We run tight geographic targeting so your ads only reach people in ${city} who are likely to book.`,
      },
      {
        q: `What's the ROI on Google Ads for a salon?`,
        a: `With an average client value of $60–$150+ and a CPC of $2–$6 for local hair searches, a well-managed campaign typically returns 4–8× ad spend for established salons.`,
      },
      {
        q: `Can you help me get more Google reviews for my salon in ${city}?`,
        a: `Absolutely. We'll set up a simple review request workflow — QR codes, follow-up texts, or email sequences — that consistently generates new five-star reviews without feeling pushy.`,
      },
    ],
  },

  "pet-groomers": {
    slug: "pet-groomers",
    label: "Pet Groomer",
    labelPlural: "Pet Groomers",
    emoji: "🐾",
    primaryService: "Local SEO & Google Ads",
    accentClass: "bg-gradient-to-br from-emerald-800 to-teal-900",
    heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80",
    tagline: (city) => `Get more grooming clients in ${city}`,
    intro: (city, state) =>
      `Pet owners in ${city}, ${state} are fiercely loyal — once they find a groomer they trust, they come back every 6–8 weeks. DataLatte helps ${city} pet groomers win new clients through local search and Google Ads, then keep them with the kind of online reputation that spreads through neighborhood groups and social media.`,
    services: [
      "Google Business Profile optimization for 'dog groomer near me' searches",
      "Local SEO targeting pet owners in your service area",
      "Google Ads campaigns focused on high-intent grooming searches",
      "Meta Ads with pet-friendly creative to reach local pet owners",
      "Review generation to build trust with new pet owners",
      "Analytics to measure bookings and track which channels drive appointments",
    ],
    faq: (city, _state) => [
      {
        q: `How do pet groomers get more clients in ${city}?`,
        a: `The most effective channels are Google Business Profile (ranking in 'dog groomer near me' searches), Google Ads, and word-of-mouth amplified by consistent five-star reviews. We focus on all three.`,
      },
      {
        q: `What does it cost to advertise a pet grooming business in ${city}?`,
        a: `Most ${city} pet groomers see solid results with $200–$500/month in Google Ads combined with local SEO work. The key is tight geographic targeting and bidding on high-intent keywords.`,
      },
      {
        q: `How long does local SEO take for a pet groomer?`,
        a: `GBP improvements are often visible in 4–8 weeks. Ranking consistently for competitive terms in ${city} typically takes 3–6 months of ongoing optimization.`,
      },
      {
        q: `Can DataLatte help me get more Google reviews as a groomer?`,
        a: `Yes. We'll set up a review request system — often a simple follow-up text after each appointment — that makes leaving a review easy for happy pet owners.`,
      },
    ],
  },

  "fitness-studios": {
    slug: "fitness-studios",
    label: "Fitness Studio",
    labelPlural: "Fitness Studios",
    emoji: "🏋️",
    primaryService: "Google Ads & Meta Ads",
    accentClass: "bg-gradient-to-br from-slate-800 to-gray-900",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    tagline: (city) => `Fill your classes and reduce churn in ${city}`,
    intro: (city, state) =>
      `Fitness studios and gyms in ${city}, ${state} deal with seasonal demand spikes, high member churn, and relentless competition from big-box gyms. DataLatte helps ${city} fitness studios attract new members with targeted Google and Meta Ads, improve local search visibility, and build marketing systems that work year-round — not just in January.`,
    services: [
      "Google Ads for high-intent fitness searches like 'gym near me' and 'yoga classes in ${city}'",
      "Meta & Instagram Ads to reach health-conscious locals in your area",
      "Local SEO to rank for fitness and wellness searches in ${city}",
      "Google Business Profile optimization to capture map pack traffic",
      "Email and SMS campaigns to re-engage lapsed members",
      "Analytics to track trial sign-ups, membership conversions, and retention rates",
    ],
    faq: (city, _state) => [
      {
        q: `What's the best marketing channel for a fitness studio in ${city}?`,
        a: `It depends on your niche. Google Ads captures people actively searching for gyms; Meta Ads are better for building brand awareness and retargeting trial visitors. Most studios need both working together.`,
      },
      {
        q: `How do I compete with big gyms in ${city}?`,
        a: `Focus on what big gyms can't offer: community, personal attention, and specialized programming. We amplify those differentiators in your ads and local search presence to attract the right members.`,
      },
      {
        q: `How much should a fitness studio in ${city} spend on ads?`,
        a: `$500–$1,500/month is a common starting range for ${city} studios, depending on competition and whether you're running Google, Meta, or both. We'll recommend a budget based on your goals and market.`,
      },
      {
        q: `How do I get more Google reviews for my gym?`,
        a: `Systematically ask happy members — right after a great class or a milestone, with a direct link to your Google review page. We'll set up a simple workflow so this happens consistently.`,
      },
    ],
  },

  "barbershops": {
    slug: "barbershops",
    label: "Barbershop",
    labelPlural: "Barbershops",
    emoji: "✂️",
    primaryService: "Local SEO & Google Ads",
    accentClass: "bg-gradient-to-br from-coffee-800 to-coffee-950",
    heroImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80",
    tagline: (city) => `Keep every chair booked in ${city}`,
    intro: (city, state) =>
      `Barbershops in ${city}, ${state} run on loyalty, word-of-mouth, and local visibility. DataLatte helps ${city} barbershops rank at the top of Google Maps, run profitable ads, and build a review profile that turns first-timers into regulars.`,
    services: [
      "Google Business Profile optimization to dominate 'barber near me' searches",
      "Local SEO to rank for 'barbershop in ${city}' and neighbourhood-level queries",
      "Google Ads targeting men actively searching for haircuts in your area",
      "Instagram & Meta Ads to showcase cuts and attract style-conscious clients",
      "Review generation to build social proof and outrank competitors",
      "Analytics to track calls, bookings, and which channels drive new clients",
    ],
    faq: (city, _state) => [
      {
        q: `How do I get my barbershop to the top of Google Maps in ${city}?`,
        a: `Map pack rankings are driven by GBP completeness, review velocity, and proximity. We optimise all three. Most ${city} barbershops see meaningful GBP improvement within 4–8 weeks.`,
      },
      {
        q: `Should I run Google Ads or Instagram Ads for my barbershop?`,
        a: `Both work, but for different goals. Google Ads captures men searching for a barber right now — high intent, fast results. Instagram Ads build brand and are great for showcasing your best cuts to a local audience.`,
      },
      {
        q: `How much should a barbershop in ${city} spend on marketing?`,
        a: `Most ${city} barbershops see solid results with $200–$500/month combining GBP optimisation and a small Google Ads budget. Given repeat-client lifetime value of $500–$1,500+, the ROI is strong.`,
      },
      {
        q: `How do I get more Google reviews for my barbershop?`,
        a: `The easiest approach: send a follow-up text after each appointment with a direct Google review link. We'll set up this workflow so it happens automatically after every visit.`,
      },
    ],
  },

  "yoga-studios": {
    slug: "yoga-studios",
    label: "Yoga Studio",
    labelPlural: "Yoga Studios",
    emoji: "🧘",
    primaryService: "Google Ads & Meta Ads",
    accentClass: "bg-gradient-to-br from-slate-700 to-slate-900",
    heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
    tagline: (city) => `Fill your classes and grow memberships in ${city}`,
    intro: (city, state) =>
      `Yoga studios in ${city}, ${state} thrive on community, consistency, and finding the right students. DataLatte helps ${city} yoga studios attract new members through local search and targeted ads, reduce churn with retention marketing, and build a reputation that fills classes year-round.`,
    services: [
      "Google Business Profile optimisation to rank for 'yoga classes near me' in ${city}",
      "Local SEO targeting wellness and yoga searches in your area",
      "Google Ads for high-intent searches like 'yoga studio in ${city}' and 'beginner yoga classes'",
      "Meta & Instagram Ads showcasing your studio culture and class offerings",
      "Email & SMS campaigns to reduce drop-off and re-engage lapsed students",
      "Analytics tracking trial sign-ups, membership conversions, and retention rates",
    ],
    faq: (city, _state) => [
      {
        q: `What's the best way to get new yoga students in ${city}?`,
        a: `A combination of Google Maps visibility (via GBP optimisation) and targeted Meta Ads works well for most ${city} studios. Google captures searchers ready to book; Instagram attracts people exploring yoga who haven't searched yet.`,
      },
      {
        q: `How do I compete with large yoga chains in ${city}?`,
        a: `Independent studios win on authenticity, community, and specialisation. We highlight your unique style, instructors, and class variety in ads and local search — things chains can't replicate.`,
      },
      {
        q: `How much should a yoga studio in ${city} spend on ads?`,
        a: `$400–$1,000/month is typical for ${city} studios. We recommend starting with Meta Ads for new member acquisition and Google Ads for intent-driven searches, adjusting based on what converts best.`,
      },
      {
        q: `How do I reduce student churn at my yoga studio?`,
        a: `Churn is often a communication gap. We set up automated email and SMS sequences — milestone celebrations, re-engagement campaigns, class reminders — that keep students connected between visits.`,
      },
    ],
  },

  "nail-salons": {
    slug: "nail-salons",
    label: "Nail Salon",
    labelPlural: "Nail Salons",
    emoji: "💅",
    primaryService: "Local SEO & Google Ads",
    accentClass: "bg-gradient-to-br from-rose-800 to-pink-950",
    heroImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
    tagline: (city) => `Fill your appointment book every week in ${city}`,
    intro: (city, state) =>
      `Nail salons in ${city}, ${state} live on repeat bookings and word-of-mouth. DataLatte helps ${city} nail salons dominate local search, attract new clients with visual advertising, and build a review profile that keeps the appointment book full.`,
    services: [
      "Google Business Profile optimisation to rank in the 'nail salon near me' map pack in ${city}",
      "Local SEO targeting searches like 'gel nails in ${city}' and 'nail technician near me'",
      "Google Ads capturing clients searching for specific services in your area",
      "Instagram & Meta Ads showcasing nail art and designs to attract style-focused clients",
      "Review strategy to build your star rating and stand out from competitors",
      "Analytics tracking bookings, calls, and which channels drive new appointments",
    ],
    faq: (city, _state) => [
      {
        q: `How do I get my nail salon to rank higher on Google in ${city}?`,
        a: `Ranking in the local map pack requires a fully optimised GBP, consistent five-star reviews, and accurate NAP (name, address, phone) data across directories. We handle all of this — most ${city} salons see results in 4–8 weeks.`,
      },
      {
        q: `Are Instagram Ads worth it for a nail salon?`,
        a: `Absolutely. Nail art is highly visual and performs well on Instagram. We run tight geographic targeting so your ads only reach people in ${city} who are likely to book.`,
      },
      {
        q: `How much should a nail salon in ${city} spend on marketing?`,
        a: `Most ${city} nail salons see strong results with $200–$500/month. Given repeat-client lifetime value and the relatively low cost per lead for local searches, the ROI is typically excellent.`,
      },
      {
        q: `How do I get more five-star reviews for my nail salon?`,
        a: `The simplest system: send clients a follow-up text or email 24 hours after their appointment with a direct Google review link. We'll set this up so it happens automatically after every visit.`,
      },
    ],
  },

  "plumbers": {
    slug: "plumbers",
    label: "Plumber",
    labelPlural: "Plumbers",
    emoji: "🔧",
    primaryService: "Google Ads & Local SEO",
    accentClass: "bg-gradient-to-br from-blue-900 to-slate-900",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    tagline: (city) => `Get more service calls and jobs in ${city}`,
    intro: (city, state) =>
      `Plumbing is a high-urgency, high-value service. When someone in ${city}, ${state} needs a plumber, they search Google and call immediately. DataLatte helps ${city} plumbers dominate local search, run profitable Google Ads, and build the trusted reputation that wins both emergency and planned jobs.`,
    services: [
      "Google Business Profile optimisation to rank in '${city} plumber' map pack searches",
      "Local SEO targeting 'plumber near me', 'emergency plumber ${city}', and service-specific keywords",
      "Google Ads capturing high-intent plumbing searches — emergency and planned jobs",
      "Google Local Services Ads (LSA) for Google-guaranteed placement with pay-per-lead pricing",
      "Review generation to build the trust profile that converts searchers into callers",
      "Analytics to track every call, form submission, and job source by channel",
    ],
    faq: (city, _state) => [
      {
        q: `What's the fastest way to get more plumbing calls in ${city}?`,
        a: `Google Ads and Local Services Ads (LSA) can generate calls within days of launch. Both capture high-intent emergency and planned-job searches. For longer-term growth, GBP optimisation compounds over time.`,
      },
      {
        q: `Should I use Google Ads or Local Services Ads as a ${city} plumber?`,
        a: `Both work well. LSA places you at the very top with a Google Guaranteed badge and charges per lead. Regular Google Ads give more keyword control. We typically recommend starting with LSA if your reviews are strong.`,
      },
      {
        q: `How much should a ${city} plumber spend on Google Ads?`,
        a: `Most ${city} plumbing companies see strong results with $500–$1,500/month. With average job values of $300–$2,000+, even a handful of extra jobs per month creates excellent ROI.`,
      },
      {
        q: `How long does local SEO take for a plumber in ${city}?`,
        a: `GBP improvements are typically visible in 4–8 weeks. Ranking consistently for competitive ${city} plumber terms takes 3–6 months of ongoing work. Google Ads deliver results immediately.`,
      },
    ],
  },

  "electricians": {
    slug: "electricians",
    label: "Electrician",
    labelPlural: "Electricians",
    emoji: "⚡",
    primaryService: "Google Ads & Local SEO",
    accentClass: "bg-gradient-to-br from-coffee-800 to-coffee-900",
    heroImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80",
    tagline: (city) => `More service calls and jobs in ${city}`,
    intro: (city, state) =>
      `Electrical services in ${city}, ${state} are high-value and high-trust. When homeowners need an electrician, they search Google first and call whoever inspires the most confidence. DataLatte helps ${city} electricians dominate local search, run profitable Google Ads, and build the trusted reputation that wins residential and commercial jobs.`,
    services: [
      "Google Business Profile optimisation to rank in '${city} electrician' map pack searches",
      "Local SEO targeting 'electrician near me', 'licensed electrician ${city}', and service-specific keywords",
      "Google Ads capturing high-intent electrical searches across emergency and planned jobs",
      "Google Local Services Ads (LSA) for Google-guaranteed placement with pay-per-lead pricing",
      "Review generation to build the trust signals that convert searchers into callers",
      "Analytics to track every call, form submission, and job source by channel",
    ],
    faq: (city, _state) => [
      {
        q: `How do I get more electrical jobs in ${city}?`,
        a: `The most reliable combination: GBP optimisation to rank in local map searches, Google Ads for immediate high-intent traffic, and a strong review profile to convert searchers into callers. We run all three together.`,
      },
      {
        q: `Should I use Google Ads or Local Services Ads as a ${city} electrician?`,
        a: `LSA places you at the very top with a Google Guaranteed badge — great if you have strong reviews. Regular Google Ads offer more keyword control. We typically recommend both once you're established.`,
      },
      {
        q: `How much should an electrician in ${city} spend on Google Ads?`,
        a: `Most ${city} electricians see strong ROI with $500–$1,500/month. With average job values of $500–$3,000+, even a few additional jobs per month more than covers the ad spend.`,
      },
      {
        q: `How long does local SEO take for an electrician in ${city}?`,
        a: `GBP improvements show up in 4–8 weeks. Ranking consistently for competitive ${city} electrician terms takes 3–6 months. Google Ads and LSA deliver results immediately while SEO compounds.`,
      },
    ],
  },
};
