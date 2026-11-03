import type { ReactNode } from "react";
import ChartRoot from "./ChartRoot";

/* Chart set for articles. Pure SVG/CSS, no dependencies, coffee palette, dark-mode aware.
   Data comes in as pipe-separated strings (matrix rows separated by ";"), like the other mdx components. */

const COFFEE = ["#5b3418", "#7d4a24", "#a2622f", "#c7844d", "#ddab7c", "#efd3b3"];
const num = (s: string) => parseFloat(s.trim());
const list = (s: string) => s.split("|").map((x) => x.trim()).filter((x) => x !== "");
const nums = (s: string) => s.split("|").map(num);
const matrix = (s: string) => s.split(";").map((r) => r.split(",").map(num));
const fmt = (v: number, unit = "") => (unit === "%" ? `${v}%` : unit === "$" ? `$${v}` : `${v}${unit}`);
const fmtNum = (v: number) => (Number.isInteger(v) ? v.toLocaleString("en-US") : String(v));

function Frame({ title, caption, children }: { title?: string; caption?: string; children: ReactNode }) {
  return (
    <ChartRoot className="my-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-700">
      {title && <figcaption className="px-5 pt-4 pb-3 border-b border-gray-100 font-semibold text-gray-800 text-sm dark:text-gray-100 dark:border-gray-700">{title}</figcaption>}
      <div className="px-4 sm:px-5 py-4">{children}</div>
      {caption && <p className="px-5 pb-4 -mt-1 text-xs text-gray-500 dark:text-gray-400">{caption}</p>}
    </ChartRoot>
  );
}

/* 1. Vertical columns (histograms) */
export function ColumnChart({ title, labels, values, unit = "", highlights = "", caption }: { title?: string; labels: string; values: string; unit?: string; highlights?: string; caption?: string }) {
  const L = list(labels), V = nums(values), H = new Set(list(highlights));
  const max = Math.max(...V) * 1.15, W = 600, Ht = 250, pad = { l: 8, r: 8, t: 22, b: 44 };
  const bw = (W - pad.l - pad.r) / L.length;
  return (
    <Frame title={title} caption={caption}>
      <svg viewBox={`0 0 ${W} ${Ht}`} className="w-full h-auto" role="img" aria-label={title || "Column chart"}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + (1 - g) * (Ht - pad.t - pad.b)} y2={pad.t + (1 - g) * (Ht - pad.t - pad.b)} className="stroke-gray-200 dark:stroke-gray-700" strokeDasharray="3 4" />
        ))}
        {L.map((l, i) => {
          const h = (V[i] / max) * (Ht - pad.t - pad.b);
          const x = pad.l + i * bw + bw * 0.14, w = bw * 0.72, y = Ht - pad.b - h;
          const hot = H.has(l);
          return (
            <g key={l}>
              <rect x={x} y={y} width={w} height={h} rx={6} fill={hot ? "#6B3F1F" : "#C07A45"} opacity={hot ? 1 : 0.85} className="mdx-col-grow" style={{ animationDelay: `${i * 70}ms` }} />
              <text x={x + w / 2} y={y - 6} textAnchor="middle" className="fill-gray-800 dark:fill-gray-100" fontSize="13" fontWeight="700">{fmt(V[i], unit)}</text>
              <text x={x + w / 2} y={Ht - pad.b + 18} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="12">{l}</text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* 2. Area/line chart over categories, with every point labelled */
export function AreaChart({ title, labels, values, unit = "", xTitle, yTitle, caption }: { title?: string; labels: string; values: string; unit?: string; xTitle?: string; yTitle?: string; caption?: string }) {
  const L = list(labels), V = nums(values);
  const W = 600, H = 270, p = { l: 48, r: 18, t: 22, b: 52 };
  const max = Math.ceil(Math.max(...V) / 20) * 20 || 100;
  const x = (i: number) => p.l + (i * (W - p.l - p.r)) / (L.length - 1), y = (v: number) => p.t + (1 - v / max) * (H - p.t - p.b);
  const line = V.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(L.length - 1)} ${H - p.b} L${x(0)} ${H - p.b} Z`;
  return (
    <Frame title={title} caption={caption}>
      <div className="overflow-x-auto"><div className="min-w-[520px]"><svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title || "Area chart"}>
        <defs><linearGradient id="area-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C07A45" stopOpacity="0.5" /><stop offset="100%" stopColor="#C07A45" stopOpacity="0.03" /></linearGradient></defs>
        {[0, max / 4, max / 2, (3 * max) / 4, max].map((t) => (
          <g key={t}><line x1={p.l} x2={W - p.r} y1={y(t)} y2={y(t)} className="stroke-gray-200 dark:stroke-gray-700" strokeDasharray="3 4" />
            <text x={p.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{fmt(Math.round(t), unit)}</text></g>
        ))}
        <path d={area} fill="url(#area-g)" />
        <path d={line} fill="none" stroke="#6B3F1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mdx-draw" />
        {V.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="4.5" fill="#fff" stroke="#6B3F1F" strokeWidth="2.5" />
            <text x={x(i)} y={y(v) - 11} textAnchor="middle" fontSize="11.5" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">{fmt(v, unit)}</text>
            <text x={x(i)} y={H - p.b + 18} textAnchor="middle" fontSize="11.5" className="fill-gray-600 dark:fill-gray-300">{L[i]}</text>
          </g>
        ))}
        {xTitle && <text x={(p.l + W - p.r) / 2} y={H - 6} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{xTitle}</text>}
        {yTitle && <text x={12} y={p.t - 8} fontSize="11" className="fill-gray-500 dark:fill-gray-400">{yTitle}</text>}
      </svg></div></div>
    </Frame>
  );
}

/* 3. 100% stacked horizontal bars, one or more rows */
export function StackedBar({ title, rows, segments, matrix: m, caption }: { title?: string; rows: string; segments: string; matrix: string; caption?: string }) {
  const R = list(rows), S = list(segments), M = matrix(m);
  return (
    <Frame title={title} caption={caption}>
      <div className="space-y-5">
        {R.map((r, ri) => {
          const row = M[ri] || [], tot = row.reduce((a, b) => a + b, 0) || 1;
          return (
            <div key={r}>
              <div className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">{r}</div>
              <div className="flex h-11 w-full overflow-hidden rounded-xl">
                {row.map((v, i) => (
                  <div key={i} title={`${S[i]}: ${v}`} className="mdx-bar-grow2 flex items-center justify-center text-xs sm:text-sm font-bold" style={{ width: `${(v / tot) * 100}%`, background: COFFEE[i % COFFEE.length], color: i < 3 ? "#fff" : "#3b2412", animationDelay: `${i * 90}ms` }}>
                    {(v / tot) * 100 >= 7 ? `${Math.round((v / tot) * 100)}%` : ""}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600 dark:text-gray-300">
        {S.map((s, i) => (<li key={s} className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded" style={{ background: COFFEE[i % COFFEE.length] }} />{s}{M[0] ? <span className="text-gray-400"> ({fmtNum(M[0][i])})</span> : null}</li>))}
      </ul>
    </Frame>
  );
}

/* 4. Heatmap table with a coffee colour scale per column */
export function Heatmap({ title, rows, cols, matrix: m, units = "", caption }: { title?: string; rows: string; cols: string; matrix: string; units?: string; caption?: string }) {
  const R = list(rows), C = list(cols), M = matrix(m), U = units.split("|");
  const mins = C.map((_, j) => Math.min(...M.map((r) => r[j]))), maxs = C.map((_, j) => Math.max(...M.map((r) => r[j])));
  const shade = (j: number, v: number) => (maxs[j] === mins[j] ? 0.5 : (v - mins[j]) / (maxs[j] - mins[j]));
  return (
    <Frame title={title} caption={caption}>
      <div className="overflow-x-auto">
        <div className="grid gap-1 min-w-[460px]" style={{ gridTemplateColumns: `72px repeat(${C.length}, minmax(0,1fr))` }}>
          <div />
          {C.map((c) => (<div key={c} className="px-1 pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{c}</div>))}
          {R.map((r, i) => (
            <div key={r} className="contents">
              <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">{r}</div>
              {M[i].map((v, j) => {
                const t = shade(j, v);
                return (<div key={j} className="rounded-md py-2 text-center text-sm font-bold tabular-nums" style={{ background: `rgba(146,87,46,${0.1 + t * 0.85})`, color: t > 0.5 ? "#fff" : "#3b2412" }}>{fmtNum(v)}{U[j] || ""}</div>);
              })}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 5. Radar chart, values 0-100 */
export function RadarChart({ title, labels, values, caption }: { title?: string; labels: string; values: string; caption?: string }) {
  const L = list(labels), V = nums(values), n = L.length, cx = 245, cy = 175, R = 112;
  const pt = (i: number, r: number) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const poly = (f: (i: number) => number) => V.map((_, i) => pt(i, f(i)).map((c) => c.toFixed(1)).join(",")).join(" ");
  return (
    <Frame title={title} caption={caption}>
      <svg viewBox="0 0 490 350" className="mx-auto w-full max-w-[520px] h-auto" role="img" aria-label={title || "Radar chart"}>
        {[25, 50, 75, 100].map((g) => (<polygon key={g} points={poly(() => (R * g) / 100)} fill="none" className="stroke-gray-200 dark:stroke-gray-700" />))}
        {L.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-gray-200 dark:stroke-gray-700" />; })}
        <polygon points={poly((i) => (R * V[i]) / 100)} fill="#C07A45" fillOpacity="0.35" stroke="#6B3F1F" strokeWidth="2.5" strokeLinejoin="round" className="mdx-fade" />
        {V.map((v, i) => { const [x, y] = pt(i, (R * v) / 100); return <circle key={i} cx={x} cy={y} r="4" fill="#6B3F1F" />; })}
        {L.map((l, i) => {
          const [x, y] = pt(i, R + 22), anchor = x < cx - 8 ? "end" : x > cx + 8 ? "start" : "middle";
          return (<text key={l} x={x} y={y} textAnchor={anchor} fontSize="11.5" className="fill-gray-700 dark:fill-gray-200"><tspan fontWeight="700">{l}</tspan><tspan x={x} dy="13" className="fill-gray-500 dark:fill-gray-400">{V[i]}%</tspan></text>);
        })}
      </svg>
    </Frame>
  );
}

/* 6. Score breakdown: stacked horizontal bars per row, parts add up to the score */
export function ScoreBreakdown({ title, rows, parts, matrix: m, caption }: { title?: string; rows: string; parts: string; matrix: string; caption?: string }) {
  const R = list(rows), P = list(parts), M = matrix(m);
  const pal = ["#4A2912", "#6B3F1F", "#92572E", "#C07A45", "#D9A679", "#9CA3AF", "#D1D5DB"];
  return (
    <Frame title={title} caption={caption}>
      <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-300">
        {P.map((p, i) => (<li key={p} className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded" style={{ background: pal[i % pal.length] }} />{p}</li>))}
      </ul>
      <div className="space-y-2.5">
        {R.map((r, ri) => {
          const total = M[ri].reduce((a, b) => a + b, 0);
          return (
            <div key={r} className="grid grid-cols-[minmax(0,9.5rem)_1fr_2.2rem] items-center gap-2 sm:gap-3 sm:grid-cols-[minmax(0,13rem)_1fr_2.4rem]">
              <div className="truncate text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200" title={r}>{ri + 1}. {r}</div>
              <div className="flex h-5 sm:h-6 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                {M[ri].map((v, i) => (<div key={i} title={`${P[i]}: ${v}`} className="mdx-bar-grow2" style={{ width: `${v}%`, background: pal[i % pal.length], animationDelay: `${ri * 60 + i * 30}ms` }} />))}
              </div>
              <div className="text-right text-sm font-bold tabular-nums text-coffee-800 dark:text-coffee-300">{total}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* 7. Projection lines against target lines */
export function ProjectionChart({ title, months, start, rates, rateLabels, targets, targetLabels, caption }: { title?: string; months: string; start: string; rates: string; rateLabels: string; targets: string; targetLabels: string; caption?: string }) {
  const M = num(months), S = num(start), Rt = nums(rates), RL = list(rateLabels), T = nums(targets), TL = list(targetLabels);
  const W = 600, H = 290, p = { l: 50, r: 16, t: 20, b: 44 };
  const max = Math.ceil(Math.max(...T, S + Math.max(...Rt) * M) / 100) * 100;
  const x = (m: number) => p.l + (m / M) * (W - p.l - p.r), y = (v: number) => p.t + (1 - Math.min(v, max) / max) * (H - p.t - p.b);
  const cols = ["#6B3F1F", "#C07A45"];
  return (
    <Frame title={title} caption={caption}>
      <div className="overflow-x-auto"><div className="min-w-[520px]"><svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title || "Projection chart"}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (<g key={g}><line x1={p.l} x2={W - p.r} y1={y(max * g)} y2={y(max * g)} className="stroke-gray-200 dark:stroke-gray-700" strokeDasharray="3 4" /><text x={p.l - 8} y={y(max * g) + 4} textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{Math.round(max * g)}</text></g>))}
        {[0, 6, 12, 18, 24, 30, 36].filter((m) => m <= M).map((m) => (<text key={m} x={x(m)} y={H - p.b + 18} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{m}</text>))}
        <text x={(p.l + W - p.r) / 2} y={H - 6} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">Months from now</text>
        {T.map((t, i) => (<g key={i}><line x1={p.l} x2={W - p.r} y1={y(t)} y2={y(t)} stroke="#92572E" strokeDasharray="7 5" strokeWidth="1.8" /><text x={p.l + 6} y={y(t) - 6} textAnchor="start" fontSize="11.5" fontWeight="700" className="fill-coffee-800 dark:fill-coffee-300">{TL[i]}</text></g>))}
        {Rt.map((r, i) => {
          const e = Math.min(M, (max - S) / r), end = S + r * e, cross = T.map((t) => (t - S) / r).filter((c) => c > 0 && c <= M);
          return (
            <g key={i}>
              <line x1={x(0)} y1={y(S)} x2={x(e)} y2={y(end)} stroke={cols[i % 2]} strokeWidth="3.5" strokeLinecap="round" className="mdx-fade" />
              {cross.map((c, k) => (<g key={k}><circle cx={x(c)} cy={y(S + r * c)} r="5.5" fill="#fff" stroke={cols[i % 2]} strokeWidth="3" /><text x={x(c)} y={y(S + r * c) + 20} textAnchor="middle" fontSize="11.5" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">month {Math.round(c)}</text></g>))}
              <text x={x(Math.min(M, e)) - 4} y={y(end) - 10} textAnchor="end" fontSize="11.5" fontWeight="700" fill={cols[i % 2]}>{RL[i]}</text>
            </g>
          );
        })}
      </svg></div></div>
    </Frame>
  );
}

/* 8. Bubble chart: x, y and bubble size */
export function BubbleChart({ title, labels, x, y, size, xTitle, yTitle, sizeTitle, caption }: { title?: string; labels: string; x: string; y: string; size: string; xTitle?: string; yTitle?: string; sizeTitle?: string; caption?: string }) {
  const L = list(labels), X = nums(x), Y = nums(y), Sz = nums(size);
  const W = 600, H = 330, p = { l: 52, r: 22, t: 20, b: 50 };
  const xmin = Math.floor(Math.min(...X) / 5) * 5 - 2, xmax = Math.ceil(Math.max(...X) / 5) * 5 + 2, ymax = Math.ceil(Math.max(...Y) / 100) * 100 + 40;
  const px = (v: number) => p.l + ((v - xmin) / (xmax - xmin)) * (W - p.l - p.r), py = (v: number) => p.t + (1 - v / ymax) * (H - p.t - p.b);
  const smin = Math.min(...Sz), smax = Math.max(...Sz), rad = (s: number) => 10 + ((s - smin) / (smax - smin || 1)) * 18;
  return (
    <Frame title={title} caption={caption}>
      <div className="overflow-x-auto"><div className="min-w-[520px]"><svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title || "Bubble chart"}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (<g key={g}><line x1={p.l} x2={W - p.r} y1={py(ymax * g)} y2={py(ymax * g)} className="stroke-gray-200 dark:stroke-gray-700" strokeDasharray="3 4" /><text x={p.l - 8} y={py(ymax * g) + 4} textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{Math.round(ymax * g)}</text></g>))}
        {Array.from({ length: Math.floor((xmax - xmin) / 5) + 1 }, (_, k) => xmin + k * 5).filter((v) => v >= xmin && v <= xmax).map((v) => (<text key={v} x={px(v)} y={H - p.b + 18} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-gray-400">{v}</text>))}
        {L.map((l, i) => (
          <g key={l} className="mdx-fade" style={{ animationDelay: `${i * 70}ms` }}>
            <circle cx={px(X[i])} cy={py(Y[i])} r={rad(Sz[i])} fill="#C07A45" fillOpacity="0.55" stroke="#6B3F1F" strokeWidth="2" />
            <text x={px(X[i])} y={py(Y[i]) + 4} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-900 dark:fill-white">{l}</text>
          </g>
        ))}
        {xTitle && <text x={(p.l + W - p.r) / 2} y={H - 6} textAnchor="middle" fontSize="11.5" className="fill-gray-600 dark:fill-gray-300">{xTitle}{sizeTitle ? `  ·  bubble size: ${sizeTitle}` : ""}</text>}
        {yTitle && <text x={12} y={p.t - 6} fontSize="11.5" className="fill-gray-600 dark:fill-gray-300">{yTitle}</text>}
      </svg></div></div>
    </Frame>
  );
}


/* 9. Big number pull-quote */
export function BigStat({ value, label, note, source }: { value: string; label: string; note?: string; source?: string }) {
  return (
    <ChartRoot className="my-10 rounded-2xl border-l-8 border-coffee-600 bg-gradient-to-r from-coffee-50 to-white px-6 py-6 sm:px-8 sm:py-7 shadow-sm dark:from-coffee-900/30 dark:to-gray-900 dark:border-coffee-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
        <div className="mdx-pop shrink-0 text-6xl sm:text-7xl font-extrabold leading-none tracking-tight text-coffee-700 dark:text-coffee-300 tabular-nums">{value}</div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-semibold leading-snug text-gray-900 dark:text-gray-50 before:content-['\201C'] before:mr-1 before:text-coffee-400 after:content-['\201D'] after:ml-0.5 after:text-coffee-400">{label}</p>
          {note && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{note}</p>}
          {source && <p className="mt-1 text-xs uppercase tracking-wide text-coffee-700/80 dark:text-coffee-300/80">{source}</p>}
        </div>
      </div>
    </ChartRoot>
  );
}
