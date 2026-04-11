/**
 * Data Validator
 * - spikes.json / rankings.json / posts.json の整合性をチェック
 * - 必須フィールド・slug重複・rankingが存在しないspikeを参照していないか等
 *
 * 使い方: npx tsx scripts/validate-data.ts
 */
import spikesJson from "../data/spikes.json";
import rankingsJson from "../data/rankings.json";
import postsJson from "../data/posts.json";
import type { Spike, Ranking, Post } from "../lib/types";

const spikes = spikesJson as Spike[];
const rankings = rankingsJson as Ranking[];
const posts = postsJson as Post[];

const errors: string[] = [];
const warnings: string[] = [];

// --- spikes ---
const spikeSlugs = new Set<string>();
for (const s of spikes) {
  if (!s.slug) errors.push(`spike: missing slug`);
  if (spikeSlugs.has(s.slug)) errors.push(`spike: duplicate slug "${s.slug}"`);
  spikeSlugs.add(s.slug);

  if (!s.name) errors.push(`spike ${s.slug}: missing name`);
  if (typeof s.price !== "number" || s.price <= 0) errors.push(`spike ${s.slug}: invalid price`);
  if (typeof s.rating !== "number" || s.rating < 0 || s.rating > 5) errors.push(`spike ${s.slug}: invalid rating`);
  if (!s.ground?.length) errors.push(`spike ${s.slug}: empty ground`);
  if (!s.ageTarget?.length) errors.push(`spike ${s.slug}: empty ageTarget`);

  const aff = s.affiliate || {};
  if (!aff.amazon && !aff.rakuten && !aff.yahoo && !aff.kamo) {
    warnings.push(`spike ${s.slug}: no affiliate links`);
  }

  // priceRange consistency
  const expected =
    s.price < 5000 ? "under5000" : s.price < 20000 ? "around10000" : "premium";
  if (s.priceRange !== expected) {
    warnings.push(`spike ${s.slug}: priceRange "${s.priceRange}" doesn't match price ¥${s.price} (expected ${expected})`);
  }
}

// --- rankings ---
const rankingIds = new Set<string>();
for (const r of rankings) {
  if (rankingIds.has(r.id)) errors.push(`ranking: duplicate id "${r.id}"`);
  rankingIds.add(r.id);

  for (const e of r.entries) {
    if (!spikeSlugs.has(e.slug)) {
      errors.push(`ranking ${r.id}: references unknown spike "${e.slug}"`);
    }
  }
  // rank ordering
  const ranks = r.entries.map((e) => e.rank);
  if (new Set(ranks).size !== ranks.length) errors.push(`ranking ${r.id}: duplicate rank values`);
}

// --- posts ---
const postSlugs = new Set<string>();
for (const p of posts) {
  if (postSlugs.has(p.slug)) errors.push(`post: duplicate slug "${p.slug}"`);
  postSlugs.add(p.slug);
  if (!p.title || !p.body) errors.push(`post ${p.slug}: missing title or body`);
}

// --- summary ---
console.log(`Spikes  : ${spikes.length}`);
console.log(`Rankings: ${rankings.length}`);
console.log(`Posts   : ${posts.length}`);
console.log("");

if (warnings.length) {
  console.log(`⚠️  ${warnings.length} warnings:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.error(`❌ ${errors.length} errors:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("✅ all data valid");
