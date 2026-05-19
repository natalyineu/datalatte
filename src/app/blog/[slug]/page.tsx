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
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;
export const dynamicParams = true;

const contentDir = path.join(process.cwd(), "content/blog");

const CLUSTER_TO_SERVICE: Record<string, { label: string; href: string }> = {
  "Google Ads":                           { label: "Google Ads Management", href: "/services/google-ads" },
  "Meta Ads":                             { label: "Meta Ads Management", href: "/services/meta-ads" },
  "Instagram Ads":                        { label: "Meta Ads Management", href: "/services/meta-ads" },
  "Local SEO":                            { label: "Local SEO", href: "/services/local-seo" },
  "Google Business Profile Optimization": { label: "Google Business Profile", href: "/services/google-business-profile" },
  "Analytics & Tracking":                 { label: "Analytics & Reporting", href: "/services/analytics" },
  "AI & Automation":                      { label: "AI Agents & Automation", href: "/services/ai-agents" },
  "Email & SMS Marketing":                { label: "Email & SMS Marketing", href: "/services/email-sms" },
  "Social Media":                         { label: "Social Media Management", href: "/services/social-media" },
  "Website & CRO":                        { label: "Website & Landing Pages", href: "/services/website" },
  "Coffee Shop Marketing":                { label: "Coffee Shop Marketing", href: "/for/coffee-shops" },
  "Hair Salon Marketing":                 { label: "Hair Salon Marketing", href: "/for/hair-salons" },
  "Pet Groomer Marketing":                { label: "Pet Groomer Marketing", href: "/for/pet-groomers" },
  "Fitness Studio Marketing":             { label: "Fitness Studio Marketing", href: "/for/fitness-studios" },
};

function getPostSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
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
  description: string;
  author: string;
  category: string;
  tags: string[];
  slug: string;
  image: string;
  readTime: string;
}

/** Extract FAQ Q&A pairs from MDX content for FAQPage structured data. */
function extractFaqItems(content: string): { q: string; a: string }[] {
  // Find the FAQ section (handles variations in heading text)
  const faqSectionMatch = content.match(
    /##\s+(?:Frequently Asked Questions|FAQ)[^\n]*\n([\s\S]*?)(?=\n##\s|\n---|\n<|$)/i
  );
  if (!faqSectionMatch) return [];

  const faqBody = faqSectionMatch[1];

  // Split on ### headings — each ### is a question
  const chunks = faqBody.split(/\n###\s+/).slice(1); // slice(1) drops the empty string before first ###

  return chunks
    .map((chunk) => {
      const lines = chunk.split("\n");
      const q = lines[0].trim().replace(/\*+/g, "").replace(/\?$/, "").trim() + "?";
      // Answer: remaining non-empty lines, stripped of MDX tags and markdown
      const answerLines = lines
        .slice(1)
        .filter((l) => l.trim() && !l.trim().startsWith("<") && !l.trim().startsWith("#"))
        .map((l) =>
          l
            .replace(/<[^>]+>/g, "")          // strip MDX/HTML tags
            .replace(/\*\*([^*]+)\*\*/g, "$1") // strip bold
            .replace(/\*([^*]+)\*/g, "$1")     // strip italic
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip links → text
            .trim()
        )
        .filter(Boolean);
      const a = answerLines.join(" ").slice(0, 500); // cap answer at 500 chars
      return q && a ? { q, a } : null;
    })
    .filter((item): item is { q: string; a: string } => item !== null)
    .slice(0, 10); // Google shows max ~10 FAQ entries in rich results
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
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3" {...props} />
  ),
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

  const schema = articleSchema({
    title: frontmatter.title,
    description: frontmatter.description,
    url: `https://datalatte.pro/blog/${slug}`,
    datePublished: frontmatter.date,
    image: frontmatter.image,
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
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
        {CLUSTER_TO_SERVICE[frontmatter.category] && (
          <div className="mt-10 p-5 rounded-xl bg-coffee-50 border border-coffee-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-coffee-600 uppercase tracking-wide mb-1">Want hands-on help?</p>
              <p className="text-sm text-gray-700">
                See how DataLatte handles{" "}
                <span className="font-semibold">{CLUSTER_TO_SERVICE[frontmatter.category].label}</span> for local businesses.
              </p>
            </div>
            <Link
              href={CLUSTER_TO_SERVICE[frontmatter.category].href}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-coffee-800 hover:text-coffee-950 hover:underline"
            >
              Learn more <ArrowRight size={14} />
            </Link>
          </div>
        )}

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
      </div>

      <CTABanner
        headline="Want this applied to your business?"
        sub="Let's review your current marketing setup together — free, no obligations."
      />
    </>
  );
}
