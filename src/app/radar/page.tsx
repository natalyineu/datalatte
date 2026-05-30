import type { Metadata } from "next";
import RadarFeed from "@/components/RadarFeed";
import { fetchPublishedSignals } from "@/lib/radar-signals";

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = {
  title: "Value Radar — Daily Marketing Intelligence for Local Businesses",
  description:
    "Daily marketing signals decoded for local businesses. New ad formats, AI tools, Google updates — explained in plain language for coffee shops, salons, pet groomers and fitness studios.",
  alternates: { canonical: "https://datalatte.pro/radar" },
};

export default async function RadarPage() {
  const signals = await fetchPublishedSignals();
  const tickerItems = [...signals, ...signals]; // duplicate for seamless loop

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white overflow-hidden">
        {/* Top status bar */}
        <div className="border-b border-gray-800 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 font-bold uppercase tracking-widest">Live</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">May 29, 2026</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-gray-500">
              <span>Meta</span><span>·</span>
              <span>Google</span><span>·</span>
              <span>AI Tools</span><span>·</span>
              <span>TikTok</span><span>·</span>
              <span>SEO</span>
            </div>
          </div>
        </div>

        {/* Main hero content */}
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">DataLatte</span>
                <span className="text-gray-700">/</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-coffee-400">Intelligence Feed</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                VALUE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 via-coffee-400 to-coffee-600">
                  RADAR
                </span>
              </h1>
              <p className="mt-4 text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
                Marketing intelligence your competitors are too busy to read.
                Decoded for coffee shops, salons, pet groomers &amp; fitness studios.
              </p>
            </div>

            {/* Live signal count panel */}
            <div className="flex-shrink-0 border border-gray-800 rounded-2xl p-5 bg-gray-900/50 backdrop-blur-sm">
              <div className="text-4xl font-black text-white tabular-nums">{signals.length}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Signals today</div>
              <div className="mt-3 space-y-1">
                {signals.filter(s => s.impact === "breaking").length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 font-semibold">{signals.filter(s => s.impact === "breaking").length} breaking</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-gray-400">{signals.filter(s => s.impact === "high").length} high impact</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-gray-400">{signals.filter(s => s.impact === "medium").length} watch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="border-t border-gray-800 py-2.5 bg-gray-900 overflow-hidden">
          <div className="flex whitespace-nowrap radar-ticker">
            {tickerItems.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-8 text-xs text-gray-400">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  s.impact === "breaking" ? "bg-red-500" :
                  s.impact === "high" ? "bg-orange-400" :
                  s.impact === "medium" ? "bg-amber-400" : "bg-gray-600"
                }`} />
                <span className="font-semibold text-gray-300">{s.source.toUpperCase()}</span>
                <span className="text-gray-500">—</span>
                <span>{s.headline}</span>
                <span className="text-gray-700 mx-4">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feed ─────────────────────────────────────────────────────────── */}
      <RadarFeed signals={signals} />
    </main>
  );
}
