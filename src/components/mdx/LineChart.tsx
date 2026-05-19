"use client";

interface LineChartProps {
  title?: string;
  labels: string;   // pipe-separated x-axis: "Jan|Feb|Mar|Apr|May|Jun"
  values: string;   // pipe-separated y-axis: "12|18|15|24|30|28"
  unit?: string;    // prefix/suffix hint: "%" | "$" | "k"
  caption?: string;
  color?: string;   // "coffee" (default) | "green" | "blue"
  area?: string;    // "true" = fill under line
}

export default function LineChart({
  title, labels, values, unit = "", caption, area = "true",
}: LineChartProps) {
  const labelArr = labels.split("|").map(s => s.trim()).filter(Boolean);
  const valueArr = values.split("|").map(s => parseFloat(s.trim()));

  if (!labelArr.length || valueArr.length < 2) return null;

  const W = 320, H = 120, padL = 36, padR = 12, padT = 12, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minV = Math.min(...valueArr);
  const maxV = Math.max(...valueArr);
  const range = maxV - minV || 1;

  const toX = (i: number) => padL + (i / (valueArr.length - 1)) * chartW;
  const toY = (v: number) => padT + chartH - ((v - minV) / range) * chartH;

  const pts = valueArr.map((v, i) => ({ x: toX(i), y: toY(v), v }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = [
    `M ${pts[0].x} ${padT + chartH}`,
    ...pts.map(p => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${padT + chartH}`,
    "Z",
  ].join(" ");

  const fmt = (v: number) => {
    if (unit === "%") return `${v}%`;
    if (unit === "$") return `$${v}`;
    if (unit === "k") return `${v}k`;
    return String(v);
  };

  // Y-axis ticks (3)
  const yTicks = [minV, minV + range / 2, maxV].map(v => ({
    v,
    y: toY(v),
    label: fmt(Math.round(v)),
  }));

  return (
    <div className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
        </div>
      )}
      <div className="px-4 py-4">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#92572E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#92572E" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* grid lines */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padL} y1={t.y} x2={W - padR} y2={t.y}
                stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 3"
              />
              <text x={padL - 4} y={t.y + 4} textAnchor="end" fontSize="8" fill="#9CA3AF">
                {t.label}
              </text>
            </g>
          ))}

          {/* area fill */}
          {area === "true" && (
            <path d={areaPath} fill="url(#areaGrad)" />
          )}

          {/* line */}
          <path d={linePath} fill="none" stroke="#92572E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* dots */}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#92572E" stroke="white" strokeWidth="1.5" />
          ))}

          {/* x-axis labels — show max 8 to avoid overlap */}
          {labelArr.map((lbl, i) => {
            const step = Math.ceil(labelArr.length / 8);
            if (i % step !== 0 && i !== labelArr.length - 1) return null;
            return (
              <text
                key={i}
                x={toX(i)}
                y={H - 4}
                textAnchor="middle"
                fontSize="8"
                fill="#9CA3AF"
              >
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>
      {caption && <p className="px-5 pb-4 text-xs text-gray-400">{caption}</p>}
    </div>
  );
}
