import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, MapPin, BarChart3, Target, TrendingUp, Zap, Users } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/for/multi-location";
const PAGE_TITLE = "Marketing for Multi-Location Businesses | DataLatte";
const PAGE_DESC =
  "Marketing strategy for businesses with 2–20 locations: consistent Google Business Profile management, location-targeted Google Ads, local SEO at scale, and unified analytics across every site.";

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
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "Multi-Location Business Marketing" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const painPoints = [
  "Each location has its own Google Business Profile that needs individual attention",
  "Ad campaigns either duplicate spend across locations or miss local targeting entirely",
  "Reviews and reputation management can't be handled the same way as a single site",
  "Analytics are fragmented — you can't see which locations are performing and which aren't",
  "Brand consistency vs local relevance is a constant tension",
  "Most agencies don't understand local SEO at the location level — they manage everything from one account",
];

const services = [
  {
    icon: MapPin,
    title: "Location-level GBP management",
    desc: "Each location gets its own optimised Google Business Profile — accurate categories, regular posts, review response, and consistent NAP across every directory. Google rewards individually managed listings.",
  },
  {
    icon: Target,
    title: "Location-targeted Google Ads",
    desc: "Separate campaigns or ad groups per location, each with radius targeting and location-specific keywords. No shared budget cannibalism between your busiest and quietest sites.",
  },
  {
    icon: TrendingUp,
    title: "Multi-location local SEO",
    desc: "Location pages on your website targeting city-level keywords for each site. Internal linking architecture that consolidates authority to your main domain while ranking each location individually.",
  },
  {
    icon: BarChart3,
    title: "Unified analytics across locations",
    desc: "One dashboard showing performance by location — revenue, bookings, leads, cost per acquisition. Know exactly which locations need attention and why.",
  },
  {
    icon: Zap,
    title: "Review velocity management",
    desc: "Review request automation that works at location level — each site builds its own review velocity. Centrally monitored but locally targeted.",
  },
  {
    icon: Users,
    title: "Brand + local balance",
    desc: "Brand-consistent messaging across locations while keeping local relevance — the right ad creative for a downtown flagship is different from a suburban satellite.",
  },
];

const faqs = [
  {
    q: "How is marketing for a multi-location business different from a single site?",
    a: "At a single site, marketing optimises for one set of local keywords, one GBP, one audience. Multi-location adds complexity: each location has its own search profile, competitive landscape, and customer demographic. Campaigns need to allocate budget across locations based on opportunity — not split it equally by default. And analytics need to show performance at location level, not just aggregate.",
  },
  {
    q: "Do I need a separate Google Ads account for each location?",
    a: "Not necessarily. A single account with location-specific campaigns or ad groups is usually the most efficient structure. What matters is that targeting, keywords, and budget are managed at the location level — not pooled into one campaign that ignores geographic differences.",
  },
  {
    q: "How do you handle Google Business Profile for multiple locations?",
    a: "Each location gets a verified, fully optimised individual GBP listing. I manage categories, attributes, posts, and review responses for each location — either individually or through a structured schedule. Google treats each listing independently, so consistent management at the location level directly affects map pack ranking for each site.",
  },
  {
    q: "Can you help with franchise marketing?",
    a: "Yes. Franchise marketing has additional complexity around brand standards, co-op advertising, and the relationship between national and local campaigns. I've worked with multi-location operators across retail, food & beverage, and service businesses and understand how to structure campaigns that serve both franchisor and franchisee goals.",
  },
  {
    q: "What's the minimum number of locations for this service?",
    a: "Multi-location marketing strategy applies from two locations upward. Even two sites have meaningfully different competitive landscapes and benefit from location-specific campaigns. The complexity — and the opportunity — scales with every additional location you add.",
  },
];

export default function MultiLocationPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Multi-Location Businesses", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/80">Multi-Location Businesses</span>
          </nav>
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            🏪 Marketing for 2–20 locations
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
            Marketing that works at the
            <span className="text-coffee-300"> location level</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl">
            Managing marketing across multiple sites is fundamentally different from a single business.
            Most agencies treat it the same — you need someone who knows the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a free multi-location audit <ArrowRight size={17} />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              About Nataliia
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">The challenges</span>
          <h2 className="section-title mb-6">
            What makes multi-location marketing
            <span className="gradient-text"> genuinely hard</span>
          </h2>
          <div className="space-y-3">
            {painPoints.map((p) => (
              <div key={p} className="flex items-start gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">✗</span>
                <span className="text-gray-700 text-sm leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">How I Help</span>
          <h2 className="section-title">
            Location-level strategy
            <span className="gradient-text"> at every scale</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {services.map((s) => (
            <div key={s.title} className="card p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <s.icon size={19} className="text-coffee-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Who it's for */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Who this is for</span>
          <h2 className="section-title mb-6">Multi-location marketing works for</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Salon or spa groups with 2–10 locations",
              "Coffee shop chains expanding city-wide",
              "Fitness studio franchises",
              "Restaurant groups and dark kitchens",
              "Pet grooming businesses with multiple sites",
              "Service businesses (cleaning, plumbing) covering multiple zones",
              "Dental or medical practices with satellite sites",
              "Retail brands scaling into new cities",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 bg-coffee-50 rounded-xl px-4 py-3 border border-coffee-100">
                <CheckCircle2 size={16} className="text-coffee-600 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Multi-location marketing questions</h2>
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

      {/* Related */}
      <SectionWrapper>
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore more options</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Enterprise & Agencies", href: "/for/enterprise" },
            { label: "Growing Businesses", href: "/for/medium-business" },
            { label: "Local SEO Service", href: "/services/local-seo" },
            { label: "Google Ads Service", href: "/services/google-ads" },
            { label: "Analytics & Reporting", href: "/services/analytics" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Managing multiple locations and ready to scale?"
        sub="Get a free multi-location audit — I'll map your current setup across all sites and show you exactly where the biggest opportunities are."
      />
    </>
  );
}
