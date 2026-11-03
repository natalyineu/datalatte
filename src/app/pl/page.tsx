import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { PL_SERVICES } from "@/content/pl/services";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "DataLatte: marketing lokalny oparty na danych dla małych firm" },
  description: "Google Ads, Meta Ads, lokalne SEO i Profil Firmy w Google dla kawiarni, salonów, groomerów i studiów fitness. Darmowy audyt, rozliczenie miesięczne, bez wiązania.",
  alternates: plAlternates("/pl"),
};

const niches = [
  ["☕", "Kawiarnie", "Widoczność w Mapach Google i wyszukiwaniach „w pobliżu”."],
  ["✂️", "Fryzjerzy i kosmetyka", "Rezerwacje z Instagrama i z wyszukiwarki."],
  ["🐾", "Groomerzy i usługi dla zwierząt", "Lokalni klienci, którzy szukają kogoś zaufanego."],
  ["🏋️", "Studia fitness i joga", "Zapisy na zajęcia próbne przez cały rok."],
];

const process = [
  ["01", "Darmowy audyt", "Sprawdzam Twój profil w Google, stronę i konkurencję. Dostajesz listę zmian w 48 godzin."],
  ["02", "Plan i priorytety", "Wybieramy 1 do 2 kanałów, które mają największy sens przy Twoim budżecie."],
  ["03", "Wdrożenie", "Konfiguruję kampanie, profil i pomiar. Wiesz, co dokładnie zostało zrobione."],
  ["04", "Raport i poprawki", "Co miesiąc dostajesz raport prostym językiem i decyzje, co dalej."],
];

const faqs = [
  ["Dla kogo jest DataLatte?", "Dla lokalnych firm z jednym lub kilkoma lokalami: kawiarni, salonów fryzjerskich i kosmetycznych, groomerów, studiów fitness i jogi."],
  ["Czy są umowy na rok?", "Nie. Rozliczamy się miesięcznie i możesz zrezygnować w każdej chwili."],
  ["Ile to kosztuje?", "Cenę ustalam po darmowym audycie, bo zależy od zakresu i miasta. Moje wynagrodzenie jest jawne i osobne od budżetu reklamowego."],
  ["Czy obiecujesz wyniki?", "Nie obiecuję konkretnych pozycji ani liczby klientów. Obiecuję jasny pomiar i uczciwe raporty."],
  ["Kto prowadzi kampanie?", "Ja, Nataliia. Rozmawiasz bezpośrednio z osobą, która pracuje nad Twoim kontem."],
];

export default function Page() {
  return (
    <>
      <section className="hero-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-coffee-200 text-sm font-semibold tracking-wide uppercase mb-4">Marketing lokalny oparty na danych</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 text-balance">Mniej zgadywania. <span className="text-coffee-300">Więcej klientów z okolicy.</span></h1>
          <p className="text-coffee-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">Google Ads, Meta Ads, lokalne SEO i Profil Firmy w Google dla kawiarni, salonów, groomerów i studiów fitness.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pl/darmowy-audyt" className="inline-flex items-center gap-2 bg-white text-coffee-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition">Darmowy audyt <ArrowRight size={18} /></Link>
            <Link href="/pl/uslugi" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition">Zobacz usługi</Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10"><span className="section-label">Usługi</span><h2 className="section-title">W czym mogę pomóc</h2></div>
          <div className="grid md:grid-cols-2 gap-5">
            {PL_SERVICES.map((s) => (
              <Link key={s.slug} href={s.path} className="card p-6 group block">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5">{s.service}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{s.short}</p>
                <span className="inline-flex items-center gap-1 text-coffee-700 dark:text-coffee-300 text-sm font-semibold">Więcej <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10"><span className="section-label">Dla kogo</span><h2 className="section-title">Lokalne firmy, które żyją z klientów z okolicy</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {niches.map(([e, t, d]) => (
              <div key={t} className="card p-5"><div className="text-3xl mb-2">{e}</div><h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{d}</p></div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10"><span className="section-label">Dane z Poznania</span><h2 className="section-title">Sprawdziliśmy 210 poznańskich kawiarni</h2></div>
          <div className="card p-6 sm:p-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">Przeanalizowaliśmy profile 210 kawiarni z Poznania w Google Maps: opinie, oceny, strony, media społecznościowe. Wnioski są jasne: oceny prawie nie odróżniają kawiarni, odróżnia je liczba opinii i kompletność profilu.</p>
            <Link href="/pl/blog/ranking-kawiarni-poznan-google-maps-2026" className="inline-flex items-center gap-2 text-coffee-700 dark:text-coffee-300 font-semibold">Przeczytaj ranking i analizę <ArrowRight size={16} /></Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10"><span className="section-label">Jak pracujemy</span><h2 className="section-title">Cztery kroki, bez niespodzianek</h2></div>
          <div className="grid sm:grid-cols-2 gap-5">
            {process.map(([n, t, d]) => (
              <div key={n} className="card p-6"><span className="text-xs font-mono text-coffee-500">{n}</span><h3 className="font-bold text-gray-900 dark:text-gray-100 mt-1 mb-1.5">{t}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{d}</p></div>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            {["Rozliczenie miesięczne", "Bez wiązania", "Jawne wynagrodzenie", "Bezpośredni kontakt"].map((x) => <li key={x} className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-coffee-600" />{x}</li>)}
          </ul>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8"><span className="section-label">FAQ</span><h2 className="section-title">Najczęstsze pytania</h2></div>
          <div className="space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="card p-5 group"><summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">{q}</summary><p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{a}</p></details>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline="Zacznijmy od darmowego audytu" sub="Sprawdzę Twoją widoczność w Google i napiszę, co poprawić w pierwszej kolejności." ctaLabel="Poproś o darmowy audyt" ctaHref="/pl/darmowy-audyt" />
    </>
  );
}
