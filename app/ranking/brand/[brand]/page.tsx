import { notFound } from "next/navigation";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { allBrands, getSpikesByBrand } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return allBrands().map((b) => ({ brand: b }));
}

export function generateMetadata({ params }: { params: { brand: string } }) {
  return buildMetadata({
    title: `${params.brand.toUpperCase()} のスパイク一覧`,
    description: `${params.brand} の人気サッカースパイクをまとめてチェック`,
    path: `/ranking/brand/${params.brand}`
  });
}

export default function BrandRanking({ params }: { params: { brand: string } }) {
  const list = getSpikesByBrand(params.brand);
  if (list.length === 0) notFound();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: params.brand, path: `/ranking/brand/${params.brand}` }]} />
      <h1 className="text-2xl font-bold capitalize">{params.brand} のスパイク</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.sort((a, b) => b.rating - a.rating).map((s, i) => <SpikeCard key={s.slug} spike={s} rank={i + 1} />)}
      </div>
    </div>
  );
}
