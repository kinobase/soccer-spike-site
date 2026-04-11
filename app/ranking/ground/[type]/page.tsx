import { notFound } from "next/navigation";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSpikesByGround, grounds } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { Ground } from "@/lib/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return grounds.map((g) => ({ type: g.key }));
}

export function generateMetadata({ params }: { params: { type: string } }) {
  const g = grounds.find((x) => x.key === params.type);
  if (!g) return {};
  return buildMetadata({
    title: `${g.label}向けスパイクランキング`,
    description: `${g.label}に最適なサッカースパイクを徹底比較`,
    path: `/ranking/ground/${g.key}`
  });
}

export default function GroundRanking({ params }: { params: { type: string } }) {
  const g = grounds.find((x) => x.key === params.type);
  if (!g) notFound();
  const list = getSpikesByGround(params.type as Ground).sort((a, b) => b.rating - a.rating);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: g.label, path: `/ranking/ground/${g.key}` }]} />
      <h1 className="text-2xl font-bold">{g.label}向けスパイクランキング</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((s, i) => <SpikeCard key={s.slug} spike={s} rank={i + 1} />)}
      </div>
    </div>
  );
}
