import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SectionWrapper from "@/components/SectionWrapper";
import BlogGrid from "@/components/BlogGrid";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 3600;

const contentDir = path.join(process.cwd(), "content/blog");
const imageCachePath = path.join(contentDir, "image-cache.json");

const POSTS_PER_PAGE = 24;
const BASE = "https://datalatte.pro";
const BLOG_URL = `${BASE}/blog`;
const BLOG_TITLE = "Blog | Local Marketing Tips for Small Businesses";
const BLOG_DESC =
  "Data-driven local marketing tips for small business owners. Google Ads, Meta Ads, local SEO, and Google Business Profile — written for owners, not marketers.";

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
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Dynamic metadata (includes page number for pages 2+) ─────────────────────
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const isFirstPage = page === 1;

  const canonicalUrl = isFirstPage ? BLOG_URL : `${BLOG_URL}?page=${page}`;
  const title = isFirstPage ? BLOG_TITLE : `Page ${page} — ${BLOG_TITLE}`;

  return {
    title,
    description: BLOG_DESC,
    // Pages 2+ are valid content — let Google index them (no noindex)
    alternates: {
      canonical: canonicalUrl,
      languages: isFirstPage
        ? { "en-US": BLOG_URL, "en-GB": BLOG_URL, "en-AU": BLOG_URL, "en-CA": BLOG_URL, "x-default": BLOG_URL }
        : undefined,
    },
    openGraph: {
      title,
      description: BLOG_DESC,
      url: canonicalUrl,
      siteName: "DataLatte",
      type: "website",
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "DataLatte Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: BLOG_DESC,
      images: [`${BASE}/opengraph-image`],
    },
  };
}

// ── Pagination links component (pure HTML — crawlable by Google) ──────────────
function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const pageUrl = (p: number) => (p === 1 ? BLOG_URL : `${BLOG_URL}?page=${p}`);

  // Show: first, ..., prev-1, prev, current, next, next+1, ..., last
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-1 flex-wrap">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} /> Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
          <ChevronLeft size={15} /> Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-gray-400 select-none">…</span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold bg-coffee-700 text-white"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={`Page ${p}`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Next page"
        >
          Next <ChevronRight size={15} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
          Next <ChevronRight size={15} />
        </span>
      )}
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const allPosts = getAllPosts();

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, parseInt(pageStr ?? "1", 10)), totalPages);
  const pagePosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Schema only on page 1 — represents the whole collection
  const collectionPageSchema =
    currentPage === 1
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: BLOG_TITLE,
          description: BLOG_DESC,
          url: BLOG_URL,
          publisher: { "@type": "Organization", name: "DataLatte", url: BASE },
          hasPart: allPosts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            url: `${BASE}/blog/${p.slug}`,
            datePublished: p.date,
            image: p.image,
          })),
        }
      : null;

  const itemListSchema =
    currentPage === 1
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "DataLatte Blog — Latest Articles",
          url: BLOG_URL,
          numberOfItems: allPosts.length,
          itemListElement: allPosts.slice(0, 30).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE}/blog/${p.slug}`,
            name: p.title,
          })),
        }
      : null;

  return (
    <>
      {collectionPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
        />
      )}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/* Hero — only show on page 1 */}
      {currentPage === 1 ? (
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
      ) : (
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <Link href={BLOG_URL} className="text-coffee-700 text-sm hover:underline mb-3 inline-block">
              ← Back to all articles
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Blog — Page {currentPage}
              <span className="text-gray-400 font-normal text-lg ml-2">of {totalPages}</span>
            </h1>
          </div>
        </section>
      )}

      <SectionWrapper>
        <BlogGrid posts={pagePosts} />

        {/* HTML pagination — crawlable by Google */}
        <Pagination currentPage={currentPage} totalPages={totalPages} />

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
          Reading is great. Implementation is better. Let&apos;s audit your marketing together.
        </p>
        <Link href="/contact" className="btn-primary">
          Get a free audit
        </Link>
      </section>
    </>
  );
}
