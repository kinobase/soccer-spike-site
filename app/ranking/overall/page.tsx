import { notFound } from "next/navigation";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getRanking, getSpikeBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "総合ランキング 2026",
  description: "編集部が選ぶ年代・価格を横断したサッカースパイク総合ランキング",
  path: "/ranking/overall"
});

export default function OverallRanking() {
  const r = getRanking("overall");
  if (!r) notFound();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: r.title, path: "/ranking/overall" }]} />
      <h1 className="text-2xl font-bold">{r.title}</h1>
      <p className="text-slate-600 mt-2 text-sm">{r.description}</p>
      <ol className="mt-6 space-y-4">
        {r.entries.map((e) => {
          const sp = getSpikeBySlug(e.slug);
          if (!sp) return null;
          return (
            <li key={e.slug} className="flex gap-4 bg-white border rounded-xl p-3">
              <div className="w-32 shrink-0"><SpikeCard spike={sp} rank={e.rank} /></div>
              <div className="flex-1">
                <p className="text-xs text-brand font-bold">第{e.rank}位</p>
                <h3 className="font-bold">{sp.name}</h3>
                {e.comment && <p className="text-sm text-slate-600 mt-1">{e.comment}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
