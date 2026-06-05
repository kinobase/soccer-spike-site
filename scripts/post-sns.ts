/**
 * SNS Auto-Post Script (CLI)
 * - 共有ロジックは lib/sns.ts に集約。ここはCLI引数の処理とログ出力のみ。
 *
 * 使い方:
 *   npx tsx scripts/post-sns.ts                  # 今日のローテーション
 *   npx tsx scripts/post-sns.ts <slug>           # 特定スパイク
 *   npx tsx scripts/post-sns.ts --dry-run        # 投稿せずに本文確認
 *   npx tsx scripts/post-sns.ts --x-only         # Xだけ
 *   npx tsx scripts/post-sns.ts --ig-only        # Instagramだけ
 */
import { runDailySnsPost } from "../lib/sns";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

async function main() {
  const dryRun = flags.has("--dry-run");
  const result = await runDailySnsPost({
    slug: positional[0],
    xOnly: flags.has("--x-only"),
    igOnly: flags.has("--ig-only"),
    dryRun
  });

  console.log("==============================");
  console.log("Target:", result.slug);
  console.log("Image :", result.imageUrl);
  console.log("------- text -------");
  console.log(result.text);
  console.log("==============================");

  if (dryRun) {
    console.log("[dry-run] 投稿しません");
    return;
  }
  if (result.x) console.log("[X]", result.x);
  if (result.instagram) console.log("[IG]", result.instagram);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
