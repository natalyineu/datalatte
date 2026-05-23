"use client";

const CHANNEL_GROUPS = [
  { label: "Paid Advertising",    sources: ["Google Ads", "Meta Ads", "TikTok Ads", "Programmatic"], color: "#4285F4", bg: "#1e3a6e" },
  { label: "Search & Local SEO",  sources: ["Search Console", "Google Business Profile"],             color: "#34A853", bg: "#1a3d2b" },
  { label: "Analytics & Social",  sources: ["GA4", "Instagram", "Facebook Page"],                    color: "#E8710A", bg: "#4a2200" },
  { label: "Email & Retention",   sources: ["Email", "SMS", "CRM"],                                  color: "#7C3AED", bg: "#2d1a4a" },
];

const OUTPUTS = [
  { emoji: "📧", name: "Weekly Email Brief",    timing: "Every Monday 8am" },
  { emoji: "📊", name: "Live Dashboard",        timing: "Real-time"        },
  { emoji: "📄", name: "Monthly PDF Report",    timing: "1st of the month" },
  { emoji: "🔔", name: "Instant Alerts",        timing: "As it happens"    },
  { emoji: "💬", name: "Strategy Call",         timing: "45 min / month"   },
];

function Pipe({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <div className="hidden lg:block relative h-px bg-gray-800 flex-1 mx-2 overflow-visible">
      <div className="flow-packet"         style={{ backgroundColor: color, animationDelay: `${delay}s`       }} />
      <div className="flow-packet flow-packet-2" style={{ backgroundColor: color, animationDelay: `${delay + 0.8}s` }} />
      <div className="flow-packet flow-packet-3" style={{ backgroundColor: color, animationDelay: `${delay + 1.6}s` }} />
    </div>
  );
}

function OutPipe({ delay = 0 }: { delay?: number }) {
  return (
    <div className="hidden lg:block relative h-px bg-gray-800 flex-1 mx-2 overflow-visible">
      <div className="flow-packet"         style={{ backgroundColor: "#92652a", animationDelay: `${delay + 1.2}s` }} />
      <div className="flow-packet flow-packet-2" style={{ backgroundColor: "#92652a", animationDelay: `${delay + 2.0}s` }} />
    </div>
  );
}

export default function ReportingFlow() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Desktop: 3-column flow layout ── */}
      <div className="hidden lg:grid grid-cols-[1fr,160px,1fr] gap-0 items-center">

        {/* Left: Sources */}
        <div className="space-y-3 pr-2">
          {CHANNEL_GROUPS.map((group, i) => (
            <div key={group.label} className="flex items-center">
              <div
                className="flex-1 rounded-xl p-4 flex items-center gap-3 border border-gray-700/60 transition-all duration-300 hover:border-gray-600 group"
                style={{ backgroundColor: group.bg + "99" }}
              >
                <div
                  className="w-2.5 h-10 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: group.color }}
                />
                <div>
                  <div className="text-white text-sm font-semibold">{group.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                    {group.sources.join(" · ")}
                  </div>
                </div>
              </div>
              <Pipe color={group.color} delay={i * 0.3} />
            </div>
          ))}
        </div>

        {/* Center: Hub */}
        <div className="flex flex-col items-center justify-center py-4">
          {/* Dot trail in */}
          <div className="flex gap-1.5 mb-4 -rotate-90">
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-700 dot-travel-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-600 dot-travel-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-500 dot-travel-3" />
          </div>

          {/* Hub */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-coffee-500/20 blur-2xl animate-hub-breathe scale-150" />
            {/* Rotating ring 1 */}
            <div className="absolute inset-[-12px] rounded-full border border-dashed border-coffee-600/30 animate-rotate-slow" />
            {/* Rotating ring 2 */}
            <div className="absolute inset-[-22px] rounded-full border border-dotted border-coffee-800/20 animate-rotate-slow-r" />
            {/* Ping */}
            <div className="absolute inset-0 rounded-full bg-coffee-500/10 animate-ping-slow" />

            {/* Core */}
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-b from-coffee-700 to-coffee-900 border border-coffee-600/60 flex flex-col items-center justify-center shadow-2xl">
              <div className="text-4xl mb-1 animate-float">☕</div>
              <div className="text-white text-[11px] font-bold leading-tight text-center">DataLatte</div>
              <div className="text-coffee-300 text-[9px] mt-0.5">Analytics Hub</div>
            </div>
          </div>

          {/* Dot trail out */}
          <div className="flex gap-1.5 mt-4 -rotate-90">
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-500 dot-travel-3" />
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-600 dot-travel-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-coffee-700 dot-travel-1" />
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="space-y-3 pl-2">
          {OUTPUTS.map((output, i) => (
            <div key={output.name} className="flex items-center">
              <OutPipe delay={i * 0.25} />
              <div
                className="flex-1 bg-gray-900 border border-gray-700/60 rounded-xl p-3.5 flex items-center gap-3 animate-card-rise hover:border-gray-600 transition-colors"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <span className="text-2xl shrink-0">{output.emoji}</span>
                <div>
                  <div className="text-white text-sm font-semibold leading-tight">{output.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{output.timing}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="lg:hidden space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">Your Channels</div>
          {CHANNEL_GROUPS.map((group) => (
            <div
              key={group.label}
              className="rounded-xl p-4 flex items-center gap-3 border border-gray-700/60"
              style={{ backgroundColor: group.bg + "99" }}
            >
              <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
              <div>
                <div className="text-white text-sm font-semibold">{group.label}</div>
                <div className="text-gray-400 text-xs">{group.sources.join(" · ")}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-coffee-700 to-coffee-900 border border-coffee-600/60 flex flex-col items-center justify-center">
            <div className="text-3xl">☕</div>
            <div className="text-white text-[10px] font-bold">DataLatte</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">Your Reports</div>
          {OUTPUTS.map((output) => (
            <div key={output.name} className="bg-gray-900 border border-gray-700/60 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-xl">{output.emoji}</span>
              <div>
                <div className="text-white text-sm font-semibold">{output.name}</div>
                <div className="text-gray-500 text-xs">{output.timing}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
