import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Star } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/case-studies";
const PAGE_TITLE = "Marketing Case Studies for Local Businesses | DataLatte";
const PAGE_DESC =
  "Real results from real local businesses. Case studies showing how DataLatte's Google Ads, local SEO, and Meta Ads strategies tripled revenue, filled every class, and grew client bases by 200+ in 6 months.";

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
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte Case Studies" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const caseStudies = [
  {
    slug: "case-study-coffee-shop-tripled-revenue-digital-marketing",
    niche: "Coffee Shop",
    emoji: "☕",
    title: "Portland Coffee Shop Triples Revenue in 6 Months",
    summary:
      "A small independent coffee shop in Portland's Pearl District was losing ground to chains. With a combined local SEO and Google Ads strategy, they tripled monthly revenue and took the top map pack position.",
    metrics: [
      { label: "Revenue increase", value: "3×" },
      { label: "Timeframe", value: "6 months" },
      { label: "Map pack position", value: "#1" },
    ],
    services: ["Google Ads", "Local SEO", "Google Business Profile"],
    color: "from-coffee-700 to-coffee-900",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
  },
  {
    slug: "case-study-hair-salon-grew-40-percent-instagram-ads",
    niche: "Hair Salon",
    emoji: "✂️",
    title: "NYC Hair Salon Grows Bookings 40% With Instagram Ads",
    summary:
      "A New York City hair salon was stagnating with word-of-mouth only. Instagram Ads targeting local women aged 25–45 drove a 40% increase in bookings within three months, at a cost per booking well below the industry average.",
    metrics: [
      { label: "Booking increase", value: "+40%" },
      { label: "Timeframe", value: "3 months" },
      { label: "Target audience", value: "Local women 25–45" },
    ],
    services: ["Meta Ads", "Instagram Ads", "Creative strategy"],
    color: "from-gray-700 to-gray-900",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  },
  {
    slug: "case-study-pet-groomer-200-new-clients-6-months",
    niche: "Pet Groomer",
    emoji: "🐾",
    title: "LA Pet Groomer Wins 200 New Clients in 6 Months",
    summary:
      "Pawsome Pets in Los Angeles had a loyal client base but couldn't break into new neighbourhoods. Local SEO, targeted Google Ads, and marketing automation delivered 200 new clients in under six months.",
    metrics: [
      { label: "New clients", value: "200" },
      { label: "Timeframe", value: "6 months" },
      { label: "Client retention rate", value: "50%" },
    ],
    services: ["Local SEO", "Google Ads", "Marketing Automation"],
    color: "from-coffee-600 to-coffee-950",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  },
  {
    slug: "case-study-fitness-studio-filled-every-class-facebook-ads",
    niche: "Fitness Studio",
    emoji: "🧘",
    title: "San Francisco Yoga Studio Fills Every Class With Facebook Ads",
    summary:
      "Yoga Bliss in San Francisco struggled to fill off-peak classes despite a loyal membership base. A targeted Facebook Ads campaign at $500/month delivered a 300% ROAS, 50 new customers, and 25% revenue growth in three months.",
    metrics: [
      { label: "ROAS", value: "300%" },
      { label: "New customers", value: "50" },
      { label: "Revenue increase", value: "+25%" },
    ],
    services: ["Meta Ads", "Facebook Ads", "Conversion tracking"],
    color: "from-gray-800 to-gray-950",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
  },
  {
    slug: "meta-ads-for-hair-salons-case-study",
    niche: "Hair Salon",
    emoji: "✂️",
    title: "Meta Ads for Hair Salons: Full Campaign Breakdown",
    summary:
      "A deep-dive into how Meta Ads can be built, structured, and optimised specifically for hair salons — with real campaign data, creative examples, and the targeting approach that delivers consistent new bookings.",
    metrics: [
      { label: "Platform", value: "Meta" },
      { label: "Format", value: "Lead gen" },
      { label: "Audience", value: "Local + Lookalike" },
    ],
    services: ["Meta Ads", "Lead generation", "Creative strategy"],
    color: "from-gray-700 to-gray-900",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  },
  {
    slug: "facebook-ads-for-coffee-shops-case-study",
    niche: "Coffee Shop",
    emoji: "☕",
    title: "Facebook Ads for Coffee Shops: What Actually Works",
    summary:
      "Not all Facebook Ads strategies work for coffee shops. This case study breaks down what objectives, audiences, creatives, and offers drove real foot traffic — and what wasted budget in the process.",
    metrics: [
      { label: "Platform", value: "Facebook" },
      { label: "Goal", value: "Foot traffic" },
      { label: "Key insight", value: "Offer-led creative" },
    ],
    services: ["Meta Ads", "Facebook Ads", "Local campaigns"],
    color: "from-coffee-700 to-coffee-900",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
  },
];

const aggregateStats = [
  { icon: TrendingUp, value: "3×", label: "Average revenue growth in first 6 months" },
  { icon: Users, value: "200+", label: "New clients generated for a single business" },
  { icon: Star, value: "300%", label: "Return on ad spend for fitness studio campaigns" },
];

export default function CaseStudiesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Case Studies", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            Real results · Real businesses · No vanity metrics
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            Marketing that moved the
            <span className="text-coffee-300"> needle</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            These aren&apos;t impressions or follower counts. Every case study below measures what matters to
            a local business owner: revenue, bookings, new clients, and return on spend.
          </p>

          {/* Aggregate stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {aggregateStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-xs leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study cards */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/blog/${cs.slug}`}
              className="group card overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-br ${cs.color} p-6 text-white`}>
                <span className="text-3xl mb-3 block">{cs.emoji}</span>
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">{cs.niche}</span>
                <h2 className="text-lg font-bold mt-1 leading-snug group-hover:text-coffee-200 transition-colors text-balance">
                  {cs.title}
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{cs.summary}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {cs.metrics.map((m) => (
                    <div key={m.label} className="bg-coffee-50 rounded-xl p-3 text-center border border-coffee-100">
                      <div className="font-extrabold text-coffee-800 text-lg leading-none">{m.value}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cs.services.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 group-hover:gap-2 transition-all">
                  Read case study <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* Social proof band */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Why it works</span>
          <h2 className="section-title mb-6">
            Enterprise strategy applied to
            <span className="gradient-text"> local businesses</span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            The same analytical frameworks used at OMD, Dentsu, BBDO, and GroupM for Fortune 500
            brands work just as well for a local coffee shop or yoga studio — they just need to be
            applied at the right scale, with the right budget discipline.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Data-first", desc: "Every decision is based on actual numbers, not hunches or templates." },
              { label: "Niche-specific", desc: "Strategies built for your exact business type, not copy-pasted from a generic playbook." },
              { label: "Full attribution", desc: "You know exactly which channel drove which bookings, calls, or revenue." },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 border border-coffee-100 text-left">
                <div className="font-bold text-gray-900 mb-2">{item.label}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Want results like these for your business?"
        sub="Start with a free audit. I'll review your current marketing and show you the specific steps to get there."
      />
    </>
  );
}
