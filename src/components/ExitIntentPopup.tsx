"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gtag } from "@/lib/gtag";

const MAGNETS: { match: RegExp; slug: string; title: string }[] = [
  { match: /coffee|cafe/, slug: "coffee-shop-marketing", title: "Coffee Shop Marketing Checklist" },
  { match: /salon|barber|hair|beauty|nail/, slug: "hair-salon-marketing", title: "Hair Salon Marketing Checklist" },
  { match: /pet|dog|groom/, slug: "pet-groomer-marketing", title: "Pet Groomer Marketing Checklist" },
  { match: /fitness|gym|yoga|pilates|studio/, slug: "fitness-studio-marketing", title: "Fitness Studio Marketing Checklist" },
  { match: /google-ads|ppc|keyword/, slug: "google-ads-setup", title: "Google Ads Setup Checklist" },
  { match: /facebook|meta|instagram|social|tiktok/, slug: "meta-ads-setup", title: "Meta Ads Setup Checklist" },
  { match: /email|sms|newsletter/, slug: "email-marketing", title: "Email Marketing Setup Checklist" },
  { match: /website|landing|conversion|cro/, slug: "website-cro", title: "Website Conversion Checklist" },
];
const DEFAULT_MAGNET = { slug: "google-business-profile", title: "Google Business Profile Checklist" };

export default function ExitIntentPopup() {
  const pathname = usePathname() || "";
  const magnet = MAGNETS.find((m) => m.match.test(pathname.toLowerCase())) ?? DEFAULT_MAGNET;
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
        setTimeout(() => { setVisible(true); gtag.exitIntentShown("mouse_leave"); }, 100);
      }
    };

    // Mobile: show after 40s of engagement
    const mobileTimer = setTimeout(() => {
      if (!shown.current && window.innerWidth < 768) {
        shown.current = true;
        setVisible(true);
        gtag.exitIntentShown("timer_40s");
      }
    }, 40000);

    // Also show after scrolling 60% of the page
    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.6 && !shown.current) {
        shown.current = true;
        setTimeout(() => { setVisible(true); gtag.exitIntentShown("scroll_60"); }, 500);
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
    gtag.exitIntentDismissed();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup", magnet: magnet.slug }),
      });
      if (res.ok) {
        setStatus("done");
        gtag.emailSubscribed(`exit_popup_${magnet.slug}`);
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative dark:bg-gray-900">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-1 dark:text-gray-50">You're in! ☕</h3>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Check your inbox: the checklist link is on its way.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-4xl mb-4 text-center">☕</div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 dark:text-gray-50">
                      Free checklist: {magnet.title.replace(" Checklist", "")}
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-5 dark:text-gray-400">
                      A step-by-step list you can finish in an afternoon. I will email you the link right away. No spam, unsubscribe any time.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none text-sm dark:border-gray-700"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors disabled:opacity-60"
                      >
                        {status === "loading" ? "Sending…" : "Email me the checklist"}
                      </button>
                    </form>
                    {status === "error" && (
                      <p className="text-red-500 text-xs mb-3 text-center">
                        Something went wrong — try <a href="mailto:hi@datalatte.pro" className="underline">emailing us</a> directly.
                      </p>
                    )}
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Prefer a personal review?{" "}
                      <Link href="/free-audit" onClick={() => { dismiss(); gtag.freeAuditClicked("exit_popup"); }} className="underline text-coffee-700 dark:text-coffee-300">
                        Get a free audit
                      </Link>
                    </p>

                    <button
                      onClick={dismiss}
                      className="text-xs text-gray-500 hover:text-gray-600 transition-colors w-full text-center dark:text-gray-400"
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
