import type { Spike } from "./types";

export type Shop = "amazon" | "rakuten" | "yahoo" | "kamo";

export const shopMeta: Record<Shop, { label: string; color: string }> = {
  amazon: { label: "Amazonで見る", color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
  rakuten: { label: "楽天で見る", color: "bg-red-600 hover:bg-red-700 text-white" },
  yahoo: { label: "Yahoo!で見る", color: "bg-purple-600 hover:bg-purple-700 text-white" },
  kamo: { label: "サッカーショップKAMO", color: "bg-blue-700 hover:bg-blue-800 text-white" }
};

const IDS = {
  amazon: process.env.AMAZON_ASSOC_TAG || "",
  rakuten: process.env.RAKUTEN_AFFILIATE_ID || "",
  yahoo: process.env.YAHOO_AFFILIATE_ID || "",
  kamo: process.env.KAMO_AFFILIATE_ID || ""
};

/**
 * 各ストアURLにアフィリエイトIDを差し込む。
 * spikes.jsonには「裸URL」を入れておけば、ビルド時に環境変数のIDが付与される。
 * 既にIDが入っている場合は重複付与しない。
 */
export const buildAffiliateUrl = (shop: Shop, rawUrl: string): string => {
  if (!rawUrl) return rawUrl;
  const id = IDS[shop];
  if (!id) return rawUrl;
  try {
    const u = new URL(rawUrl);
    switch (shop) {
      case "amazon":
        if (!u.searchParams.has("tag")) u.searchParams.set("tag", id);
        return u.toString();
      case "rakuten":
        // 楽天は本来 hb.afl.rakuten.co.jp 経由だが、簡易対応として scid 付与
        if (!u.searchParams.has("scid")) u.searchParams.set("scid", id);
        return u.toString();
      case "yahoo":
        if (!u.searchParams.has("sid")) u.searchParams.set("sid", id);
        return u.toString();
      case "kamo":
        if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", id);
        return u.toString();
    }
  } catch {
    return rawUrl;
  }
  return rawUrl;
};

export const availableShops = (spike: Spike): Shop[] =>
  (Object.keys(spike.affiliate) as Shop[]).filter((k) => !!spike.affiliate[k]);

export const affiliateUrlFor = (spike: Spike, shop: Shop): string =>
  buildAffiliateUrl(shop, spike.affiliate[shop] || "");
