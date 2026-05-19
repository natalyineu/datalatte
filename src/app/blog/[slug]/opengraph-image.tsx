import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const contentDir = path.join(process.cwd(), "content/blog");

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

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    if (data.title) title = data.title as string;
    if (data.category) category = data.category as string;
    if (data.description) description = data.description as string;
  }

  // Truncate long titles gracefully
  const shortTitle = title.length > 72 ? title.slice(0, 70) + "…" : title;
  const shortDesc = description.length > 110 ? description.slice(0, 108) + "…" : description;

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
        {/* Decorative coffee ring top-right */}
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
          <span style={{ fontSize: 30, fontWeight: 700, color: "#d4956a" }}>DataLatte</span>
          <span style={{ fontSize: 14, color: "rgba(212,149,106,0.5)", marginLeft: 4 }}>datalatte.pro</span>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "rgba(212,149,106,0.15)",
              border: "1px solid rgba(212,149,106,0.3)",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: "#d4956a",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: shortTitle.length > 50 ? 40 : 48,
            fontWeight: 800,
            color: "#f5ede4",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {shortTitle}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(245,237,228,0.6)",
            lineHeight: 1.5,
            marginBottom: 40,
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
              }}
            >
              N
            </div>
            <span style={{ color: "rgba(245,237,228,0.7)", fontSize: 15 }}>
              Nataliia Makota · DataLatte
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,149,106,0.6)",
              fontWeight: 500,
            }}
          >
            Local Marketing Insights
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
