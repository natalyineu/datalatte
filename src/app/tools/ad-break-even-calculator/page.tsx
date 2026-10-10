import type { Metadata } from "next";
import Link from "next/link";
import AdBreakEven from "@/components/AdBreakEven";
import { breadcrumbSchema } from "@/lib/schema";

const URL_ = "https://datalatte.pro/tools/ad-break-even-calculator";
const TITLE = "Ad Break-Even Calculator: Max Cost Per Click, Lead and Customer";
const DESC = "Free calculator: enter what a new customer is worth and how many leads close, and see the most you can pay per click, lead and customer, checked against published cost-per-lead medians.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL_ },
  openGraph: { title: TITLE, description: DESC, url: URL_, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  {
    q: "How do you calculate a break-even cost per click?",
    a: "Multiply what a new customer is worth by your profit margin to get profit per customer. Divide by the return you want per $1 of ads, multiply by the share of leads that become customers (gives your maximum cost per lead), then multiply by the share of clicks that become leads. That final number is the most a click can cost before the ads lose money.",
  },
  {
    q: "What is a good conversion rate for local business ads?",
    a: "It varies widely by industry. LocaliQ's 2026 search benchmarks show medians around 6 to 8% of clicks becoming leads in several local categories, but your own landing page, offer and tracking decide your real number. Measure it for 30 days before trusting any benchmark.",
  },
  {
    q: "Should I use first-year value or lifetime value?",
    a: "Start with first-year value. Lifetime value is higher but uncertain, and ad spend is paid now. If repeat visits are strong (salons, groomers, gyms), a longer horizon can justify a higher ceiling, but check it against your own retention data.",
  },
  {
    q: "Where do the cost-per-lead medians come from?",
    a: "From LocaliQ's 2026 search and Facebook benchmark pages, plus one second-hand roundup for fitness. Every figure, source and confidence label is listed on our rates page.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ad Break-Even Calculator",
    url: URL_,
    description: DESC,
    applicationCategory: "BusinessApplication",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "DataLatte", url: "https://datalatte.pro" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
  breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Free tools", url: "https://datalatte.pro/resources" },
    { name: "Ad Break-Even Calculator", url: URL_ },
  ]),
];

export default function AdBreakEvenPage() {
  return (
    <>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <section className="hero-shimmer relative pt-16 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-coffee-100 text-coffee-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 dark:bg-coffee-900/30 dark:text-coffee-300">
            ☕ Free Tool — No sign-up required
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 dark:text-gray-50">
            Ad Break-Even Calculator
            <br />
            <span className="text-coffee-600 dark:text-coffee-400">before you spend a dollar</span>
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto dark:text-gray-400">
            Find the most you can pay per click, lead and customer, then see whether typical ad costs clear that bar.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 -mt-4 dark:bg-gray-900 dark:border-gray-700">
          <AdBreakEven />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center dark:text-gray-50">Questions</h2>
        <div className="space-y-4">
          {FAQ.map(f => (
            <div key={f.q} className="bg-gray-50 rounded-2xl p-5 dark:bg-gray-800/60">
              <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-50">{f.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center mt-8 dark:text-gray-300">
          Next: split your budget with the{" "}
          <Link href="/tools/marketing-budget-calculator" className="underline text-coffee-700 dark:text-coffee-300">marketing budget calculator</Link>
          {" "}or browse every benchmark on the{" "}
          <Link href="/rates" className="underline text-coffee-700 dark:text-coffee-300">rates page</Link>.
        </p>
      </section>
    </>
  );
}
