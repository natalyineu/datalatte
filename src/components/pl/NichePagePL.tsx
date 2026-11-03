import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import type { PlNiche } from "@/content/pl/niches";

export default function NichePagePL({ n }: { n: PlNiche }) {
  const crumbs = breadcrumbSchema([
    { name: "Strona główna", url: "https://datalatte.pro/pl" },
    { name: n.name, url: `https://datalatte.pro${n.path}` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(n.faq)) }} />
      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">{n.emoji}</div>
          <p className="text-coffee-200 text-sm font-semibold uppercase tracking-wide mb-3">{n.name}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">{n.headline}</h1>
          <p className="text-coffee-100 text-lg mb-8">{n.sub}</p>
          <Link href="/pl/darmowy-audyt" className="inline-flex items-center gap-2 bg-white text-coffee-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition">Darmowy audyt <ArrowRight size={18} /></Link>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-8">Brzmi znajomo?</h2>
          <ul className="space-y-3">
            {n.problems.map((p) => (
              <li key={p} className="flex gap-3 card p-4"><X size={18} className="text-red-400 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300">{p}</span></li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center mb-8">Co mogę zrobić dla Twojej firmy</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {n.channels.map((c) => (
              <Link key={c.title} href={c.href} className="card p-6 block group">
                <div className="text-3xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1.5">{c.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.desc}</p>
                <span className="inline-flex items-center gap-1 text-coffee-700 dark:text-coffee-300 text-sm font-semibold">Więcej <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {n.data && (
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-8">Dane z naszej analizy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {n.data.map((d) => (
                <div key={d.label} className="card p-5 text-center"><div className="text-3xl font-bold text-coffee-800 dark:text-coffee-200">{d.value}</div><p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">{d.label}</p></div>
              ))}
            </div>
            {n.dataNote && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">{n.dataNote.text}{" "}<Link href={n.dataNote.href} className="font-semibold text-coffee-700 dark:text-coffee-300 underline">{n.dataNote.linkLabel}</Link></p>
            )}
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-8">Jak to robię</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {n.tactics.map((t, i) => (
              <div key={t.title} className="card p-6"><span className="text-xs font-mono text-coffee-500">0{i + 1}</span><h3 className="font-bold text-gray-900 dark:text-gray-100 mt-1 mb-1.5">{t.title}</h3><p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.detail}</p></div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-8">Pytania</h2>
          <div className="space-y-3">
            {n.faq.map((f) => (
              <details key={f.q} className="card p-5"><summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">{f.q}</summary><p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{f.a}</p></details>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline="Zacznijmy od darmowego audytu" sub="Sprawdzę Twoją widoczność w Google i napiszę, co poprawić w pierwszej kolejności." ctaLabel="Poproś o darmowy audyt" ctaHref="/pl/darmowy-audyt" />
    </>
  );
}
