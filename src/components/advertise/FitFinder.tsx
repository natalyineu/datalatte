"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Bot, CalendarCheck, Hammer, Mail, Search, Truck, Tv, Eye, type LucideIcon } from "lucide-react";
import { FIT } from "./fit-data";

const ICONS: Record<string, LucideIcon> = { Tv, Search, CalendarCheck, Mail, Bot, BarChart3, Truck, Hammer };
const MAIL = "mailto:hi@datalatte.pro?subject=Sponsored%20placement%20on%20DataLatte";

export default function FitFinder() {
  const [i, setI] = useState(0);
  const cur = FIT[i];
  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[320px_1fr] gap-6">
      <div role="tablist" aria-label="What do you sell?" className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {FIT.map((f, k) => {
          const Icon = ICONS[f.icon];
          const on = k === i;
          return (
            <button key={f.key} role="tab" aria-selected={on} onClick={() => setI(k)}
              className={`flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-all duration-200 ${on ? "bg-coffee-700 border-coffee-600 text-white shadow-lg lg:translate-x-1" : "bg-white border-gray-200 text-gray-700 hover:border-coffee-400 hover:bg-coffee-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"}`}>
              <Icon size={18} className={on ? "text-coffee-200" : "text-coffee-600 dark:text-coffee-300"} aria-hidden />
              <span className="text-sm font-semibold leading-tight">{f.key}</span>
            </button>
          );
        })}
      </div>

      <div key={cur.key} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm animate-card-rise dark:bg-gray-900 dark:border-gray-700">
        <div className="text-xs font-semibold uppercase tracking-widest text-coffee-600 dark:text-coffee-300 mb-1">If you sell</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">{cur.key}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{cur.desc}</p>

        <div className="rounded-xl bg-coffee-50 border border-coffee-100 p-4 mb-6 dark:bg-coffee-900/20 dark:border-coffee-800">
          <div className="text-xs font-semibold uppercase tracking-widest text-coffee-700 dark:text-coffee-300 mb-1">Suggested format</div>
          <div className="font-bold text-gray-900 dark:text-gray-50">{cur.format}</div>
          <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{cur.why}</p>
        </div>

        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Guides where it could appear</div>
        <ul className="space-y-2 mb-6">
          {cur.guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/blog/${g.slug}`} className="group flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3 hover:border-coffee-300 hover:bg-coffee-50/60 transition-colors dark:border-gray-800 dark:hover:bg-gray-800">
                <span className="text-sm font-medium text-gray-900 group-hover:text-coffee-700 dark:text-gray-100 dark:group-hover:text-coffee-300">{g.title}</span>
                {g.imp >= 500 && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><Eye size={13} aria-hidden />{g.imp.toLocaleString("en-US")}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Numbers are Google impressions over 90 days (Search Console), shown for guides with 500 or more. Recently updated guides are still building their numbers.</p>

        <a href={MAIL} className="inline-flex items-center gap-2 bg-coffee-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-coffee-500 transition-colors">
          Ask about {cur.format.toLowerCase()} <ArrowRight size={17} />
        </a>
      </div>
    </div>
  );
}
