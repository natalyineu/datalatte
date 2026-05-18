"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const shown = useRef(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("exit-popup-dismissed")) return;

    // Desktop: exit intent on mouse leaving top of viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown.current) {
        shown.current = true;
        setTimeout(() => setVisible(true), 100);
      }
    };

    // Mobile: show after 40s of engagement
    const mobileTimer = setTimeout(() => {
      if (!shown.current && window.innerWidth < 768) {
        shown.current = true;
        setVisible(true);
      }
    }, 40000);

    // Also show after scrolling 60% of the page
    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.6 && !shown.current) {
        shown.current = true;
        setTimeout(() => setVisible(true), 500);
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(mobileTimer);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem("exit-popup-dismissed", "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup" }),
      });
      if (res.ok) {
        setStatus("done");
        setTimeout(() => dismiss(), 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Top gradient bar */}
              <div className="h-2 bg-gradient-to-r from-coffee-700 via-coffee-500 to-coffee-300" />

              <div className="p-8">
                {status === "done" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">You're in! ☕</h3>
                    <p className="text-gray-500 text-sm">Check your inbox for a welcome email.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-4xl mb-4 text-center">☕</div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                      Before you go — get a free audit
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-6">
                      I'll review your Google presence and tell you exactly what's holding you back.
                      Takes me 20 minutes. Costs you nothing.
                    </p>

                    {/* Options */}
                    <div className="space-y-3 mb-5">
                      <Link
                        href="/contact"
                        onClick={dismiss}
                        className="flex items-center justify-between w-full bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors group"
                      >
                        <span>Book my free audit</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative text-center text-xs text-gray-400 bg-white px-2 inline-block mx-auto w-full">
                          or just get weekly tips
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none text-sm"
                        />
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap disabled:opacity-60"
                        >
                          {status === "loading" ? "…" : "Subscribe"}
                        </button>
                      </form>
                      {status === "error" && (
                        <p className="text-red-500 text-xs mt-1 text-center">
                          Something went wrong — try <a href="mailto:hi@datalatte.pro" className="underline">emailing us</a> directly.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={dismiss}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
                    >
                      No thanks, I'll figure it out myself
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
