import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SectionWrapper from "@/components/SectionWrapper";
import BlogCard from "@/components/BlogCard";
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

const categories = ["All", "Coffee Shops", "Hair Salons", "Pet Groomers", "Fitness Studios", "Local SEO", "Strategy"];

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
        {/* Category filter (visual only — full filtering would require client component or SSR params) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-coffee-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.description}
              slug={post.slug}
              category={post.category}
              date={new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              readTime={post.readTime}
              image={post.image}
            />
          ))}
        </div>

        {/* Load more CTA */}
        <div className="mt-14 text-center">
          <div className="bg-coffee-50 rounded-2xl p-8 max-w-lg mx-auto">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Stay in the loop</h3>
            <p className="text-gray-500 text-sm mb-5">
              New posts weekly. No spam, no fluff — just practical local marketing tips.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
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
