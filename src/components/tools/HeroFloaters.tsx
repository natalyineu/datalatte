"use client";
import { motion } from "framer-motion";

const floaters = [
  { emoji: "☕", left: "8%",  top: "20%", delay: 0,   dur: 3.5 },
  { emoji: "📊", left: "88%", top: "25%", delay: 0.6, dur: 4.0 },
  { emoji: "🎯", left: "80%", top: "65%", delay: 1.1, dur: 3.2 },
  { emoji: "💰", left: "12%", top: "60%", delay: 1.8, dur: 4.5 },
];

export default function HeroFloaters() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl select-none opacity-20"
          style={{ left: f.left, top: f.top }}
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: f.dur, delay: f.delay, ease: "easeInOut" }}
        >
          {f.emoji}
        </motion.div>
      ))}
    </div>
  );
}
