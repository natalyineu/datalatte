import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/content-marketing",
    languages: {
      "en-US": "https://datalatte.pro/services/content-marketing",
      "en-GB": "https://datalatte.pro/services/content-marketing",
      "en-AU": "https://datalatte.pro/services/content-marketing",
      "en-CA": "https://datalatte.pro/services/content-marketing",
      "x-default": "https://datalatte.pro/services/content-marketing",
    },
  },
  title: "Content Marketing for Small & Local Businesses | DataLatte",
  description:
    "SEO-driven content marketing for local businesses. Blog posts, landing pages, and local content that rank on Google and convert visitors into customers.",
  openGraph: {
    title: "Content Marketing for Small & Local Businesses | DataLatte",
    description: "SEO-driven content marketing for local businesses. Blog posts, landing pages, and local content that rank on Google and convert visitors into customers.",
    url: "https://datalatte.pro/services/content-marketing",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Marketing for Small & Local Businesses | DataLatte",
    description: "SEO-driven content marketing for local businesses. Blog posts, landing pages, and local content that rank on Google.",
  },
};

export default function ContentMarketingPage() {
  return (
    <ServicePage
      service="Content Marketing"
      tagline="Rank on Google, earn trust, and turn readers into customers — without paid ads."
      description="Content marketing builds a steady pipeline of organic traffic by answering the exact questions your customers are already typing into Google. For local businesses, that means showing up when it counts — before they even know about your competitors."
      icon="✍️"
      accentClass="bg-gradient-to-br from-emerald-800 to-emerald-950"
      whatItIs="Content marketing is the practice of creating and publishing valuable, search-optimised content — blog posts, service pages, guides, FAQs — that attracts your ideal customers through organic search. Unlike ads, content keeps working long after you publish it. A well-written blog post about 'best hair salons in Austin' can drive dozens of new visits every month for years. For local businesses, content marketing bridges the gap between Local SEO (ranking your Google Business Profile) and Paid Ads (paying for clicks). It's the middle layer that builds authority, earns backlinks, and gives customers a reason to trust you before they ever pick up the phone.\n\nIn the marketing funnel, content plays a different role at each stage. At the top, awareness-level content — 'how to choose a dog groomer', 'signs your pet needs a grooming appointment' — captures people early in their research, before they've decided who to book. In the middle, comparison and how-to content — 'balayage vs highlights: which is right for you?', 'how much does a fitness studio membership cost in Melbourne?' — reaches buyers who are actively evaluating options and building trust with whoever answers their questions best. At the bottom, local intent content — 'coffee shop with quiet workspace in Shoreditch', 'pet groomer open on Sundays in Austin' — captures ready-to-buy customers in the final moment before they book. A content strategy that covers all three stages builds a full-funnel organic presence that compounds month over month.\n\nThe most common mistake small businesses make with content marketing is publishing inconsistently and then concluding that 'content doesn't work for us.' DemandMetric research shows content marketing generates three times more leads than outbound marketing at 62% lower cost — but those results take time to materialise and require consistent output. Posting two articles in January and then nothing until May produces almost no organic traction. Google's ranking algorithms reward fresh, consistently updated sites; your competitors who publish 2–4 pieces per month are quietly accumulating the authority that earns their top rankings. The businesses winning in organic search right now started their content programmes 6–12 months ago and never stopped."
      howItWorks={[
        {
          step: "01",
          title: "Keyword & topic research",
          desc: "I identify the exact terms your customers search at every stage — 'what is balayage', 'balayage near me Austin', 'how much does balayage cost' — and build a content calendar around them.",
        },
        {
          step: "02",
          title: "Competitor content gap analysis",
          desc: "I audit what your local competitors are ranking for and find the topics they've missed. Those gaps become your fastest wins.",
        },
        {
          step: "03",
          title: "Content creation",
          desc: "I write (or direct the creation of) blog posts, service page copy, FAQs, and location landing pages. Every piece is written for humans first, optimised for Google second.",
        },
        {
          step: "04",
          title: "On-page SEO",
          desc: "Each piece is published with proper title tags, meta descriptions, schema markup, internal linking, and heading structure — so Google can understand and rank it.",
        },
        {
          step: "05",
          title: "Track, update & compound",
          desc: "I monitor rankings and traffic monthly. Pieces that are close to ranking get refreshed and boosted. New opportunities get added. Content compounds over time.",
        },
      ]}
      included={[
        "Keyword research and content gap analysis",
        "Monthly content calendar with prioritised topics",
        "Long-form blog posts (800–2,000 words each)",
        "Service page copywriting and optimisation",
        "Location landing pages for multi-city businesses",
        "On-page SEO (title, meta, headings, schema)",
        "Internal linking strategy",
        "FAQ sections with FAQ schema markup",
        "Content performance tracking (Google Search Console)",
        "Monthly ranking and traffic reports",
        "Content refresh and update strategy",
        "Competitor content monitoring",
        "Topical cluster mapping (pillar page + supporting articles)",
        "E-E-A-T optimisation (author bios, credentials, trust signals)",
        "Google Search Console setup and indexing management",
      ]}
      bestFor={[
        "Coffee shops wanting to rank for local searches",
        "Hair salons and beauty businesses building organic traffic",
        "Service businesses where customers research before buying",
        "Businesses with no time to write but who understand content's value",
        "Local businesses competing against national chains",
        "Any brand wanting to reduce reliance on paid ads over time",
      ]}
      faqs={[
        {
          q: "How long before content starts ranking?",
          a: "For competitive terms, expect 3–6 months. For less competitive local terms — 'pet groomer in [small city]' — you can see rankings in 4–8 weeks. Content marketing is a long game, but the results are durable.",
        },
        {
          q: "Do I need to write the content myself?",
          a: "No. I handle the writing, or work with a specialist writer for your niche. You'll review and approve drafts before anything is published. Your voice, your expertise — delivered without eating your time.",
        },
        {
          q: "How is content marketing different from SEO?",
          a: "Local SEO focuses on your Google Business Profile, citations, and on-site technical factors. Content marketing creates the actual pages that rank for informational and commercial searches. They work best together — and I do both.",
        },
        {
          q: "How many pieces of content do I need per month?",
          a: "For most local businesses, 2–4 pieces per month is a strong starting point. Quality beats quantity. One thorough 1,500-word post on a well-researched topic beats five thin 300-word posts.",
        },
        {
          q: "What topics should a local business write about?",
          a: "The best content for local businesses falls into three buckets: educational (answering questions your customers Google before booking), local intent (your service + your city/neighbourhood), and comparison content (helping customers choose between options, where your business is naturally positioned well). I research and prioritise all of this for you during the keyword research phase.",
        },
        {
          q: "Can content marketing replace paid ads?",
          a: "Over time, yes — organic traffic from content can significantly reduce your paid ad dependency. But they work best together in the short to medium term: ads give you immediate traffic while content builds the organic foundation that makes your business less vulnerable to rising ad costs. Most clients run both in parallel and gradually shift budget toward organic as it matures.",
        },
        {
          q: "How do I know the content is actually working?",
          a: "Every piece is tracked in Google Search Console, so we can see exactly which queries are driving impressions and clicks. Monthly reports show keyword position movements, organic traffic trends, and which articles are generating the most leads. Nothing is published and forgotten — every piece of content has a performance target and gets revisited if it's underperforming.",
        },
        {
          q: "Does content marketing work for service businesses with no blog?",
          a: "Yes — and starting from zero is actually an advantage. We can build a clean, well-structured content architecture from scratch, targeting the right keywords without the legacy of thin or duplicate content. Businesses that have never invested in content before often see faster early gains than those with years of low-quality posts that need cleaning up.",
        },
      ]}
      stats={[
        { value: "3×", label: "More leads vs outbound marketing" },
        { value: "62%", label: "Lower cost per lead than paid ads" },
        { value: "6mo", label: "Typical time to compounding organic traffic" },
        { value: "10×", label: "More web traffic from consistent content" },
      ]}
      relatedLinks={[
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Website & Landing Pages", href: "/services/website" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
