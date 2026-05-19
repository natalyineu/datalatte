"use client";

interface DonutChartProps {
  title?: string;
  labels: string;   // pipe-separated: "Google|Facebook|Yelp|Other"
  values: string;   // pipe-separated numbers: "45|25|20|10"
  unit?: string;    // "%" | "$" | ""
  caption?: string;
  centerLabel?: string;  // text in the centre of the donut
}

const PALETTE = [
  "#6B3F1F", // coffee-800
  "#92572E", // coffee-700
  "#C07A45", // coffee-500
  "#D9A679", // coffee-300
  "#EDD9C5", // coffee-100
  "#4A2912", // darker
  "#B08060", // mid
];

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, endDeg);
  const end   = polarToXY(cx, cy, r, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export default function DonutChart({
  title, labels, values, unit = "%", caption, centerLabel,
}: DonutChartProps) {
  const labelArr = labels.split("|").map(s => s.trim()).filter(Boolean);
  const rawVals  = values.split("|").map(s => parseFloat(s.trim()));

  if (!labelArr.length) return null;

  const total    = rawVals.reduce((a, b) => a + b, 0) || 1;
  const percents = rawVals.map(v => (v / total) * 100);

  const cx = 80, cy = 80, r = 60, inner = 36;
  let cursor = 0;

  const slices = percents.map((pct, i) => {
    const startDeg = (cursor / 100) * 360;
    cursor += pct;
    const endDeg = (cursor / 100) * 360;
    return { startDeg, endDeg, pct, color: PALETTE[i % PALETTE.length], label: labelArr[i], raw: rawVals[i] };
  });

  const fmt = (v: number) =>
    unit === "%" ? `${v}%` : unit ? `${unit}${v}` : String(v);

  return (
    <div className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
        </div>
      )}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-center gap-6">
        {/* SVG donut */}
        <div className="shrink-0">
          <svg viewBox="0 0 160 160" width="160" height="160">
            {slices.map((s, i) => {
              const gap = 1.5;
              const path = describeArc(cx, cy, r, s.startDeg + gap / 2, s.endDeg - gap / 2);
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={r - inner}
                  strokeLinecap="round"
                />
              );
            })}
            {/* centre */}
            <circle cx={cx} cy={cy} r={inner} fill="white" />
            {centerLabel ? (
              <>
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#3D1F09">{centerLabel}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#9B7B63">total</text>
              </>
            ) : (
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10" fill="#9B7B63">breakdown</text>
            )}
          </svg>
        </div>

        {/* legend */}
        <div className="flex flex-col gap-2.5 w-full">
          {slices.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-sm text-gray-700 flex-1 truncate">{s.label}</span>
              <span className="text-sm font-bold text-gray-800 tabular-nums">{fmt(s.raw)}</span>
              <span className="text-xs text-gray-400 w-10 text-right tabular-nums">{Math.round(s.pct)}%</span>
            </div>
          ))}
        </div>
      </div>
      {caption && <p className="px-5 pb-4 text-xs text-gray-400">{caption}</p>}
    </div>
  );
}
