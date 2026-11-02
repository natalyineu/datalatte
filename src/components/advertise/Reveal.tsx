"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Fade-up on scroll, built so content can never stay hidden:
 * - server render and first paint are fully visible;
 * - on mount, only elements that are below the fold get hidden, then revealed when they scroll into view;
 * - a safety timer reveals anything still hidden, and reduced-motion users never see the animation.
 */
export default function Reveal({ children, delay = 0, className = "", y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return; // already on screen: leave visible
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) setState("shown");
    }, 3500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const style: React.CSSProperties =
    state === "hidden"
      ? { opacity: 0, transform: `translateY(${y}px)` }
      : state === "shown"
        ? { opacity: 1, transform: "none", transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.22,1,.36,1) ${delay}s` }
        : {};

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
