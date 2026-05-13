import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Local SEO for Small Businesses | Coffee Shops, Salons & More",
  description:
    "Local SEO services for small businesses. Rank for 'near me' searches, build local citations, and drive consistent organic traffic from your neighborhood.",
};

export default function LocalSEOPage() {
  return (
    <ServicePage
      service="Local SEO"
      tagline="Rank for the searches that bring real customers — not just traffic for vanity metrics."
      description="Local SEO is how your business shows up organically when someone searches for what you offer in your area. Unlike ads, it compounds over time and keeps working even when you're not actively spending."
      icon="🔍"
      accentClass="bg-gradient-to-br from-coffee-800 to-coffee-950"
      whatItIs="Local SEO is the practice of optimizing your online presence so that Google shows your business in search results for location-specific queries — 'coffee shop downtown Chicago', 'hair salon near me', 'pet groomer in Brooklyn'. It works through a combination of Google Business Profile signals, on-page website optimization, local citation building (consistent NAP — Name, Address, Phone — across directories), earning local links, and technical SEO basics. Good local SEO compounds: a well-optimized business gets more clicks, those clicks build stronger engagement signals, which improves ranking, which gets more clicks. It's the channel that keeps on giving."
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
      ]}
      relatedLinks={[
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
