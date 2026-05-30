import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const contentDir = path.join(process.cwd(), "content/blog");

const CATEGORY_ICONS: Record<string, string> = {
  "google ads":           "🔍",
  "microsoft ads":        "🔍",
  "youtube ads":          "▶️",
  "programmatic":         "📡",
  "retargeting":          "🎯",
  "ctv":                  "📺",
  "audio advertising":    "🎙️",
  "meta ads":             "📱",
  "facebook":             "📱",
  "instagram":            "📸",
  "tiktok":               "🎵",
  "snapchat":             "👻",
  "pinterest":            "📌",
  "local seo":            "📍",
  "google business":      "🗺️",
  "reputation":           "⭐",
  "analytics":            "📊",
  "ai & automation":      "🤖",
  "marketing automation": "🤖",
  "email":                "📧",
  "sms":                  "💬",
  "social media":         "📲",
  "content marketing":    "✍️",
  "website":              "🌐",
  "landing page":         "🌐",
  "coffee shop":          "☕",
  "fitness":              "🏋️",
  "hair salon":           "✂️",
  "pet":                  "🐾",
};

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📣";
}

export default async function BlogOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(contentDir, `${slug}.mdx`);

  let title = "DataLatte Blog";
  let category = "Marketing";
  let description = "Data-driven local marketing insights";

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      if (data.title) title = data.title as string;
      if (data.category) category = data.category as string;
      if (data.description) description = data.description as string;
    }
  } catch { /* fall back to defaults */ }

  const icon = getCategoryIcon(category);
  const shortTitle = title.length > 72 ? title.slice(0, 70) + "…" : title;
  const shortDesc = description.length > 110 ? description.slice(0, 108) + "…" : description;
  const titleFontSize = shortTitle.length > 55 ? 40 : shortTitle.length > 38 ? 46 : 52;

  // Coffee brand palette — no external brand colors
  const caramel = "#d4956a";
  const caramelDim = "rgba(212,149,106,0.18)";
  const caramelBorder = "rgba(212,149,106,0.35)";

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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #8B5E3C 0%, #d4956a 50%, #8B5E3C 100%)",
          }}
        />

        {/* Large icon watermark bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            right: 60,
            fontSize: 180,
            opacity: 0.06,
            lineHeight: 1,
          }}
        >
          {icon}
        </div>

        {/* Decorative circles top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "40px solid rgba(212,149,106,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "25px solid rgba(212,149,106,0.05)",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <span style={{ fontSize: 36 }}>☕</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: caramel }}>DataLatte</span>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.45)", marginLeft: 4 }}>datalatte.pro</span>
        </div>

        {/* Category badge — coffee colors only */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <div
            style={{
              background: caramelDim,
              border: `1px solid ${caramelBorder}`,
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: caramel,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15 }}>{icon}</span>
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            color: "#f5ede4",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            maxHeight: 220,
            overflow: "hidden",
          }}
        >
          {shortTitle}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 17,
            color: "rgba(245,237,228,0.55)",
            lineHeight: 1.5,
            marginBottom: 32,
            maxHeight: 80,
            overflow: "hidden",
          }}
        >
          {shortDesc}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(212,149,106,0.2)",
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(212,149,106,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#d4956a",
                fontWeight: 700,
              }}
            >
              N
            </div>
            <span style={{ color: "rgba(245,237,228,0.7)", fontSize: 15 }}>
              Nataliia Makota · DataLatte
            </span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.6)", fontWeight: 500 }}>
            Local Marketing Insights
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
