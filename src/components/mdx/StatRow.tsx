interface StatRowProps {
  title?: string;
  values: string;   // pipe-separated: "$25–$45|92%|$500|3×"
  labels: string;   // pipe-separated: "Typical CPM|Completion rate|..."
  subs?: string;    // pipe-separated (empty = no sub): "per 1,000|vs 70%||vs TV"
  trends?: string;  // pipe-separated: "up|down|neutral|up" (empty = none)
}

const TREND = {
  up:      { icon: "↑", cls: "text-green-600" },
  down:    { icon: "↓", cls: "text-red-500"   },
  neutral: { icon: "→", cls: "text-gray-400"  },
} as const;

export default function StatRow({ title, values, labels, subs = "", trends = "" }: StatRowProps) {
  const valArr   = values.split("|").map(s => s.trim());
  const labelArr = labels.split("|").map(s => s.trim());
  const subArr   = subs.split("|").map(s => s.trim());
  const trendArr = trends.split("|").map(s => s.trim());

  if (!valArr.length) return null;

  const cols =
    valArr.length === 2 ? "grid-cols-2" :
    valArr.length === 3 ? "grid-cols-3" :
    "grid-cols-2 sm:grid-cols-4";

  return (
    <div className="my-8">
      {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{title}</p>}
      <div className={`grid gap-3 ${cols}`}>
        {valArr.map((val, i) => {
          const trend = trendArr[i] as keyof typeof TREND | "";
          const sub = subArr[i] || "";
          return (
            <div
              key={i}
              className="mdx-fade-up bg-coffee-50 border border-coffee-100 rounded-2xl p-4 text-center"
              style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-coffee-800 leading-none">{val}</span>
                {trend && TREND[trend] && (
                  <span className={`text-sm font-bold ${TREND[trend].cls}`}>{TREND[trend].icon}</span>
                )}
              </div>
              <p className="text-xs font-semibold text-coffee-700 mt-1.5 leading-tight">{labelArr[i] ?? ""}</p>
              {sub && <p className="text-[10px] text-coffee-500 mt-0.5 leading-tight">{sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
