import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/ctv-advertising",
    languages: {
      "en-US": "https://datalatte.pro/services/ctv-advertising",
      "en-GB": "https://datalatte.pro/services/ctv-advertising",
      "en-AU": "https://datalatte.pro/services/ctv-advertising",
      "en-CA": "https://datalatte.pro/services/ctv-advertising",
      "x-default": "https://datalatte.pro/services/ctv-advertising",
    },
  },
  title: "CTV Advertising for Local Businesses — Connected TV Ads That Drive Foot Traffic",
  description:
    "Run TV-quality video ads on Hulu, Peacock, Pluto TV, ITVX, and 50+ streaming platforms. Hyper-local targeting by zip code or postcode. CPMs from $15. No minimum spend. Built for coffee shops, salons, gyms, and pet groomers.",
  openGraph: {
    title: "CTV Advertising for Local Businesses | DataLatte",
    description:
      "Reach streaming audiences in your exact zip code or postcode on Hulu, Peacock, Amazon, and ITVX. TV-quality video ads starting from $500/month — built for local service businesses.",
    url: "https://datalatte.pro/services/ctv-advertising",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CTV Advertising for Local Businesses | DataLatte",
    description: "TV ads on Hulu, Peacock, Amazon & ITVX — targeted to your exact neighborhood. Starting from $500/month.",
  },
};

export default function CTVAdvertisingPage() {
  return (
    <ServicePage
      service="CTV Advertising"
      tagline="Your ad on the living room screen. Their neighborhood. Their moment."
      description="Connected TV advertising puts your 15- or 30-second video ad on Hulu, Peacock, Amazon Prime Video, Pluto TV, ITVX, and 50+ streaming platforms — targeted to households within a specific radius of your business. It used to cost $50,000 to run a TV campaign. Now a coffee shop in Austin or a gym in Manchester can reach 20,000 local households for $800."
      icon="📺"
      accentClass="bg-gradient-to-br from-gray-800 to-gray-950"
      stats={[
        { value: "$30B+", label: "US CTV ad spend in 2025 — growing 20% year-over-year as linear TV declines" },
        { value: "$15–45", label: "Typical CPM (cost per thousand views) — far cheaper than linear TV's $40–80 CPM" },
        { value: "94%", label: "Completion rate on CTV — viewers can't skip non-skippable 15-second ads" },
      ]}
      whatItIs="Connected TV (CTV) advertising delivers video ads to internet-connected televisions — smart TVs, streaming sticks, and game consoles running apps like Hulu, Peacock, Pluto TV, Tubi, and Amazon Prime Video. Unlike traditional TV where you buy a time slot on a channel and hope your demographic is watching, CTV uses programmatic technology to target specific households based on location, income, interests, and viewing behaviour. You don't buy a channel. You buy an audience in a place.\n\nFor local businesses, the breakthrough is geographic precision. CTV platforms can target by zip code (US), postcode (UK), or suburb (AU/CA), meaning your ad appears only to households within a realistic travel distance of your business. A hair salon in Chicago's Lincoln Park neighbourhood can run a CTV campaign that reaches only 60614 and adjacent zip codes — not waste impressions on Naperville. This precision, combined with TV's inherent authority and non-skippable format, makes CTV the most powerful brand-building tool available to local businesses in 2026.\n\nThe most common mistake small businesses make with CTV is treating it like digital display — judging it on clicks and direct conversions. CTV is a brand awareness and demand-creation channel. It works by building recognition and trust with local households over repeated exposures. The correct way to measure CTV success is branded search lift (more people Googling your business name), direct traffic increases, and foot traffic growth over the campaign period. Businesses that pair CTV (awareness) with Google Search Ads (intent capture) see 30–50% better overall campaign performance than either channel alone."
      howItWorks={[
        {
          step: "01",
          title: "Geo-targeting strategy",
          desc: "We define your target radius — typically 3–10 miles / 5–15 km from your location — and map it to zip codes, postcodes, or DMA regions. For multi-location businesses, we build separate geo-targets per location to prevent overlap.",
        },
        {
          step: "02",
          title: "Platform selection",
          desc: "I select the streaming platforms that best match your audience: Hulu and Peacock for premium US reach, Pluto TV and Tubi for affordable frequency, Amazon Prime Video for household income targeting, ITVX and Channel 4 for UK campaigns. Budget determines the mix.",
        },
        {
          step: "03",
          title: "Creative briefing and production",
          desc: "CTV requires 16:9 horizontal video, 15 or 30 seconds, with clear audio (viewers watch with sound on). I brief your video production or work with production partners. For businesses without video, I can help source cost-effective production options starting from $300.",
        },
        {
          step: "04",
          title: "Campaign setup and compliance",
          desc: "I traffic the creative, configure frequency caps (2–3 views per household per week to avoid fatigue), set dayparting if relevant (e.g., dinner-time for restaurants), and handle any platform compliance requirements like Clearcast in the UK.",
        },
        {
          step: "05",
          title: "Audience layering",
          desc: "Beyond geo, I layer audience signals: household income, interest categories (fitness, food, beauty), and behavioural data (recent searchers for your service category). This ensures your TV ad reaches local households that are genuinely likely to become customers.",
        },
        {
          step: "06",
          title: "Measurement and optimisation",
          desc: "Weekly reporting on impressions, completion rate, reach, and frequency. Monthly review of branded search lift and direct traffic to attribute CTV impact. Campaign is optimised by shifting spend to best-performing platforms and audience segments.",
        },
      ]}
      included={[
        "Platform strategy and selection (US, UK, AU, CA, EU markets)",
        "Geo-targeting setup: zip code, postcode, radius, or DMA/region",
        "Audience layering: income, interest, behavioural, and intent segments",
        "Creative specifications and trafficking (15s and 30s formats)",
        "Frequency capping and dayparting configuration",
        "Platform compliance support (Clearcast UK, NAI standards US)",
        "Weekly delivery reports: impressions, completion rate, reach, frequency",
        "Branded search lift tracking and attribution setup",
        "CTV + Google Search coordination for full-funnel performance",
        "Multi-location campaign management",
      ]}
      bestFor={[
        "Coffee shops and cafés wanting to own their local neighborhood",
        "Hair salons and beauty studios building brand recognition in a radius",
        "Fitness studios and gyms running seasonal acquisition campaigns",
        "Pet groomers competing with national franchise chains on brand visibility",
        "Restaurants targeting local households before dinner-time decisions",
        "Any local business that has maxed out Google and Meta and needs new reach",
        "Multi-location businesses needing consistent brand presence across markets",
      ]}
      faqs={[
        {
          q: "What is the minimum budget for CTV advertising?",
          a: "You can run a meaningful test campaign from $500–$800 per month on platforms like Pluto TV or Tubi (US) or My5 (UK). To get reliable frequency (the 3+ exposures needed to build brand memory), a core local CTV campaign typically needs $1,500–$3,000/month. Below $500, impressions are too thin to generate measurable brand lift. I'll always tell you honestly if your budget is too small for CTV to work.",
        },
        {
          q: "What kind of video do I need for CTV?",
          a: "A 15-second horizontal (16:9) video ad with clear audio. The creative does not need to be broadcast-TV quality — it needs to be clean, professional, and communicate one clear message: who you are, what you offer, and where you are. Many local businesses produce effective CTV creative with a simple voiceover, b-roll footage of their premises, and a logo end card. I can advise on production options, including budget-friendly local videographers and AI-assisted production tools.",
        },
        {
          q: "How is CTV different from YouTube advertising?",
          a: "YouTube is skippable after 5 seconds and plays on phones and laptops — it behaves like social media advertising. CTV delivers non-skippable ads (typically 15 seconds) to the household television screen during premium long-form content like TV shows and movies. The viewing context is fundamentally different: CTV viewers are settled in, attentive, and in a lean-back mindset that is far more receptive to brand advertising than a mobile YouTube pre-roll someone is trying to skip. CTV completion rates average 94% vs 30–40% for skippable YouTube.",
        },
        {
          q: "Can I track whether CTV ads are driving customers to my business?",
          a: "Not with direct click tracking — CTV viewers aren't clicking on their TV screens. The correct measurement framework for CTV is: (1) branded search lift — are more people Googling your business name during the campaign? (2) direct website traffic — is there a measurable increase in direct visits? (3) foot traffic attribution — platforms like The Trade Desk offer location-based attribution matching device IDs exposed to your ad against store visit data. I set all three up as standard on every CTV campaign.",
        },
        {
          q: "Which streaming platforms are available in my country?",
          a: "CTV platforms vary significantly by market. In the US: Hulu, Peacock, Pluto TV, Tubi, Amazon Prime Video, Paramount+, Samsung TV+. In the UK: ITVX, Channel 4 Streaming, My5, Sky AdSmart, Amazon Prime Video, Pluto TV. In Australia: BINGE, 9Now, 7Plus, Kayo, Amazon Prime Video AU. In Canada: Crave, CBC Gem, Citytv, Amazon Prime Video CA. I work across all major English-language markets and select the optimal platform mix for your location.",
        },
      ]}
      relatedLinks={[
        { label: "Programmatic Advertising", href: "/services/programmatic" },
        { label: "Video Marketing", href: "/services/video-marketing" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
