"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "How can Google Ads help my coffee shop?",
  "What's the best way to get more reviews?",
  "How much should I spend on ads?",
  "Can you audit my marketing strategy?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Latte ☕ — DataLatte's AI marketing consultant. Ask me anything about growing your local business: Google Ads, SEO, Meta Ads, or just where to start. How can I help?",
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stop pulse after first open
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops — something went wrong. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([WELCOME]);
    setInput("");
  }

  return (
    <>
      {/* Floating trigger button — bottom-left */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!open && pulse && (
            <motion.div
              className="absolute inset-0 rounded-full bg-coffee-600 opacity-40"
              initial={{ scale: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 bg-coffee-700 hover:bg-coffee-800 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open AI marketing consultant"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} className="text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="coffee"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="leading-none"
              >
                ☕
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip shown when closed */}
        <AnimatePresence>
          {!open && (
            <motion.div
              className="absolute bottom-1 left-16 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              Ask Latte ☕
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 120px))" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-coffee-700 text-white shrink-0">
              <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center text-base">☕</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">Latte</p>
                <p className="text-coffee-200 text-xs leading-tight">AI Marketing Consultant</p>
              </div>
              <button
                onClick={reset}
                title="New conversation"
                className="text-coffee-200 hover:text-white transition-colors"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 mr-2">
                      ☕
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-coffee-700 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 bg-coffee-100 rounded-full flex items-center justify-center text-sm shrink-0">☕</div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter questions — only show if only welcome message */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs bg-coffee-50 hover:bg-coffee-100 text-coffee-700 border border-coffee-200 rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about marketing…"
                disabled={loading}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-coffee-300 focus:border-coffee-400 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-coffee-700 hover:bg-coffee-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
              >
                <Send size={15} />
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-400 text-[10px] pb-2 shrink-0">
              Powered by DataLatte AI · Not financial advice
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
