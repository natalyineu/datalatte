"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BarChart2, CheckSquare, RotateCcw, Printer, ArrowRight, Check } from "lucide-react";
import { type Checklist, getTotalItems } from "@/lib/checklists";

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "bg-coffee-100 text-coffee-800 border-coffee-200",
  Ads: "bg-gray-100 text-gray-800 border-gray-200",
  Social: "bg-coffee-50 text-coffee-700 border-coffee-100",
  Website: "bg-gray-100 text-gray-700 border-gray-200",
  Email: "bg-coffee-100 text-coffee-700 border-coffee-200",
  Niche: "bg-coffee-200 text-coffee-900 border-coffee-300",
};

function getLocalKey(slug: string) {
  return `checklist-${slug}`;
}

function loadChecked(slug: string): Set<string> {
  try {
    const stored = localStorage.getItem(getLocalKey(slug));
    if (stored) {
      const arr: string[] = JSON.parse(stored);
      return new Set(arr);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveChecked(slug: string, checked: Set<string>) {
  try {
    localStorage.setItem(getLocalKey(slug), JSON.stringify([...checked]));
  } catch {
    // ignore
  }
}

function AnimatedCheckbox({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
}) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      id={id}
      className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-1 ${
        checked
          ? "bg-coffee-700 border-coffee-700"
          : "bg-white border-gray-300 hover:border-coffee-500"
      }`}
    >
      <AnimatePresence>
        {checked && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.18, type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check size={11} className="text-white stroke-[3]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function ChecklistClient({
  checklist,
}: {
  checklist: Checklist;
}) {
  const totalItems = getTotalItems(checklist);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevComplete, setPrevComplete] = useState(false);

  // Build a stable item ID from section index + item index
  function itemId(sectionIdx: number, itemIdx: number) {
    return `${sectionIdx}-${itemIdx}`;
  }

  useEffect(() => {
    setMounted(true);
    setChecked(loadChecked(checklist.slug));
  }, [checklist.slug]);

  const checkedCount = checked.size;
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  useEffect(() => {
    if (!mounted) return;
    const isComplete = checkedCount === totalItems && totalItems > 0;
    if (isComplete && !prevComplete) {
      setShowCelebration(true);
    }
    setPrevComplete(isComplete);
  }, [checkedCount, totalItems, prevComplete, mounted]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        saveChecked(checklist.slug, next);
        return next;
      });
    },
    [checklist.slug]
  );

  const reset = useCallback(() => {
    const empty = new Set<string>();
    setChecked(empty);
    setShowCelebration(false);
    setPrevComplete(false);
    saveChecked(checklist.slug, empty);
  }, [checklist.slug]);

  const handlePrint = () => {
    window.print();
  };

  // Sections with flat item index for LocalStorage keys
  let globalIdx = 0;
  const sectionsWithIds = checklist.sections.map((section, si) => ({
    ...section,
    itemsWithIds: section.items.map((item, ii) => {
      const id = itemId(si, ii);
      globalIdx++;
      return { item, id, globalIdx: globalIdx - 1 };
    }),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
              {mounted ? checkedCount : 0} / {totalItems} completed
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coffee-700 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${mounted ? pct : 0}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-bold text-coffee-700 flex-shrink-0 w-10 text-right">
              {mounted ? pct : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[checklist.category] ?? "bg-gray-100 text-gray-700 border-gray-200"} mb-4`}
              >
                {checklist.category}
              </span>
              <div className="text-5xl mb-3">{checklist.icon}</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                {checklist.title}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
                {checklist.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0 print:hidden">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 border-t border-gray-100 pt-5">
            <span className="flex items-center gap-1.5">
              <CheckSquare size={14} className="text-coffee-500" />
              <span className="font-medium text-gray-700">{totalItems}</span> total items
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-coffee-500" />
              {checklist.timeEstimate}
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart2 size={14} className="text-coffee-500" />
              {checklist.difficulty}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-coffee-600 inline-block" />
              {checklist.sections.length} sections
            </span>
          </div>
        </div>

        {/* Celebration banner */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45, type: "spring", stiffness: 300, damping: 25 }}
              className="mb-8 bg-coffee-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg"
            >
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-0.5">Checklist complete!</p>
                <p className="text-coffee-200 text-sm">
                  You&apos;ve completed all {totalItems} items. Ready to take your marketing to the next level?
                </p>
              </div>
              <Link
                href="/free-audit"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-coffee-800 font-bold px-5 py-2.5 rounded-xl hover:bg-coffee-50 transition-colors text-sm"
              >
                Get a Free Audit
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checklist sections */}
        <div className="space-y-8">
          {sectionsWithIds.map((section, si) => {
            const sectionChecked = section.itemsWithIds.filter((x) =>
              checked.has(x.id)
            ).length;
            const sectionTotal = section.itemsWithIds.length;
            const sectionComplete = sectionChecked === sectionTotal;

            return (
              <motion.div
                key={si}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.08 }}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                  sectionComplete
                    ? "border-coffee-200"
                    : "border-gray-100"
                }`}
              >
                {/* Section header */}
                <div
                  className={`flex items-center justify-between px-6 py-4 border-b ${
                    sectionComplete
                      ? "bg-coffee-50 border-coffee-100"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {sectionComplete && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-coffee-600 flex items-center justify-center"
                      >
                        <Check size={12} className="text-white stroke-[3]" />
                      </motion.span>
                    )}
                    <h2 className="font-bold text-gray-900 text-base">
                      {section.title}
                    </h2>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      sectionComplete
                        ? "bg-coffee-100 text-coffee-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {mounted ? sectionChecked : 0} / {sectionTotal}
                  </span>
                </div>

                {/* Items */}
                <ul className="divide-y divide-gray-50">
                  {section.itemsWithIds.map(({ item, id }) => {
                    const isChecked = mounted && checked.has(id);
                    return (
                      <li key={id}>
                        <label
                          htmlFor={`item-${id}`}
                          className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                            isChecked ? "bg-gray-50/50" : ""
                          }`}
                        >
                          <div className="pt-0.5">
                            <AnimatedCheckbox
                              checked={isChecked}
                              onChange={() => toggle(id)}
                              id={`item-${id}`}
                            />
                          </div>
                          <span
                            className={`text-sm leading-relaxed transition-all duration-200 ${
                              isChecked
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gray-900 text-white rounded-2xl p-8 text-center print:hidden">
          <p className="text-coffee-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Ready to implement?
          </p>
          <h3 className="text-2xl font-bold mb-3">
            Get a free marketing audit
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Book a 30-minute audit with Nataliia. You&apos;ll get a personalized action plan for your business — no sales pitch, just strategy.
          </p>
          <Link
            href="/free-audit"
            className="inline-flex items-center gap-2 bg-coffee-700 hover:bg-coffee-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200"
          >
            Book Free Audit
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center print:hidden">
          <Link
            href="/checklists"
            className="text-sm text-gray-400 hover:text-coffee-700 transition-colors"
          >
            ← Back to all checklists
          </Link>
        </div>
      </div>
    </div>
  );
}
