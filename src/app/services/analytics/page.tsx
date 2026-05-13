import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Marketing Analytics & Reporting for Local Businesses",
  description:
    "Clear marketing analytics and dashboards for small businesses. Know exactly which channels bring in customers and stop guessing where to spend your marketing budget.",
};

export default function AnalyticsPage() {
  return (
    <ServicePage
      service="Analytics & Reporting"
      tagline="Know exactly what's working. No data overwhelm, no mystery black boxes."
      description="Most small business owners spend money on marketing and then wonder if it's working. I build clear, readable dashboards that answer the only question that matters: is this bringing in customers?"
      icon="📊"
      accentClass="bg-gradient-to-br from-gray-900 to-coffee-950"
      whatItIs="Analytics for local businesses means connecting your marketing channels — Google Ads, Meta Ads, GBP, website, organic search — to actual business outcomes: phone calls, form submissions, appointment bookings, direction requests. It sounds obvious, but most small businesses are flying blind. They know they 'got some calls from Google' but can't tell if it was from their ad, their GBP listing, or organic search. Without that attribution, you can't make smart spending decisions. Good analytics doesn't mean drowning in data — it means having a clear weekly or monthly snapshot that tells you what's growing, what's flat, and where to invest more."
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
