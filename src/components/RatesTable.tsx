"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BENCHMARKS, PRICES, CONFIDENCE_LABEL, type Confidence } from "@/data/rates";

const CONF_STYLE: Record<Confidence, string> = {
  report: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  "rate-card": "bg-coffee-100 text-coffee-800 dark:bg-coffee-900/60 dark:text-coffee-100",
  "second-hand": "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100",
  estimate: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

function Badge({ c }: { c: Confidence }) {
  return (
    <span title={CONFIDENCE_LABEL[c].hint} className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${CONF_STYLE[c]}`}>
      {CONFIDENCE_LABEL[c].label}
    </span>
  );
}

const ALL = "All";

export default function RatesTable() {
  const [conf, setConf] = useState<string>(ALL);
  const [q, setQ] = useState("");

  const match = (text: string, c: Confidence) =>
    (conf === ALL || conf === c) && (!q || text.toLowerCase().includes(q.toLowerCase()));

  const bench = useMemo(
    () => BENCHMARKS.filter((r) => match(`${r.channel} ${r.category} ${r.note ?? ""}`, r.confidence)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conf, q]
  );
  const prices = useMemo(
    () => PRICES.filter((r) => match(`${r.group} ${r.item} ${r.basis}`, r.confidence)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conf, q]
  );

  const chips = [ALL, ...(Object.keys(CONFIDENCE_LABEL) as Confidence[])];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: dentist, Meta, Semrush…"
          aria-label="Search rates"
          className="w-full sm:w-72 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by confidence">
          {chips.map((c) => {
            const active = conf === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setConf(c)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-coffee-700 bg-coffee-700 text-white dark:border-coffee-400 dark:bg-coffee-400 dark:text-gray-900"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {c === ALL ? "All" : CONFIDENCE_LABEL[c as Confidence].label}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="section-title text-left mb-2">Advertising benchmarks</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">Medians by industry. CPC = cost per click, CTR = click-through rate, Conv = conversion rate, CPL = cost per lead.</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th className="p-3 font-semibold">Channel · industry</th>
              <th className="p-3 font-semibold">CPC</th>
              <th className="p-3 font-semibold">CTR</th>
              <th className="p-3 font-semibold">Conv</th>
              <th className="p-3 font-semibold">CPL</th>
              <th className="p-3 font-semibold">Confidence</th>
              <th className="p-3 font-semibold">Source · guide</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-100">
            {bench.map((r) => (
              <tr key={r.channel + r.category} className="border-t border-gray-100 align-top dark:border-gray-800">
                <td className="p-3">
                  <div className="font-medium">{r.category}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{r.channel}</div>
                  {r.note && <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{r.note}</div>}
                </td>
                <td className="p-3 whitespace-nowrap">{r.cpc ?? "–"}</td>
                <td className="p-3 whitespace-nowrap">{r.ctr ?? "–"}</td>
                <td className="p-3 whitespace-nowrap">{r.conv ?? "–"}</td>
                <td className="p-3 whitespace-nowrap font-semibold">{r.cpl ?? "–"}</td>
                <td className="p-3"><Badge c={r.confidence} /></td>
                <td className="p-3 text-xs">
                  <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="text-coffee-700 underline dark:text-coffee-300">{r.source.name}</a>
                  <div className="mt-1"><Link href={`/blog/${r.article}`} className="text-coffee-700 underline dark:text-coffee-300">Read the guide →</Link></div>
                </td>
              </tr>
            ))}
            {bench.length === 0 && <tr><td colSpan={7} className="p-4 text-gray-600 dark:text-gray-300">No benchmarks match.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="section-title text-left mt-14 mb-2">Tool and platform prices</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">List prices from the vendors' own pages. They change often; check the page before you buy.</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Basis</th>
              <th className="p-3 font-semibold">Confidence</th>
              <th className="p-3 font-semibold">Source · guide</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-100">
            {prices.map((r) => (
              <tr key={r.item} className="border-t border-gray-100 align-top dark:border-gray-800">
                <td className="p-3">
                  <div className="font-medium">{r.item}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{r.group}</div>
                </td>
                <td className="p-3 font-semibold">{r.price}</td>
                <td className="p-3 text-xs text-gray-700 dark:text-gray-300">{r.basis}</td>
                <td className="p-3"><Badge c={r.confidence} /></td>
                <td className="p-3 text-xs">
                  <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="text-coffee-700 underline dark:text-coffee-300">{r.source.name}</a>
                  <div className="mt-1"><Link href={`/blog/${r.article}`} className="text-coffee-700 underline dark:text-coffee-300">Read the guide →</Link></div>
                </td>
              </tr>
            ))}
            {prices.length === 0 && <tr><td colSpan={5} className="p-4 text-gray-600 dark:text-gray-300">No prices match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
