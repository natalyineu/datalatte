import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Local Marketing Tips for Coffee Shops, Salons, Pet Groomers & Fitness Studios",
  description:
    "Data-driven local marketing advice for small business owners. Practical tips on Google Ads, Meta Ads, local SEO, and Google Business Profile — written for owners, not marketers.",
};

const posts = [
  {
    title: "How Coffee Shops Can Dominate Google Maps in Their Neighborhood",
    excerpt:
      "The local map pack gets 44% of clicks for 'near me' searches. Here's exactly how to claim your spot without a big budget.",
    slug: "coffee-shops-dominate-google-maps",
    category: "Coffee Shops",
    date: "Apr 10, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    title: "The Hair Salon Owner's Guide to Getting More Bookings from Instagram",
    excerpt:
      "Meta Ads can feel like throwing money into a black hole — unless you set them up right. Here's what actually works.",
    slug: "hair-salon-instagram-bookings",
    category: "Hair Salons",
    date: "Apr 4, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    title: "5 Google Ads Mistakes Pet Groomers Keep Making (and How to Fix Them)",
    excerpt:
      "Most small business Google Ads accounts I audit have at least 3 of these issues. They're all fixable in an afternoon.",
    slug: "pet-groomer-google-ads-mistakes",
    category: "Pet Groomers",
    date: "Mar 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
  },
  {
    title: "Fitness Studios: How to Fill Classes in January AND July",
    excerpt:
      "The fitness industry is notoriously seasonal. Here's how to build a marketing calendar that drives memberships all year.",
    slug: "fitness-studio-year-round-marketing",
    category: "Fitness Studios",
    date: "Mar 20, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    title: "Google Business Profile 2026: The Complete Optimization Checklist",
    excerpt:
      "Everything you need to optimize your GBP for maximum visibility in the local map pack. Practical, step-by-step.",
    slug: "google-business-profile-optimization-checklist",
    category: "Local SEO",
    date: "Mar 12, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
  },
  {
    title: "What Does a Good Local Marketing Budget Actually Look Like?",
    excerpt:
      "Honest breakdown of what local businesses should expect to spend on Google Ads, Meta Ads, and SEO — and what they'll get for it.",
    slug: "local-marketing-budget-guide",
    category: "Strategy",
    date: "Mar 5, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
];

const categories = ["All", "Coffee Shops", "Hair Salons", "Pet Groomers", "Fitness Studios", "Local SEO", "Strategy"];

export default function BlogPage() {
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
            <BlogCard key={post.slug} {...post} />
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
