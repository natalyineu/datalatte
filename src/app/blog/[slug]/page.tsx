import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Callout from "@/components/mdx/Callout";
import BarChart from "@/components/mdx/BarChart";
import StatRow from "@/components/mdx/StatRow";
import Funnel from "@/components/mdx/Funnel";
import DonutChart from "@/components/mdx/DonutChart";
import LineChart from "@/components/mdx/LineChart";
import CompareBar from "@/components/mdx/CompareBar";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CTABanner from "@/components/CTABanner";
import { ArrowRight } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

/** Convert heading text to an anchor id (mirrors TableOfContents slugify). */
function headingId(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const revalidate = 86400;
export const dynamicParams = true;

const contentDir = path.join(process.cwd(), "content/blog");

const CLUSTER_TO_SERVICE: Record<string, { label: string; href: string }> = {
  // Google Ads variants
  "Google Ads":                           { label: "Google Ads Management", href: "/services/google-ads" },
  "Google Ads Advanced":                  { label: "Google Ads Management", href: "/services/google-ads" },
  "Microsoft Ads":                        { label: "Google Ads Management", href: "/services/google-ads" },
  "Yahoo Advertising":                    { label: "Google Ads Management", href: "/services/google-ads" },
  "YouTube Ads":                          { label: "Google Ads Management", href: "/services/google-ads" },
  "Programmatic Advertising":             { label: "Google Ads Management", href: "/services/google-ads" },
  "Retargeting":                          { label: "Google Ads Management", href: "/services/google-ads" },
  "CTV & OTT":                            { label: "Google Ads Management", href: "/services/google-ads" },
  "CTV Advertising":                      { label: "Google Ads Management", href: "/services/google-ads" },
  "Audio Advertising":                    { label: "Google Ads Management", href: "/services/google-ads" },
  // Meta Ads variants
  "Meta Ads":                             { label: "Meta Ads Management", href: "/services/meta-ads" },
  "Facebook Ads":                         { label: "Meta Ads Management", href: "/services/meta-ads" },
  "Instagram Ads":                        { label: "Meta Ads Management", href: "/services/meta-ads" },
  "Instagram Marketing":                  { label: "Meta Ads Management", href: "/services/meta-ads" },
  "TikTok Ads":                           { label: "Social Media Management", href: "/services/social-media" },
  "TikTok Marketing":                     { label: "Social Media Management", href: "/services/social-media" },
  "Snapchat Advertising":                 { label: "Social Media Management", href: "/services/social-media" },
  "Pinterest Marketing":                  { label: "Social Media Management", href: "/services/social-media" },
  "Reddit & Community Marketing":         { label: "Social Media Management", href: "/services/social-media" },
  "Nextdoor & Neighborhood Marketing":    { label: "Local SEO", href: "/services/local-seo" },
  "Messaging & Community Marketing":      { label: "Email & SMS Marketing", href: "/services/email-sms" },
  "Telegram & Messaging Ads":             { label: "Email & SMS Marketing", href: "/services/email-sms" },
  // Local SEO variants
  "Local SEO":                            { label: "Local SEO", href: "/services/local-seo" },
  "Google Business Profile Optimization": { label: "Google Business Profile", href: "/services/google-business-profile" },
  "Reputation Management":                { label: "Google Business Profile", href: "/services/google-business-profile" },
  "Review Platform Ads":                  { label: "Google Business Profile", href: "/services/google-business-profile" },
  // Analytics
  "Analytics & Tracking":                 { label: "Analytics & Reporting", href: "/services/analytics" },
  // AI & Automation
  "AI & Automation":                      { label: "AI Agents & Automation", href: "/services/ai-agents" },
  "Marketing Automation":                 { label: "AI Agents & Automation", href: "/services/ai-agents" },
  // Email & SMS
  "Email & SMS Marketing":                { label: "Email & SMS Marketing", href: "/services/email-sms" },
  "Email Marketing":                      { label: "Email & SMS Marketing", href: "/services/email-sms" },
  // Social Media
  "Social Media":                         { label: "Social Media Management", href: "/services/social-media" },
  "Content Marketing":                    { label: "Social Media Management", href: "/services/social-media" },
  "Influencer Marketing":                 { label: "Social Media Management", href: "/services/social-media" },
  "Influencer Marketing for Salons":      { label: "Social Media Management", href: "/services/social-media" },
  "Influencer & Creator Marketing":       { label: "Social Media Management", href: "/services/social-media" },
  // Website & CRO
  "Website & CRO":                        { label: "Website & Landing Pages", href: "/services/website" },
  // Strategy — default to analytics
  "Marketing Strategy":                   { label: "Analytics & Reporting", href: "/services/analytics" },
  "Local Business Strategy":              { label: "Analytics & Reporting", href: "/services/analytics" },
  "Tool Comparisons":                     { label: "Analytics & Reporting", href: "/services/analytics" },
  "Offline Marketing":                    { label: "Local SEO", href: "/services/local-seo" },
  "Case Studies":                         { label: "Local SEO", href: "/services/local-seo" },
  // Niche pages
  "Coffee Shop Marketing":                { label: "Coffee Shop Marketing", href: "/for/coffee-shops" },
  "Coffee Shops":                         { label: "Coffee Shop Marketing", href: "/for/coffee-shops" },
  "Hair Salon Marketing":                 { label: "Hair Salon Marketing", href: "/for/hair-salons" },
  "Hair Salons":                          { label: "Hair Salon Marketing", href: "/for/hair-salons" },
  "Pet Groomer Marketing":                { label: "Pet Groomer Marketing", href: "/for/pet-groomers" },
  "Pet Groomers":                         { label: "Pet Groomer Marketing", href: "/for/pet-groomers" },
  "Dog Grooming Marketing":               { label: "Pet Groomer Marketing", href: "/for/pet-groomers" },
  "Fitness Studio Marketing":             { label: "Fitness Studio Marketing", href: "/for/fitness-studios" },
  "Fitness Studios":                      { label: "Fitness Studio Marketing", href: "/for/fitness-studios" },
};

/** Fuzzy fallback: keyword-match the category to a service. */
function getServiceLink(category: string): { label: string; href: string } | null {
  if (!category) return null;
  if (CLUSTER_TO_SERVICE[category]) return CLUSTER_TO_SERVICE[category];
  const c = category.toLowerCase();
  if (c.includes("google ads") || c.includes("ppc") || c.includes("search ad")) return { label: "Google Ads Management", href: "/services/google-ads" };
  if (c.includes("facebook") || c.includes("meta") || c.includes("instagram ad")) return { label: "Meta Ads Management", href: "/services/meta-ads" };
  if (c.includes("seo") || c.includes("search") || c.includes("local") && !c.includes("social")) return { label: "Local SEO", href: "/services/local-seo" };
  if (c.includes("google business") || c.includes("gbp") || c.includes("review") || c.includes("reputation")) return { label: "Google Business Profile", href: "/services/google-business-profile" };
  if (c.includes("analytic") || c.includes("tracking") || c.includes("report")) return { label: "Analytics & Reporting", href: "/services/analytics" };
  if (c.includes("ai") || c.includes("automat")) return { label: "AI Agents & Automation", href: "/services/ai-agents" };
  if (c.includes("email") || c.includes("sms") || c.includes("message")) return { label: "Email & SMS Marketing", href: "/services/email-sms" };
  if (c.includes("social") || c.includes("tiktok") || c.includes("instagram") || c.includes("influenc") || c.includes("content") || c.includes("pinterest") || c.includes("snapchat") || c.includes("reddit")) return { label: "Social Media Management", href: "/services/social-media" };
  if (c.includes("website") || c.includes("landing") || c.includes("cro") || c.includes("convert")) return { label: "Website & Landing Pages", href: "/services/website" };
  if (c.includes("coffee") || c.includes("café") || c.includes("cafe")) return { label: "Coffee Shop Marketing", href: "/for/coffee-shops" };
  if (c.includes("salon") || c.includes("barber") || c.includes("hair") || c.includes("beauty") || c.includes("spa")) return { label: "Hair Salon Marketing", href: "/for/hair-salons" };
  if (c.includes("groom") || c.includes("pet") || c.includes("dog") || c.includes("cat")) return { label: "Pet Groomer Marketing", href: "/for/pet-groomers" };
  if (c.includes("fitness") || c.includes("gym") || c.includes("yoga") || c.includes("studio") || c.includes("trainer")) return { label: "Fitness Studio Marketing", href: "/for/fitness-studios" };
  // Final fallback
  return { label: "Local Marketing Services", href: "/services/local-seo" };
}

function getPostSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

function getRelatedPosts(currentSlug: string, category: string, limit = 3): RelatedPost[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  const candidates: RelatedPost[] = [];
  const fallbacks: RelatedPost[] = [];

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    if (slug === currentSlug) continue;
    try {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data, content } = matter(raw);
      const post: RelatedPost = {
        slug,
        title: data.title || slug,
        description: data.description || "",
        image: data.image || `/blog/clusters/marketing-strategy.jpg`,
        category: data.category || "",
        readTime: data.readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        date: data.date || "",
      };
      if (data.category === category) candidates.push(post);
      else fallbacks.push(post);
    } catch {
      // skip unreadable files
    }
  }

  const pool = candidates.length >= limit ? candidates : [...candidates, ...fallbacks];
  // shuffle deterministically by slug to avoid hydration mismatch
  pool.sort((a, b) => a.slug.localeCompare(b.slug));
  return pool.slice(0, limit);
}

function calcReadTime(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function getPost(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  if (!frontmatter.readTime) {
    frontmatter.readTime = calcReadTime(content.split(/\s+/).length);
  }
  return { frontmatter, content };
}

interface PostFrontmatter {
  title: string;
  date: string;
  lastModified?: string; // set by caretaker when FAQ/charts are added
  description: string;
  author: string;
  category: string;
  tags: string[];
  slug: string;
  image: string;
  readTime: string;
}

/** Strip markdown / MDX syntax to plain text. */
function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")           // strip MDX/HTML tags
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1")     // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1)) // inline code
    .trim();
}

/** Extract FAQ Q&A pairs from MDX content for FAQPage structured data.
 *  Handles three formats:
 *   1. ### heading per question (most common in new articles)
 *   2. Q: / A: plain or list style  (older articles)
 *   3. **Bold question?** followed by answer paragraph
 */
function extractFaqItems(content: string): { q: string; a: string }[] {
  // Find the FAQ section (handles variations in heading text)
  const faqSectionMatch = content.match(
    /##\s+(?:Frequently Asked Questions|FAQ)[^\n]*\n([\s\S]*?)(?=\n##\s|\n---|\n<\/|$)/i
  );
  if (!faqSectionMatch) return [];

  const faqBody = faqSectionMatch[1];
  const results: { q: string; a: string }[] = [];

  // ── Format 1: ### Sub-headings ────────────────────────────────────────────
  const hashChunks = faqBody.split(/\n###\s+/).slice(1);
  if (hashChunks.length > 0) {
    for (const chunk of hashChunks) {
      const lines = chunk.split("\n");
      const rawQ = lines[0].trim();
      const q = stripMarkdown(rawQ).replace(/\?*$/, "") + "?";
      const answerLines = lines
        .slice(1)
        .filter((l) => l.trim() && !l.trim().startsWith("<") && !l.trim().startsWith("#"))
        .map((l) => stripMarkdown(l))
        .filter(Boolean);
      const a = answerLines.join(" ").slice(0, 500);
      if (q && a) results.push({ q, a });
    }
    if (results.length > 0) return results.slice(0, 10);
  }

  // ── Format 2: Q: / A: plain or list style ────────────────────────────────
  // Handles: "Q: question\nA: answer", "* **Q: question**\n  A: answer",
  //          "**Q: question**\nA: answer", "Q: question\n\nA: answer"
  const qaPattern = /(?:^|\n)\s*(?:\*\s*)?(?:\*{1,2})?Q(?:uestion)?:\s*\*{0,2}\s*(.+?)(?:\*{0,2})\s*\n+\s*(?:\*\s*)?(?:\*{1,2})?A(?:nswer)?:\s*\*{0,2}\s*([\s\S]+?)(?=\n\s*(?:\*\s*)?(?:\*{0,2})?Q(?:uestion)?:|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = qaPattern.exec(faqBody)) !== null && results.length < 10) {
    const q = stripMarkdown(m[1]).replace(/\?*$/, "") + "?";
    const a = stripMarkdown(m[2].split("\n")[0]).slice(0, 500); // first paragraph of answer
    if (q.length > 10 && a.length > 10) results.push({ q, a });
  }
  if (results.length > 0) return results;

  // ── Format 3: **Bold question?** + paragraph answer ──────────────────────
  const boldQPattern = /\*\*([^*]{10,}?\?)\*\*\s*\n+([^\n*#]{20,})/g;
  while ((m = boldQPattern.exec(faqBody)) !== null && results.length < 10) {
    const q = stripMarkdown(m[1]).replace(/\?*$/, "") + "?";
    const a = stripMarkdown(m[2]).slice(0, 500);
    if (q && a) results.push({ q, a });
  }

  return results.slice(0, 10); // Google shows max ~10 FAQ entries
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const { frontmatter } = post;
  const url = `https://datalatte.pro/blog/${slug}`;
  const imageUrl = frontmatter.image?.startsWith("http")
    ? frontmatter.image
    : `https://datalatte.pro${frontmatter.image}`;

  const modifiedTime = frontmatter.lastModified ?? frontmatter.date;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    // ── Canonical + hreflang per article ──────────────────────────────────
    alternates: {
      canonical: url,
      languages: {
        "en-US": url,
        "en-GB": url,
        "en-AU": url,
        "en-CA": url,
        "x-default": url,
      },
    },
    // ── Open Graph (article type with full metadata) ───────────────────────
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      type: "article",
      locale: "en_US",
      alternateLocale: ["en_GB", "en_AU", "en_CA"],
      siteName: "DataLatte",
      publishedTime: frontmatter.date,
      modifiedTime,
      authors: ["https://datalatte.pro/about"],
      tags: frontmatter.tags ?? [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    // ── Twitter / X card ──────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [imageUrl],
    },
  };
}

// MDX component overrides — maps markdown elements to Tailwind-styled JSX
const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = headingId(String(children));
    return (
      <h2 id={id} className="text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = headingId(String(children));
    return (
      <h3 id={id} className="text-xl font-semibold text-gray-800 mt-8 mb-3 scroll-mt-24" {...props}>
        {children}
      </h3>
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className="text-gray-600 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-5 space-y-2 text-gray-600" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-5 space-y-2 text-gray-600" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-600 mb-1" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-800" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-coffee-700 underline hover:text-coffee-900" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-coffee-300 pl-4 italic text-gray-500 my-6" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  Callout,
  BarChart,
  StatRow,
  Funnel,
  DonutChart,
  LineChart,
  CompareBar,
  // Aliases for shorthand component names the AI sometimes generates
  Tip: ({ children }: { children: React.ReactNode }) => <Callout type="tip">{children}</Callout>,
  Warning: ({ children }: { children: React.ReactNode }) => <Callout type="warning">{children}</Callout>,
  Coffee: ({ children }: { children: React.ReactNode }) => <Callout type="coffee">{children}</Callout>,
  Example: ({ children }: { children: React.ReactNode }) => <Callout type="example">{children}</Callout>,
  Stat: ({ children }: { children: React.ReactNode }) => <Callout type="stat">{children}</Callout>,
  Faq: ({ children }: { children: React.ReactNode }) => <Callout type="faq">{children}</Callout>,
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-coffee-50 text-coffee-800 text-xs font-mono px-1.5 py-0.5 rounded" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-900 text-gray-100 text-sm font-mono rounded-xl p-5 overflow-x-auto my-6" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-coffee-50 text-coffee-900" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-gray-100" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-gray-50 transition-colors" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-coffee-800 text-xs uppercase tracking-wide border-b border-coffee-100 whitespace-nowrap" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-gray-600 align-top" {...props} />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const relatedPosts = getRelatedPosts(slug, frontmatter.category);

  // Word count and reading time for schema
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const schema = articleSchema({
    title: frontmatter.title,
    description: frontmatter.description,
    url: `https://datalatte.pro/blog/${slug}`,
    datePublished: frontmatter.date,
    dateModified: frontmatter.lastModified ?? frontmatter.date,
    image: frontmatter.image,
    tags: frontmatter.tags,
    wordCount,
    timeRequired: `PT${readMinutes}M`,
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Blog", url: "https://datalatte.pro/blog" },
    { name: frontmatter.title, url: `https://datalatte.pro/blog/${slug}` },
  ]);

  const faqItems = extractFaqItems(content);
  const faqStructuredData = faqItems.length > 0 ? faqSchema(faqItems) : null;

  // Format date for display
  const displayDate = new Date(frontmatter.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <li><Link href="/" className="hover:text-coffee-700 transition-colors">Home</Link></li>
            <li className="text-gray-300" aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-coffee-700 transition-colors">Blog</Link></li>
            <li className="text-gray-300" aria-hidden="true">/</li>
            <li className="text-gray-700 truncate max-w-[240px] sm:max-w-none" aria-current="page">{frontmatter.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero image */}
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={frontmatter.image}
          alt={frontmatter.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Link
            href={`/blog/category/${frontmatter.category.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
            className="inline-block bg-coffee-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 hover:bg-coffee-600 transition-colors"
          >
            {frontmatter.category}
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {frontmatter.title}
          </h1>
        </div>
      </div>

      {/* Wide wrapper for content + sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta row — full width */}
        <div className="max-w-3xl mx-auto flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {displayDate}
          </span>
          <span>·</span>
          <span>{frontmatter.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {frontmatter.readTime}
          </span>
          <Link href="/blog" className="flex items-center gap-1 text-coffee-700 hover:underline ml-auto text-sm">
            <ArrowLeft size={14} /> All posts
          </Link>
        </div>

        {/* Content + sticky TOC sidebar */}
        <div className="flex gap-12 items-start">
          {/* Article body */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Mobile ToC (renders inside content column, hidden on xl) */}
            <TableOfContents source={content} />

            {/* MDX Content */}
            <div className="prose-datalatte">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>

        {/* Tags */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="text-xs bg-coffee-50 text-coffee-700 px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related service link */}
        {(() => {
          const svc = getServiceLink(frontmatter.category);
          return svc ? (
            <div className="mt-10 p-5 rounded-xl bg-coffee-50 border border-coffee-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-coffee-600 uppercase tracking-wide mb-1">Want hands-on help?</p>
                <p className="text-sm text-gray-700">
                  See how DataLatte handles{" "}
                  <span className="font-semibold">{svc.label}</span> for local businesses.
                </p>
              </div>
              <Link
                href={svc.href}
                className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-coffee-800 hover:text-coffee-950 hover:underline"
              >
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          ) : null;
        })()}

        {/* Author */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Image src="/images/founder.png" alt="Nataliia Makota" width={40} height={40} className="rounded-full object-cover w-10 h-10" />
            <div>
              <div className="font-semibold text-gray-900">{frontmatter.author}</div>
              <div className="text-sm text-gray-500">
                Freelance local marketing & analytics — for businesses that want real results.
              </div>
            </div>
          </div>
        </div>
          </div>{/* end article body */}

          {/* Desktop sticky ToC (hidden below xl) */}
          <TableOfContents source={content} />
        </div>{/* end flex row */}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative h-40 w-full flex-shrink-0">
                    <Image
                      src={rp.image}
                      alt={rp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-coffee-600 uppercase tracking-wide mb-2">{rp.category}</span>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-coffee-700 transition-colors">{rp.title}</h3>
                    <span className="mt-auto pt-3 text-xs text-gray-400">{rp.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner
        headline="Want this applied to your business?"
        sub="Let's review your current marketing setup together — free, no obligations."
      />
    </>
  );
}
