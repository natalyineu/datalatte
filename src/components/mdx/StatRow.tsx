interface StatRowProps {
  title?: string;
  values: string;   // pipe-separated: "$25–$45|92%|$500|3×"
  labels: string;   // pipe-separated: "Typical CPM|Completion rate|..."
  subs?: string;    // pipe-separated (empty = no sub): "per 1,000|vs 70%||vs TV"
  trends?: string;  // pipe-separated: "up|down|neutral|up" (empty = none)
  source?: string;  // set only when the figures are verified; otherwise a generic estimate note is shown
}

const TREND = {
  up:      { icon: "↑", cls: "text-green-600" },
  down:    { icon: "↓", cls: "text-red-500"   },
  neutral: { icon: "→", cls: "text-gray-500 dark:text-gray-400"  },
} as const;

// A card is shown as an assumption when its label or sub-line says so.
const ASSUMPTION = /\b(assumption|assumed|example|illustrat\w*|hypothetical|estimate[sd]?)\b|zał[oó]żenie|przykład/i;

export default function StatRow({ title, values, labels, subs = "", trends = "", source }: StatRowProps) {
  const valArr   = values.split("|").map(s => s.trim());
  const labelArr = labels.split("|").map(s => s.trim());
  const subArr   = subs.split("|").map(s => s.trim());
  const trendArr = trends.split("|").map(s => s.trim());

  if (!valArr.length) return null;

  const cols =
    valArr.length === 2 ? "grid-cols-2" :
    valArr.length === 3 ? "grid-cols-3" :
    "grid-cols-2 sm:grid-cols-4";

  const isAssumption = (i: number) => ASSUMPTION.test(`${labelArr[i] ?? ""} ${subArr[i] ?? ""}`);
  // Lead card: the first one, unless it is an assumption (then the first real fact).
  const lead = valArr.findIndex((_, i) => !isAssumption(i));

  return (
    <div className="my-8">
      {title && <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">{title}</p>}
      <div className={`grid gap-3 ${cols}`}>
        {valArr.map((val, i) => {
          const trend = trendArr[i] as keyof typeof TREND | "";
          const sub = subArr[i] || "";
          const assumed = isAssumption(i);
          const featured = i === lead;
          const base = featured
            ? "bg-coffee-700 border-coffee-800 text-white dark:bg-coffee-600 dark:border-coffee-500"
            : assumed
              ? "bg-white dark:bg-gray-900 border-dashed border-coffee-300 dark:border-gray-600"
              : "bg-coffee-50 dark:bg-gray-800 border-coffee-100 dark:border-gray-700";
          return (
            <div
              key={i}
              className={`mdx-fade-up relative flex flex-col items-center justify-start border rounded-2xl px-3 pb-4 pt-5 text-center ${base}`}
              style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
            >
              {assumed && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-coffee-300 bg-white px-2 py-px text-[10px] font-semibold uppercase tracking-wide text-coffee-700 dark:border-gray-600 dark:bg-gray-900 dark:text-coffee-300">
                  Assumption
                </span>
              )}
              <div className="flex items-center justify-center gap-1">
                <span className={`font-extrabold leading-none tabular-nums ${featured ? "text-4xl text-white" : "text-3xl text-coffee-800 dark:text-coffee-200"}`}>{val}</span>
                {trend && TREND[trend] && (
                  <span className={`text-sm font-bold ${featured ? "text-white" : TREND[trend].cls}`}>{TREND[trend].icon}</span>
                )}
              </div>
              <p className={`mt-2 text-sm font-semibold leading-snug ${featured ? "text-white" : "text-coffee-800 dark:text-coffee-200"}`}>{labelArr[i] ?? ""}</p>
              {sub && <p className={`mt-1 text-xs leading-snug ${featured ? "text-coffee-100" : "text-gray-600 dark:text-gray-400"}`}>{sub}</p>}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-right">{source ? `Source: ${source}` : "See Sources at the end of the article. Cards marked Assumption are examples, not results."}</p>
    </div>
  );
}
