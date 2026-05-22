import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, BarChart3, CheckSquare, Cpu, Calculator, Layers } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/resources";
const PAGE_TITLE = "Free Marketing Resources for Local Businesses | DataLatte";
const PAGE_DESC =
  "Free guides, checklists, templates, calculators, and comparison tools for local business owners. Organised by niche and topic — no fluff, no gated content.";

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
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte Free Marketing Resources" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const tools = [
  {
    icon: Calculator,
    title: "Marketing Budget Calculator",
    desc: "Find out exactly how much to spend on Google Ads, Meta Ads, SEO, and more. Personalised channel recommendations for coffee shops, salons, and fitness studios.",
    href: "/tools/marketing-budget-calculator",
    tag: "Tool",
    tagColor: "bg-coffee-100 text-coffee-700",
  },
  {
    icon: BarChart3,
    title: "Local SEO Grader",
    desc: "Instantly score your local SEO across 10 key factors — GBP optimisation, review velocity, keyword targeting, and more. Get specific fixes for every failing item.",
    href: "/tools/local-seo-grader",
    tag: "Tool",
    tagColor: "bg-coffee-100 text-coffee-700",
  },
  {
    icon: Cpu,
    title: "AI Agent Builder",
    desc: "Build a custom AI agent for your local business in minutes — automate customer replies, social media, email marketing, and more. No coding required.",
    href: "/tools/ai-agent-builder",
    tag: "Tool",
    tagColor: "bg-coffee-100 text-coffee-700",
  },
  {
    icon: BookOpen,
    title: "Free Marketing Audit",
    desc: "Personal review of your GBP, local SEO, competitors, and ad accounts — delivered within 48 hours by Nataliia. No sales call required.",
    href: "/free-audit",
    tag: "Free Audit",
    tagColor: "bg-green-100 text-green-700",
  },
];

const nicheResources = [
  {
    emoji: "☕",
    niche: "Coffee Shops",
    links: [
      { label: "Coffee shop marketing guide", href: "/for/coffee-shops" },
      { label: "Google Ads for coffee shops", href: "/blog/google-ads-for-coffee-shops" },
      { label: "How much to spend on Google Ads", href: "/blog/how-much-should-a-coffee-shop-spend-on-google-ads" },
      { label: "AI agents for coffee shops", href: "/blog/ai-agents-for-coffee-shops" },
      { label: "Video marketing for coffee shops", href: "/blog/video-marketing-for-coffee-shops-complete-guide" },
    ],
  },
  {
    emoji: "✂️",
    niche: "Hair Salons",
    links: [
      { label: "Hair salon marketing guide", href: "/for/hair-salons" },
      { label: "Instagram ads case study", href: "/blog/case-study-hair-salon-grew-40-percent-instagram-ads" },
      { label: "Local SEO audit checklist for salons", href: "/blog/local-seo-audit-checklist-for-hair-salons" },
      { label: "AI booking system for salons", href: "/blog/ai-booking-assistant-for-salons" },
      { label: "Why salon clients ghost you", href: "/blog/why-salon-clients-ghost-you-and-how-to-stop-it" },
    ],
  },
  {
    emoji: "🐾",
    niche: "Pet Groomers",
    links: [
      { label: "Pet groomer marketing guide", href: "/for/pet-groomers" },
      { label: "200 new clients case study", href: "/blog/case-study-pet-groomer-200-new-clients-6-months" },
      { label: "Local SEO audit for pet groomers", href: "/blog/local-seo-audit-checklist-for-pet-groomers" },
      { label: "Google Ads for dog groomers", href: "/blog/how-much-should-a-dog-groomer-spend-on-google-ads" },
      { label: "AI agents for pet groomers", href: "/blog/ai-agents-for-pet-groomers" },
    ],
  },
  {
    emoji: "🧘",
    niche: "Fitness Studios",
    links: [
      { label: "Fitness studio marketing guide", href: "/for/fitness-studios" },
      { label: "Facebook Ads case study", href: "/blog/case-study-fitness-studio-filled-every-class-facebook-ads" },
      { label: "Email marketing templates", href: "/blog/fitness-studio-email-marketing-templates" },
      { label: "Local SEO checklist", href: "/blog/fitness-studio-local-seo-checklist" },
      { label: "AI chatbot for fitness studios", href: "/blog/ai-chatbot-for-fitness-studios" },
    ],
  },
];

const guidesByTopic = [
  {
    icon: CheckSquare,
    topic: "Checklists",
    color: "text-green-600 bg-green-50",
    links: [
      { label: "Google Business Profile optimisation checklist", href: "/blog/google-business-profile-optimization-checklist" },
      { label: "Local SEO audit checklist", href: "/blog/local-seo-audit-checklist" },
      { label: "Local business website checklist", href: "/blog/local-business-website-checklist" },
      { label: "Fitness studio local SEO checklist", href: "/blog/fitness-studio-local-seo-checklist" },
    ],
  },
  {
    icon: BarChart3,
    topic: "Pricing & Cost Guides",
    color: "text-coffee-700 bg-coffee-50",
    links: [
      { label: "How much do Google Ads cost?", href: "/blog/how-much-does-google-ads-cost-for-small-businesses-real-2026-pricing-breakdown" },
      { label: "How much does local SEO cost?", href: "/blog/how-much-does-local-seo-cost-for-a-small-business-honest-pricing-guide" },
      { label: "How much do Facebook Ads cost?", href: "/blog/how-much-do-facebook-ads-cost-for-small-businesses-2026-benchmarks" },
      { label: "How much does a website cost?", href: "/blog/how-much-does-a-website-cost-small-business" },
    ],
  },
  {
    icon: Layers,
    topic: "Platform Comparisons",
    color: "text-slate-700 bg-slate-50",
    links: [
      { label: "Google Ads vs Meta Ads for local business", href: "/blog/google-ads-vs-facebook-ads-local-business-which-wins" },
      { label: "Google Business Profile vs Yelp", href: "/blog/google-business-profile-vs-yelp-which-matters-more" },
      { label: "Yelp vs Google — which matters more?", href: "/blog/yelp-vs-google-business-profile-which-matters-more" },
      { label: "7 best marketing automation platforms (compared)", href: "/blog/7-best-marketing-automation-platforms-for-small-businesses-in-2026-compared" },
    ],
  },
  {
    icon: BookOpen,
    topic: "Beginner Guides",
    color: "text-amber-700 bg-amber-50",
    links: [
      { label: "What is local SEO? Plain English guide", href: "/blog/what-is-local-seo-and-why-does-it-matter-plain-english-guide-for-small-businesses" },
      { label: "What is programmatic advertising?", href: "/blog/what-is-programmatic-advertising-plain-english-guide-for-business-owners" },
      { label: "AI for small business: where to start", href: "/blog/ai-for-small-business-where-to-start-beginner-guide" },
      { label: "1-hour weekly marketing plan for busy owners", href: "/blog/1-hour-weekly-marketing-plan-for-busy-small-business-owners" },
    ],
  },
];

export default function ResourcesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Resources", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Free Resources</span>
          <h1 className="section-title mb-4">
            The local marketing
            <span className="gradient-text"> resource library</span>
          </h1>
          <p className="section-subtitle">
            Over 1,000 guides, checklists, tools, and templates — curated for local business owners.
            No gated content. No upsells. Just useful information.
          </p>
        </div>
      </section>

      {/* Interactive tools */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">Tools</span>
          <h2 className="section-title">Free interactive tools</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                  <tool.icon size={19} className="text-coffee-700" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tool.tagColor}`}>{tool.tag}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-coffee-700 transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-coffee-700 group-hover:gap-1.5 transition-all mt-auto">
                Open tool <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* By niche */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-10">
          <span className="section-label">By Business Type</span>
          <h2 className="section-title">Resources for your niche</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {nicheResources.map((nr) => (
            <div key={nr.niche} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-2xl mb-3">{nr.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-4">{nr.niche}</h3>
              <ul className="space-y-2">
                {nr.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-coffee-700 hover:text-coffee-900 hover:underline flex items-start gap-1.5">
                      <ArrowRight size={12} className="shrink-0 mt-0.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* By topic */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">By Topic</span>
          <h2 className="section-title">Guides organised by type</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {guidesByTopic.map((g) => (
            <div key={g.topic} className="card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${g.color}`}>
                  <g.icon size={17} />
                </div>
                <h3 className="font-bold text-gray-900">{g.topic}</h3>
              </div>
              <ul className="space-y-2.5">
                {g.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-coffee-700 hover:text-coffee-900 hover:underline flex items-start gap-1.5">
                      <ArrowRight size={12} className="shrink-0 mt-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Blog CTA */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">1,000+ Articles</span>
          <h2 className="section-title mb-4">The full blog</h2>
          <p className="text-gray-600 mb-6">
            Browse over 1,000 articles on every aspect of local digital marketing — searchable by topic,
            channel, and business type.
          </p>
          <Link href="/blog" className="btn-primary">
            Browse all articles <ArrowRight size={15} />
          </Link>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Want these strategies applied to your business?"
        sub="Start with a free audit. No sales call, no commitment — just expert eyes on your marketing."
      />
    </>
  );
}
