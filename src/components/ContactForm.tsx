"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, string>) => void;
  }
}

type Mode = "explore" | "ready";
type Status = "idle" | "loading" | "success" | "error";

const NICHES = [
  { value: "coffee",     emoji: "☕", label: "Coffee Shop" },
  { value: "salon",      emoji: "✂️", label: "Hair & Beauty" },
  { value: "grooming",   emoji: "🐾", label: "Pet Business" },
  { value: "fitness",    emoji: "🏋️", label: "Fitness Studio" },
  { value: "startup",    emoji: "🚀", label: "Startup" },
  { value: "freelancer", emoji: "💼", label: "Freelancer / Consultant" },
  { value: "other",      emoji: "🏪", label: "Other" },
];

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm bg-white";

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Progress</span>
        <motion.span
          key={pct}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold text-coffee-700"
        >
          {pct}%
        </motion.span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-coffee-500 to-coffee-700"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", damping: 22, stiffness: 180 }}
        />
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={36} className="text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">You're all set ☕</h3>
      <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
        I'll get back to you within one business day — usually sooner.
      </p>
    </motion.div>
  );
}

async function submit(data: Record<string, string>, setStatus: (s: Status) => void) {
  setStatus("loading");
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("success");
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", { event_category: "contact_form" });
      }
    } else { setStatus("error"); }
  } catch { setStatus("error"); }
}

/* ─── Form 1: Just exploring ─── */
function ExploreForm() {
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");

  const pct = Math.min(100, (email ? 50 : 0) + (message.trim() ? 50 : 0));

  if (status === "success") return <SuccessState />;

  return (
    <form
      className="space-y-5"
      onSubmit={e => {
        e.preventDefault();
        submit({ email, message, form_type: "explore" }, setStatus);
      }}
    >
      <ProgressBar pct={pct} />

      <div>
        <label htmlFor="ex-email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Your email <span className="text-coffee-600">*</span>
        </label>
        <input
          id="ex-email" name="email" type="email"
          placeholder="you@yourbusiness.com"
          value={email} onChange={e => setEmail(e.target.value)}
          className={inputCls} required
        />
      </div>

      <div>
        <label htmlFor="ex-message" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          What are you curious about?
          <span className="text-[11px] text-gray-400 font-normal">optional</span>
        </label>
        <textarea
          id="ex-message" name="message" rows={3}
          placeholder="e.g. I want more customers from Google, or I'm not sure where to start…"
          value={message} onChange={e => setMessage(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit" disabled={status === "loading"}
        className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 group"
      >
        {status === "loading"
          ? <><Spinner /> Sending…</>
          : <><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> Send me a note</>}
      </button>

      {status === "error" && <ErrorMsg />}
      <p className="text-xs text-gray-400 text-center">No spam. Just a friendly reply. ☕</p>
    </form>
  );
}

/* ─── Form 2: Ready to start ─── */
function ReadyForm() {
  const [email,   setEmail]   = useState("");
  const [name,    setName]    = useState("");
  const [niche,   setNiche]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");

  const pct = (email ? 25 : 0) + (name.trim() ? 25 : 0) + (niche ? 25 : 0) + (message.trim() ? 25 : 0);

  if (status === "success") return <SuccessState />;

  return (
    <form
      className="space-y-5"
      onSubmit={e => {
        e.preventDefault();
        submit({ email, name, niche, message, form_type: "ready" }, setStatus);
      }}
    >
      <ProgressBar pct={pct} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rd-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-coffee-600">*</span>
          </label>
          <input
            id="rd-email" name="email" type="email"
            placeholder="you@yourbusiness.com"
            value={email} onChange={e => setEmail(e.target.value)}
            className={inputCls} required
          />
        </div>
        <div>
          <label htmlFor="rd-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your name <span className="text-coffee-600">*</span>
          </label>
          <input
            id="rd-name" name="name" type="text"
            placeholder="Jane Smith"
            value={name} onChange={e => setName(e.target.value)}
            className={inputCls} required
          />
        </div>
      </div>

      {/* Niche tiles — compact row */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Your business type <span className="text-gray-400 font-normal text-xs ml-1">optional</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map(n => (
            <button
              key={n.value} type="button"
              onClick={() => setNiche(n.value === niche ? "" : n.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all cursor-pointer
                ${niche === n.value
                  ? "border-coffee-600 bg-coffee-50 text-coffee-800"
                  : "border-gray-200 text-gray-600 hover:border-coffee-300 hover:bg-coffee-50/50"}`}
            >
              <span>{n.emoji}</span> {n.label}
              {niche === n.value && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="ml-0.5">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="rd-message" className="block text-sm font-medium text-gray-700 mb-1.5">
          What do you need help with? <span className="text-gray-400 font-normal text-xs ml-1">optional</span>
        </label>
        <textarea
          id="rd-message" name="message" rows={2}
          placeholder="e.g. Google Ads setup, local SEO, full audit…"
          value={message} onChange={e => setMessage(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit" disabled={status === "loading"}
        className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 group"
      >
        {status === "loading"
          ? <><Spinner /> Sending…</>
          : <><Sparkles size={15} className="opacity-80" /> Let's Talk <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>}
      </button>

      {status === "error" && <ErrorMsg />}
      <p className="text-xs text-gray-400 text-center">Free audit, no commitment. Back to you within one business day. ☕</p>
    </form>
  );
}

function Spinner() {
  return <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>;
}

function ErrorMsg() {
  return (
    <p className="text-red-500 text-xs text-center">
      Something went wrong — email <a href="mailto:hi@datalatte.pro" className="underline">hi@datalatte.pro</a> directly.
    </p>
  );
}

/* ─── Main export ─── */
export default function ContactForm() {
  const [mode, setMode] = useState<Mode>("explore");

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
        {([
          { id: "explore", icon: <ArrowRight size={14} />, label: "Just exploring" },
          { id: "ready",   icon: <Zap size={14} />,        label: "Ready to start" },
        ] as const).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200
              ${mode === tab.id
                ? "bg-white text-coffee-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {mode === "explore" ? <ExploreForm /> : <ReadyForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
