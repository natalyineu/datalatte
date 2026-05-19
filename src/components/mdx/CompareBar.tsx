"use client";

interface CompareBarProps {
  title?: string;
  caption?: string;
  // Two-sided comparison: left vs right
  leftLabel: string;   // e.g. "Google Ads"
  rightLabel: string;  // e.g. "Facebook Ads"
  metrics: string;     // pipe-sep metric names: "Avg CPC|CTR|Conversion Rate|ROI"
  leftValues: string;  // pipe-sep numbers: "3.50|4.2|6.1|210"
  rightValues: string; // pipe-sep numbers: "1.20|1.8|3.4|140"
  unit?: string;       // "%" | "$" | ""
}

const LEFT_COLOR  = "#6B3F1F"; // coffee-800
const RIGHT_COLOR = "#C07A45"; // coffee-500

export default function CompareBar({
  title, caption, leftLabel, rightLabel, metrics, leftValues, rightValues, unit = "",
}: CompareBarProps) {
  const metricArr = metrics.split("|").map(s => s.trim()).filter(Boolean);
  const leftArr   = leftValues.split("|").map(s => parseFloat(s.trim()));
  const rightArr  = rightValues.split("|").map(s => parseFloat(s.trim()));

  if (!metricArr.length) return null;

  const fmt = (v: number) =>
    unit === "%" ? `${v}%` : unit === "$" ? `$${v}` : String(v);

  return (
    <div className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
        </div>
      )}

      {/* legend */}
      <div className="px-5 pt-3 flex gap-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: LEFT_COLOR }} />
          {leftLabel}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: RIGHT_COLOR }} />
          {rightLabel}
        </span>
      </div>

      <div className="px-5 py-4 space-y-5">
        {metricArr.map((metric, i) => {
          const lv = leftArr[i]  ?? 0;
          const rv = rightArr[i] ?? 0;
          const maxV = Math.max(lv, rv) * 1.1 || 1;
          const lPct = Math.round((lv / maxV) * 100);
          const rPct = Math.round((rv / maxV) * 100);
          const lWins = lv >= rv;

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{metric}</span>
              </div>
              {/* left bar */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 w-24 truncate text-right">{leftLabel}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${lPct}%`, background: LEFT_COLOR }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-14 tabular-nums"
                  style={{ color: lWins ? LEFT_COLOR : "#9CA3AF" }}
                >
                  {fmt(lv)}{lWins ? " ✓" : ""}
                </span>
              </div>
              {/* right bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24 truncate text-right">{rightLabel}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${rPct}%`, background: RIGHT_COLOR }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-14 tabular-nums"
                  style={{ color: !lWins ? RIGHT_COLOR : "#9CA3AF" }}
                >
                  {fmt(rv)}{!lWins ? " ✓" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {caption && <p className="px-5 pb-4 text-xs text-gray-400">{caption}</p>}
    </div>
  );
}
