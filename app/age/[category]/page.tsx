import { notFound } from "next/navigation";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ageCategories, getSpikesByAge } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { AgeCategory } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return ageCategories.map((c) => ({ category: c.key }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const c = ageCategories.find((x) => x.key === params.category);
  if (!c) return {};
  return buildMetadata({
    title: `${c.label}向けサッカースパイクおすすめ`,
    description: c.description,
    path: `/age/${c.key}`
  });
}

export default function AgePage({ params }: { params: { category: string } }) {
  const cat = ageCategories.find((c) => c.key === params.category);
  if (!cat) notFound();
  const list = getSpikesByAge(params.category as AgeCategory);
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: `${cat.label}向け`, path: `/age/${cat.key}` }
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={crumbs} />
      <h1 className="text-2xl font-bold">{cat.label}向けおすすめサッカースパイク</h1>
      <p className="text-slate-600 mt-2 text-sm">{cat.description}</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((s) => <SpikeCard key={s.slug} spike={s} />)}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
    </div>
  );
}
