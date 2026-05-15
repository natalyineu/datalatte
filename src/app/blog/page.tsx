import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SectionWrapper from "@/components/SectionWrapper";
import BlogGrid from "@/components/BlogGrid";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export const revalidate = 86400;

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

function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data } = matter(raw);
    return {
      title: data.title,
      description: data.description,
      slug,
      category: data.category,
      date: data.date,
      readTime: data.readTime,
      image: data.image,
      tags: data.tags ?? [],
    } as PostMeta;
  });
  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const metadata: Metadata = {
  title: "Blog | Local Marketing Tips for Coffee Shops, Salons, Pet Groomers & Fitness Studios",
  description:
    "Data-driven local marketing advice for small business owners. Practical tips on Google Ads, Meta Ads, local SEO, and Google Business Profile — written for owners, not marketers.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
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
