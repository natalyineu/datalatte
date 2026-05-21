import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/cro",
    languages: {
      "en-US": "https://datalatte.pro/services/cro",
      "en-GB": "https://datalatte.pro/services/cro",
      "en-AU": "https://datalatte.pro/services/cro",
      "en-CA": "https://datalatte.pro/services/cro",
      "x-default": "https://datalatte.pro/services/cro",
    },
  },
  title: "Conversion Rate Optimisation (CRO) for Small Businesses | DataLatte",
  description:
    "Turn more visitors into customers without spending more on ads. CRO audits, A/B testing, and landing page optimisation for local and growing businesses.",
  openGraph: {
    title: "Conversion Rate Optimisation (CRO) for Small Businesses | DataLatte",
    description: "Turn more visitors into customers without spending more on ads. CRO audits, A/B testing, and landing page optimisation for local and growing businesses.",
    url: "https://datalatte.pro/services/cro",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte — CRO for Small Businesses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversion Rate Optimisation (CRO) for Small Businesses | DataLatte",
    description: "Turn more visitors into customers without spending more on ads.",
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

export default function CROPage() {
  return (
    <ServicePage
      service="Conversion Rate Optimisation"
      tagline="Get more customers from the traffic you already have — without increasing ad spend."
      description="If 100 people visit your website and only 2 book an appointment, your conversion rate is 2%. CRO is the practice of systematically improving that number. Doubling your conversion rate is the same as doubling your traffic — but it costs a fraction of the price."
      icon="📈"
      accentClass="bg-gradient-to-br from-violet-800 to-violet-950"
      whatItIs="Conversion Rate Optimisation (CRO) is the process of identifying why visitors leave your website without taking action — and then fixing it. The reasons are almost always the same: unclear value proposition, confusing navigation, slow load times, weak CTAs, lack of trust signals, or forms that are too long. CRO is data-driven: I use heatmaps, session recordings, Google Analytics funnels, and A/B tests to identify exactly where people drop off and what changes move the needle. For local businesses running Google Ads or Meta Ads, CRO is often the highest-ROI investment you can make — because every improvement multiplies the return on every dollar you're already spending."
      howItWorks={[
        {
          step: "01",
          title: "CRO audit",
          desc: "I review your site with Google Analytics, heatmaps, and session recordings to identify your highest-traffic pages, drop-off points, and conversion bottlenecks.",
        },
        {
          step: "02",
          title: "Prioritised fix list",
          desc: "I produce a prioritised list of changes ranked by expected impact and implementation effort — quick wins first, structural changes second.",
        },
        {
          step: "03",
          title: "Landing page redesign",
          desc: "For key pages (homepage, service pages, ad landing pages), I redesign the layout, copy, CTA placement, and trust signals based on the audit findings.",
        },
        {
          step: "04",
          title: "A/B testing",
          desc: "Where traffic volume allows, I set up A/B tests to validate changes before rolling them out site-wide. No guessing — data-driven decisions only.",
        },
        {
          step: "05",
          title: "Ongoing optimisation",
          desc: "CRO is never 'done'. I monitor conversion rates monthly, run new experiments, and adapt to changing traffic sources and user behaviour.",
        },
      ]}
      included={[
        "Full CRO audit (Google Analytics, heatmaps, session recordings)",
        "User journey mapping and funnel analysis",
        "Conversion bottleneck report with prioritised recommendations",
        "Homepage and key service page redesign",
        "Ad landing page design and copywriting",
        "Call-to-action (CTA) copy and placement optimisation",
        "Trust signal audit (testimonials, reviews, awards, security badges)",
        "Mobile UX review and optimisation",
        "Page speed and Core Web Vitals improvements",
        "A/B test setup, monitoring, and analysis",
        "Form optimisation (length, fields, friction reduction)",
        "Monthly conversion rate tracking and reporting",
      ]}
      bestFor={[
        "Businesses running Google or Meta Ads with a low conversion rate",
        "Local services where bookings or calls are the primary goal",
        "E-commerce stores with high traffic but low purchase rate",
        "Businesses that recently redesigned their site but aren't seeing results",
        "Anyone whose cost-per-lead is rising and they don't know why",
        "SaaS companies optimising free trial or demo sign-up flows",
      ]}
      faqs={[
        {
          q: "What's a good conversion rate for a local business website?",
          a: "It varies by industry and traffic source, but for a local service business (salon, gym, dentist), a 3–6% conversion rate from Google Ads traffic is solid. Under 2% is a red flag. From organic traffic, 1–3% is more typical. I'll benchmark yours against your industry.",
        },
        {
          q: "Do I need a lot of traffic for CRO to work?",
          a: "For A/B testing, yes — you need roughly 1,000+ visitors per month per variation to reach statistical significance quickly. But the audit and qualitative recommendations are valuable at any traffic level. Even a simple fix to a broken booking form can double conversions overnight.",
        },
        {
          q: "Can CRO help if my ads aren't converting?",
          a: "Absolutely. Most of the time when ads aren't converting, it's a landing page problem, not an ads problem. I audit both together and can tell you definitively where the drop-off is happening.",
        },
        {
          q: "How much can CRO actually improve my results?",
          a: "Improvements of 20–50% in conversion rate are common after a proper audit and fixes. For a business spending $1,000/month on ads, going from 2% to 3% conversion rate means 50% more leads from the same budget.",
        },
      ]}
      relatedLinks={[
        { label: "Website & Landing Pages", href: "/services/website" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
