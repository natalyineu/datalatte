"use client";
import { useState } from "react";
import { Check } from "lucide-react";

const TABS = [
  { id: "mention", label: "Mention", price: "from $150", words: "50–100 words", time: "3 business days", points: ["One link, rel=\"sponsored\"", "Placed where readers compare options", "Wording approved by you"], lines: 1 },
  { id: "section", label: "Section", price: "from $300", words: "150–300 words + table row", time: "3 business days", points: ["Up to two links, rel=\"sponsored\"", "Row added to the comparison table", "Facts checked on your public pages"], lines: 3 },
  { id: "article", label: "Article", price: "from $600", words: "1,200+ words", time: "about 2 weeks", points: ["Researched and written by us", "Sources cited, labelled Sponsored", "Internal links from related guides"], lines: 6 },
];

export default function PlacementTabs() {
  const [i, setI] = useState(1);
  const t = TABS[i];
  return (
    <div className="max-w-4xl mx-auto rounded-2xl border border-gray-800 bg-gray-900/80 overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950/60">
        <span className="w-3 h-3 rounded-full bg-red-500/80" /><span className="w-3 h-3 rounded-full bg-yellow-500/80" /><span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-gray-500 truncate">datalatte.pro/blog/your-article</span>
      </div>
      <div role="tablist" className="flex gap-1 px-3 pt-3 border-b border-gray-800 overflow-x-auto">
        {TABS.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={i === k} onClick={() => setI(k)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${i === k ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="rounded-xl bg-white dark:bg-gray-100 p-4 text-gray-900" aria-hidden>
          <div className="h-2.5 w-1/3 rounded bg-coffee-200 mb-3" />
          <div className="h-4 w-3/4 rounded bg-gray-300 mb-3" />
          <div className="space-y-1.5 mb-4"><div className="h-2 rounded bg-gray-200" /><div className="h-2 w-5/6 rounded bg-gray-200" /></div>
          <div key={t.id} className="rounded-lg border-2 border-coffee-500 bg-coffee-50 p-3 mb-4 animate-card-rise">
            <span className="text-[9px] font-bold uppercase tracking-widest text-coffee-700 bg-coffee-100 rounded px-1.5 py-0.5">Sponsored</span>
            <div className="h-2.5 w-2/3 rounded bg-coffee-400/70 mt-2 mb-2" />
            <div className="space-y-1.5">
              {Array.from({ length: t.lines + 1 }).map((_, n) => <div key={n} className={`h-2 rounded bg-coffee-200 ${n % 3 === 2 ? "w-4/6" : n % 3 === 1 ? "w-5/6" : ""}`} />)}
            </div>
          </div>
          <div className="space-y-1.5"><div className="h-2 rounded bg-gray-200" /><div className="h-2 w-4/5 rounded bg-gray-200" /></div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-3xl font-bold text-coffee-300">{t.price}</div>
          <div className="text-sm text-gray-400 mb-4">{t.words} · ready in {t.time}</div>
          <ul className="space-y-2">
            {t.points.map((p) => <li key={p} className="flex gap-2 text-sm text-gray-200"><Check size={16} className="text-green-400 mt-0.5 shrink-0" />{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
