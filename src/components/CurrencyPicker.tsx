"use client";

import { CURRENCIES, FX_DATE, type CurrencyCode } from "@/lib/currency";

export default function CurrencyPicker({ value, onChange }: { value: CurrencyCode; onChange: (c: CurrencyCode) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
      <label htmlFor="currency-picker" className="font-medium">Currency</label>
      <select
        id="currency-picker"
        value={value}
        onChange={e => onChange(e.target.value as CurrencyCode)}
        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
        ))}
      </select>
      {value !== "USD" && (
        <span className="basis-full text-right text-[11px]">
          Your amounts stay in {value}. Published benchmarks are US medians in dollars, converted at fixed reference rates ({FX_DATE}, not live).
        </span>
      )}
    </div>
  );
}
