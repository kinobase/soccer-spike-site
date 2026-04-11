import { posts } from "@/lib/data";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
      <category>${escape(p.category)}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>サッカースパイクの選び方・最新情報</description>
    <language>ja</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
