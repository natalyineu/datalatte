import type { MetadataRoute } from "next";
import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";

export async function GET(request: Request) {
  const sitemapData: MetadataRoute.Sitemap = sitemap();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapData
    .map(({ url, lastModified, changeFrequency, priority }) => {
      const date = lastModified ? (lastModified instanceof Date ? lastModified : new Date(lastModified)) : new Date();
      const dateString = date.toISOString().split("T")[0];
      return `
  <url>
    <loc>${url}</loc>
    <lastModified>${dateString}</lastModified>
    <changeFrequency>${changeFrequency}</changeFrequency>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}