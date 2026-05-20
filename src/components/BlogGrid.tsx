"use client";
import { useState, useMemo, useEffect } from "react";
import BlogCard from "./BlogCard";
import { getGroup, GROUP_CONFIG, type GroupName } from "./blogCategories";

const PAGE_SIZE = 24;

interface Post {
  title: string;
  description: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const ALL_GROUPS = Object.keys(GROUP_CONFIG) as GroupName[];

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [activeGroup, setActiveGroup] = useState<GroupName | "All">("All");
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Count posts per group for badge display
  const groupCounts = useMemo(() => {
    const counts: Partial<Record<GroupName, number>> = {};
    for (const p of posts) {
      const g = getGroup(p.category);
      counts[g] = (counts[g] ?? 0) + 1;
    }
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    const base = posts.filter(p => {
      const matchesGroup = activeGroup === "All" || getGroup(p.category) === activeGroup;
      const q = query.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
    return sortAsc ? [...base].reverse() : base;
  }, [posts, activeGroup, query, sortAsc]);

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeGroup, query, sortAsc]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const [featured, ...rest] = visible;
  const rawDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      {/* Search + sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full max-w-md px-4 py-2.5 rounded-full border border-coffee-200 bg-white text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition"
        />
        <button
          onClick={() => setSortAsc(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-coffee-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition whitespace-nowrap"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 4h8M2 8h5M2 12h3" strokeLinecap="round"/>
            <path d="M11 6l2.5-2.5L16 6M13.5 3.5v9" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {sortAsc ? "Oldest first" : "Newest first"}
        </button>
        <span className="text-xs text-gray-400 sm:ml-auto">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Group filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveGroup("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeGroup === "All" ? "bg-coffee-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All
          <span className={`ml-1.5 text-xs ${activeGroup === "All" ? "text-white/70" : "text-gray-400"}`}>
            {posts.length}
          </span>
        </button>
        {ALL_GROUPS.filter(g => groupCounts[g]).map(group => {
          const { Icon, chipActive, chipInactive } = GROUP_CONFIG[group];
          const isActive = activeGroup === group;
          return (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? chipActive : chipInactive}`}
            >
              <Icon size={13} strokeWidth={2} />
              {group}
              <span className={`text-xs ${isActive ? "opacity-70" : "opacity-60"}`}>
                {groupCounts[group]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No articles found. Try a different search or category.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured && (
            <BlogCard
              key={featured.slug}
              title={featured.title}
              excerpt={featured.description}
              slug={featured.slug}
              category={featured.category}
              date={formatDate(featured.date)}
              rawDate={rawDate(featured.date)}
              readTime={featured.readTime}
              image={featured.image}
              featured
            />
          )}
          {rest.map(post => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.description}
              slug={post.slug}
              category={post.category}
              date={formatDate(post.date)}
              rawDate={rawDate(post.date)}
              readTime={post.readTime}
              image={post.image}
            />
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-coffee-700 hover:bg-coffee-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Load more articles
              <span className="text-white/60 text-xs">({filtered.length - visibleCount} remaining)</span>
            </button>
          </div>
        )}
      </>
      )}
    </>
  );
}
