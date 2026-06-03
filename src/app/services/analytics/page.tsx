import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/analytics",
    languages: {
      "en-US": "https://datalatte.pro/services/analytics",
      "en-GB": "https://datalatte.pro/services/analytics",
      "en-AU": "https://datalatte.pro/services/analytics",
      "en-CA": "https://datalatte.pro/services/analytics",
      "x-default": "https://datalatte.pro/services/analytics",
    },
  },
  title: "Marketing Analytics & Reporting for Local Businesses",
  description:
    "Clear marketing analytics and dashboards for small businesses. Know exactly which channels bring in customers and stop guessing where to spend your marketing budget.",
  openGraph: {
    title: "Marketing Analytics & Reporting for Local Businesses",
    description: "Clear marketing analytics and dashboards for small businesses. Know exactly which channels bring in customers and stop guessing where to spend your marketing budget.",
    url: "https://datalatte.pro/services/analytics",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Analytics & Reporting for Local Businesses",
    description: "Clear marketing analytics and dashboards for small businesses. Know exactly which channels bring in customers and stop guessing where to spend your marketing budget.",
  },
};

export default function AnalyticsPage() {
  return (
    <ServicePage
      service="Analytics & Reporting"
      tagline="Know exactly what's working. No data overwhelm, no mystery black boxes."
      description="Most small business owners spend money on marketing and then wonder if it's working. I build clear, readable dashboards that answer the only question that matters: is this bringing in customers?"
      icon="📊"
      accentClass="bg-gradient-to-br from-gray-900 to-coffee-950"
      whatItIs="Analytics for local businesses means connecting your marketing channels — Google Ads, Meta Ads, GBP, website, organic search — to actual business outcomes: phone calls, form submissions, appointment bookings, direction requests. It sounds obvious, but most small businesses are flying blind. They know they 'got some calls from Google' but can't tell if it was from their ad, their GBP listing, or organic search. Without that attribution, you can't make smart spending decisions. Good analytics doesn't mean drowning in data — it means having a clear weekly or monthly snapshot that tells you what's growing, what's flat, and where to invest more.\n\nWithin the broader marketing funnel, analytics is the connective tissue that holds everything together. At the top of the funnel, it tells you which channels are driving awareness — how many people are finding your Google Business Profile, visiting your website for the first time, or clicking through from social. In the middle, it shows you where potential customers drop off: which pages they bounce from, which booking flows create friction, which ads generate clicks but no calls. At the bottom, it attributes real revenue and bookings to specific campaigns so you know exactly which pound or dollar of spend is pulling its weight. Without this layer, you're making every marketing decision on gut feel — and gut feel rarely beats data.\n\nThe most common mistake small businesses make with analytics is treating it as a 'set it and forget it' task — installing Google Analytics years ago and never looking at it again. According to McKinsey, data-driven businesses are 23 times more likely to acquire customers than those who don't use data to guide decisions. Yet most local business owners either have no tracking in place, or have GA installed but with zero conversion events configured, meaning the data they do have tells them almost nothing actionable. Pageviews alone don't pay the bills — tracked phone calls, booked appointments, and form submissions do."
      howItWorks={[
        {
          step: "01",
          title: "Tracking audit",
          desc: "I audit what's currently tracked (often: very little) and identify the conversion actions that matter most to your business — calls, bookings, form fills, direction requests.",
        },
        {
          step: "02",
          title: "Implementation",
          desc: "Set up Google Analytics 4 with proper event tracking, Google Tag Manager for clean tag management, Meta Pixel, and call tracking if needed.",
        },
        {
          step: "03",
          title: "Dashboard build",
          desc: "Build a clear Looker Studio (free Google tool) dashboard that pulls in data from all your channels. Designed to be readable by a non-data person.",
        },
        {
          step: "04",
          title: "Attribution setup",
          desc: "Where possible, connect ad spend to actual conversions so you can see cost per lead, cost per booking, and ROAS by channel.",
        },
        {
          step: "05",
          title: "Monthly review",
          desc: "Walk through your numbers together each month. What grew, what needs attention, what to adjust. Plain English, actionable recommendations.",
        },
      ]}
      included={[
        "GA4 setup or audit and reconfiguration",
        "Google Tag Manager setup",
        "Conversion event tracking (calls, forms, bookings)",
        "Meta Pixel and standard events setup",
        "GBP performance tracking",
        "Looker Studio dashboard (custom to your business)",
        "UTM parameter strategy for link tracking",
        "Monthly analytics review call",
        "Plain English monthly report",
        "Cross-channel attribution mapping (ads vs organic vs GBP)",
        "Funnel drop-off analysis to identify conversion blockers",
        "Keyword and landing page performance breakdown",
      ]}
      notIncluded={[
        "Advanced data warehousing or custom BI tools (overkill for most local businesses)",
        "Heatmapping / session recording setup (I can recommend tools like Hotjar)",
        "CRM integration (I can advise, depends on your CRM)",
        "Automated email or SMS reporting pipelines",
      ]}
      bestFor={[
        "Businesses spending on ads with no conversion tracking in place",
        "Owners who want to know which marketing channels actually work",
        "Businesses with multiple marketing activities and no unified view",
        "Anyone who's ever said 'I think the ads are working but I'm not sure'",
        "Businesses preparing to scale their marketing investment",
        "Owners who want clear accountability from their marketing spend",
      ]}
      faqs={[
        {
          q: "Is this just Google Analytics setup?",
          a: "It starts there, but it's more than that. The goal is a unified view of your marketing performance — connecting data from Google Ads, Meta, GBP, and your website into a single dashboard you can actually use.",
        },
        {
          q: "How technical do I need to be to use the dashboard?",
          a: "Not at all. I design dashboards for business owners, not data analysts. Big numbers, clear trends, traffic-light indicators. You should be able to read it in 5 minutes.",
        },
        {
          q: "Can you fix my existing analytics if it's a mess?",
          a: "Yes, and I often do. Old GA accounts with duplicate views, missing filters, broken goals, and no conversion tracking are very common. A clean slate in GA4 is often the right call.",
        },
        {
          q: "Do I need analytics if I'm only running Google Ads?",
          a: "Absolutely. Google Ads has its own reporting but without GA4 you miss a lot — what happens after the click, which pages people visit, whether they come back. Proper analytics makes your ad management significantly better.",
        },
        {
          q: "How much does Google Analytics cost?",
          a: "GA4 is completely free, as is Looker Studio (the dashboard tool I use). The investment is in the setup and configuration — making sure the data being collected is actually accurate and meaningful. Most businesses have GA installed but tracking nothing useful.",
        },
        {
          q: "Can I track phone calls from my ads and website?",
          a: "Yes. Call tracking is one of the most valuable things I set up for local businesses. I use Google's call tracking (free if you're running Google Ads) or a third-party tool like CallRail, so you can see exactly how many calls came from which source — ad, organic, GBP listing, or direct.",
        },
        {
          q: "What's the difference between GA4 and the old Universal Analytics?",
          a: "Universal Analytics was sunset in July 2023, so if you haven't migrated to GA4 yet, you have no historical data being collected right now. GA4 uses an event-based model instead of session-based, which gives you much more flexibility in tracking exactly the actions that matter to your business.",
        },
        {
          q: "How long does it take to set up proper tracking?",
          a: "A standard setup — GA4, GTM, conversion events, Meta Pixel, and the Looker Studio dashboard — typically takes 3–5 business days. Your dashboard is usually ready within 48 hours of completing the technical setup. After that, data starts flowing immediately.",
        },
      ]}
      stats={[
        { value: "23%", label: "Higher revenue for data-driven SMBs" },
        { value: "GA4", label: "Free & included in every engagement" },
        { value: "48h", label: "Dashboard ready after onboarding" },
        { value: "100%", label: "Reports in plain English, no jargon" },
      ]}
      relatedLinks={[
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
      ]}
    />
  );
}
