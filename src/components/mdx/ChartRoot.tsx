"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Wrapper that adds the class "is-in" once the element scrolls into view, so chart animations start when the reader sees them. */
export default function ChartRoot({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setOn(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    const safety = window.setTimeout(() => setOn(true), 6000); // never leave a chart frozen
    return () => { io.disconnect(); window.clearTimeout(safety); };
  }, []);
  return <figure ref={ref} className={`mdx-chart ${on ? "is-in" : ""} ${className}`}>{children}</figure>;
}
