/**
 * SNS投稿の共有ロジック
 * - CLIスクリプト(scripts/post-sns.ts)とVercel Cronルート(app/api/cron/post-sns)の両方から利用
 * - X(Twitter) と Instagram にスパイク紹介を投稿
 */
import { TwitterApi } from "twitter-api-v2";
import spikesJson from "../data/spikes.json";
import type { Spike } from "./types";

const spikes = spikesJson as Spike[];

/** 末尾の改行・スラッシュを除去した本番サイトURL（未設定時は本番URLにフォールバック） */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://soccer-spike-site.vercel.app")
    .trim()
    .replace(/\/+$/, "");
}

/** slug指定があればそれを、無ければ日替わりローテーションでスパイクを選ぶ */
export function pickDailySpike(slug?: string): Spike {
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

export function buildPostText(s: Spike): string {
  const url = `${getSiteUrl()}/spikes/${s.slug}`;
  const tplIdx = Math.floor(Date.now() / 86400000) % TEMPLATES.length;
  const body = TEMPLATES[tplIdx](s, url);
  const tags = ["#サッカースパイク", `#${s.brand}`, ...s.features.slice(0, 2).map((f) => `#${f.replace(/\s/g, "")}`)].join(" ");
  return `${body}\n\n${tags}`;
}

export function ogImageUrl(s: Spike): string {
  const params = new URLSearchParams({
    title: s.name,
    subtitle: `¥${s.price.toLocaleString()} / ★${s.rating.toFixed(1)}`
  });
  return `${getSiteUrl()}/api/og?${params.toString()}`;
}

/**
 * OG画像はデプロイ直後などに一時的に取得失敗することがある。
 * リトライ＋タイムアウトで粘り、最終的にダメでも null を返して投稿自体は止めない。
 */
export async function fetchImageBuffer(url: string, retries = 3): Promise<Buffer | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`status ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      console.warn(`[og] 画像取得 失敗 ${attempt}/${retries}: ${(e as Error).message}`);
      if (attempt < retries) await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
  console.warn("[og] 画像を取得できず → Xはテキストのみで投稿します");
  return null;
}

export type PostOutcome = { posted: boolean; id?: string; skipped?: string; error?: string };

export async function postToX(text: string, imageBuf: Buffer | null): Promise<PostOutcome> {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    console.warn("[X] credentials missing - skipping");
    return { posted: false, skipped: "credentials missing" };
  }
  const client = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET
  });
  // 画像が取得できていれば画像付き、ダメならテキストのみで投稿
  if (imageBuf) {
    const mediaId = await client.v1.uploadMedia(imageBuf, { mimeType: "image/png" });
    const tweet = await client.v2.tweet({ text, media: { media_ids: [mediaId] as [string] } });
    console.log("[X] posted (image):", tweet.data.id);
    return { posted: true, id: tweet.data.id };
  }
  const tweet = await client.v2.tweet({ text });
  console.log("[X] posted (text-only):", tweet.data.id);
  return { posted: true, id: tweet.data.id };
}

export async function postToInstagram(caption: string, imageUrl: string): Promise<PostOutcome> {
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ID } = process.env;
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ID) {
    console.warn("[IG] credentials missing - skipping");
    return { posted: false, skipped: "credentials missing" };
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
  const pubJson = (await pubRes.json()) as { id?: string };
  console.log("[IG] posted:", pubJson);
  return { posted: true, id: pubJson.id };
}

export interface SnsRunResult {
  slug: string;
  text: string;
  imageUrl: string;
  dryRun: boolean;
  x?: PostOutcome;
  instagram?: PostOutcome;
}

/** 日次SNS投稿のオーケストレーション。CLIとCronルートの共通エントリ。 */
export async function runDailySnsPost(opts: {
  slug?: string;
  xOnly?: boolean;
  igOnly?: boolean;
  dryRun?: boolean;
} = {}): Promise<SnsRunResult> {
  const spike = pickDailySpike(opts.slug);
  const text = buildPostText(spike);
  const imageUrl = ogImageUrl(spike);

  const result: SnsRunResult = { slug: spike.slug, text, imageUrl, dryRun: !!opts.dryRun };
  if (opts.dryRun) return result;

  if (!opts.igOnly) {
    const imgBuf = await fetchImageBuffer(imageUrl);
    result.x = await postToX(text, imgBuf);
  }
  if (!opts.xOnly) {
    result.instagram = await postToInstagram(text, imageUrl);
  }
  return result;
}
