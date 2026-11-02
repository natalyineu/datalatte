"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Example figures for each niche (weekly sales in $K, last 12 weeks). The last four weeks add up to the monthly Sales tile.
const NICHES = [
  {
    id: "coffee", emoji: "☕", label: "Coffee shop", title: "Corner Café",
    weekly: [1.4, 1.5, 1.5, 1.7, 1.8, 1.8, 2.0, 2.1, 2.2, 2.4, 2.5, 2.7],
    stats: [
      { label: "Impressions", value: "18.2K", change: "+34%", hint: "times your listing and ads were shown" },
      { label: "Visits", value: "1,240", change: "+21%", hint: "people who tapped through or asked for directions" },
      { label: "Sales", value: "$9.8K", change: "+28%", hint: "revenue from marketing-driven orders" },
    ],
    channels: [["Google Maps", 46], ["Instagram", 24], ["Google Ads", 18], ["Email", 12]],
    badge: "☕ +38% new customers this month",
  },
  {
    id: "salon", emoji: "💇", label: "Hair salon", title: "Studio Salon",
    weekly: [1.0, 1.1, 1.1, 1.2, 1.3, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9, 2.0],
    stats: [
      { label: "Impressions", value: "12.4K", change: "+29%", hint: "times your listing and ads were shown" },
      { label: "Visits", value: "847", change: "+21%", hint: "profile visits, calls and booking-page views" },
      { label: "Sales", value: "$7.2K", change: "+31%", hint: "revenue from marketing-driven bookings" },
    ],
    channels: [["Instagram", 38], ["Google Maps", 30], ["Meta Ads", 20], ["Email", 12]],
    badge: "💇 +24% repeat bookings",
  },
  {
    id: "pets", emoji: "🐾", label: "Pet groomer", title: "Happy Paws Grooming",
    weekly: [0.8, 0.8, 0.9, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.3, 1.4, 1.5],
    stats: [
      { label: "Impressions", value: "9.6K", change: "+37%", hint: "times your listing and ads were shown" },
      { label: "Visits", value: "612", change: "+26%", hint: "calls, direction requests and booking clicks" },
      { label: "Sales", value: "$5.4K", change: "+33%", hint: "revenue from marketing-driven appointments" },
    ],
    channels: [["Google Maps", 41], ["Google Ads", 27], ["Facebook", 20], ["Email", 12]],
    badge: "🐾 +19 new regular clients",
  },
  {
    id: "fitness", emoji: "🏋️", label: "Fitness studio", title: "Peak Fitness Studio",
    weekly: [1.9, 2.0, 2.1, 2.3, 2.2, 2.4, 2.5, 2.4, 2.6, 2.8, 3.0, 3.2],
    stats: [
      { label: "Impressions", value: "14.1K", change: "+31%", hint: "times your listing and ads were shown" },
      { label: "Visits", value: "905", change: "+24%", hint: "class page views and trial requests" },
      { label: "Sales", value: "$11.6K", change: "+36%", hint: "memberships and packs from marketing" },
    ],
    channels: [["Instagram", 33], ["Google Ads", 28], ["Google Maps", 24], ["Email", 15]],
    badge: "🏋️ +42 trial sign-ups",
  },
] as const;

function SalesChart({ data, id }: { data: readonly number[]; id: string }) {
  const W = 340, H = 130, L = 34, R = 10, T = 14, B = 22;
  const max = Math.ceil(Math.max(...data) * 1.15 * 2) / 2;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)} ${H - B} L${x(0)} ${H - B} Z`;
  const ticks = [0, max / 2, max];
  const last = data.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Weekly sales over the last 12 weeks, rising">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3b98a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e3b98a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,.14)" strokeDasharray="3 4" />
          <text x={L - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">${t.toFixed(t % 1 ? 1 : 0)}K</text>
        </g>
      ))}
      <path d={area} fill={`url(#g-${id})`} />
      <motion.path d={line} fill="none" stroke="#f3d9b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 4.5 : 2.2} fill={i === last ? "#fff" : "#f3d9b8"} stroke={i === last ? "#b07d4d" : "none"} strokeWidth="2">
          <title>{`Week ${i + 1}: $${v.toFixed(1)}K`}</title>
        </circle>
      ))}
      <text x={x(last) - 4} y={y(data[last]) - 9} textAnchor="end" fontSize="10" fontWeight="700" fill="#fff">${data[last].toFixed(1)}K</text>
      <text x={L} y={H - 6} fontSize="9" fill="#9ca3af">12 weeks ago</text>
      <text x={W - R} y={H - 6} textAnchor="end" fontSize="9" fill="#9ca3af">This week</text>
    </svg>
  );
}

const INTERVAL = 8000;

export default function AnimatedDashboard() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setI((v) => (v + 1) % NICHES.length), []);

  useEffect(() => {
    if (reduce || paused) return;
    timer.current = setTimeout(next, INTERVAL);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [i, paused, reduce, next]);

  const n = NICHES[i];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="bg-gray-950/90 rounded-2xl border border-coffee-400/40 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Niche tabs */}
        <div role="tablist" aria-label="Dashboard examples by business type" className="flex border-b border-white/10 bg-black/30">
          {NICHES.map((x, k) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`relative flex-1 px-2 py-3 text-xs sm:text-sm font-semibold transition-colors ${k === i ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <span aria-hidden className="mr-1">{x.emoji}</span>
              <span className="hidden sm:inline">{x.label}</span>
              {k === i && !reduce && (
                <span
                  key={`${i}-${paused}`}
                  className="absolute left-0 bottom-0 h-0.5 bg-coffee-300"
                  style={{ width: paused ? "0%" : "100%", animation: paused ? undefined : `dash-progress ${INTERVAL}ms linear` }}
                />
              )}
              {k === i && reduce && <span className="absolute left-0 bottom-0 h-0.5 w-full bg-coffee-300" />}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-bold text-base sm:text-lg">Your Marketing Dashboard</span>
            <span className="text-green-300 text-xs font-semibold bg-green-400/15 border border-green-400/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-4">{n.title} · last 30 days</div>

          <AnimatePresence mode="wait">
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-white">Weekly sales</span>
                <span className="text-[11px] text-gray-400">12 weeks, $K</span>
              </div>
              <div className="mb-4 rounded-xl bg-white/5 border border-white/10 p-2">
                <SalesChart data={n.weekly} id={n.id} />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {n.stats.map((s) => (
                  <div key={s.label} className={`rounded-xl border p-2.5 sm:p-3 ${s.label === "Sales" ? "bg-coffee-500/25 border-coffee-300/50" : "bg-white/10 border-white/20"}`}>
                    <div className="text-gray-300 text-xs font-medium">{s.label}</div>
                    <div className="text-white text-base sm:text-xl font-bold leading-tight">{s.value}</div>
                    <div className="text-green-300 text-xs font-semibold">▲ {s.change} <span className="hidden sm:inline text-gray-400 font-normal">vs prior 30 days</span></div>
                    <div className="hidden sm:block text-[10px] text-gray-400 mt-1 leading-snug">{s.hint}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs font-semibold text-white mb-2">Where sales came from</div>
              <div className="space-y-1.5">
                {n.channels.map(([name, pct]) => (
                  <div key={name} className="flex items-center gap-2 text-xs">
                    <span className="w-20 sm:w-24 shrink-0 text-gray-300">{name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-coffee-400 to-coffee-200" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
                    </div>
                    <span className="w-9 text-right text-white font-semibold">{pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-white/45">Example figures for illustration.</p>

      {/* Floating badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={n.id}
          className="absolute -bottom-4 left-2 sm:-left-4 bg-coffee-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-coffee-300/60 animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {n.badge}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
