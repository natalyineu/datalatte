"use client";
import { useState } from "react";
import BlogCard from "./BlogCard";

interface Post { title: string; description: string; slug: string; category: string; date: string; readTime: string; image: string; }

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category))).sort()];
  const filtered = active === "All" ? posts : posts.filter(p => p.category === active);
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${active === cat ? "bg-coffee-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <BlogCard key={post.slug} title={post.title} excerpt={post.description} slug={post.slug} category={post.category}
            date={new Date(post.date).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
            readTime={post.readTime} image={post.image} />
        ))}
      </div>
    </>
  );
}
