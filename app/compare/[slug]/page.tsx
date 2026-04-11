import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AffiliateButtons from "@/components/AffiliateButtons";
import { spikes, getSpikeBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

// URL: /compare/{slugA}-vs-{slugB}
export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const a of spikes) {
    for (const b of spikes) {
      if (a.slug !== b.slug) params.push({ slug: `${a.slug}-vs-${b.slug}` });
    }
  }
  return params;
}

const parse = (slug: string) => {
  const idx = slug.indexOf("-vs-");
  if (idx === -1) return null;
  return [slug.slice(0, idx), slug.slice(idx + 4)] as const;
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const pair = parse(params.slug);
  if (!pair) return {};
  const [a, b] = pair.map(getSpikeBySlug);
  if (!a || !b) return {};
  return buildMetadata({
    title: `${a.name} vs ${b.name} 徹底比較`,
    description: `${a.name} と ${b.name} のスペック・価格・特徴を比較`,
    path: `/compare/${params.slug}`
  });
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const pair = parse(params.slug);
  if (!pair) notFound();
  const [a, b] = pair.map(getSpikeBySlug);
  if (!a || !b) notFound();

  const rows: [string, string, string][] = [
    ["価格", `¥${a.price.toLocaleString()}`, `¥${b.price.toLocaleString()}`],
    ["重量", `${a.weightGrams}g`, `${b.weightGrams}g`],
    ["アッパー", a.upper, b.upper],
    ["フィット", a.fit, b.fit],
    ["対応GND", a.ground.join("/").toUpperCase(), b.ground.join("/").toUpperCase()],
    ["評価", `★${a.rating}`, `★${b.rating}`]
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "比較", path: `/compare/${params.slug}` }]} />
      <h1 className="text-2xl font-bold">{a.name} vs {b.name}</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full bg-white border rounded-xl overflow-hidden text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">項目</th>
              <th className="p-3">{a.name}</th>
              <th className="p-3">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t">
                <td className="p-3 font-bold bg-slate-50">{r[0]}</td>
                <td className="p-3 text-center">{r[1]}</td>
                <td className="p-3 text-center">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold mb-2">{a.name}</h2>
          <AffiliateButtons spike={a} />
        </div>
        <div>
          <h2 className="font-bold mb-2">{b.name}</h2>
          <AffiliateButtons spike={b} />
        </div>
      </div>
    </div>
  );
}
