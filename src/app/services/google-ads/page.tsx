import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/google-ads",
    languages: {
      "en-US": "https://datalatte.pro/services/google-ads",
      "en-GB": "https://datalatte.pro/services/google-ads",
      "en-AU": "https://datalatte.pro/services/google-ads",
      "en-CA": "https://datalatte.pro/services/google-ads",
      "x-default": "https://datalatte.pro/services/google-ads",
    },
  },
  title: "Google Ads for Coffee Shops, Salons & Local Businesses",
  description:
    "Google Ads management for local businesses and growing brands. Pay only for clicks from customers actively searching for you. Setup, strategy, and ongoing optimisation included.",
  openGraph: {
    title: "Google Ads for Coffee Shops, Salons & Local Businesses",
    description: "Google Ads management for local businesses and growing brands. Pay only for clicks from customers actively searching for you. Setup, strategy, and ongoing optimisation included.",
    url: "https://datalatte.pro/services/google-ads",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte — Google Ads for Local Businesses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Ads for Coffee Shops, Salons & Local Businesses",
    description: "Google Ads management for local businesses and growing brands. Pay only for clicks from customers actively searching for you.",
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

export default function GoogleAdsPage() {
  return (
    <ServicePage
      service="Google Ads"
      tagline="Show up when locals are actively searching. Pay only when they click."
      description="Google Ads puts your business at the top of search results the moment a potential customer types in what you offer. Done right, it's the most direct path from 'someone searching' to 'customer in your door.'"
      icon="🎯"
      accentClass="bg-gradient-to-br from-coffee-900 to-coffee-950"
      whatItIs="Google Ads (formerly AdWords) is a pay-per-click advertising platform that lets you show text ads — and now image and video ads — across Google Search, Google Maps, YouTube, and thousands of partner websites. For local businesses, the most valuable type is Search Ads: you bid on keywords like 'hair salon near me' and your ad shows up at the top of the results page. You only pay when someone actually clicks. The power is in the intent — people on Google Search are actively looking for something. That's very different from Facebook or Instagram where you're interrupting someone's scroll."
      howItWorks={[
        {
          step: "01",
          title: "Audit & research",
          desc: "I start by auditing your existing account (if you have one) and researching your local keyword landscape — what people are searching, how competitive it is, and what a realistic budget looks like.",
        },
        {
          step: "02",
          title: "Campaign architecture",
          desc: "I build tightly themed ad groups with relevant keywords, strong negative keyword lists, and geographic targeting set to your actual service area — not just the whole city.",
        },
        {
          step: "03",
          title: "Ad copy that converts",
          desc: "Headlines and descriptions written to match search intent. I test multiple variations and iterate based on click-through and conversion data.",
        },
        {
          step: "04",
          title: "Conversion tracking",
          desc: "Before anything goes live, I set up proper conversion tracking — calls, form submissions, booking completions. If we can't measure it, we can't improve it.",
        },
        {
          step: "05",
          title: "Optimize & report",
          desc: "Weekly bid adjustments, search term mining for new keywords and negatives, Quality Score improvements. Monthly reports in plain English.",
        },
      ]}
      included={[
        "Account setup or full audit of existing account",
        "Keyword research and competitive landscape analysis",
        "Campaign and ad group architecture",
        "Ad copywriting, RSA optimisation and A/B testing",
        "Geographic, demographic, and audience targeting",
        "Negative keyword management and search term mining",
        "Conversion tracking setup (calls, forms, bookings, purchases)",
        "Google Shopping & Performance Max campaigns",
        "Display and YouTube campaigns",
        "Remarketing and audience list strategy",
        "Landing page recommendations and CRO guidance",
        "Landing page design and build (if needed)",
        "Quality Score improvement and bid strategy optimisation",
        "Weekly optimisations and bid adjustments",
        "Monthly performance reports in plain English",
        "Multi-location and multi-market campaign management",
      ]}
      bestFor={[
        "Coffee shops wanting to show up for 'near me' searches",
        "Hair salons targeting specific service searches like 'balayage near me'",
        "Pet groomers in competitive local markets",
        "Fitness studios promoting trial class sign-ups",
        "E-commerce brands running Shopping and Performance Max",
        "Multi-location businesses needing coordinated geo campaigns",
        "SaaS and B2B companies running lead generation campaigns",
        "Enterprise brands requiring structured campaign hierarchies",
        "Any business where customers actively search before buying",
      ]}
      faqs={[
        {
          q: "How much should I budget for Google Ads?",
          a: "For most local businesses in this space, $300–$800/month in ad spend is a strong starting point. I'll give you a specific recommendation based on your location and competition level during the free audit. My management fee is separate and transparent.",
        },
        {
          q: "How quickly will I see results?",
          a: "Google Ads can drive traffic the day you launch. However, the first 4–6 weeks is a learning phase where we gather data and optimize. Expect the best performance after 2–3 months of refinement.",
        },
        {
          q: "My competitor's ads are everywhere — can I compete?",
          a: "Often yes. Big advertisers aren't always smart advertisers. With tight geo-targeting, good negative keywords, and strong Quality Scores, a smaller budget can outperform a larger, poorly-managed account.",
        },
        {
          q: "Do I need a website to run Google Ads?",
          a: "For Search Ads, yes — you need somewhere to send traffic. If your site isn't converting well, I'll flag it. Google also offers Google Ads extensions that can drive calls and direction requests directly from the ad.",
        },
      ]}
      relatedLinks={[
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
