interface FunnelProps {
  title?: string;
  caption?: string;
  stages: string;      // pipe-separated: "Reach|Engage|Click|Intent|Convert"
  stepLabels: string;  // pipe-separated: "Unique viewers|Ad completions|..."
  values?: string;     // pipe-separated (optional): "35,000|32,200|~320|~80|~10"
}

const COLORS = [
  "bg-coffee-800 text-white",
  "bg-coffee-700 text-white",
  "bg-coffee-500 text-white",
  "bg-coffee-300 text-coffee-900",
  "bg-coffee-100 text-coffee-800",
];

export default function Funnel({ title, caption, stages, stepLabels, values = "" }: FunnelProps) {
  const stageArr = stages.split("|").map(s => s.trim()).filter(Boolean);
  const labelArr = stepLabels.split("|").map(s => s.trim());
  const valueArr = values.split("|").map(s => s.trim());

  if (!stageArr.length) return null;
  const total = stageArr.length;

  return (
    <div className="my-8">
      {title && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center">{title}</p>
      )}
      <div className="flex flex-col items-center gap-0">
        {stageArr.map((stage, i) => {
          const widthPct = 100 - (i / total) * 42;
          const colorCls = COLORS[i % COLORS.length];
          const val = valueArr[i] || "";
          return (
            <div
              key={i}
              className="w-full flex flex-col items-center mdx-fade-up"
              style={{ animationDelay: `${i * 90}ms` } as React.CSSProperties}
            >
              <div
                className={`${colorCls} rounded-xl flex items-center justify-between px-4 py-3`}
                style={{ width: `${widthPct}%` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 shrink-0">{stage}</span>
                  <span className="font-semibold text-sm truncate">{labelArr[i] ?? ""}</span>
                </div>
                {val && (
                  <span className="font-bold text-sm shrink-0 ml-3">{val}</span>
                )}
              </div>
              {i < stageArr.length - 1 && <div className="w-0.5 h-3 bg-gray-200" />}
            </div>
          );
        })}
      </div>
      {caption && <p className="text-xs text-gray-400 text-center mt-3">{caption}</p>}
    </div>
  );
}
