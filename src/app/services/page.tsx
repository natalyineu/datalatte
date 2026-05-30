import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const BASE = "https://datalatte.pro";
const PAGE_URL = `${BASE}/services`;

export const metadata: Metadata = {
  title: "Marketing Services for Local Businesses",
  description:
    "Every marketing service DataLatte offers — Google Ads, Meta Ads, Local SEO, Content Marketing, AI Automation, and more. Built for small businesses that want real results.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Marketing Services | DataLatte",
    description:
      "15 data-driven marketing services for small businesses — from Google Ads to AI automation.",
    url: PAGE_URL,
    type: "website",
    siteName: "DataLatte",
  },
  twitter: { card: "summary_large_image", title: "Marketing Services | DataLatte" },
};

interface ServiceItem {
  icon: string;
  name: string;
  slug: string;
  tagline: string;
}

interface ServiceCategory {
  label: string;
  description: string;
  services: ServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "Paid Advertising",
    description: "Put your business in front of buyers who are actively searching or scrolling.",
    services: [
      {
        icon: "🎯",
        name: "Google Ads",
        slug: "google-ads",
        tagline: "Show up when locals are actively searching. Pay only when they click.",
      },
      {
        icon: "📱",
        name: "Meta Ads",
        slug: "meta-ads",
        tagline: "Reach your ideal local customer on Facebook & Instagram — before they go looking.",
      },
      {
        icon: "🎵",
        name: "TikTok Ads",
        slug: "tiktok-ads",
        tagline: "Reach the next generation of local customers before your competitors discover TikTok.",
      },
      {
        icon: "📡",
        name: "Programmatic Advertising",
        slug: "programmatic",
        tagline: "Every impression, measured. Every dollar, justified.",
      },
    ],
  },
  {
    label: "Local & SEO",
    description: "Dominate local search and Google Maps — with or without paid ads.",
    services: [
      {
        icon: "📍",
        name: "Google Business Profile",
        slug: "google-business-profile",
        tagline: "The free local marketing channel most businesses are leaving almost entirely untouched.",
      },
      {
        icon: "🔍",
        name: "Local SEO",
        slug: "local-seo",
        tagline: "Rank for the searches that bring real customers — not just vanity traffic.",
      },
      {
        icon: "⭐",
        name: "Reputation Management",
        slug: "reputation-management",
        tagline: "More 5-star reviews. Fewer unanswered complaints. A brand customers trust.",
      },
    ],
  },
  {
    label: "Content & Social",
    description: "Build authority, stay consistent, and grow an audience that buys.",
    services: [
      {
        icon: "✍️",
        name: "Content Marketing",
        slug: "content-marketing",
        tagline: "Rank on Google, earn trust, and turn readers into customers — without paid ads.",
      },
      {
        icon: "📱",
        name: "Social Media Management",
        slug: "social-media",
        tagline: "Show up consistently. Build trust. Turn followers into regulars.",
      },
      {
        icon: "🎬",
        name: "Video Marketing",
        slug: "video-marketing",
        tagline: "Show your business in motion. Build trust, reach new audiences, and drive bookings.",
      },
    ],
  },
  {
    label: "Web & Analytics",
    description: "Convert more visitors and know exactly what your data is telling you.",
    services: [
      {
        icon: "🌐",
        name: "Website & Landing Pages",
        slug: "website",
        tagline: "Your website should be working for you 24/7 — not just sitting there looking pretty.",
      },
      {
        icon: "📈",
        name: "Conversion Rate Optimisation",
        slug: "cro",
        tagline: "Get more customers from the traffic you already have — without increasing ad spend.",
      },
      {
        icon: "📊",
        name: "Analytics & Reporting",
        slug: "analytics",
        tagline: "Know exactly what's working. No data overwhelm, no mystery black boxes.",
      },
    ],
  },
  {
    label: "Automation & Retention",
    description: "Scale your marketing without scaling your team.",
    services: [
      {
        icon: "🤖",
        name: "AI Agents & Automation",
        slug: "ai-agents",
        tagline: "Eight agents. One pipeline. Zero missed leads.",
      },
      {
        icon: "✉️",
        name: "Email & SMS Marketing",
        slug: "email-sms",
        tagline: "Your regulars are your best asset. Keep them coming back.",
      },
    ],
  },
];

const FAQS = [
  {
    q: "Do I need all these services?",
    a: "No. Most clients start with 2–3 services most relevant to their growth stage — typically Google Ads or Local SEO plus analytics to measure it. We build from there.",
  },
  {
    q: "How do I know which service is right for me?",
    a: "Book a free audit and we'll map your current marketing gaps to the services with the highest ROI for your specific business type and location.",
  },
  {
    q: "Are these services available as packages?",
    a: "Yes. See our pricing page for bundled packages, or contact us for a custom scope.",
  },
];

export default function ServicesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: BASE },
    { name: "Services", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-700 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            All Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            Everything you need to grow —{" "}
            <span className="text-coffee-300">nothing you don&apos;t</span>
          </h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto mb-8">
            15 data-driven marketing services for small businesses. Each one measured, reported, and
            optimised weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg"
            >
              Get a free audit <ArrowRight size={17} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-coffee-50 border-b border-coffee-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "15", label: "Services" },
            { value: "5", label: "Categories" },
            { value: "200+", label: "Clients helped" },
            { value: "1 week", label: "To first report" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-coffee-800">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service categories */}
      {SERVICE_CATEGORIES.map((cat, i) => (
        <SectionWrapper key={cat.label} className={i % 2 === 1 ? "bg-gray-50" : ""}>
          <div className="mb-8">
            <span className="section-label">{cat.label}</span>
            <p className="text-gray-500 mt-1 text-sm">{cat.description}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cat.services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-coffee-200 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{svc.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-coffee-700 transition-colors leading-snug">
                  {svc.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{svc.tagline}</p>
                <span className="inline-flex items-center gap-1 text-coffee-600 text-sm font-medium">
                  Learn more <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      ))}

      {/* FAQ */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white rounded-xl p-6 border border-coffee-100">
                <h4 className="font-semibold text-gray-900 mb-2">{f.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
