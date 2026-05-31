import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE = "https://datalatte.pro";
const CONTENT_DIR = path.join(process.cwd(), "content/blog");

interface PostMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
  author: string;
  image?: string;
  category?: string;
}

function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: PostMeta[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      if (!data.title || !data.date || !data.slug) continue;
      posts.push({
        title: data.title,
        date: data.date,
        description: data.description ?? "",
        slug: data.slug,
        author: data.author ?? "Nataliia",
        image: data.image,
        category: data.category,
      });
    } catch {
      // skip malformed files
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts().slice(0, 100); // cap at 100 most recent

  const items = posts
    .map((post) => {
      const url = `${BASE}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>hello@datalatte.pro (${escapeXml(post.author)})</author>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.image ? `<enclosure url="${escapeXml(post.image)}" type="image/jpeg" length="0" />` : ""}
    </item>`.trim();
    })
    .join("\n    ");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DataLatte Blog — Local Marketing for Small Businesses</title>
    <link>${BASE}/blog</link>
    <description>Data-driven local marketing tips for coffee shops, hair salons, pet groomers, and fitness studios. Google Ads, Meta Ads, local SEO, CTV advertising and more.</description>
    <language>en-us</language>
    <managingEditor>hello@datalatte.pro (Nataliia)</managingEditor>
    <webMaster>hello@datalatte.pro (Nataliia)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE}/images/logo.png</url>
      <title>DataLatte</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
