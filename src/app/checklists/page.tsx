"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BarChart2, CheckSquare, ArrowRight } from "lucide-react";
import { checklists, getTotalItems, type ChecklistCategory } from "@/lib/checklists";

const CATEGORIES: { label: string; value: "All" | ChecklistCategory }[] = [
  { label: "All", value: "All" },
  { label: "SEO", value: "SEO" },
  { label: "Ads", value: "Ads" },
  { label: "Social", value: "Social" },
  { label: "Website", value: "Website" },
  { label: "Email", value: "Email" },
  { label: "Niche", value: "Niche" },
];

const CATEGORY_COLORS: Record<ChecklistCategory, string> = {
  SEO: "bg-coffee-100 text-coffee-800",
  Ads: "bg-gray-100 text-gray-800",
  Social: "bg-coffee-50 text-coffee-700",
  Website: "bg-gray-100 text-gray-700",
  Email: "bg-coffee-100 text-coffee-700",
  Niche: "bg-coffee-200 text-coffee-900",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-coffee-600",
  Intermediate: "text-coffee-700",
  Advanced: "text-coffee-900",
};

function useLocalProgress(slug: string, totalItems: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`checklist-${slug}`);
      if (stored) {
        const checked: number[] = JSON.parse(stored);
        setProgress(Math.round((checked.length / totalItems) * 100));
      }
    } catch {
      // ignore
    }
  }, [slug, totalItems]);

  return progress;
}

function ChecklistCard({
  checklist,
  index,
}: {
  checklist: (typeof checklists)[0];
  index: number;
}) {
  const totalItems = getTotalItems(checklist);
  const progress = useLocalProgress(checklist.slug, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden"
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[checklist.category]}`}
          >
            {checklist.category}
          </span>
          {progress > 0 && (
            <span className="text-xs font-medium text-coffee-600">
              {progress}% done
            </span>
          )}
        </div>

        {/* Icon + Title */}
        <div className="text-4xl mb-3 leading-none">{checklist.icon}</div>
        <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-coffee-700 transition-colors">
          {checklist.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
          {checklist.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <CheckSquare size={12} className="text-coffee-500" />
            {totalItems} items
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-coffee-500" />
            {checklist.timeEstimate}
          </span>
          <span className={`flex items-center gap-1 font-medium ${DIFFICULTY_COLORS[checklist.difficulty]}`}>
            <BarChart2 size={12} />
            {checklist.difficulty}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coffee-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/checklists/${checklist.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-coffee-700 hover:bg-coffee-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
        >
          {progress > 0 ? "Continue Checklist" : "Start Checklist"}
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ChecklistsPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | ChecklistCategory>("All");

  const filtered =
    activeCategory === "All"
      ? checklists
      : checklists.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-coffee-700/30 border border-coffee-600/40 text-coffee-300 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
              <CheckSquare size={13} />
              10 Free Checklists
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
              Free Marketing Checklists<br />
              <span className="text-coffee-400">for Local Businesses</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Every checklist is specific, actionable, and built for local business owners — not marketing professors. Track your progress as you go.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeCategory === cat.value
                    ? "bg-coffee-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((checklist, i) => (
            <ChecklistCard key={checklist.slug} checklist={checklist} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            No checklists in this category yet.
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-coffee-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-coffee-300 text-sm font-semibold uppercase tracking-wider mb-3">
            Done with the checklists?
          </p>
          <h2 className="text-3xl font-bold mb-4">
            Want help implementing all this?
          </h2>
          <p className="text-coffee-200 mb-8 text-lg">
            Book a free audit and get a personalized marketing plan for your local business — no fluff, just the specific actions that move the needle.
          </p>
          <Link
            href="/free-audit"
            className="inline-flex items-center gap-2 bg-white text-coffee-800 font-bold px-8 py-3.5 rounded-xl hover:bg-coffee-50 transition-colors duration-200 text-base"
          >
            Get a Free Marketing Audit
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
