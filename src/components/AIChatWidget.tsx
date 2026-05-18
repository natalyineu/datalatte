"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, ExternalLink, ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role:    "user" | "assistant";
  content: string;
  cta?:    string | null;
}

// ─── CTA config ──────────────────────────────────────────────────────────────

interface CtaButton {
  label:    string;
  href:     string;
  primary?: boolean;
  icon?:    "arrow" | "external" | "calc";
}

const CTA_MAP: Record<string, CtaButton[]> = {
  audit: [
    { label: "Book my free audit →",     href: "/contact",                          primary: true,  icon: "arrow" },
    { label: "See how it works",          href: "/about",                            primary: false, icon: "external" },
  ],
  google_ads: [
    { label: "Google Ads service →",      href: "/services/google-ads",              primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  meta_ads: [
    { label: "Meta Ads service →",        href: "/services/meta-ads",                primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  local_seo: [
    { label: "Local SEO service →",       href: "/services/local-seo",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  gbp: [
    { label: "GBP Optimisation →",        href: "/services/google-business-profile", primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  email: [
    { label: "Email & SMS service →",     href: "/services/email-sms",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  ai: [
    { label: "AI Agents service →",       href: "/services/ai-agents",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  social: [
    { label: "Social Media service →",    href: "/services/social-media",            primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  analytics: [
    { label: "Analytics service →",       href: "/services/analytics",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  website: [
    { label: "Website & Landing Pages →", href: "/services/website",                 primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
  calculator: [
    { label: "Try budget calculator →",   href: "/tools/marketing-budget-calculator", primary: true, icon: "calc" },
    { label: "Book a free audit",         href: "/contact",                          primary: false },
  ],
};

const DEFAULT_CTA: CtaButton[] = [
  { label: "Book a free audit →", href: "/contact", primary: true, icon: "arrow" },
];

// ─── Starter topics ──────────────────────────────────────────────────────────

const STARTERS = [
  { label: "How do I get more customers?",         msg: "How do I get more customers for my local business?" },
  { label: "Google Ads vs Meta Ads?",              msg: "What's the difference between Google Ads and Meta Ads for a local business?" },
  { label: "How much should I spend on marketing?",msg: "How much should I spend on marketing per month?" },
  { label: "Get more Google reviews?",             msg: "How can I get more Google reviews for my business?" },
];

// ─── Welcome message ─────────────────────────────────────────────────────────

const WELCOME: Message = {
  role: "assistant",
  cta: null,
  content:
    "Hi! I'm Latte ☕ — DataLatte's AI marketing consultant.\n\nTell me about your business and I'll give you specific advice on what's actually worth your marketing budget — no fluff, no pushy sales pitch.\n\nWhat type of business do you run?",
};

// ─── Helper: render text with basic markdown (bold, newlines) ─────────────────

function RenderText({ text }: { text: string }) {
  const lines = text.split("\n").filter(l => l.trim());
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── CTA Buttons component ───────────────────────────────────────────────────

function CtaButtons({ cta }: { cta: string | null | undefined }) {
  const buttons: CtaButton[] = (cta ? CTA_MAP[cta] : null) ?? DEFAULT_CTA;
  return (
    <div className="mt-2.5 flex flex-col gap-1.5">
      {buttons.map((btn) => (
        <Link
          key={btn.href}
          href={btn.href}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group
            ${btn.primary
              ? "bg-coffee-700 hover:bg-coffee-800 text-white"
              : "bg-white border border-gray-200 hover:border-coffee-300 hover:bg-coffee-50 text-gray-700"
            }`}
        >
          <span>{btn.label}</span>
          {btn.icon === "arrow"    && <ArrowRight    size={12} className="group-hover:translate-x-0.5 transition-transform" />}
          {btn.icon === "external" && <ExternalLink  size={11} className="opacity-60" />}
          {btn.icon === "calc"     && <Calculator    size={11} className="opacity-80" />}
        </Link>
      ))}
    </div>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────────────

export default function AIChatWidget() {
  const [open,    setOpen]    = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse,   setPulse]   = useState(true);
  const [unread,  setUnread]  = useState(0);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setPulse(false); setUnread(0); } }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      const newMsg: Message = {
        role: "assistant",
        content: data.reply ?? "Sorry, something went wrong. Please try again.",
        cta: data.cta ?? "audit",
      };
      setMessages(prev => [...prev, newMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Oops — something went wrong. Try again in a moment.", cta: "audit" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([WELCOME]);
    setInput("");
  }

  const isFirstMessage = messages.length === 1;

  return (
    <>
      {/* ── Floating trigger ── */}
      <div className="fixed bottom-6 left-6 z-50">
        {/* Pulse ring */}
        <AnimatePresence>
          {!open && pulse && (
            <motion.div
              className="absolute inset-0 rounded-full bg-coffee-500 opacity-40"
              initial={{ scale: 1 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(v => !v)}
          className="relative w-14 h-14 bg-coffee-700 hover:bg-coffee-800 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chat with Latte AI"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} className="text-white" />
              </motion.span>
            ) : (
              <motion.span key="coffee" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="text-2xl leading-none">
                ☕
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {!open && (
            <motion.div
              className="absolute bottom-1 left-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              Ask Latte — free advice ☕
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: "min(580px, calc(100vh - 110px))" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-coffee-800 to-coffee-600 px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-coffee-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
                  ☕
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-coffee-700 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Latte</p>
                <p className="text-coffee-200 text-[11px]">AI Marketing Consultant · Usually replies instantly</p>
              </div>
              <button onClick={reset} title="New conversation" className="text-coffee-200 hover:text-white transition-colors p-1">
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Persistent free audit banner */}
            <div className="bg-coffee-50 border-b border-coffee-100 px-3 py-2 shrink-0">
              <Link href="/contact" className="flex items-center justify-between group">
                <div>
                  <p className="text-xs font-semibold text-coffee-800">🎯 Free 20-min marketing audit</p>
                  <p className="text-[10px] text-coffee-600">Nataliia reviews your setup personally — no obligation</p>
                </div>
                <ArrowRight size={14} className="text-coffee-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0 mt-1">
                      ☕
                    </div>
                  )}

                  <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
                    <div
                      className={`rounded-2xl px-3 py-2.5 text-sm
                        ${msg.role === "user"
                          ? "bg-coffee-700 text-white rounded-tr-sm"
                          : "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm"
                        }`}
                    >
                      {msg.role === "user"
                        ? <p className="leading-relaxed">{msg.content}</p>
                        : <RenderText text={msg.content} />
                      }
                    </div>

                    {/* CTA buttons for assistant messages */}
                    {msg.role === "assistant" && i > 0 && (
                      <CtaButtons cta={msg.cta} />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2 items-end">
                  <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0">☕</div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Starter questions — only on first message */}
            {isFirstMessage && !loading && (
              <div className="px-3 pb-2 shrink-0">
                <p className="text-[10px] text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Quick questions</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {STARTERS.map(s => (
                    <button
                      key={s.label}
                      onClick={() => send(s.msg)}
                      className="text-left text-xs bg-gray-50 hover:bg-coffee-50 border border-gray-100 hover:border-coffee-200 text-gray-600 hover:text-coffee-700 rounded-xl px-2.5 py-2 transition-all leading-tight"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={e => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 shrink-0 bg-white"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about your marketing…"
                disabled={loading}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-coffee-700 hover:bg-coffee-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
              >
                <Send size={14} />
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-400 text-[10px] pb-2 shrink-0">
              Powered by DataLatte AI · <Link href="/contact" className="hover:text-coffee-600 underline transition-colors">Talk to Nataliia directly</Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
