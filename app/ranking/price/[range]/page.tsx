import { notFound } from "next/navigation";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSpikesByPriceRange, priceRanges } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { PriceRange } from "@/lib/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return priceRanges.map((p) => ({ range: p.key }));
}

export function generateMetadata({ params }: { params: { range: string } }) {
  const p = priceRanges.find((x) => x.key === params.range);
  if (!p) return {};
  return buildMetadata({
    title: `${p.label}のおすすめスパイク`,
    description: `${p.label}の価格帯で選ぶ人気サッカースパイクランキング`,
    path: `/ranking/price/${p.key}`
  });
}

export default function PriceRanking({ params }: { params: { range: string } }) {
  const meta = priceRanges.find((p) => p.key === params.range);
  if (!meta) notFound();
  const list = getSpikesByPriceRange(params.range as PriceRange).sort((a, b) => b.rating - a.rating);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: `${meta.label}ランキング`, path: `/ranking/price/${meta.key}` }]} />
      <h1 className="text-2xl font-bold">{meta.label}のおすすめスパイク</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((s, i) => <SpikeCard key={s.slug} spike={s} rank={i + 1} />)}
      </div>
    </div>
  );
}
