import { Lightbulb } from "lucide-react";

interface BarChartProps {
  title?: string;
  labels: string;       // pipe-separated: "Label A|Label B|Label C"
  values: string;       // pipe-separated numbers: "37|30|25"
  unit?: string;
  maxValue?: string;
  caption?: string;
  highlights?: string;  // pipe-separated label names to highlight: "Label A"
  subs?: string;        // pipe-separated subs (empty string = no sub): "most common||lowest"
}

export default function BarChart({
  title, labels, values, unit = "", maxValue, caption, highlights = "", subs = ""
}: BarChartProps) {
  const labelArr = labels.split("|").map(s => s.trim()).filter(Boolean);
  const valueArr = values.split("|").map(s => parseFloat(s.trim()));
  const highlightSet = new Set(highlights.split("|").map(s => s.trim()).filter(Boolean));
  const subArr = subs.split("|").map(s => s.trim());

  if (!labelArr.length) return null;

  const maxVal = maxValue ? parseFloat(maxValue) : Math.max(...valueArr) * 1.1;

  return (
    <div className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-2">
          <Lightbulb size={14} className="text-coffee-500 shrink-0" />
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
        </div>
      )}
      <div className="px-5 py-4 space-y-3.5">
        {labelArr.map((label, i) => {
          const val = valueArr[i] ?? 0;
          const pct = Math.round((val / maxVal) * 100);
          const isHighlight = highlightSet.has(label);
          const sub = subArr[i] || "";
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-sm font-medium truncate ${isHighlight ? "text-coffee-800" : "text-gray-700"}`}>
                    {label}
                  </span>
                  {sub && <span className="text-xs text-gray-400 shrink-0">{sub}</span>}
                  {isHighlight && (
                    <span className="shrink-0 text-[10px] bg-coffee-100 text-coffee-700 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      Best
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold tabular-nums shrink-0 ml-3 ${isHighlight ? "text-coffee-700" : "text-gray-500"}`}>
                  {unit === "%" ? `${val}%` : `${unit}${val}`}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full mdx-bar-grow ${isHighlight
                    ? "bg-gradient-to-r from-coffee-500 to-coffee-700"
                    : "bg-gradient-to-r from-gray-300 to-gray-400"
                  }`}
                  style={{
                    "--bar-target": `${pct}%`,
                    animationDelay: `${i * 80}ms`,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>
      {caption && <p className="px-5 pb-4 text-xs text-gray-400">{caption}</p>}
    </div>
  );
}
