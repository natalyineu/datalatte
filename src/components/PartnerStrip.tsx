import Link from "next/link";
import { Mic2, Tv, Mail, ArrowUpRight } from "lucide-react";

const PARTNERS = [
  {
    name: "Spotify Advertising",
    what: "Audio and podcast advertising",
    Icon: Mic2,
    href: "/blog/ctv-advertising-platforms-compared-2026",
    guide: "CTV advertising platforms compared",
  },
  {
    name: "Vibe",
    what: "Connected TV advertising",
    Icon: Tv,
    href: "/blog/how-much-does-ctv-advertising-cost-real-cpm-data",
    guide: "What CTV advertising costs",
  },
  {
    name: "Flodesk",
    what: "Email marketing",
    Icon: Mail,
    href: "/blog/email-marketing-ideas-for-small-businesses-20-campaigns-that-drive-revenue-2026",
    guide: "20 email campaign ideas",
  },
];

export default function PartnerStrip({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      aria-label="Brands we work with"
      className="bg-gradient-to-b from-coffee-50 to-coffee-100 dark:from-gray-900 dark:to-gray-900 border-t border-coffee-100 dark:border-gray-800 py-14"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="inline-block text-xs font-bold uppercase tracking-widest text-coffee-700 dark:text-coffee-300 bg-white dark:bg-gray-800 border border-coffee-200 dark:border-gray-700 rounded-full px-4 py-1.5">
            Brands we work with
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-coffee-900 dark:text-white">Partners featured in our guides</h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {PARTNERS.map(({ name, what, Icon, href, guide }) => (
            <li key={name}>
              <Link
                href={href}
                className="group block h-full bg-white dark:bg-gray-800 rounded-2xl border border-coffee-200 dark:border-gray-700 border-t-4 border-t-coffee-500 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-coffee-100 dark:bg-gray-700 text-coffee-700 dark:text-coffee-200">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="block mt-4 text-2xl font-extrabold tracking-tight text-coffee-900 dark:text-white">{name}</span>
                <span className="block mt-1 text-sm text-gray-500 dark:text-gray-400">{what}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 dark:text-coffee-300 group-hover:underline">
                  Featured in: {guide} <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {detailed && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Some of their materials appear in our guides under written agreements. A partnership never changes a ranking, score or conclusion.
          </p>
        )}
        <p className="mt-4 text-center text-sm">
          <Link href="/partnerships" className="text-coffee-700 dark:text-coffee-300 font-semibold hover:underline">
            How we work with partners
          </Link>
        </p>
      </div>
    </section>
  );
}
