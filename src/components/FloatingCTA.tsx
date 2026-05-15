"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("floating-cta-dismissed")) {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("floating-cta-dismissed", "1");
  }

  if (dismissed) return null;

  return (
    <>
      {/* Mobile sticky bottom bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
              <div className="flex-1">
                <p className="text-xs text-gray-500 leading-tight">Free marketing audit</p>
                <p className="text-sm font-semibold text-gray-900">Find out what's holding you back</p>
              </div>
              <Link
                href="/contact"
                className="bg-coffee-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
              >
                Book now <ArrowRight size={14} />
              </Link>
              <button onClick={dismiss} className="text-gray-400 shrink-0">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop floating button (right side) */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed right-6 bottom-8 z-40 hidden md:flex flex-col items-end gap-2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white text-xs text-gray-600 px-3 py-1.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap"
            >
              Free audit — no strings attached ☕
            </motion.div>
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="bg-coffee-700 hover:bg-coffee-800 text-white font-semibold text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all group"
              >
                Get Free Audit
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={dismiss}
                className="bg-white text-gray-400 hover:text-gray-600 w-9 h-9 rounded-xl shadow-md border border-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
