import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/local-seo",
    languages: {
      "en-US": "https://datalatte.pro/services/local-seo",
      "en-GB": "https://datalatte.pro/services/local-seo",
      "en-AU": "https://datalatte.pro/services/local-seo",
      "en-CA": "https://datalatte.pro/services/local-seo",
      "x-default": "https://datalatte.pro/services/local-seo",
    },
  },
  title: "Local SEO for Small Businesses | Coffee Shops, Salons & More",
  description:
    "Local SEO services for small businesses. Rank for 'near me' searches, build local citations, and drive consistent organic traffic from your neighborhood.",
  openGraph: {
    title: "Local SEO for Small Businesses | Coffee Shops, Salons & More",
    description: "Local SEO services for small businesses. Rank for 'near me' searches, build local citations, and drive consistent organic traffic from your neighborhood.",
    url: "https://datalatte.pro/services/local-seo",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Local SEO for Small Businesses | Coffee Shops, Salons & More",
    description: "Local SEO services for small businesses. Rank for 'near me' searches, build local citations, and drive consistent organic traffic from your neighborhood.",
  },
};

export default function LocalSEOPage() {
  return (
    <ServicePage
      service="Local SEO"
      tagline="Rank for the searches that bring real customers — not just traffic for vanity metrics."
      description="Local SEO is how your business shows up organically when someone searches for what you offer in your area. Unlike ads, it compounds over time and keeps working even when you're not actively spending."
      icon="🔍"
      accentClass="bg-gradient-to-br from-coffee-800 to-coffee-950"
      whatItIs="Local SEO is the practice of optimizing your online presence so that Google shows your business in search results for location-specific queries — 'coffee shop downtown Chicago', 'hair salon near me', 'pet groomer in Brooklyn'. It works through a combination of Google Business Profile signals, on-page website optimization, local citation building (consistent NAP — Name, Address, Phone — across directories), earning local links, and technical SEO basics. Good local SEO compounds: a well-optimized business gets more clicks, those clicks build stronger engagement signals, which improves ranking, which gets more clicks. It's the channel that keeps on giving.\n\nIn the marketing funnel, local SEO operates at both the awareness and decision stages. Someone discovers your café while exploring coffee options downtown (awareness), and later searches specifically for your business name to check hours or read reviews before visiting (decision). According to Google, 46% of all searches have local intent — and 88% of people who do a local search on their smartphone visit or call the business within 24 hours. That conversion speed is unmatched by almost any other channel. Better still, unlike paid ads, a well-earned top-3 ranking costs nothing per click and can hold its position for months or years.\n\nThe single biggest mistake local businesses make with SEO is NAP inconsistency — having their business listed as '123 Main St.' in one directory and '123 Main Street, Suite 1' in another. Google cross-references dozens of data sources to verify your business is real and trustworthy. Conflicting information introduces doubt and suppresses your rankings. A thorough citation audit, cleaning up these inconsistencies before building new ones, is often one of the fastest and most impactful early wins in any local SEO engagement."
      howItWorks={[
        {
          step: "01",
          title: "Local SEO audit",
          desc: "I assess your current ranking positions, Google Business Profile health, citation consistency, website on-page signals, and backlink profile compared to your top local competitors.",
        },
        {
          step: "02",
          title: "Keyword mapping",
          desc: "Research the specific terms your ideal local customers are searching — service + city, service + neighborhood, service + 'near me'. Map these to your website pages and GBP.",
        },
        {
          step: "03",
          title: "On-page optimization",
          desc: "Title tags, meta descriptions, H1s, and body copy updated with local keywords. Local landing pages created if needed (e.g., separate pages for each neighborhood you serve).",
        },
        {
          step: "04",
          title: "Citation audit and build",
          desc: "Audit your existing citations for inconsistencies (wrong phone, old address). Build new citations on relevant directories: Google, Yelp, Apple Maps, Facebook, industry-specific directories.",
        },
        {
          step: "05",
          title: "Content strategy",
          desc: "Identify local content opportunities — neighborhood guides, local event coverage, service-specific FAQ pages — that can rank and attract local links.",
        },
      ]}
      included={[
        "Comprehensive local SEO audit",
        "Competitor ranking analysis",
        "Local keyword research and mapping",
        "On-page optimization for key pages",
        "Google Business Profile optimization",
        "Citation audit and cleanup",
        "New citation building (top 20+ directories)",
        "Schema markup implementation (LocalBusiness, etc.)",
        "Monthly ranking report",
        "Content brief for local SEO pages",
        "Internal linking architecture review and recommendations",
        "Core Web Vitals check and page speed recommendations",
        "Hyperlocal neighborhood page strategy (for multi-zone businesses)",
      ]}
      notIncluded={[
        "Link building outreach campaigns (I can advise but it's a separate engagement)",
        "Content writing (I provide briefs, you or a copywriter writes)",
        "Technical website development (I flag issues with recommendations)",
        "National SEO — my focus is local",
      ]}
      bestFor={[
        "Local businesses with no existing SEO foundation",
        "Businesses in markets where competitors have weak local SEO",
        "Business owners who want long-term, non-ad-dependent traffic",
        "Coffee shops, salons, groomers, and studios in medium-competition markets",
        "Businesses that recently moved or opened a new location",
        "Any business looking to reduce reliance on paid ads over time",
      ]}
      faqs={[
        {
          q: "How long does local SEO take to work?",
          a: "Honest answer: 3–6 months to see meaningful ranking improvements, 6–12 months for compounding results. If anyone promises results in 30 days, they're either selling you GBP optimization (which works faster) or they're lying.",
        },
        {
          q: "Do I need to blog for local SEO?",
          a: "Not necessarily for the basics. Your service pages, GBP, and citations can rank without a blog. But targeted local content (e.g., 'Best coffee shops in [neighborhood]') can significantly accelerate results and is worth doing eventually.",
        },
        {
          q: "I have multiple locations — does that complicate things?",
          a: "Multi-location SEO is more complex but very doable. Each location needs its own GBP, its own page on your website, and its own citation set. I scope multi-location work separately.",
        },
        {
          q: "What's the difference between local SEO and regular SEO?",
          a: "Regular SEO focuses on ranking nationally or globally. Local SEO focuses on ranking for queries with geographic intent — 'near me', city names, neighborhood names. The tactics overlap but local SEO puts much more emphasis on GBP, citations, and local signals.",
        },
        {
          q: "How much does local SEO cost — and is it worth it compared to Google Ads?",
          a: "Local SEO typically requires a one-time or monthly investment but delivers zero-cost-per-click traffic once rankings are established. Compared to Google Ads, it's slower to start but dramatically cheaper long-term. Most businesses that run both find that SEO lowers their average cost per customer acquisition over 6–12 months.",
        },
        {
          q: "My business is brand new — is local SEO even relevant yet?",
          a: "Absolutely — and the sooner you start, the better. Getting your citations and GBP set up correctly from day one means you avoid the painful cleanup work that most established businesses need. A brand-new business can often rank faster than older ones if the older competitors have neglected their online presence.",
        },
        {
          q: "What are local citations and why do they matter?",
          a: "Citations are any online mention of your business name, address, and phone number — on directories like Yelp, Apple Maps, TripAdvisor, YellowPages, and hundreds of industry-specific sites. Google uses them to verify your business is legitimate and located where you say it is. Consistent, widespread citations are a foundational local ranking signal.",
        },
        {
          q: "Can I do local SEO myself, or do I need a specialist?",
          a: "The basics — claiming your GBP, filling out your profile, asking for reviews — you can absolutely do yourself. Where most business owners get stuck is keyword research, on-page optimization, technical fixes, and citation cleanup. These areas have a high return on specialist time and are where I focus.",
        },
      ]}
      stats={[
        { value: "46%", label: "Of Google searches have local intent" },
        { value: "88%", label: "Local searchers visit or call within 24h" },
        { value: "3–6mo", label: "Time to meaningful ranking gains" },
        { value: "0", label: "Cost per click once ranked" },
      ]}
      relatedLinks={[
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
