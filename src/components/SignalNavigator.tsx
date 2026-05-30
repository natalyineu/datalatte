"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Signal } from "@/lib/radar-signals";

interface Props {
  prev: Signal | null;
  next: Signal | null;
  index: number;
  total: number;
}

export default function SignalNavigator({ prev, next, index, total }: Props) {
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goPrev = () => prev && router.push(`/radar/${prev.slug}`);
  const goNext = () => next && router.push(`/radar/${next.slug}`);

  /* Keyboard ← → */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Touch swipe */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
      if (Math.abs(dx) < 50 || dy > 60) return; // ignore vertical scrolls
      if (dx > 0) goNext();
      else goPrev();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [prev, next]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Progress dots — top of page */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? "w-5 h-1.5 bg-coffee-400"
                : "w-1.5 h-1.5 bg-gray-700 hover:bg-gray-500"
            }`}
          />
        ))}
        <span className="ml-3 text-xs text-gray-600 tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      {/* Fixed side arrows — desktop only */}
      {prev && (
        <button
          onClick={goPrev}
          aria-label="Previous signal"
          className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:border-coffee-500 group-hover:bg-gray-800 transition-all shadow-lg">
            <ChevronLeft size={18} className="text-gray-500 group-hover:text-coffee-400 transition-colors" />
          </div>
          <span className="max-w-[80px] text-center text-xs text-gray-700 group-hover:text-gray-400 transition-colors leading-tight line-clamp-2 hidden xl:block">
            {prev.headline}
          </span>
        </button>
      )}

      {next && (
        <button
          onClick={goNext}
          aria-label="Next signal"
          className="fixed right-3 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:border-coffee-500 group-hover:bg-gray-800 transition-all shadow-lg">
            <ChevronRight size={18} className="text-gray-500 group-hover:text-coffee-400 transition-colors" />
          </div>
          <span className="max-w-[80px] text-center text-xs text-gray-700 group-hover:text-gray-400 transition-colors leading-tight line-clamp-2 hidden xl:block">
            {next.headline}
          </span>
        </button>
      )}

      {/* Swipe hint on mobile — subtle */}
      {(prev || next) && (
        <p className="text-center text-xs text-gray-800 mt-1 lg:hidden select-none">
          swipe ← → to navigate
        </p>
      )}
    </>
  );
}
