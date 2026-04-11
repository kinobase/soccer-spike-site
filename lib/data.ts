import spikesJson from "@/data/spikes.json";
import rankingsJson from "@/data/rankings.json";
import postsJson from "@/data/posts.json";
import type { Spike, Ranking, Post, AgeCategory, PriceRange, Ground, Brand } from "./types";

export const spikes: Spike[] = spikesJson as Spike[];
export const rankings: Ranking[] = rankingsJson as Ranking[];
export const posts: Post[] = postsJson as Post[];

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const getSpikeBySlug = (slug: string): Spike | undefined =>
  spikes.find((s) => s.slug === slug);

export const getSpikesByAge = (age: AgeCategory): Spike[] =>
  spikes.filter((s) => s.ageTarget.includes(age));

export const getSpikesByPriceRange = (range: PriceRange): Spike[] =>
  spikes.filter((s) => s.priceRange === range);

export const getSpikesByGround = (g: Ground): Spike[] =>
  spikes.filter((s) => s.ground.includes(g));

export const getSpikesByBrand = (brand: Brand): Spike[] =>
  spikes.filter((s) => s.brand === brand);

export const getRanking = (id: string): Ranking | undefined =>
  rankings.find((r) => r.id === id);

export const featuredSpikes = (limit = 4): Spike[] =>
  [...spikes].sort((a, b) => b.rating - a.rating).slice(0, limit);

export const allBrands = (): Brand[] =>
  Array.from(new Set(spikes.map((s) => s.brand)));

/** 関連スパイク: 同ブランド or 同価格帯 or 同グラウンド一致度でスコアリング */
export const getRelatedSpikes = (slug: string, limit = 4): Spike[] => {
  const target = getSpikeBySlug(slug);
  if (!target) return [];
  return spikes
    .filter((s) => s.slug !== slug)
    .map((s) => {
      let score = 0;
      if (s.brand === target.brand) score += 3;
      if (s.priceRange === target.priceRange) score += 2;
      score += s.ground.filter((g) => target.ground.includes(g)).length;
      score += s.ageTarget.filter((a) => target.ageTarget.includes(a)).length;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score || b.s.rating - a.s.rating)
    .slice(0, limit)
    .map((x) => x.s);
};

export const allBlogCategories = (): string[] =>
  Array.from(new Set(posts.map((p) => p.category)));

export const getPostsByCategory = (category: string): Post[] =>
  posts.filter((p) => p.category === category);

export const ageCategories: { key: AgeCategory; label: string; description: string }[] = [
  { key: "elementary", label: "小学生", description: "初めてのスパイクや成長期の足を守る軽量・幅広モデル" },
  { key: "junior", label: "中学生", description: "本格プレーが始まる中学生向けの定番スパイク" },
  { key: "high", label: "高校生", description: "ポジション特性で選ぶ本格モデル" },
  { key: "adult", label: "社会人・シニア", description: "履き心地と耐久性重視。社会人リーグやシニアにも" }
];

export const priceRanges: { key: PriceRange; label: string }[] = [
  { key: "under5000", label: "5,000円以下" },
  { key: "around10000", label: "10,000円前後" },
  { key: "premium", label: "ハイエンド" }
];

export const grounds: { key: Ground; label: string }[] = [
  { key: "fg", label: "FG（天然芝）" },
  { key: "ag", label: "AG（人工芝）" },
  { key: "tf", label: "TF（トレシュー）" },
  { key: "hg", label: "HG（土・かたい地面）" }
];
