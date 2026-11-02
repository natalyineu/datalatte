"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Illustrative sample data for each niche. Shown with a "Sample data" label.
const NICHES = [
  {
    id: "coffee", emoji: "☕", label: "Coffee shop", title: "Corner Café",
    bars: [38, 52, 46, 64, 58, 74, 70, 84, 79, 92, 88, 100],
    stats: [
      { label: "Impressions", value: "18.2K", change: "+34%" },
      { label: "Visits", value: "1,240", change: "+21%" },
      { label: "Sales", value: "$9.8K", change: "+28%" },
    ],
    badge: "☕ +38% new customers this month",
  },
  {
    id: "salon", emoji: "💇", label: "Hair salon", title: "Studio Salon",
    bars: [30, 44, 40, 58, 66, 62, 78, 72, 86, 82, 94, 100],
    stats: [
      { label: "Impressions", value: "12.4K", change: "+29%" },
      { label: "Visits", value: "847", change: "+21%" },
      { label: "Sales", value: "$7.2K", change: "+31%" },
    ],
    badge: "💇 +24% repeat bookings",
  },
  {
    id: "pets", emoji: "🐾", label: "Pet groomer", title: "Happy Paws Grooming",
    bars: [26, 36, 48, 42, 60, 56, 70, 68, 80, 90, 86, 100],
    stats: [
      { label: "Impressions", value: "9.6K", change: "+37%" },
      { label: "Visits", value: "612", change: "+26%" },
      { label: "Sales", value: "$5.4K", change: "+33%" },
    ],
    badge: "🐾 +19 new regular clients",
  },
  {
    id: "fitness", emoji: "🏋️", label: "Fitness studio", title: "Peak Fitness Studio",
    bars: [34, 40, 55, 50, 68, 64, 76, 88, 82, 90, 96, 100],
    stats: [
      { label: "Impressions", value: "14.1K", change: "+31%" },
      { label: "Visits", value: "905", change: "+24%" },
      { label: "Sales", value: "$11.6K", change: "+36%" },
    ],
    badge: "🏋️ +42 trial sign-ups",
  },
] as const;

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

        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-bold text-lg">Your Marketing Dashboard</span>
            <span className="text-green-300 text-xs font-semibold bg-green-400/15 border border-green-400/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-5">{n.title} · last 30 days · <span className="text-coffee-300">sample data</span></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-end gap-2 h-32 mb-5 border-b border-white/10 pb-0.5">
                {n.bars.map((h, k) => (
                  <motion.div
                    key={k}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-coffee-500 to-coffee-200"
                    initial={{ height: "4%" }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: k * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {n.stats.map((s) => (
                  <div key={s.label} className={`rounded-xl border p-3 ${s.label === "Sales" ? "bg-coffee-500/25 border-coffee-300/50" : "bg-white/10 border-white/20"}`}>
                    <div className="text-white text-xl font-bold leading-tight">{s.value}</div>
                    <div className="text-gray-300 text-xs">{s.label}</div>
                    <div className="text-green-300 text-xs font-semibold mt-0.5">▲ {s.change}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={n.id}
          className="absolute -bottom-4 -left-4 bg-coffee-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-coffee-300/60 animate-float"
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
