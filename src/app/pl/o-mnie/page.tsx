import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CTABanner from "@/components/CTABanner";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "O mnie: Natalia Rumiancewa, założycielka DataLatte",
  description: "Mieszkam w Poznaniu, piję za dużo kawy i od ponad 10 lat zajmuję się marketingiem cyfrowym, między innymi w agencjach OMD, Dentsu, BBDO i GroupM.",
  alternates: plAlternates("/pl/o-mnie"),
};

const agencies = ["OMD", "Dentsu", "BBDO", "GroupM"];

export default function Page() {
  return (
    <>
      <section className="hero-gradient py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <Image src="/images/founder.png" alt="Natalia Rumiancewa, założycielka DataLatte" width={140} height={140} className="rounded-full ring-4 ring-white/20 shadow-2xl shrink-0" style={{ width: 140, height: 140, objectFit: "cover" }} priority />
          <div className="text-center sm:text-left">
            <p className="text-coffee-300 text-sm font-semibold uppercase tracking-widest mb-2">O mnie</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cześć, jestem Natalia Rumiancewa ☕</h1>
            <p className="text-coffee-200 text-lg leading-relaxed">Prowadzę DataLatte z Poznania. Pomagam lokalnym firmom rosnąć dzięki marketingowi, który ma sens i który da się zmierzyć.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Ponad 10 lat doświadczenia, między innymi w</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">{agencies.map((a) => <span key={a} className="text-lg font-bold text-gray-800 dark:text-gray-200">{a}</span>)}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto">Duże kampanie dla międzynarodowych marek, a dziś to samo podejście, oparte na danych, dla lokalnych firm, które rozmawiają ze mną jak z człowiekiem.</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
        <p>Mieszkam w Poznaniu i znam tutejsze kawiarnie. Dlatego pierwszą dużą analizą DataLatte w Polsce było sprawdzenie, jak 210 poznańskich kawiarni wygląda w Google Maps.</p>
        <p>Pracuję prosto: zaczynam od darmowego audytu, mówię wprost, co warto poprawić, rozliczam się miesięcznie i nie wiążę Cię umową na rok. Rozmawiasz bezpośrednio ze mną, a nie z działem obsługi klienta.</p>
        <p>Nie obiecuję konkretnych pozycji ani liczby klientów. Obiecuję jasny pomiar i raporty prostym językiem.</p>
        <div className="pt-4"><Link href="/pl/darmowy-audyt" className="inline-flex items-center gap-2 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">Darmowy audyt <ArrowRight size={15} /></Link></div>
      </section>
      <CTABanner headline="Porozmawiajmy o Twojej firmie" sub="Napisz, czym się zajmujesz. Odpowiem w ciągu jednego dnia roboczego." ctaLabel="Napisz do mnie" ctaHref="/pl/kontakt" />
    </>
  );
}
