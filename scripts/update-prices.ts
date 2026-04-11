/**
 * Price Updater (mock)
 * - spikes.json の各商品について「価格情報の取得→更新」を行うスケルトン
 * - 実運用では Amazon PA-API / 楽天API / Yahooショッピングapi を呼ぶ
 * - 本サンプルでは ±2% のランダム揺らぎを与えて updatedAt を更新
 *
 * 使い方:
 *   npx tsx scripts/update-prices.ts             # 実行 (dry-run無し)
 *   npx tsx scripts/update-prices.ts --dry-run   # 差分確認のみ
 */
import { promises as fs } from "fs";
import path from "path";
import type { Spike } from "../lib/types";

const DRY_RUN = process.argv.includes("--dry-run");
const FILE = path.resolve(process.cwd(), "data/spikes.json");

async function fetchLatestPrice(spike: Spike): Promise<number> {
  // TODO: 実APIに置き換える
  // const r = await fetch(`https://api.amazon.../product?asin=${spike.asin}`);
  // return parsePrice(await r.json());
  const jitter = (Math.random() - 0.5) * 0.04; // ±2%
  return Math.round((spike.price * (1 + jitter)) / 10) * 10;
}

async function main() {
  const raw = await fs.readFile(FILE, "utf-8");
  const spikes = JSON.parse(raw) as Spike[];
  const now = new Date().toISOString();
  const diffs: { slug: string; before: number; after: number }[] = [];

  for (const s of spikes) {
    const newPrice = await fetchLatestPrice(s);
    if (newPrice !== s.price) {
      diffs.push({ slug: s.slug, before: s.price, after: newPrice });
      s.price = newPrice;
      s.updatedAt = now;
    }
  }

  console.log(`${diffs.length} prices changed`);
  for (const d of diffs) {
    const arrow = d.after > d.before ? "↑" : "↓";
    console.log(`  ${arrow} ${d.slug}: ¥${d.before.toLocaleString()} → ¥${d.after.toLocaleString()}`);
  }

  if (DRY_RUN) {
    console.log("[dry-run] not writing");
    return;
  }
  await fs.writeFile(FILE, JSON.stringify(spikes, null, 2) + "\n", "utf-8");
  console.log("✅ data/spikes.json updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
