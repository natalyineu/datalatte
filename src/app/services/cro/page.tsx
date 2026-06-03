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
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversion Rate Optimisation (CRO) for Small Businesses | DataLatte",
    description: "Turn more visitors into customers without spending more on ads.",
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
      stats={[
        { value: "2–3×", label: "Average improvement in conversion rate after a professional CRO audit" },
        { value: "38%", label: "Of users abandon a website if the layout or content is unattractive" },
        { value: "0", label: "Extra ad spend needed to double leads — just convert existing traffic better" },
      ]}
      whatItIs="Conversion Rate Optimisation (CRO) is the process of identifying why visitors leave your website without taking action — and then fixing it. The reasons are almost always the same: unclear value proposition, confusing navigation, slow load times, weak CTAs, lack of trust signals, or forms that are too long. CRO is data-driven: I use heatmaps, session recordings, Google Analytics funnels, and A/B tests to identify exactly where people drop off and what changes move the needle. For local businesses running Google Ads or Meta Ads, CRO is often the highest-ROI investment you can make — because every improvement multiplies the return on every dollar you're already spending.

Consider the economics: if you spend $1,000/month on Google Ads and your landing page converts at 2%, you get roughly 20 leads. Fix the page to convert at 4% and you get 40 leads — with zero increase in ad spend. No other marketing activity offers that kind of leverage on existing investment. And unlike ads, the improvements are permanent: a better page keeps converting long after the one-time optimisation cost is recovered.

CRO for local businesses is different from CRO for large e-commerce — the primary goals are phone calls, booking form submissions, and direction requests, not purchases. I specialise in this context: optimising for local trust signals (your address, photos of your space, staff faces, Google review count), reducing friction in booking flows, and making it dead simple for a first-time visitor to take the one action that matters most."
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
        {
          q: "What tools do you use for CRO analysis?",
          a: "I use Google Analytics 4 for funnel analysis and traffic source breakdown, Microsoft Clarity or Hotjar for heatmaps and session recordings, and Google Optimize or VWO for A/B testing. For Core Web Vitals, I use PageSpeed Insights and Lighthouse. The tool choice depends on your current setup and traffic volume.",
        },
        {
          q: "How long does a CRO engagement take?",
          a: "An initial audit and first round of fixes typically takes 2–4 weeks. Meaningful A/B test results require 4–8 weeks of running time to reach statistical significance. Most clients see their first measurable uplift within 30–60 days, with further gains compounding over subsequent test cycles.",
        },
        {
          q: "Is CRO a one-time project or ongoing?",
          a: "Both options work. Many clients start with a one-time audit and implementation, which delivers lasting improvements. Ongoing monthly CRO — running continuous experiments — makes sense once you have 5,000+ monthly visitors and want to compound gains over time. I'll recommend which model fits your current traffic level.",
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
