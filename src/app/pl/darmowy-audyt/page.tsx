import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import ContactFormPL from "@/components/pl/ContactFormPL";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Darmowy audyt marketingu lokalnego",
  description: "Darmowy audyt Profilu Firmy w Google, lokalnego SEO i reklam. Dostaniesz listę najważniejszych poprawek w ciągu 48 godzin, bez zobowiązań.",
  alternates: plAlternates("/pl/darmowy-audyt"),
};

const items = [
  ["Profil Firmy w Google", "Kompletność danych, kategorie, zdjęcia, opinie i odpowiedzi na nie."],
  ["Lokalne frazy", "Czego szukają ludzie w Twoim mieście i na jakie frazy pokazują się konkurenci."],
  ["Konkurencja", "Porównanie z kilkoma lokalnymi firmami z Twojej branży."],
  ["Reklamy (jeśli je prowadzisz)", "Typowe źródła przepalanego budżetu: brak wykluczeń, brak pomiaru konwersji, słaba strona docelowa."],
  ["Plan pierwszych kroków", "Kilka zmian, które mają największy sens na start. Prostym językiem."],
];

export default function Page() {
  return (
    <>
      <section className="hero-gradient py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Darmowy audyt marketingu lokalnego</h1>
          <p className="text-coffee-200 text-lg">Sprawdzę Twoją widoczność w Google i napiszę, co poprawić w pierwszej kolejności. Odpowiedź w ciągu 48 godzin, bez zobowiązań.</p>
        </div>
      </section>
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">Co sprawdzam</h2>
            <ul className="space-y-4">
              {items.map(([t, d]) => (
                <li key={t} className="flex gap-3"><CheckCircle2 size={20} className="text-coffee-600 shrink-0 mt-0.5" /><div><p className="font-semibold text-gray-900 dark:text-gray-100">{t}</p><p className="text-sm text-gray-600 dark:text-gray-400">{d}</p></div></li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8 h-fit"><ContactFormPL audit /></div>
        </div>
      </section>
    </>
  );
}
