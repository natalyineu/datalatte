import type { Metadata } from "next";
import ContactFormPL from "@/components/pl/ContactFormPL";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Napisz do Nataliii z DataLatte: marketing lokalny dla kawiarni, salonów, groomerów i studiów fitness. Odpowiadam w ciągu jednego dnia roboczego.",
  alternates: plAlternates("/pl/kontakt"),
};

export default function Page() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Napisz do mnie</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Odpowiadam w ciągu jednego dnia roboczego. Możesz też napisać bezpośrednio: <a className="underline text-coffee-700 dark:text-coffee-300" href="mailto:hi@datalatte.pro">hi@datalatte.pro</a>.</p>
        <div className="card p-6 sm:p-8"><ContactFormPL /></div>
      </div>
    </section>
  );
}
