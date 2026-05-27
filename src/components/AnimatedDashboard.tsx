"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const BARS = [40, 55, 45, 70, 60, 80, 75, 90, 85, 100, 95, 88];

export default function AnimatedDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold">Your Marketing Dashboard</span>
          <span className="text-coffee-300 text-xs font-medium bg-coffee-300/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-coffee-300 rounded-full animate-pulse" />
            Live
          </span>
        </div>

        {/* Animated chart bars */}
        <div className="flex items-end gap-2 h-28 mb-4">
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-coffee-700 to-coffee-400 hover:opacity-100 transition-opacity cursor-default"
              initial={{ height: "4%", opacity: 0.4 }}
              animate={started ? { height: `${h}%`, opacity: 0.8 } : {}}
              transition={{
                height: { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: i * 0.05 },
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Impressions", value: "12.4K", change: "+34%" },
            { label: "Clicks", value: "847", change: "+21%" },
            { label: "Conversions", value: "63", change: "+48%" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-card"
              initial={{ opacity: 0, y: 10 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            >
              <div className="text-white font-bold">{s.value}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
              <div className="text-coffee-300 text-xs font-medium">{s.change}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -bottom-4 -left-4 bg-coffee-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-coffee-600 animate-float"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={started ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.0, type: "spring", stiffness: 200 }}
      >
        ☕ +38% new customers this month
      </motion.div>
    </motion.div>
  );
}
