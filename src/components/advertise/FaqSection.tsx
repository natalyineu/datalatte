"use client";
import { useState } from "react";
import { ADVERTISE_FAQ, FAQ_CATS } from "./faq-data";

export default function FaqSection() {
  const [cat, setCat] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(ADVERTISE_FAQ[0].q);
  const list = cat === "All" ? ADVERTISE_FAQ : ADVERTISE_FAQ.filter((f) => f.cat === cat);
  const cats = ["All", ...FAQ_CATS];
  return (
    <div className="max-w-3xl mx-auto">
      <div role="tablist" aria-label="FAQ topics" className="flex flex-wrap justify-center gap-2 mb-8">
        {cats.map((c) => {
          const n = c === "All" ? ADVERTISE_FAQ.length : ADVERTISE_FAQ.filter((f) => f.cat === c).length;
          return (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${cat === c ? "bg-coffee-700 border-coffee-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-coffee-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"}`}>
              {c} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {list.map((f) => {
          const isOpen = open === f.q;
          return (
            <div key={f.q} className="card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : f.q)} aria-expanded={isOpen}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4">
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-coffee-600 dark:text-coffee-300 mb-0.5">{f.cat}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">{f.q}</span>
                </span>
                <span className={`mt-1 text-coffee-700 dark:text-coffee-300 text-xl leading-none transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden>+</span>
              </button>
              {isOpen && <p className="px-5 pb-5 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{f.a}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        Still have a question? Write to <a href="mailto:hi@datalatte.pro" className="underline text-coffee-700 dark:text-coffee-300">hi@datalatte.pro</a>.
      </p>
    </div>
  );
}
