import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #2c1810 0%, #4a2c17 50%, #7c4a2d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{ fontSize: 64 }}>☕</span>
          <span style={{ fontSize: 56, fontWeight: 800, color: "#d4956a" }}>DataLatte</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Data-Driven Digital Marketing for Local Businesses
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#c4956a",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Google Ads · Meta Ads · SEO · Programmatic · Analytics
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 20,
            color: "#8a6a50",
          }}
        >
          datalatte.pro
        </div>
      </div>
    ),
    { ...size }
  );
}
