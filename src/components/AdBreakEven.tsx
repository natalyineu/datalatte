"use client";

import { useState } from "react";
import Link from "next/link";
import { CPL_BY_NICHE, type CalcNiche } from "@/data/rates";

const NICHES: { value: CalcNiche; emoji: string; label: string; value$: number }[] = [
  { value: "coffee", emoji: "☕", label: "Coffee shop", value$: 120 },
  { value: "salon", emoji: "✂️", label: "Hair & beauty", value$: 255 },
  { value: "pet", emoji: "🐾", label: "Pet business", value$: 280 },
  { value: "fitness", emoji: "🏋️", label: "Fitness studio", value$: 600 },
  { value: "startup", emoji: "🚀", label: "Startup", value$: 400 },
  { value: "freelancer", emoji: "💼", label: "Freelancer", value$: 1500 },
  { value: "other", emoji: "🏪", label: "Other", value$: 300 },
];

const money = (n: number, d = 2) => `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
      {children}
      {hint && <span className="block text-xs font-normal text-gray-500 mt-1 dark:text-gray-400">{hint}</span>}
    </label>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-base font-semibold text-gray-900 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50";

export default function AdBreakEven() {
  const [niche, setNiche] = useState<CalcNiche>("coffee");
  const [value, setValue] = useState<number | null>(null);
  const [margin, setMargin] = useState(60);
  const [close, setClose] = useState(25);
  const [conv, setConv] = useState(8);
  const [target, setTarget] = useState(1);

  const v = value ?? NICHES.find(n => n.value === niche)!.value$;
  const profit = (v * margin) / 100;                 // profit per new customer
  const maxCpCust = profit / target;                 // most you can pay per customer
  const maxCpl = maxCpCust * (close / 100);          // most you can pay per lead
  const maxCpc = maxCpl * (conv / 100);              // most you can pay per click

  const b = CPL_BY_NICHE[niche];
  const rows = [
    { name: "Google Search", bench: b.google },
    { name: "Meta lead ads", bench: b.meta },
  ].map(r => ({ ...r, ok: r.bench.cpl <= maxCpl, ratio: maxCpl > 0 ? r.bench.cpl / maxCpl : Infinity }));

  const num = (setter: (n: number) => void, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setter(Math.min(max, Math.max(min, Number(e.target.value) || min)));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {NICHES.map(n => (
          <button
            key={n.value}
            type="button"
            aria-pressed={niche === n.value}
            onClick={() => { setNiche(n.value); setValue(null); }}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
              niche === n.value
                ? "border-coffee-600 bg-coffee-50 text-coffee-800 dark:bg-coffee-900 dark:border-coffee-400 dark:text-coffee-200"
                : "border-gray-200 text-gray-700 hover:border-coffee-300 hover:bg-coffee-50/50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-coffee-900/60"
            }`}
          >
            <span className="text-lg">{n.emoji}</span>{n.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Value of a new customer ($)" hint="Revenue from a typical new customer in the first year. Our default is an assumption: replace it.">
          <input type="number" min={1} inputMode="decimal" value={v} onChange={e => setValue(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>
        <Field label="Profit margin (%)" hint="What is left after the cost of serving them.">
          <input type="number" min={1} max={100} inputMode="numeric" value={margin} onChange={num(setMargin, 1, 100)} className={inputCls} />
        </Field>
        <Field label="Leads that become customers (%)" hint="Share of enquiries that book or buy.">
          <input type="number" min={1} max={100} inputMode="numeric" value={close} onChange={num(setClose, 1, 100)} className={inputCls} />
        </Field>
        <Field label="Clicks that become leads (%)" hint="Website conversion rate. Medians sit near 6 to 8% in LocaliQ's 2026 search data.">
          <input type="number" min={0.5} max={100} step="0.5" inputMode="decimal" value={conv} onChange={num(setConv, 0.5, 100)} className={inputCls} />
        </Field>
        <Field label="Return you want per $1 of ad spend" hint="1× = break even on first-year profit; 2× = you want to double it.">
          <select value={target} onChange={e => setTarget(Number(e.target.value))} className={inputCls}>
            <option value={1}>1× (break even)</option>
            <option value={1.5}>1.5×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>
        </Field>
      </div>

      <div className="bg-gradient-to-r from-coffee-700 to-coffee-500 rounded-2xl p-6 text-white mb-5">
        <p className="text-white/90 text-sm mb-3">The most you can pay and still hit your target</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><p className="text-2xl sm:text-3xl font-bold">{money(maxCpCust, 0)}</p><p className="text-white/90 text-xs mt-1">per customer</p></div>
          <div><p className="text-2xl sm:text-3xl font-bold">{money(maxCpl)}</p><p className="text-white/90 text-xs mt-1">per lead</p></div>
          <div><p className="text-2xl sm:text-3xl font-bold">{money(maxCpc)}</p><p className="text-white/90 text-xs mt-1">per click</p></div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 dark:bg-gray-800/60 dark:border-gray-700">
        <p className="text-xs font-semibold text-coffee-700 mb-1 dark:text-coffee-300">📈 Can the typical advertiser clear your bar?</p>
        <p className="text-xs text-gray-600 mb-3 dark:text-gray-300">Published median cost per lead against your ceiling of {money(maxCpl)} per lead.</p>
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.name}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{r.name}</span>
                <span className={`text-sm font-bold ${r.ok ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                  {money(r.bench.cpl)} per lead · {r.ok ? "within your ceiling" : `${r.ratio.toFixed(1)}× too high`}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 dark:text-gray-400">{r.bench.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed dark:text-gray-400">
          Medians across advertisers of every size; your own results will differ. If a channel is over your ceiling, raise customer value (memberships, rebooking), lift your close rate, or test it with a small budget before scaling.{" "}
          <Link href="/rates" className="underline text-coffee-700 dark:text-coffee-300">See all sources and rates</Link>
        </p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <p className="font-bold mb-1">Want these numbers checked against your real account?</p>
        <p className="text-gray-300 text-sm mb-4">I will review your campaigns and tell you which channel actually clears your ceiling. Free, no commitment.</p>
        <Link
          href={`/contact?niche=${niche}`}
          className="flex items-center justify-center w-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Book my free audit
        </Link>
      </div>
    </div>
  );
}
