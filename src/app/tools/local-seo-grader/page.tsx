import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import LocalSeoGrader from "@/components/LocalSeoGrader";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/tools/local-seo-grader";
const PAGE_TITLE = "Free Local SEO Grader — Score Your Business in 30 Seconds";
const PAGE_DESC =
  "Instantly score your local SEO across 10 key factors: Google Business Profile, review velocity, NAP consistency, keyword targeting, and more. Free, instant, no email required.";

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
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "Free Local SEO Grader" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const factors = [
  "Google Business Profile claimed & optimised",
  "Business category accuracy",
  "Photo quality and recency",
  "Review count and velocity",
  "Review response rate",
  "Google Posts activity",
  "NAP consistency across directories",
  "Website local SEO signals",
  "Local keyword targeting",
  "Mobile performance",
];

const faqs = [
  {
    q: "Is this tool free?",
    a: "Yes, completely free. Enter your business name, city, and type to get an instant score across 10 local SEO factors. No email address required.",
  },
  {
    q: "How accurate is the grader?",
    a: "The grader evaluates common local SEO patterns and generates a diagnostic based on industry benchmarks for your business type. It surfaces the most common issues affecting local rankings. For a detailed, manually verified audit of your specific GBP and accounts, use the free full audit service.",
  },
  {
    q: "What's a good local SEO score?",
    a: "A score of B (70%+) means your fundamentals are solid. An A (85%+) means you're well-positioned to rank in the map pack for your main keywords. Most local businesses score C or D — meaning there are clear, fixable gaps between them and the top results.",
  },
  {
    q: "What should I do with my score?",
    a: "Focus on the red and amber items first — they represent the biggest gaps between you and competitors. Each failing item includes a specific action you can take today. If you'd like expert help implementing the fixes, request a free full audit.",
  },
];

export default function LocalSeoGraderPage() {
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Local SEO Grader",
    url: PAGE_URL,
    description: PAGE_DESC,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Tools", url: "https://datalatte.pro/tools" },
    { name: "Local SEO Grader", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-800 to-coffee-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            Free tool · Instant results · No email required
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            How strong is your
            <span className="text-coffee-300"> local SEO?</span>
          </h1>
          <p className="text-coffee-200 text-lg mb-8 leading-relaxed">
            Get an instant score across 10 key ranking factors — with specific, actionable fixes for anything below a passing grade.
          </p>
        </div>
      </section>

      {/* Tool */}
      <SectionWrapper>
        <LocalSeoGrader />
      </SectionWrapper>

      {/* What we check */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-label">What we grade</span>
            <h2 className="section-title">10 local SEO factors that affect your ranking</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {factors.map((f) => (
              <div key={f} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                <CheckCircle2 size={15} className="text-coffee-500 shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Upgrade to full audit */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Want more depth?</span>
          <h2 className="section-title mb-4">This tool vs. the full free audit</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left mt-8">
            <div className="card p-6">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">This SEO grader</h3>
              <p className="text-gray-500 text-sm mb-4">Instant automated score across common local SEO factors. Great for a quick health check and prioritising where to focus.</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>✓ Instant results</li>
                <li>✓ No email required</li>
                <li>✓ 10 key factors scored</li>
                <li>✓ Actionable fix for each issue</li>
              </ul>
            </div>
            <div className="card p-6 border-coffee-200 bg-coffee-50/30">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2">Free full audit</h3>
              <p className="text-gray-500 text-sm mb-4">Manually reviewed by Nataliia — your specific GBP, competitor analysis, keyword gaps, and a prioritised action plan.</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>✓ Personal review of your actual GBP</li>
                <li>✓ Top 3 competitor analysis</li>
                <li>✓ Keyword gap report</li>
                <li>✓ Ad account health check (if applicable)</li>
                <li>✓ Delivered within 48 hours</li>
              </ul>
              <Link href="/free-audit" className="inline-flex items-center gap-1.5 text-sm font-semibold text-coffee-700 mt-4 hover:underline">
                Request the full audit <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions about the grader</h2>
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
        headline="Score wasn't what you hoped? Let's fix that."
        sub="Get a free full audit — a personal review of your GBP, competitors, and marketing setup, delivered within 48 hours."
      />
    </>
  );
}
