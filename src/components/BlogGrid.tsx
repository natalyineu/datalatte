"use client";
import { useState } from "react";
import BlogCard from "./BlogCard";

interface Post { title: string; description: string; slug: string; category: string; date: string; readTime: string; image: string; }

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category))).sort()];

  const filtered = posts.filter(p => {
    const matchesCategory = active === "All" || p.category === active;
    const q = query.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Search input */}
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full max-w-md px-4 py-2.5 rounded-full border border-coffee-200 bg-white text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${active === cat ? "bg-coffee-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No articles found. Try a different search or category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} title={post.title} excerpt={post.description} slug={post.slug} category={post.category}
              date={new Date(post.date).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
              readTime={post.readTime} image={post.image} />
          ))}
        </div>
      )}
    </>
  );
}
