import type { Metadata } from "next";
import Link from "next/link";
import BudgetCalculator from "@/components/BudgetCalculator";

export const metadata: Metadata = {
  title: "Free Marketing Budget Calculator for Small Businesses",
  description:
    "Find out exactly how much to spend on Google Ads, Meta Ads, SEO, and more. Free calculator with personalized channel recommendations for coffee shops, salons, pet businesses, and fitness studios.",
  openGraph: {
    title: "Free Local Marketing Budget Calculator | DataLatte",
    description:
      "Get a personalised marketing budget breakdown in 60 seconds. Built for local businesses: coffee shops, salons, gyms, and more.",
    url: "https://datalatte.pro/tools/marketing-budget-calculator",
    type: "website",
  },
  alternates: {
    canonical: "https://datalatte.pro/tools/marketing-budget-calculator",
  },
};

const FAQ = [
  {
    q: "How much should a small business spend on marketing?",
    a: "Most small businesses should spend 7–15% of monthly revenue on marketing. New businesses in growth mode often invest 15–20%, while established businesses with steady revenue can maintain presence at 5–10%. The right number depends on your industry, competition, and goals.",
  },
  {
    q: "How do I split my marketing budget between channels?",
    a: "The best split depends on your primary goal. If you want new customers fast, weight toward Google Ads (40%) and Meta Ads (30%). If local visibility is the priority, invest more in Local SEO and Google Business Profile. For retention, Email & SMS marketing delivers the highest ROI.",
  },
  {
    q: "What's the minimum marketing budget for a local business?",
    a: "We recommend a minimum of $500/month for paid advertising to see meaningful results. Below that, budgets are too thin to generate sufficient data for optimisation. Many local businesses see strong results starting at $1,000–$2,000/month across two or three channels.",
  },
  {
    q: "Should I do Google Ads or Meta Ads first?",
    a: "Google Ads captures people actively searching for your service (high intent, faster results). Meta Ads builds awareness and reaches people who don't know they need you yet. For most local businesses, start with Google Ads for quick wins, then add Meta Ads once your baseline is profitable.",
  },
  {
    q: "How long does it take to see results from marketing?",
    a: "Google Ads can deliver results within days. Local SEO typically takes 3–6 months to gain traction. Email marketing shows results within weeks for existing customers. Plan your budget with a 90-day runway to measure true channel performance.",
  },
];

export default function MarketingBudgetCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Local Marketing Budget Calculator",
    url: "https://datalatte.pro/tools/marketing-budget-calculator",
    description:
      "Free interactive tool to calculate the recommended monthly marketing budget for local businesses, with channel-by-channel breakdown.",
    applicationCategory: "BusinessApplication",
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-coffee-50 to-white pt-16 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-coffee-100 text-coffee-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            ☕ Free Tool — No sign-up required
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Marketing Budget Calculator
            <br />
            <span className="text-coffee-600">for Local Businesses</span>
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Answer 4 quick questions and get a personalised monthly marketing budget
            with a channel-by-channel breakdown — in under 60 seconds.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 -mt-4">
          <BudgetCalculator />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How the calculator works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: "1", title: "Industry benchmarks", body: "Budget percentages are based on industry data across thousands of local businesses. New businesses typically invest more (15–20%) to build awareness, while established ones maintain at 5–10%." },
            { n: "2", title: "Goal-based allocation", body: "Your primary goal determines how to split spend. Customer acquisition favours paid ads. Local visibility favours SEO. Retention favours email. We weight the channels accordingly." },
            { n: "3", title: "Minimum floors", body: "Paid ad channels need a minimum budget to generate enough data for optimisation. We set a $500/month floor so your budget can actually produce meaningful results — not just impressions." },
          ].map(card => (
            <div key={card.n} className="bg-gray-50 rounded-2xl p-5">
              <div className="w-8 h-8 bg-coffee-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">{card.n}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing budget FAQs</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-coffee-700 rounded-3xl p-8 text-white text-center">
          <div className="text-3xl mb-3">☕</div>
          <h2 className="text-2xl font-bold mb-2">Want a real custom plan?</h2>
          <p className="text-coffee-200 text-sm mb-6 max-w-md mx-auto">
            The calculator gives you a solid starting point. But a free 20-minute audit from Nataliia
            gives you a precise plan based on your actual website, competitors, and local market.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-coffee-700 font-bold px-6 py-3 rounded-xl hover:bg-coffee-50 transition-colors"
          >
            Book my free audit →
          </Link>
        </div>
      </section>

      {/* Related tools / internal links */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Explore by business type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: "☕", label: "Coffee Shops",   href: "/for/coffee-shops"   },
            { emoji: "✂️", label: "Hair Salons",    href: "/for/hair-salons"    },
            { emoji: "🐾", label: "Pet Businesses", href: "/for/pet-groomers"   },
            { emoji: "🏋️", label: "Fitness Studios", href: "/for/fitness-studios" },
          ].map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-gray-100 hover:border-coffee-200 hover:bg-coffee-50 transition-colors text-center"
            >
              <span className="text-2xl">{n.emoji}</span>
              <span className="text-xs font-medium text-gray-700">{n.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
