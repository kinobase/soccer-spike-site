# Data Schema

## spikes.json

```ts
type Spike = {
  slug: string;                 // URL識別子 (例: "mercurial-superfly-10")
  name: string;                 // 商品名
  brand: "nike" | "adidas" | "puma" | "mizuno" | "asics" | "newbalance" | string;
  series: string;               // シリーズ名
  releaseYear: number;
  price: number;                // 参考価格(円)
  priceRange: "under5000" | "around10000" | "premium";
  ground: ("fg" | "ag" | "tf" | "hg" | "sg")[]; // 対応グラウンド
  ageTarget: ("elementary" | "junior" | "high" | "adult")[]; // 推奨年代
  weightGrams: number;
  upper: string;                // アッパー素材
  fit: "narrow" | "standard" | "wide";
  features: string[];           // 特徴タグ
  pros: string[];
  cons: string[];
  review: string;               // マークダウン or プレーンテキスト本文
  rating: number;               // 0-5
  image: string;                // メイン画像URL
  gallery?: string[];
  affiliate: {
    amazon?: string;
    rakuten?: string;
    yahoo?: string;
    kamo?: string;              // サッカーショップKAMOなど専門店
  };
  updatedAt: string;            // ISO
};
```

## rankings.json

```ts
type RankingEntry = { slug: string; rank: number; comment?: string };
type Ranking = {
  id: string;                   // 例: "overall", "price-under5000", "ground-fg", "brand-nike"
  title: string;
  description: string;
  type: "overall" | "price" | "ground" | "brand";
  key?: string;                 // price range / ground type / brand key
  entries: RankingEntry[];
  updatedAt: string;
};
```
