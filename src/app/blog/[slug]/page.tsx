import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CTABanner from "@/components/CTABanner";
import ReadingProgress from "@/components/ReadingProgress";
import { articleSchema } from "@/lib/schema";

export const revalidate = 86400;

const contentDir = path.join(process.cwd(), "content/blog");

function getPostSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

function getPost(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
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
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      images: [{ url: frontmatter.image }],
      type: "article",
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
    <p className="text-gray-600 leading-relaxed mb-4" {...props} />
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
          <span className="inline-block bg-coffee-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {frontmatter.category}
          </span>
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
