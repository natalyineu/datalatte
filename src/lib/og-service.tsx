import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const SERVICES: Record<string, { title: string; icon: string; tagline: string }> = {
  "google-ads":              { title: "Google Ads Management",        icon: "🔍", tagline: "Get found first when locals search for you" },
  "meta-ads":                { title: "Meta Ads",                     icon: "📱", tagline: "Facebook & Instagram ads that fill your calendar" },
  "local-seo":               { title: "Local SEO",                    icon: "📍", tagline: "Rank higher in local search — get more walk-ins" },
  "google-business-profile": { title: "Google Business Profile",      icon: "🗺️", tagline: "Own your local presence on Google Maps" },
  "analytics":               { title: "Analytics & Reporting",        icon: "📊", tagline: "Know exactly what's working and what isn't" },
  "ai-agents":               { title: "AI Agents & Automation",       icon: "🤖", tagline: "Automate follow-ups, bookings & more 24/7" },
  "email-sms":               { title: "Email & SMS Marketing",        icon: "📧", tagline: "Keep customers coming back with smart campaigns" },
  "social-media":            { title: "Social Media Management",      icon: "📲", tagline: "Stay top-of-mind with content that converts" },
  "website":                 { title: "Website & Landing Pages",      icon: "🌐", tagline: "Fast, beautiful pages built to convert visitors" },
  "programmatic":            { title: "Programmatic Advertising",     icon: "📡", tagline: "Reach your ideal customer across the whole web" },
  "content-marketing":       { title: "Content Marketing",            icon: "✍️", tagline: "Build authority with content that ranks & converts" },
  "competitor-analysis":     { title: "Competitor Analysis",          icon: "🔎", tagline: "See exactly what your competitors are doing" },
  "cro":                     { title: "Conversion Rate Optimisation", icon: "🎯", tagline: "Turn more visitors into paying customers" },
  "reputation-management":   { title: "Reputation Management",        icon: "⭐", tagline: "Build trust with more 5-star reviews" },
  "tiktok-ads":              { title: "TikTok Ads",                   icon: "🎵", tagline: "Reach younger locals where they spend their time" },
  "video-marketing":         { title: "Video Marketing",              icon: "🎬", tagline: "Tell your story with video that drives results" },
};

export function generateServiceOg(slug: string): ImageResponse {
  const service = SERVICES[slug] ?? { title: "Marketing Services", icon: "📣", tagline: "Data-driven marketing for local businesses" };

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #1a0f08 0%, #2c1810 40%, #4a2c17 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top caramel accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #8B5E3C 0%, #d4956a 50%, #8B5E3C 100%)" }} />

        {/* Large icon watermark bottom-right */}
        <div style={{ position: "absolute", bottom: -10, right: 60, fontSize: 180, opacity: 0.06, lineHeight: 1 }}>
          {service.icon}
        </div>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", border: "40px solid rgba(212,149,106,0.08)" }} />
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", border: "25px solid rgba(212,149,106,0.05)" }} />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <span style={{ fontSize: 36 }}>☕</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#d4956a" }}>DataLatte</span>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.45)", marginLeft: 4 }}>datalatte.pro</span>
        </div>

        {/* "Service" label */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <div style={{
            background: "rgba(212,149,106,0.18)",
            border: "1px solid rgba(212,149,106,0.35)",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: "#d4956a",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ fontSize: 15 }}>{service.icon}</span>
            Our Service
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: service.title.length > 30 ? 52 : 60,
          fontWeight: 800,
          color: "#f5ede4",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 20,
          maxHeight: 200,
          overflow: "hidden",
        }}>
          {service.title}
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 22,
          color: "rgba(245,237,228,0.6)",
          lineHeight: 1.5,
          maxHeight: 70,
          overflow: "hidden",
        }}>
          {service.tagline}
        </div>

        {/* Bottom bar — absolutely pinned */}
        <div style={{ position: "absolute", bottom: 60, left: 72, right: 72, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(212,149,106,0.2)", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(212,149,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#d4956a", fontWeight: 700 }}>N</div>
            <span style={{ color: "rgba(245,237,228,0.7)", fontSize: 15 }}>Nataliia Makota · DataLatte</span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.6)", fontWeight: 500 }}>Local Marketing Services</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
