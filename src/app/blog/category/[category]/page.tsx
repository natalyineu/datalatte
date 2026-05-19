import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import BlogGrid from "@/components/BlogGrid";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

const contentDir = path.join(process.cwd(), "content/blog");

interface PostMeta {
  title: string;
  description: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

function categoryToSlug(cat: string): string {
  return cat.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function slugToCategory(slug: string, allCategories: string[]): string | null {
  return allCategories.find((c) => categoryToSlug(c) === slug) ?? null;
}

function calcReadTime(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        title: data.title,
        description: data.description,
        slug,
        category: data.category ?? "",
        date: data.date,
        readTime: data.readTime || calcReadTime(content.split(/\s+/).length),
        image: data.image,
        tags: data.tags ?? [],
      } as PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getAllCategories(): string[] {
  const cats = new Set<string>();
  fs.readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .forEach((f) => {
      const { data } = matter(fs.readFileSync(path.join(contentDir, f), "utf8"));
      if (data.category) cats.add(data.category as string);
    });
  return [...cats];
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ category: categoryToSlug(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const allCategories = getAllCategories();
  const category = slugToCategory(slug, allCategories);
  if (!category) return {};
  return {
    title: `${category} Articles`,
    description: `Browse all DataLatte articles about ${category}. Practical tips for local business owners on ${category.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const allCategories = getAllCategories();
  const category = slugToCategory(slug, allCategories);
  if (!category) notFound();

  const posts = getAllPosts().filter((p) => p.category === category);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Blog", url: "https://datalatte.pro/blog" },
    { name: category, url: `https://datalatte.pro/blog/category/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/blog" className="text-sm text-coffee-700 hover:underline mb-4 inline-block">
            ← All posts
          </Link>
          <span className="section-label">{posts.length} articles</span>
          <h1 className="section-title mb-4">{category}</h1>
          <p className="section-subtitle">
            Practical advice for local business owners — no jargon, just tactics that work.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <BlogGrid posts={posts} />
      </SectionWrapper>

      {/* Bottom CTA */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Want {category.toLowerCase()} handled for you?
        </h2>
        <p className="text-gray-400 mb-6">
          Let&apos;s review your current setup — free audit, no obligations.
        </p>
        <Link href="/contact" className="btn-primary">
          Get a free audit
        </Link>
      </section>
    </>
  );
}
