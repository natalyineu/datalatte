import Link from "next/link";

const PARTNERS = [
  { name: "Spotify Advertising", cls: "font-bold tracking-tight" },
  { name: "Vibe", cls: "font-extrabold tracking-wide" },
  { name: "Flodesk", cls: "font-semibold italic" },
];

export default function PartnerStrip({ detailed = false }: { detailed?: boolean }) {
  return (
    <section aria-label="Brands we work with" className="border-t border-gray-100 dark:border-gray-800 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Brands we work with</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p) => (
            <li key={p.name} className={`text-xl sm:text-2xl text-gray-400 dark:text-gray-500 hover:text-coffee-700 dark:hover:text-coffee-300 transition-colors ${p.cls}`}>
              {p.name}
            </li>
          ))}
        </ul>
        {detailed && (
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Some of their materials appear in our guides under written agreements. A partnership never changes a ranking, score or conclusion.
          </p>
        )}
        <p className="mt-4 text-sm">
          <Link href="/partnerships" className="text-coffee-700 dark:text-coffee-300 font-semibold hover:underline">
            How we work with partners
          </Link>
        </p>
      </div>
    </section>
  );
}
