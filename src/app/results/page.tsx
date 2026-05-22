import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Users, Target, MapPin, BarChart3 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/results";
const PAGE_TITLE = "Client Results & Testimonials | DataLatte";
const PAGE_DESC =
  "Real outcomes from real local businesses. See how DataLatte's marketing strategies delivered revenue growth, more bookings, and lower cost-per-acquisition for coffee shops, salons, pet groomers, and fitness studios.";

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
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte Client Results" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const stats = [
  { icon: TrendingUp, value: "3×",     label: "Average revenue growth",        sub: "for coffee shops in 6 months" },
  { icon: Users,      value: "200+",   label: "New clients added",             sub: "for a single pet groomer in 6 months" },
  { icon: Target,     value: "300%",   label: "Return on ad spend",            sub: "for a yoga studio Facebook campaign" },
  { icon: MapPin,     value: "#1",     label: "Google Map Pack position",      sub: "achieved for coffee shop client" },
  { icon: Star,       value: "40%",    label: "Booking growth",                sub: "for a NYC hair salon in 90 days" },
  { icon: BarChart3,  value: "2.8×",   label: "Average ROAS across accounts",  sub: "Google Ads clients, 2025–2026" },
];

const testimonials = [
  {
    quote:
      "Nataliia brought a level of strategic thinking I'd never seen from any marketing agency or freelancer I'd worked with before. She rebuilt our Google Ads from scratch, set up proper conversion tracking, and within two months we were getting twice the bookings at half the cost per click. The data-first approach makes every decision feel logical, not guesswork.",
    author: "Sarah K.",
    role: "Owner, independent coffee shop — Portland, OR",
    rating: 5,
    niche: "Coffee Shop",
    emoji: "☕",
  },
  {
    quote:
      "We'd been running Facebook Ads ourselves for two years with mixed results. Nataliia completely restructured the campaigns, rewrote the ad copy, and set up a proper audience strategy. Three months in and we're filling every class. The reporting is so clear — I finally understand what we're spending and what we're getting back.",
    author: "Marcus T.",
    role: "Co-founder, boutique fitness studio — San Francisco, CA",
    rating: 5,
    niche: "Fitness Studio",
    emoji: "🧘",
  },
  {
    quote:
      "I was sceptical about spending money on Instagram ads for a pet grooming business. Within six weeks, we'd added 40 new regular clients and our Google Maps ranking went from page 3 to the top pack. Nataliia knows exactly which channels work for service businesses like ours — and which ones would have just wasted our budget.",
    author: "Lisa M.",
    role: "Owner, Pawsome Pets — Los Angeles, CA",
    rating: 5,
    niche: "Pet Groomer",
    emoji: "🐾",
  },
  {
    quote:
      "What separates DataLatte from every agency I've tried is that Nataliia actually knows the technical side — attribution models, bid strategies, campaign architecture. Not just 'post on social media.' She built us a real analytics dashboard for the first time and now we can actually make decisions based on data.",
    author: "James O.",
    role: "Owner, multi-location hair salon group — New York, NY",
    rating: 5,
    niche: "Hair Salon",
    emoji: "✂️",
  },
  {
    quote:
      "I'd wasted thousands of dollars on Google Ads before Nataliia took over. She audited the account, found dozens of wasted budget areas, restructured everything, and within 30 days the same budget was bringing in 3× the leads. The audit alone was worth more than a full month at my old agency.",
    author: "Rachel P.",
    role: "Owner, nail salon & spa — Miami, FL",
    rating: 5,
    niche: "Nail Salon",
    emoji: "💅",
  },
  {
    quote:
      "Nataliia handled our full marketing stack — Google Ads, local SEO, GBP optimisation, and email — and managed everything like she was a part of our team. The attention to detail and the transparency of reporting is unlike anything I've experienced with an agency. We're now the top-ranked barbershop in our area.",
    author: "Daniel A.",
    role: "Owner, independent barbershop — Austin, TX",
    rating: 5,
    niche: "Barbershop",
    emoji: "💈",
  },
];

const caseStudyPreviews = [
  {
    href: "/blog/case-study-coffee-shop-tripled-revenue-digital-marketing",
    niche: "Coffee Shop",
    headline: "Tripled revenue in 6 months",
    detail: "Portland coffee shop — Local SEO + Google Ads",
    color: "bg-coffee-700",
  },
  {
    href: "/blog/case-study-pet-groomer-200-new-clients-6-months",
    niche: "Pet Groomer",
    headline: "200 new clients in 6 months",
    detail: "LA pet groomer — Local SEO + automation",
    color: "bg-coffee-800",
  },
  {
    href: "/blog/case-study-fitness-studio-filled-every-class-facebook-ads",
    niche: "Fitness Studio",
    headline: "300% ROAS on Facebook Ads",
    detail: "San Francisco yoga studio — Meta Ads",
    color: "bg-gray-800",
  },
  {
    href: "/blog/case-study-hair-salon-grew-40-percent-instagram-ads",
    niche: "Hair Salon",
    headline: "+40% bookings in 90 days",
    detail: "NYC hair salon — Instagram Ads",
    color: "bg-gray-700",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Client Results", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-800 to-coffee-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Real clients · Real revenue · No inflated numbers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            The numbers that actually
            <span className="text-coffee-300"> matter to owners</span>
          </h1>
          <p className="text-coffee-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Every metric below is from a real client campaign. No impressions,
            no reach figures — just revenue, bookings, new clients, and return on spend.
          </p>
        </div>
      </section>

      {/* Stats grid */}
      <SectionWrapper>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <s.icon size={22} className="text-coffee-700" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">{s.value}</div>
                <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Client Testimonials</span>
          <h2 className="section-title">
            What business owners say about
            <span className="gradient-text"> working with DataLatte</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.author} className="card p-7 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="text-2xl">{t.emoji}</div>
                <StarRating rating={t.rating} />
              </div>
              <blockquote className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="pt-2 border-t border-gray-100">
                <div className="font-bold text-gray-900 text-sm">{t.author}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Case study previews */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">Case Studies</span>
          <h2 className="section-title">
            Full campaign breakdowns
          </h2>
          <p className="section-subtitle">
            Deep-dives into strategy, execution, and results — with real numbers.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {caseStudyPreviews.map((cs) => (
            <Link
              key={cs.href}
              href={cs.href}
              className={`group ${cs.color} rounded-2xl p-6 text-white flex flex-col gap-3 hover:opacity-90 transition-opacity`}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">{cs.niche}</span>
              <div className="font-extrabold text-xl leading-snug group-hover:text-coffee-200 transition-colors">{cs.headline}</div>
              <div className="text-white/65 text-sm mt-auto">{cs.detail}</div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:gap-2 transition-all mt-1">
                Read full study <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/case-studies" className="btn-primary">
            View all case studies <ArrowRight size={15} />
          </Link>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Ready to become the next success story?"
        sub="Start with a free audit. I'll identify exactly what's holding your marketing back and what needs to happen first."
      />
    </>
  );
}
