/**
 * SNS Auto-Post Script
 * - X(Twitter) と Instagram にスパイク紹介を自動投稿
 * - OGP画像 (/api/og) を取得して画像付き投稿として使用
 *
 * 使い方:
 *   npx tsx scripts/post-sns.ts                  # 今日のローテーション
 *   npx tsx scripts/post-sns.ts <slug>           # 特定スパイク
 *   npx tsx scripts/post-sns.ts --dry-run        # 投稿せずに本文確認
 *   npx tsx scripts/post-sns.ts --x-only         # Xだけ
 *   npx tsx scripts/post-sns.ts --ig-only        # Instagramだけ
 */
import { TwitterApi } from "twitter-api-v2";
import spikesJson from "../data/spikes.json";
import type { Spike } from "../lib/types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://soccer-spike-site.vercel.app")
  .trim()
  .replace(/\/+$/, "");
const spikes = spikesJson as Spike[];

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));
const DRY_RUN = flags.has("--dry-run");
const X_ONLY = flags.has("--x-only");
const IG_ONLY = flags.has("--ig-only");

function pickSpike(): Spike {
  const slug = positional[0];
  if (slug) {
    const found = spikes.find((s) => s.slug === slug);
    if (!found) throw new Error(`Spike not found: ${slug}`);
    return found;
  }
  const dayIdx = Math.floor(Date.now() / 86400000) % spikes.length;
  return spikes[dayIdx];
}

const TEMPLATES = [
  (s: Spike, url: string) =>
    [
      `⚽ 今日のおすすめスパイク`,
      ``,
      `${s.name}`,
      `💴 ¥${s.price.toLocaleString()}　★${s.rating.toFixed(1)}`,
      `▼ 特徴`,
      ...s.features.slice(0, 3).map((f) => `・${f}`),
      ``,
      `▶ レビューはこちら`,
      url
    ].join("\n"),
  (s: Spike, url: string) =>
    [
      `🔥 ${s.brand.toUpperCase()}最新作レビュー`,
      ``,
      `${s.name}`,
      `重量${s.weightGrams}g / ${s.upper}`,
      ``,
      `${s.pros[0]}`,
      ``,
      url
    ].join("\n"),
  (s: Spike, url: string) =>
    [
      `【${s.ageTarget.includes("elementary") ? "小学生" : s.ageTarget.includes("junior") ? "中学生" : s.ageTarget.includes("high") ? "高校生" : "大人"}向け】`,
      `${s.name}`,
      `¥${s.price.toLocaleString()} / ${s.ground.join("・").toUpperCase()}対応`,
      ``,
      `${s.review.slice(0, 60)}...`,
      ``,
      url
    ].join("\n")
];

function buildText(s: Spike): string {
  const url = `${SITE_URL}/spikes/${s.slug}`;
  const tplIdx = Math.floor(Date.now() / 86400000) % TEMPLATES.length;
  const body = TEMPLATES[tplIdx](s, url);
  const tags = ["#サッカースパイク", `#${s.brand}`, ...s.features.slice(0, 2).map((f) => `#${f.replace(/\s/g, "")}`)].join(" ");
  return `${body}\n\n${tags}`;
}

function ogImageUrl(s: Spike): string {
  const params = new URLSearchParams({
    title: s.name,
    subtitle: `¥${s.price.toLocaleString()} / ★${s.rating.toFixed(1)}`
  });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OG fetch failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function postToX(text: string, imageBuf: Buffer) {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    console.warn("[X] credentials missing - skipping");
    return;
  }
  const client = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET
  });
  const mediaId = await client.v1.uploadMedia(imageBuf, { mimeType: "image/png" });
  const tweet = await client.v2.tweet({ text, media: { media_ids: [mediaId] } });
  console.log("[X] posted:", tweet.data.id);
}

async function postToInstagram(caption: string, imageUrl: string) {
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ID } = process.env;
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ID) {
    console.warn("[IG] credentials missing - skipping");
    return;
  }
  const createUrl = `https://graph.facebook.com/v19.0/${INSTAGRAM_BUSINESS_ID}/media`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: INSTAGRAM_ACCESS_TOKEN })
  });
  const createJson = (await createRes.json()) as { id?: string };
  if (!createJson.id) throw new Error(`IG create failed: ${JSON.stringify(createJson)}`);
  const publishUrl = `https://graph.facebook.com/v19.0/${INSTAGRAM_BUSINESS_ID}/media_publish`;
  const pubRes = await fetch(publishUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: createJson.id, access_token: INSTAGRAM_ACCESS_TOKEN })
  });
  console.log("[IG] posted:", await pubRes.json());
}

async function main() {
  const spike = pickSpike();
  const text = buildText(spike);
  const imageUrl = ogImageUrl(spike);

  console.log("==============================");
  console.log("Target:", spike.slug);
  console.log("Image :", imageUrl);
  console.log("------- text -------");
  console.log(text);
  console.log("==============================");

  if (DRY_RUN) {
    console.log("[dry-run] 投稿しません");
    return;
  }

  const tasks: Promise<unknown>[] = [];
  if (!IG_ONLY) {
    const imgBuf = await fetchImageBuffer(imageUrl);
    tasks.push(postToX(text, imgBuf));
  }
  if (!X_ONLY) tasks.push(postToInstagram(text, imageUrl));

  const results = await Promise.allSettled(tasks);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[task ${i}] failed:`, r.reason);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
