import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SEGMENT_GROUPS } from "@/lib/segments";

export default function Segments({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-12">
      {SEGMENT_GROUPS.map((g) => (
        <div key={g.id}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-coffee-900 dark:text-white">{g.label}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{g.intro}</p>
          </div>
          <ul className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
            {g.items.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-coffee-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-coffee-400 transition-all"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-gray-700 dark:to-gray-600 text-2xl" aria-hidden="true">
                    {s.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-coffee-900 dark:text-white leading-snug">{s.title}</span>
                    <span className="block mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-snug">{s.blurb}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-coffee-700 dark:text-coffee-300 group-hover:gap-2 transition-all">
                      Explore <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
