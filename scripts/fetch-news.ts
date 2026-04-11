/**
 * News Auto-Fetcher
 * - 外部RSS/Atomフィードからサッカースパイク関連の最新ニュースを取得
 * - data/posts.json に新規エントリを自動追加（重複は無視）
 *
 * 使い方:
 *   npx tsx scripts/fetch-news.ts            # 取得して書き込み
 *   npx tsx scripts/fetch-news.ts --dry-run  # 取得結果のみ表示
 *
 * フィードURLは FEEDS 配列で管理。RSS / Atom 両対応のシンプルパーサ。
 */
import { promises as fs } from "fs";
import path from "path";
import type { Post } from "../lib/types";

const DRY_RUN = process.argv.includes("--dry-run");
const POSTS_FILE = path.resolve(process.cwd(), "data/posts.json");

// 取得対象のフィード（公開RSSのみ。商用利用前に各サイトの規約を確認のこと）
const FEEDS: { url: string; category: string }[] = [
  { url: "https://www.footyheadlines.com/feeds/posts/default?alt=rss", category: "ニュース" }
];

// キーワードフィルタ: スパイク関連のみに絞る
const KEYWORDS = ["boot", "cleat", "spike", "mercurial", "phantom", "predator", "tiempo", "morelia", "future", "ultra", "copa", "nike", "adidas", "puma", "mizuno"];

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));

type Item = { title: string; link: string; description: string; pubDate: string };

function parseFeed(xml: string): Item[] {
  const items: Item[] = [];
  // RSS <item>
  const rssItems = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of rssItems) {
    const title = decode(stripHtml((block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "")));
    const link = decode((block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "").trim());
    const description = decode(stripHtml(block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || ""));
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || new Date().toUTCString()).trim();
    if (title && link) items.push({ title, link, description, pubDate });
  }
  // Atom <entry> fallback
  if (items.length === 0) {
    const atomEntries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
    for (const block of atomEntries) {
      const title = decode(stripHtml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ""));
      const link = (block.match(/<link[^>]*href="([^"]+)"/i)?.[1] || "").trim();
      const description = decode(stripHtml(block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || ""));
      const pubDate = (block.match(/<updated>([\s\S]*?)<\/updated>/i)?.[1] || new Date().toISOString()).trim();
      if (title && link) items.push({ title, link, description, pubDate });
    }
  }
  return items;
}

async function fetchFeed(url: string): Promise<Item[]> {
  const res = await fetch(url, { headers: { "User-Agent": "soccer-spike-site/1.0" } });
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  const xml = await res.text();
  return parseFeed(xml);
}

function isRelevant(item: Item): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return KEYWORDS.some((k) => text.includes(k));
}

function toPost(item: Item, category: string): Post {
  return {
    slug: slugify(item.title) || `news-${Date.now()}`,
    title: item.title,
    description: item.description.slice(0, 140) || item.title,
    category,
    publishedAt: new Date(item.pubDate).toISOString().slice(0, 10),
    body: `${item.description}\n\n出典: ${item.link}`
  };
}

async function main() {
  const raw = await fs.readFile(POSTS_FILE, "utf-8");
  const existing: Post[] = JSON.parse(raw);
  const existingSlugs = new Set(existing.map((p) => p.slug));

  const fetched: Post[] = [];
  for (const f of FEEDS) {
    try {
      const items = await fetchFeed(f.url);
      for (const it of items) {
        if (!isRelevant(it)) continue;
        const post = toPost(it, f.category);
        if (existingSlugs.has(post.slug)) continue;
        fetched.push(post);
        existingSlugs.add(post.slug);
      }
    } catch (e) {
      console.warn(`feed failed: ${f.url}`, (e as Error).message);
    }
  }

  console.log(`fetched ${fetched.length} new posts`);
  fetched.slice(0, 10).forEach((p) => console.log(`  + ${p.slug} :: ${p.title}`));

  if (DRY_RUN || fetched.length === 0) {
    if (DRY_RUN) console.log("[dry-run] not writing");
    return;
  }

  const merged = [...fetched, ...existing];
  await fs.writeFile(POSTS_FILE, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`✅ data/posts.json updated (+${fetched.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
