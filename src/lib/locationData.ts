export interface City {
  city: string;
  state: string;
  stateCode: string;
  slug: string; // e.g. "austin-tx"
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
];

export const NICHES = ["coffee-shops", "hair-salons", "pet-groomers", "fitness-studios"] as const;
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
    faq: (city, state) => [
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
    faq: (city, state) => [
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
    faq: (city, state) => [
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
    faq: (city, state) => [
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
};

// ── Service segments for niche × service intersection pages ───────────────────

export interface ServiceSegmentInfo {
  slug: string;
  label: string;
  shortLabel: string;
  icon: string;
  tagline: (nicheLabel: string) => string;
  intro: (nicheLabel: string, nicheLabelPlural: string) => string;
  bullets: (nicheLabel: string) => string[];
  ctaNote: string;
  href: string;
}

export const SERVICE_SEGMENTS: Record<string, ServiceSegmentInfo> = {
  "google-ads": {
    slug: "google-ads",
    label: "Google Ads",
    shortLabel: "Google Ads",
    icon: "🎯",
    tagline: (n) => `Show up at the top of Google when ${n.toLowerCase()} customers are searching`,
    intro: (n, np) =>
      `Google Ads is the fastest way for ${np.toLowerCase()} to capture customers who are actively searching right now. Unlike social ads, Google Ads targets people with real buying intent — they typed in exactly what they need. Done right, it delivers qualified leads within days of launch.`,
    bullets: (n) => [
      `Keyword research specific to ${n.toLowerCase()} services and your local area`,
      `Campaign structure built to avoid wasted spend on irrelevant searches`,
      `Ad copy that speaks to ${n.toLowerCase()} customers at the moment of decision`,
      `Conversion tracking: every call, booking, and form submission attributed`,
      `Negative keyword management to filter out tyre-kickers`,
      `Weekly optimisation and transparent monthly reporting`,
    ],
    ctaNote: "Campaigns go live within 1–2 weeks. Results visible within 30 days.",
    href: "/services/google-ads",
  },
  "local-seo": {
    slug: "local-seo",
    label: "Local SEO",
    shortLabel: "Local SEO",
    icon: "📍",
    tagline: (n) => `Rank in the Google Map Pack when locals search for ${n.toLowerCase()} services`,
    intro: (n, np) =>
      `Over 80% of local searches result in a visit or contact within 24 hours. For ${np.toLowerCase()}, ranking in the top 3 local results ("the map pack") is the single highest-ROI marketing activity — it's free traffic from people actively looking for what you offer.`,
    bullets: (n) => [
      `Google Business Profile optimisation specific to ${n.toLowerCase()} categories and attributes`,
      `On-page local SEO: title tags, location landing pages, and schema markup`,
      `Citation building and NAP consistency across directories`,
      `Review strategy to increase velocity and average rating`,
      `Competitor gap analysis to identify exactly what rivals are ranking for`,
      `Monthly tracking of map pack positions and organic keyword rankings`,
    ],
    ctaNote: "Initial improvements visible in 4–8 weeks. Compounding results over 3–6 months.",
    href: "/services/local-seo",
  },
  "meta-ads": {
    slug: "meta-ads",
    label: "Meta Ads",
    shortLabel: "Meta Ads",
    icon: "📱",
    tagline: (n) => `Reach ${n.toLowerCase()} customers on Facebook and Instagram before they start searching`,
    intro: (n, np) =>
      `Meta Ads (Facebook & Instagram) let ${np.toLowerCase()} reach a highly targeted local audience based on demographics, interests, and behaviours. Unlike Google Ads which captures existing demand, Meta Ads creates it — building awareness and driving action before someone even starts Googling.`,
    bullets: (n) => [
      `Audience strategy: local targeting, lookalike audiences, and retargeting`,
      `Creative guidance for ${n.toLowerCase()}-specific ad formats that stop the scroll`,
      `Campaign objective selection: bookings, leads, awareness, or foot traffic`,
      `Instagram and Facebook placement optimisation`,
      `A/B testing of ad copy, visuals, and offers`,
      `Pixel setup and conversion tracking for every lead and booking`,
    ],
    ctaNote: "Campaigns live in 1–2 weeks. Optimisation typically improves ROAS over 4–6 weeks.",
    href: "/services/meta-ads",
  },
  "google-business-profile": {
    slug: "google-business-profile",
    label: "Google Business Profile",
    shortLabel: "Google Business Profile",
    icon: "🗺️",
    tagline: (n) => `Win the local map pack and get more calls, directions, and bookings`,
    intro: (n, np) =>
      `Your Google Business Profile is the most visible piece of real estate in local search — it shows your photos, hours, reviews, and contact details before your website. For ${np.toLowerCase()}, an optimised GBP is often the difference between ranking in the top 3 and being invisible to local customers.`,
    bullets: (n) => [
      `Full GBP audit against ${n.toLowerCase()}-specific ranking factors`,
      `Category, attribute, and service section optimisation`,
      `Photo strategy: what types, how many, and how often to update`,
      `Google Posts calendar to maintain freshness signals`,
      `Review generation system and response template setup`,
      `Q&A section management and spam fighting`,
    ],
    ctaNote: "GBP improvements start affecting rankings within 4–8 weeks.",
    href: "/services/google-business-profile",
  },
  "email-sms": {
    slug: "email-sms",
    label: "Email & SMS Marketing",
    shortLabel: "Email & SMS",
    icon: "✉️",
    tagline: (n) => `Turn one-time visitors into loyal ${n.toLowerCase()} regulars`,
    intro: (n, np) =>
      `Email and SMS marketing delivers the highest ROI of any channel for ${np.toLowerCase()} — because it targets people who already visited, booked, or bought. It's the engine that turns a one-time customer into a regular, and a regular into a referral source.`,
    bullets: (n) => [
      `List building strategy: capture emails and phone numbers at every touchpoint`,
      `Welcome sequence that introduces new ${n.toLowerCase()} customers to your full offer`,
      `Re-engagement campaigns to win back lapsed clients`,
      `Booking reminder sequences to reduce no-shows`,
      `Seasonal and event campaigns for ${n.toLowerCase()} peak periods`,
      `Segmentation to send the right message to the right customer`,
    ],
    ctaNote: "First campaigns typically launch within 2–3 weeks. Results visible immediately on open and booking rates.",
    href: "/services/email-sms",
  },
  "social-media": {
    slug: "social-media",
    label: "Social Media Management",
    shortLabel: "Social Media",
    icon: "📸",
    tagline: (n) => `Build a feed that turns followers into ${n.toLowerCase()} customers`,
    intro: (n, np) =>
      `Organic social media for ${np.toLowerCase()} isn't about follower counts — it's about building trust with the local community that eventually converts into bookings and visits. A consistent, well-executed social presence builds the social proof that new customers look for before choosing any local service.`,
    bullets: (n) => [
      `Content strategy tailored to ${n.toLowerCase()} audience and platforms`,
      `Post scheduling: Instagram, Facebook, and Google Business Profile`,
      `${n} showcase content: before/afters, team features, and behind-the-scenes`,
      `Community management: responding to comments and DMs`,
      `Hashtag and location tagging strategy for local discovery`,
      `Monthly reporting on reach, engagement, and profile visits`,
    ],
    ctaNote: "Content calendar built and scheduled in week one. Engagement typically grows over 60–90 days.",
    href: "/services/social-media",
  },
};

export const SERVICE_SEGMENT_SLUGS = Object.keys(SERVICE_SEGMENTS);
