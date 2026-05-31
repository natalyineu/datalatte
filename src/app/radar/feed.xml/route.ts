import { fetchPublishedSignals } from "@/lib/radar-signals";

const BASE = "https://datalatte.pro";

export const revalidate = 21600; // 6 hours

export async function GET() {
  const signals = await fetchPublishedSignals();

  const items = signals
    .slice(0, 50)
    .map((s) => {
      const url = `${BASE}/radar/${s.slug}`;
      const body = s.body.join("\n\n");
      const content = `${s.summary}\n\n${body}\n\n💡 ${s.insight}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `
  <item>
    <title><![CDATA[${s.headline}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(s.date).toUTCString()}</pubDate>
    <category>${s.category}</category>
    <description><![CDATA[${s.summary}]]></description>
    <content:encoded><![CDATA[${content}]]></content:encoded>
    <dc:creator>Nataliia · DataLatte</dc:creator>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DataLatte Value Radar — Daily Marketing Signals</title>
    <link>${BASE}/radar</link>
    <atom:link href="${BASE}/radar/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Daily marketing intelligence for local businesses — Google updates, Meta Ads, AI tools, TikTok, SEO and CTV signals decoded for coffee shops, salons, pet groomers and fitness studios.</description>
    <language>en-us</language>
    <ttl>360</ttl>
    <image>
      <url>${BASE}/images/og-default.png</url>
      <title>DataLatte Value Radar</title>
      <link>${BASE}/radar</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
    },
  });
}
