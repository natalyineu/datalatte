import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INDEX_PATH = path.join(process.cwd(), "content/blog/INDEX.md");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  wordCount: number;
  tags: string[];
  url: string;
}

function parseIndexMd(): ArticleMeta[] {
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  const lines = raw.split("\n");

  // Find the table header line
  const headerIdx = lines.findIndex((l) => l.startsWith("| Slug"));
  if (headerIdx === -1) return [];

  // Data rows start after header + separator
  const dataLines = lines.slice(headerIdx + 2).filter((l) => l.startsWith("|"));

  return dataLines.map((line) => {
    // | `slug` | Title | Date | Words | Tags |
    const cols = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

    if (cols.length < 5) return null;

    const slug = cols[0].replace(/`/g, "");
    const title = cols[1];
    const date = cols[2];
    const wordCount = parseInt(cols[3], 10) || 0;
    const tags = cols[4]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return {
      slug,
      title,
      date,
      wordCount,
      tags,
      url: `https://datalatte.pro/blog/${slug}`,
    } as ArticleMeta;
  }).filter((a): a is ArticleMeta => a !== null);
}

export async function GET(): Promise<NextResponse> {
  try {
    const articles = parseIndexMd();
    return NextResponse.json({ articles, total: articles.length }, { status: 200 });
  } catch (err) {
    console.error("Articles read error:", err);
    return NextResponse.json({ error: "Failed to read articles index" }, { status: 500 });
  }
}
