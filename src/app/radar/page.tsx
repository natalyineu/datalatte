import type { Metadata } from "next";
import RadarFeed from "@/components/RadarFeed";

export const metadata: Metadata = {
  title: "Value Radar — Daily Marketing Intelligence for Local Businesses",
  description:
    "Daily marketing signals decoded for local businesses. New ad formats, AI tools, Google updates — explained in plain language for coffee shops, salons, pet groomers and fitness studios.",
  alternates: { canonical: "https://datalatte.pro/radar" },
};

export default function RadarPage() {
  return (
    <main>
      {/* Dark hero */}
      <section className="bg-gray-950 text-white pt-14 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">Live</span>
            <span className="mx-2 text-gray-700">·</span>
            <span className="text-xs text-gray-500 font-medium">Updated daily</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-none">
            Value{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-500">
              Radar
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Marketing intelligence your competitors are too busy to read — decoded for
            coffee shops, salons, pet groomers and fitness studios in plain language.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-coffee-400 inline-block" />
              5 signals today
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700">
              May 29, 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700">
              Meta · Google · AI · TikTok · SEO
            </span>
          </div>
        </div>
      </section>

      <RadarFeed />
    </main>
  );
}
