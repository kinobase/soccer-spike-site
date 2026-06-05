/**
 * Vercel Cron 用 SNS自動投稿エンドポイント
 * - vercel.json の crons から毎日呼ばれる（壊れているGitHub Actionsに依存しない自走経路）
 * - CRON_SECRET が設定されていれば Bearer 認証で保護（Vercel Cronは自動でこのヘッダを付与）
 * - 手動確認: /api/cron/post-sns?dry=1  (Authorization: Bearer <CRON_SECRET>)
 */
import { NextResponse } from "next/server";
import { runDailySnsPost } from "@/lib/sns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry") === "1";
  const slug = url.searchParams.get("slug") || undefined;
  const xOnly = url.searchParams.get("x-only") === "1";
  const igOnly = url.searchParams.get("ig-only") === "1";

  try {
    const result = await runDailySnsPost({ slug, xOnly, igOnly, dryRun });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[cron/post-sns] failed:", e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
