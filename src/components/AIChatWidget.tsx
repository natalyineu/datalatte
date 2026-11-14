"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gtag } from "@/lib/gtag";
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
    { label: "Book my free audit →",     href: "/free-audit",                       primary: true,  icon: "arrow" },
    { label: "See how it works",          href: "/about",                            primary: false, icon: "external" },
  ],
  google_ads: [
    { label: "Google Ads service →",      href: "/services/google-ads",              primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  meta_ads: [
    { label: "Meta Ads service →",        href: "/services/meta-ads",                primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  local_seo: [
    { label: "Local SEO service →",       href: "/services/local-seo",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  gbp: [
    { label: "GBP Optimisation →",        href: "/services/google-business-profile", primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  email: [
    { label: "Email & SMS service →",     href: "/services/email-sms",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  ai: [
    { label: "AI Agents service →",       href: "/services/ai-agents",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  social: [
    { label: "Social Media service →",    href: "/services/social-media",            primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  analytics: [
    { label: "Analytics service →",       href: "/services/analytics",               primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  website: [
    { label: "Website & Landing Pages →", href: "/services/website",                 primary: true,  icon: "arrow" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
  calculator: [
    { label: "Try budget calculator →",   href: "/tools/marketing-budget-calculator", primary: true, icon: "calc" },
    { label: "Book a free audit",         href: "/free-audit",                          primary: false },
  ],
};

const DEFAULT_CTA: CtaButton[] = [
  { label: "Book a free audit →", href: "/free-audit", primary: true, icon: "arrow" },
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
                ? <strong key={j} className="font-semibold text-gray-900 dark:text-gray-50">{part.slice(2, -2)}</strong>
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
              : "bg-white border border-gray-200 hover:border-coffee-300 hover:bg-coffee-50 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-coffee-900/60"
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

// ─── Lead capture inside the chat ───────────────────────────────────────────

function ChatLeadForm({ messages }: { messages: Message[] }) {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setStatus("loading");
    // Send the visitor's side of the conversation so the follow-up is specific
    const transcript = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" | ")
      .slice(0, 1500);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), form_type: "explore", message: `[From AI chat] ${transcript}` }),
      });
      if (res.ok) { setStatus("done"); gtag.chatLeadCaptured(); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  if (status === "done") {
    return <p className="text-xs text-coffee-700 bg-coffee-50 rounded-xl px-3 py-2.5 dark:text-coffee-300 dark:bg-coffee-900/20">Thanks! Nataliia will email you within one business day ☕</p>;
  }
  return (
    <form onSubmit={submit} className="bg-coffee-50 border border-coffee-100 rounded-xl p-3 dark:bg-coffee-900/20 dark:border-coffee-800">
      <p className="text-xs font-semibold text-coffee-900 mb-2 dark:text-coffee-100">Want a personal plan by email? Leave your address.</p>
      <div className="flex gap-2">
        <input
          id="chat-lead-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          className="flex-1 min-w-0 text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-coffee-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
        />
        <button type="submit" disabled={status === "loading"} className="text-xs font-semibold px-3 py-2 rounded-lg bg-coffee-700 hover:bg-coffee-800 text-white disabled:opacity-60">
          {status === "loading" ? "…" : "Send"}
        </button>
      </div>
      {status === "error" && <p className="text-[11px] text-red-600 mt-1.5 dark:text-red-300">Could not send. Please try again or email hi@datalatte.pro</p>}
    </form>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────────────

export default function AIChatWidget() {
  const [open,    setOpen]    = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse,   setPulse]   = useState(false); // no attention-grabbing pulse
  const [unread,  setUnread]  = useState(0);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setPulse(false); setUnread(0); } }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    // Focus the input only on desktop: on phones it pops the keyboard and hides the chat
    if (open && window.matchMedia("(min-width: 768px)").matches) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Back button / Escape close the chat instead of leaving the page
  const pushedRef = useRef(false);
  useEffect(() => {
    if (!open) return;
    window.history.pushState(null, "", window.location.href);
    pushedRef.current = true;
    const onPop = () => { pushedRef.current = false; setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeChat(); };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function closeChat() {
    if (pushedRef.current) { pushedRef.current = false; window.history.back(); }
    setOpen(false);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    gtag.chatMessageSent(messages.length);
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
      <div className="group fixed bottom-20 left-3 md:bottom-5 md:left-5 z-40">
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
          onClick={() => { if (open) closeChat(); else { gtag.chatWidgetOpened(); setOpen(true); } }}
          className="relative w-10 h-10 md:w-11 md:h-11 bg-coffee-700/85 hover:bg-coffee-800 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center opacity-80 hover:opacity-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chat with Latte AI"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} className="text-white" />
              </motion.span>
            ) : (
              <motion.span key="coffee" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="text-lg md:text-xl leading-none">
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

        {/* Tooltip: only on hover (desktop) */}
        {!open && (
          <div className="hidden md:block absolute bottom-1.5 left-14 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Latte — free advice ☕
          </div>
        )}
      </div>

      {/* ── Mobile backdrop: tap outside to close ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeChat}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Chat panel (bottom sheet on phones) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Latte"
            className="fixed inset-x-0 bottom-0 z-50 w-full max-h-[82dvh] md:max-h-[580px] md:inset-x-auto md:bottom-24 md:left-6 md:w-[400px] flex flex-col bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-700"
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
              <button onClick={reset} title="New conversation" aria-label="New conversation" className="text-coffee-200 hover:text-white transition-colors p-2">
                <RotateCcw size={16} />
              </button>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="flex items-center gap-1.5 shrink-0 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white pl-3 pr-2.5 h-10 text-sm font-semibold transition-colors"
              >
                Close <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Persistent free audit banner */}
            <div className="bg-coffee-50 border-b border-coffee-100 px-3 py-2 shrink-0 dark:bg-coffee-900/20 dark:border-coffee-800">
              <Link href="/free-audit" className="flex items-center justify-between group">
                <div>
                  <p className="text-xs font-semibold text-coffee-800 dark:text-coffee-200">🎯 Free 20-min marketing audit</p>
                  <p className="text-[10px] text-coffee-600 dark:text-coffee-400">Nataliia reviews your setup personally — no obligation</p>
                </div>
                <ArrowRight size={14} className="text-coffee-600 group-hover:translate-x-0.5 transition-transform shrink-0 dark:text-coffee-400" />
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0 mt-1 dark:bg-coffee-900/30">
                      ☕
                    </div>
                  )}

                  <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
                    <div
                      className={`rounded-2xl px-3 py-2.5 text-sm
                        ${msg.role === "user"
                          ? "bg-coffee-700 text-white rounded-tr-sm"
                          : "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-200"
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

              {/* Email capture after the visitor has engaged (2+ messages) */}
              {!loading && messages.filter((m) => m.role === "user").length >= 2 && (
                <ChatLeadForm messages={messages} />
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2 items-end">
                  <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0 dark:bg-coffee-900/30">☕</div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center dark:bg-gray-800/60 dark:border-gray-700">
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
                      className="text-left text-xs bg-gray-50 hover:bg-coffee-50 border border-gray-100 hover:border-coffee-200 text-gray-600 hover:text-coffee-700 rounded-xl px-2.5 py-2 transition-all leading-tight dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-coffee-900/60"
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
              className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 shrink-0 bg-white dark:border-gray-700 dark:bg-gray-900"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about your marketing…"
                disabled={loading}
                className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 disabled:opacity-50 transition-all dark:text-gray-50 dark:bg-gray-800/60 dark:border-gray-700"
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
              Powered by DataLatte AI · <Link href="/free-audit" className="hover:text-coffee-600 underline transition-colors">Talk to Nataliia directly</Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
