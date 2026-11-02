import { Check, X } from "lucide-react";

export const GRID_BG = {
  backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
  backgroundSize: "40px 40px",
} as const;

export function GridOverlay({ size = 40, opacity = 0.04 }: { size?: number; opacity?: number }) {
  return <div className="absolute inset-0" style={{ ...GRID_BG, backgroundSize: `${size}px ${size}px`, opacity }} aria-hidden />;
}

type Dot = "green" | "amber" | "blue" | "pink" | "purple";
const DOT: Record<Dot, string> = { green: "bg-green-400", amber: "bg-amber-400", blue: "bg-blue-400", pink: "bg-pink-400", purple: "bg-purple-400" };

export function FloatingChip({ className, dot, children, delay = "0s", reverse = false }: { className: string; dot: Dot; children: React.ReactNode; delay?: string; reverse?: boolean }) {
  return (
    <div className={`absolute hidden ${className} ${reverse ? "animate-float-r" : "animate-float"} opacity-90`} style={{ animationDelay: delay }} aria-hidden>
      <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
        <span className={`w-2 h-2 rounded-full ${DOT[dot]} animate-pulse shrink-0`} />
        {children}
      </div>
    </div>
  );
}

export function StatsBar({ items }: { items: { value: React.ReactNode; label: string }[] }) {
  return (
    <div className="bg-coffee-950 border-b border-coffee-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {items.map((s) => (
          <div key={s.label}>
            <div className="text-xl font-bold text-coffee-300">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BeforeAfter({ beforeLabel, afterLabel, rows }: { beforeLabel: string; afterLabel: string; rows: { before: string; after: string }[] }) {
  return (
    <div className="max-w-3xl mx-auto divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm dark:border-gray-700 dark:divide-gray-700">
      <div className="grid grid-cols-2 bg-gray-50 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest dark:bg-gray-800/60">
        <div className="px-5 py-3 border-r border-gray-100 flex items-center gap-2 dark:border-gray-700"><X size={13} className="text-red-400" /> {beforeLabel}</div>
        <div className="px-5 py-3 flex items-center gap-2"><Check size={13} className="text-green-500" /> {afterLabel}</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 text-sm hover:bg-gray-50 transition-colors dark:hover:bg-gray-800">
          <div className="px-5 py-3.5 text-gray-500 border-r border-gray-100 flex items-start gap-2 dark:border-gray-700 dark:text-gray-400"><X size={13} className="text-red-400 shrink-0 mt-0.5" />{r.before}</div>
          <div className="px-5 py-3.5 text-gray-800 flex items-start gap-2 dark:text-gray-100"><Check size={13} className="text-green-500 shrink-0 mt-0.5" />{r.after}</div>
        </div>
      ))}
    </div>
  );
}

export type Tile = { abbr: string; name: string; category: string; desc: string; tags: string[]; href?: string };

export function TileGrid({ groups }: { groups: { label: string; dot: string; tiles: Tile[] }[] }) {
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.dot }} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">{g.label}</h3>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">{g.tiles.length}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {g.tiles.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden animate-card-rise dark:bg-gray-900 dark:border-gray-700">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(circle at top left, ${g.dot}22, transparent 65%)` }} />
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: g.dot }}>{t.abbr}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm leading-tight dark:text-gray-50">{t.name}</div>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block bg-coffee-50 text-coffee-700 dark:bg-coffee-900/40 dark:text-coffee-200">{t.category}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed relative dark:text-gray-400">{t.desc}</p>
                <div className="flex flex-wrap gap-1 relative">
                  {t.tags.map((m) => (
                    <span key={m} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded dark:text-gray-400 dark:bg-gray-800/60 dark:border-gray-700">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PipelineFlow({ left, right, hub = "DataLatte", sub }: { left: { title: string; text: string }[]; right: { title: string; text: string }[]; hub?: string; sub: string }) {
  return (
    <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
      <div className="space-y-3">
        {left.map((n) => (
          <div key={n.title} className="rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 flex gap-3 items-start">
            <span className="w-1 self-stretch rounded bg-coffee-500" />
            <div><div className="text-sm font-semibold text-white">{n.title}</div><div className="text-xs text-gray-400 mt-0.5">{n.text}</div></div>
          </div>
        ))}
      </div>
      <div className="mx-auto w-40 h-40 rounded-full bg-coffee-900/60 border-2 border-coffee-600 flex flex-col items-center justify-center text-center animate-float shadow-[0_0_60px_rgba(176,125,77,.35)]">
        <div className="text-4xl">☕</div>
        <div className="text-sm font-bold text-white mt-1">{hub}</div>
        <div className="text-[10px] text-coffee-300">{sub}</div>
      </div>
      <div className="space-y-3">
        {right.map((n) => (
          <div key={n.title} className="rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 flex gap-3 items-start">
            <span className="w-1 self-stretch rounded bg-green-400" />
            <div><div className="text-sm font-semibold text-white">{n.title}</div><div className="text-xs text-gray-400 mt-0.5">{n.text}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
