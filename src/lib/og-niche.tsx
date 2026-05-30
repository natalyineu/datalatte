import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const NICHES: Record<string, { title: string; icon: string; tagline: string }> = {
  "coffee-shops":       { title: "Marketing for Coffee Shops",        icon: "☕", tagline: "Attract more regulars and beat the big chains" },
  "hair-salons":        { title: "Marketing for Hair Salons",         icon: "✂️", tagline: "Fill your chair with loyal, high-value clients" },
  "pet-groomers":       { title: "Marketing for Pet Groomers",        icon: "🐾", tagline: "Grow your bookings with pet owners nearby" },
  "fitness-studios":    { title: "Marketing for Fitness Studios",     icon: "🏋️", tagline: "Pack your classes and reduce member churn" },
  "barbershops":        { title: "Marketing for Barbershops",         icon: "💈", tagline: "Keep your chairs busy all week long" },
  "dentists":           { title: "Marketing for Dentists",            icon: "🦷", tagline: "Attract new patients and reduce no-shows" },
  "restaurants":        { title: "Marketing for Restaurants",         icon: "🍽️", tagline: "Drive more covers and repeat visits" },
  "yoga-studios":       { title: "Marketing for Yoga Studios",        icon: "🧘", tagline: "Grow your community and fill every class" },
  "nail-salons":        { title: "Marketing for Nail Salons",         icon: "💅", tagline: "Turn walk-ins into loyal regulars" },
  "cleaning-services":  { title: "Marketing for Cleaning Services",   icon: "🧹", tagline: "Book more recurring clients on autopilot" },
  "electricians":       { title: "Marketing for Electricians",        icon: "⚡", tagline: "Get more local leads without word-of-mouth alone" },
  "plumbers":           { title: "Marketing for Plumbers",            icon: "🔧", tagline: "Be the first call when locals need help" },
  "real-estate-agents": { title: "Marketing for Real Estate Agents",  icon: "🏠", tagline: "Generate more listings and buyer inquiries" },
  "multi-location":     { title: "Multi-Location Business Marketing", icon: "🏢", tagline: "Scale your marketing across every location" },
  "enterprise":         { title: "Enterprise Local Marketing",        icon: "🏛️", tagline: "Data-driven growth for established businesses" },
  "freelancers":        { title: "Marketing for Freelancers",         icon: "💼", tagline: "Build your personal brand and attract clients" },
  "startups":           { title: "Marketing for Startups",            icon: "🚀", tagline: "Get your first 100 local customers faster" },
  "medium-business":    { title: "Marketing for Growing Businesses",  icon: "📈", tagline: "Scale what works, cut what doesn't" },
};

export function generateNicheOg(slug: string): ImageResponse {
  const niche = NICHES[slug] ?? { title: "Local Business Marketing", icon: "📣", tagline: "Data-driven marketing for local businesses" };

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
          {niche.icon}
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

        {/* Niche label */}
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
            <span style={{ fontSize: 15 }}>{niche.icon}</span>
            Local Marketing
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: niche.title.length > 35 ? 48 : 56,
          fontWeight: 800,
          color: "#f5ede4",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 20,
          maxHeight: 210,
          overflow: "hidden",
        }}>
          {niche.title}
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 22,
          color: "rgba(245,237,228,0.6)",
          lineHeight: 1.5,
          maxHeight: 70,
          overflow: "hidden",
        }}>
          {niche.tagline}
        </div>

        {/* Bottom bar — absolutely pinned */}
        <div style={{ position: "absolute", bottom: 60, left: 72, right: 72, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(212,149,106,0.2)", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(212,149,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#d4956a", fontWeight: 700 }}>N</div>
            <span style={{ color: "rgba(245,237,228,0.7)", fontSize: 15 }}>Nataliia Makota · DataLatte</span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.6)", fontWeight: 500 }}>Data-Driven Local Marketing</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
