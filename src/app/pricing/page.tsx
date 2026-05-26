import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, X, BarChart3, TrendingUp, BookOpen, Zap, PieChart, Calculator } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/pricing";
const PAGE_TITLE = "Marketing Consultant Pricing for Small Businesses | DataLatte";
const PAGE_DESC =
  "Transparent pricing for freelance digital marketing services. Google Ads, local SEO, Meta Ads, and full-service retainers — starting from $500/month. No agency markup.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-US": PAGE_URL,
      "en-GB": PAGE_URL,
      "en-AU": PAGE_URL,
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte Pricing" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const tiers = [
  {
    name: "Espresso",
    tagline: "One channel, done properly",
    price: "From $500",
    period: "/month",
    highlight: false,
    description:
      "Ideal for businesses starting with paid advertising or local SEO for the first time. One channel, managed to a high standard with full conversion tracking.",
    included: [
      "Single channel management (Google Ads OR Local SEO)",
      "Initial strategy and setup",
      "Monthly reporting in plain English",
      "Conversion tracking setup",
      "Email support",
    ],
    notIncluded: [
      "Multi-channel campaigns",
      "Creative production",
      "Analytics dashboards",
    ],
    cta: "Get started",
    accentClass: "border-coffee-200",
    badgeClass: "bg-coffee-100 text-coffee-700",
  },
  {
    name: "Americano",
    tagline: "Most popular for local businesses",
    price: "From $1,200",
    period: "/month",
    highlight: true,
    description:
      "The most popular package for established local businesses ready to compete across multiple channels. Covers paid ads + local SEO with full analytics.",
    included: [
      "2–3 channel management (e.g. Google Ads + Local SEO)",
      "Full audit before starting",
      "Google Analytics 4 & conversion tracking",
      "Bi-weekly check-in calls",
      "Monthly performance report with recommendations",
      "Ad creative guidance and copy review",
      "Competitor monitoring",
    ],
    notIncluded: [
      "Video production",
      "Website development",
    ],
    cta: "Start growing",
    accentClass: "border-coffee-700 ring-2 ring-coffee-700",
    badgeClass: "bg-coffee-700 text-white",
  },
  {
    name: "Pumpkin Spice Latte",
    tagline: "Enterprise thinking, your budget",
    price: "From $2,500",
    period: "/month",
    highlight: false,
    description:
      "Full multi-channel strategy with the same analytical rigour used at OMD and GroupM — applied to your business. Ideal for scaling companies and multi-location operators.",
    included: [
      "Full multi-channel strategy (paid, SEO, social, email)",
      "Custom analytics dashboards",
      "Weekly optimisation and reporting",
      "Dedicated strategy sessions",
      "A/B testing and CRO recommendations",
      "AI automation setup",
      "Programmatic advertising access",
      "White-glove onboarding",
    ],
    notIncluded: [],
    cta: "Let's talk",
    accentClass: "border-gray-300",
    badgeClass: "bg-gray-100 text-gray-700",
  },
];

const benefits = [
  {
    icon: BarChart3,
    title: "Beautiful monthly reports",
    desc: "Plain-English performance summaries every month — what worked, what didn't, and the exact next steps. No jargon, no padding.",
    href: "/reporting",
    linkText: "See what reporting looks like",
  },
  {
    icon: TrendingUp,
    title: "Proven results, real numbers",
    desc: "Real outcomes from coffee shops, salons, pet groomers, and fitness studios across the US and UK — not cherry-picked.",
    href: "/results",
    linkText: "View client results",
  },
  {
    icon: BookOpen,
    title: "Deep-dive case studies",
    desc: "Step-by-step breakdowns of how underperforming accounts became consistent lead machines — with the data to prove it.",
    href: "/case-studies",
    linkText: "Read the case studies",
  },
  {
    icon: Zap,
    title: "AI & automation setup",
    desc: "Chatbots, automated follow-up sequences, and AI-powered targeting — built and managed for you, no tech skills needed.",
    href: "/services/ai-agents",
    linkText: "Explore AI services",
  },
  {
    icon: PieChart,
    title: "Full analytics & conversion tracking",
    desc: "GA4 setup, goal tracking, and dashboards that show your real cost-per-lead — so you always know what's working.",
    href: "/services/analytics",
    linkText: "Learn about analytics",
  },
  {
    icon: Calculator,
    title: "Free marketing budget calculator",
    desc: "Not sure how much to spend across channels? Model your budget and expected returns before committing a single dollar.",
    href: "/tools/marketing-budget-calculator",
    linkText: "Try the calculator",
  },
];

const comparisonRows = [
  { feature: "Google Ads management",    starter: true,  growth: true,  full: true },
  { feature: "Local SEO",                starter: true,  growth: true,  full: true },
  { feature: "Meta Ads",                 starter: false, growth: true,  full: true },
  { feature: "Email & SMS marketing",    starter: false, growth: true,  full: true },
  { feature: "Analytics dashboards",     starter: false, growth: true,  full: true },
  { feature: "Programmatic advertising", starter: false, growth: false, full: true },
  { feature: "AI automation setup",      starter: false, growth: false, full: true },
  { feature: "A/B testing & CRO",        starter: false, growth: false, full: true },
  { feature: "Weekly reporting",         starter: false, growth: false, full: true },
];

const faqs = [
  {
    q: "How much should a local business spend on marketing?",
    a: "Most local businesses benefit from a marketing budget of 7–12% of monthly revenue, split across channels. As a starting rule of thumb: allocate at least $500/month to see meaningful results from paid advertising — below that, budgets are too thin to generate enough data to optimise.",
  },
  {
    q: "Are these prices for ad spend or management fees?",
    a: "These are management fees only — the cost of strategy, setup, optimisation, and reporting. Ad spend (what goes to Google or Meta) is a separate budget set by you. I'll recommend a realistic starting ad budget as part of your free audit.",
  },
  {
    q: "Is there a setup fee?",
    a: "There is no separate setup fee on any package. The first month covers initial audits, account builds, tracking setup, and strategy — all included in the monthly fee.",
  },
  {
    q: "Do I have to sign a long-term contract?",
    a: "No. All packages run month-to-month with 30 days notice to cancel. I earn your business every month, not through lock-in contracts. That said, marketing channels like SEO and paid ads take 60–90 days to hit their stride, so I ask for a genuine three-month commitment before judging results.",
  },
  {
    q: "Can I start small and upgrade later?",
    a: "Absolutely. Most clients start on the Espresso or Americano package and add channels as they see results. Upgrading is seamless — there's no new setup or onboarding needed.",
  },
  {
    q: "How is this different from a marketing agency?",
    a: "At an agency, your account is managed by a junior executive following a playbook. At DataLatte, you work directly with Nataliia — 10+ years at OMD, Dentsu, BBDO, and GroupM — on every campaign. No account managers, no briefing chains, no markups on third-party tools.",
  },
];

export default function PricingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Pricing", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-800 to-coffee-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            Transparent pricing · No agency markup
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            Honest pricing for
            <span className="text-coffee-300"> serious marketing</span>
          </h1>
          <p className="text-coffee-200 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Every package includes direct access to a senior marketer with 10+ years at the world&apos;s
            top agencies — without the agency overhead. Month-to-month. No lock-in.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
            Get a free audit first <ArrowRight size={17} />
          </Link>
          <p className="text-coffee-400 text-sm mt-4">Not sure what you need? Start with a free 48-hour audit — no strings attached.</p>
        </div>
      </section>

      {/* Pricing tiers */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border-2 bg-white p-8 flex flex-col relative ${tier.accentClass} ${tier.highlight ? "shadow-xl" : "shadow-sm"}`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-coffee-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${tier.badgeClass}`}>
                  {tier.tagline}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{tier.name}</h2>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-coffee-800">{tier.price}</span>
                  <span className="text-gray-500 text-sm mb-1">{tier.period}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex-1 space-y-2.5 mb-8">
                {tier.included.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-coffee-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
                {tier.notIncluded.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 opacity-40">
                    <X size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className={`w-full text-center font-bold py-3 px-6 rounded-xl transition-all ${tier.highlight ? "bg-coffee-700 hover:bg-coffee-600 text-white" : "bg-coffee-100 hover:bg-coffee-200 text-coffee-800"}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          All fees are management fees only. Ad spend is a separate budget set by you.{" "}
          <Link href="/tools/marketing-budget-calculator" className="text-coffee-700 hover:underline">
            Use the budget calculator →
          </Link>
        </p>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper className="bg-coffee-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Included in every package</span>
            <h2 className="section-title">More than just campaign management</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base leading-relaxed">
              Every client gets a senior strategist — not a junior account manager — plus the tools,
              reports, and transparency to know exactly what their money is doing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-coffee-400 hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-10 h-10 bg-coffee-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-coffee-200 transition-colors">
                  <b.icon size={20} className="text-coffee-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{b.desc}</p>
                <span className="inline-flex items-center gap-1 text-coffee-700 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                  {b.linkText} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Feature comparison */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Compare</span>
            <h2 className="section-title">What&apos;s in each package</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-gray-600 font-medium w-1/2">Feature</th>
                  <th className="p-4 text-center text-gray-700 font-bold">Espresso</th>
                  <th className="p-4 text-center text-coffee-700 font-bold">Americano</th>
                  <th className="p-4 text-center text-gray-700 font-bold">Pumpkin Spice Latte</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                    <td className="p-4 text-gray-700">{row.feature}</td>
                    <td className="p-4 text-center">{row.starter ? <CheckCircle2 size={17} className="text-coffee-500 mx-auto" /> : <X size={15} className="text-gray-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.growth ? <CheckCircle2 size={17} className="text-coffee-600 mx-auto" /> : <X size={15} className="text-gray-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.full ? <CheckCircle2 size={17} className="text-coffee-700 mx-auto" /> : <X size={15} className="text-gray-300 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Pricing questions, answered</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Not sure which package is right for you?"
        sub="Start with a free audit. I'll review your current setup and recommend exactly where to start — no sales pressure."
      />
    </>
  );
}
