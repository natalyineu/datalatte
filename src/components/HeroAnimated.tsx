"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gtag } from "@/lib/gtag";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function FadeUp({
  children,
  delay,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  as?: "div" | "h1" | "p";
}) {
  const Component = motion[Tag] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </Component>
  );
}

const PL = {
  badge: "Marketing lokalny oparty na danych",
  h1: ["Marketing cyfrowy dla", "lokalnych firm,", "zrobiony dobrze"],
  p: "Google Ads, Meta Ads, lokalne SEO i automatyzacja marketingu dla kawiarni, salonów fryzjerskich, groomerów i studiów fitness oraz rozwijających się marek w każdej skali.",
  cta: "Darmowy audyt marketingu", ctaHref: "/pl/darmowy-audyt",
  how: "Zobacz, jak to działa",
  built: <>Stworzone dla <strong className="text-white">lokalnych firm</strong> z 4 branż</>,
};
const EN = {
  badge: "Data-Driven Local Marketing",
  h1: ["Digital Marketing for", "Local Businesses,", "Done Right"],
  p: "Google Ads, Meta Ads, local SEO and marketing automation for coffee shops, hair salons, pet groomers, fitness studios — and growing brands at any scale.",
  cta: "Get a Free Marketing Audit", ctaHref: "/free-audit",
  how: "See how it works",
  built: <>Built for <strong className="text-white">local businesses</strong> across 4 niches</>,
};

export default function HeroAnimated({ lang }: { lang?: "pl" } = {}) {
  const t = lang === "pl" ? PL : EN;
  return (
    <div>
      <FadeUp delay={0} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6 backdrop-blur-sm">
        <span className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse" />
        {t.badge}
      </FadeUp>

      <FadeUp delay={0.1} as="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
        {t.h1[0]}
        <br />
        <span className="text-coffee-300">{t.h1[1]}</span>
        <br />
        {t.h1[2]}
      </FadeUp>

      <FadeUp delay={0.2} as="p" className="text-coffee-200 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
        {t.p}
      </FadeUp>

      <FadeUp delay={0.3} className="flex flex-col sm:flex-row gap-3">
        <Link
          href={t.ctaHref}
          onClick={() => gtag.freeAuditClicked("hero")}
          className="inline-flex items-center justify-center gap-2 bg-white text-coffee-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:bg-gray-900 dark:text-coffee-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {t.cta}
          <ArrowRight size={18} />
        </Link>
        <Link
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200"
        >
          {t.how}
        </Link>
      </FadeUp>

      <FadeUp delay={0.4} className="flex items-center gap-5 mt-10">
        <div className="flex -space-x-2">
          {["☕", "✂️", "🐾", "🧘"].map((e, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm"
            >
              {e}
            </div>
          ))}
        </div>
        <p className="text-sm text-coffee-200">
          {t.built}
        </p>
      </FadeUp>
    </div>
  );
}
