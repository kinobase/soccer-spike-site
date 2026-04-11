export type Brand = "nike" | "adidas" | "puma" | "mizuno" | "asics" | "newbalance" | string;
export type Ground = "fg" | "ag" | "tf" | "hg" | "sg";
export type AgeCategory = "elementary" | "junior" | "high" | "adult";
export type PriceRange = "under5000" | "around10000" | "premium";

export type Spike = {
  slug: string;
  name: string;
  brand: Brand;
  series: string;
  releaseYear: number;
  price: number;
  priceRange: PriceRange;
  ground: Ground[];
  ageTarget: AgeCategory[];
  weightGrams: number;
  upper: string;
  fit: "narrow" | "standard" | "wide";
  features: string[];
  pros: string[];
  cons: string[];
  review: string;
  rating: number;
  image: string;
  gallery?: string[];
  affiliate: {
    amazon?: string;
    rakuten?: string;
    yahoo?: string;
    kamo?: string;
  };
  updatedAt: string;
};

export type RankingEntry = { slug: string; rank: number; comment?: string };
export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  body: string;
};

export type Ranking = {
  id: string;
  title: string;
  description: string;
  type: "overall" | "price" | "ground" | "brand";
  key?: string;
  entries: RankingEntry[];
  updatedAt: string;
};
