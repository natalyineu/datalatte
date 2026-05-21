import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SectionWrapper from "@/components/SectionWrapper";
import BlogGrid from "@/components/BlogGrid";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export const revalidate = 3600;

const contentDir = path.join(process.cwd(), "content/blog");
const imageCachePath = path.join(contentDir, "image-cache.json");

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

function calcReadTime(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function getAllPosts(): PostMeta[] {
  let imageCache: Record<string, string> = {};
  if (fs.existsSync(imageCachePath)) {
    try {
      imageCache = JSON.parse(fs.readFileSync(imageCachePath, "utf8"));
    } catch {
      // corrupted cache — fall back to frontmatter images
    }
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data, content } = matter(raw);
    const readTime = data.readTime || calcReadTime(content.split(/\s+/).length);
    return {
      title: data.title,
      description: data.description,
      slug,
      category: data.category,
      date: data.date,
      readTime,
      image: imageCache[slug] ?? data.image,
      tags: data.tags ?? [],
    } as PostMeta;
  });
  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const BASE = "https://datalatte.pro";
const BLOG_URL = `${BASE}/blog`;
const BLOG_TITLE = "Blog | Local Marketing Tips for Small Businesses";
const BLOG_DESC =
  "Data-driven local marketing tips for small business owners. Google Ads, Meta Ads, local SEO, and Google Business Profile — written for owners, not marketers.";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESC,
  alternates: {
    canonical: BLOG_URL,
    languages: {
      "en-US": BLOG_URL,
      "en-GB": BLOG_URL,
      "en-AU": BLOG_URL,
      "en-CA": BLOG_URL,
      "x-default": BLOG_URL,
    },
  },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESC,
    url: BLOG_URL,
    siteName: "DataLatte",
    type: "website",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "DataLatte Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESC,
    images: [`${BASE}/opengraph-image`],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: BLOG_TITLE,
    description: BLOG_DESC,
    url: BLOG_URL,
    publisher: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
    hasPart: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${BASE}/blog/${p.slug}`,
      datePublished: p.date,
      image: p.image,
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "DataLatte Blog — Latest Articles",
    url: BLOG_URL,
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Hero */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">The DataLatte Blog</span>
          <h1 className="section-title mb-4">
            Local marketing,{" "}
            <span className="gradient-text">explained plainly</span>
          </h1>
          <p className="section-subtitle">
            Practical tips for coffee shops, hair salons, pet groomers, and fitness studios.
            No jargon. No fluff. Just tactics that work.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <BlogGrid posts={posts} />

        {/* Newsletter */}
        <div className="mt-14 text-center">
          <NewsletterForm source="blog" />
        </div>
      </SectionWrapper>

      {/* Bottom CTA */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Want this applied to your specific business?
        </h2>
        <p className="text-gray-400 mb-6">
          Reading is great. Implementation is better. Let's audit your marketing together.
        </p>
        <Link href="/contact" className="btn-primary">
          Get a free audit
        </Link>
      </section>
    </>
  );
}

