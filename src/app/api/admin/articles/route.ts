import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  wordCount: number;
  category: string;
  tags: string[];
  url: string;
}

function scanMdxFiles(): ArticleMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    if (file === "INDEX.md") continue;
    const slug = file.replace(/\.mdx$/, "");
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      // Rough word count from content body
      const wordCount = content.trim().split(/\s+/).length;
      // gray-matter parses unquoted YAML dates as JS Date objects
      const rawDate = data.date;
      const date = rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : String(rawDate ?? "");
      articles.push({
        slug,
        title: String(data.title ?? slug),
        date,
        wordCount,
        category: String(data.category ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        url: `https://datalatte.pro/blog/${slug}`,
      });
    } catch {
      // skip unreadable files
    }
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  try {
    const articles = scanMdxFiles();
    return NextResponse.json({ articles, total: articles.length }, { status: 200 });
  } catch (err) {
    console.error("Articles scan error:", err);
    return NextResponse.json({ error: "Failed to scan articles" }, { status: 500 });
  }
}
