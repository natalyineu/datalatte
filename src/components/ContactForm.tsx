"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const NICHES = [
  { value: "coffee",   emoji: "☕", label: "Coffee Shop",   sub: "Café / Restaurant" },
  { value: "salon",    emoji: "✂️", label: "Hair & Beauty", sub: "Salon / Spa / Barbershop" },
  { value: "grooming", emoji: "🐾", label: "Pet Business",  sub: "Groomer / Walker / Vet" },
  { value: "fitness",  emoji: "🏋️", label: "Fitness Studio", sub: "Gym / Yoga / PT" },
  { value: "other",    emoji: "🏪", label: "Other Local",    sub: "Any brick-and-mortar" },
];

const field = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm";

export default function ContactForm() {
  const [niche,   setNiche]  = useState("");
  const [status,  setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = new FormData(e.currentTarget);
    data.append("niche", niche);
    try {
      const res = await fetch("https://formspree.io/f/xqenvpwv", {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "generate_lead", { event_category: "contact_form" });
        }
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <motion.div
        className="text-center py-14"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={42} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're all set ☕</h3>
        <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
          I'll review your details and get back to you within one business day — usually sooner.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Step 1 — niche tiles */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">What kind of business do you run?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {NICHES.map((n) => (
            <button
              key={n.value}
              type="button"
              onClick={() => setNiche(n.value === niche ? "" : n.value)}
              className={`relative flex flex-col items-center gap-1 p-3.5 rounded-2xl border-2 text-center transition-all duration-150 cursor-pointer select-none
                ${niche === n.value
                  ? "border-coffee-600 bg-coffee-50 shadow-sm"
                  : "border-gray-200 hover:border-coffee-300 hover:bg-coffee-50/50"
                }`}
            >
              {niche === n.value && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-coffee-600 rounded-full flex items-center justify-center">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              <span className="text-2xl leading-none">{n.emoji}</span>
              <span className={`text-xs font-semibold leading-tight ${niche === n.value ? "text-coffee-800" : "text-gray-700"}`}>{n.label}</span>
              <span className="text-[10px] text-gray-400 leading-tight">{n.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">Your details</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Step 2 — just the essentials */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
          <input type="text" id="name" name="name" placeholder="Jane Smith" className={field} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input type="email" id="email" name="email" placeholder="jane@mybusiness.com" className={field} required />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          What's your #1 marketing challenge right now?
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="message" name="message" rows={3}
          placeholder={`e.g. "I'm not showing up on Google Maps" or "I tried Facebook ads but wasted money"`}
          className={`${field} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 group"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>
            Sending…
          </span>
        ) : (
          <>
            <Sparkles size={17} className="opacity-80" />
            Get My Free Audit
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong — email me directly at{" "}
          <a href="mailto:hi@datalatte.pro" className="underline">hi@datalatte.pro</a>
        </p>
      )}

      <p className="text-xs text-gray-400 text-center">
        Free, no commitment. I'll respond within one business day. ☕
      </p>
    </form>
  );
}
