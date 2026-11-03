import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { PL_SERVICES } from "@/content/pl/services";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Usługi marketingu lokalnego",
  description: "Google Ads, Meta Ads, lokalne SEO i Profil Firmy w Google dla kawiarni, salonów, groomerów i studiów fitness. Rozliczenie miesięczne, bez wiązania.",
  alternates: plAlternates("/pl/uslugi"),
};

export default function Page() {
  return (
    <>
      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Usługi marketingu lokalnego</h1>
          <p className="text-coffee-200 text-lg">Cztery narzędzia, które przynoszą klientów lokalnym firmom. Każde zaczyna się od darmowego audytu i liczb.</p>
        </div>
      </section>
      <SectionWrapper>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {PL_SERVICES.map((s) => (
            <Link key={s.slug} href={s.path} className="card p-6 group block">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{s.service}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{s.short}</p>
              <span className="inline-flex items-center gap-1 text-coffee-700 dark:text-coffee-300 text-sm font-semibold">
                Dowiedz się więcej <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          Potrzebujesz czegoś innego, na przykład e-mail marketingu, analityki lub strony internetowej? Napisz, powiem szczerze, czy to mój obszar.
        </p>
      </SectionWrapper>
      <CTABanner headline="Zacznijmy od darmowego audytu" sub="Sprawdzę Twoją widoczność w Google i napiszę, co poprawić w pierwszej kolejności." ctaLabel="Poproś o darmowy audyt" ctaHref="/pl/darmowy-audyt" />
    </>
  );
}
