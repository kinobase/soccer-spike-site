import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AffiliateButtons from "@/components/AffiliateButtons";
import SpikeImage from "@/components/SpikeImage";
import SpikeCard from "@/components/SpikeCard";
import { spikes, getSpikeBySlug, getRelatedSpikes } from "@/lib/data";
import { buildMetadata, productJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { Spike } from "@/lib/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return spikes.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getSpikeBySlug(params.slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} レビュー｜価格・特徴・口コミ`,
    description: s.review.slice(0, 120),
    path: `/spikes/${s.slug}`,
    image: s.image
  });
}

const buildFaqs = (s: Spike) => [
  {
    q: `${s.name} の重さは？`,
    a: `${s.weightGrams}gです。${s.weightGrams < 200 ? "超軽量クラスでスピード重視のプレーヤーに向きます。" : "標準的な重さで、安定感を重視したい選手に向きます。"}`
  },
  {
    q: `${s.name} はどのグラウンドで使えますか？`,
    a: `${s.ground.join(" / ").toUpperCase()} に対応しています。`
  },
  {
    q: `${s.name} の推奨年代は？`,
    a: `${s.ageTarget.join("・")} 向けに設計されています。`
  },
  {
    q: `${s.name} の価格は？`,
    a: `参考価格は ¥${s.price.toLocaleString()} です。Amazon・楽天・Yahoo!・サッカーショップKAMOで価格比較できます。`
  }
];

export default function SpikeDetail({ params }: { params: { slug: string } }) {
  const s = getSpikeBySlug(params.slug);
  if (!s) notFound();
  const related = getRelatedSpikes(s.slug, 4);
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: s.brand, path: `/ranking/brand/${s.brand}` },
    { name: s.name, path: `/spikes/${s.slug}` }
  ];
  const faqs = buildFaqs(s);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={crumbs} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border overflow-hidden">
          <SpikeImage src={s.image} alt={s.name} className="w-full aspect-[4/3] object-cover" />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">{s.brand} / {s.series} / {s.releaseYear}</p>
          <h1 className="text-2xl font-bold mt-1">{s.name}</h1>
          <p className="mt-2 text-amber-500">★ {s.rating.toFixed(1)}</p>
          <p className="text-3xl font-bold mt-3">¥{s.price.toLocaleString()}</p>
          <ul className="mt-4 text-sm text-slate-700 space-y-1">
            <li>重量: {s.weightGrams}g</li>
            <li>アッパー: {s.upper}</li>
            <li>フィット: {s.fit}</li>
            <li>対応グラウンド: {s.ground.join(" / ").toUpperCase()}</li>
            <li>推奨年代: {s.ageTarget.join(" / ")}</li>
          </ul>
          <div className="mt-6">
            <AffiliateButtons spike={s} size="lg" />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">レビュー</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">{s.review}</p>
      </section>

      <section className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <h3 className="font-bold text-emerald-800">良い点</h3>
          <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
            {s.pros.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
          <h3 className="font-bold text-rose-800">気になる点</h3>
          <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
            {s.cons.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">最安値をチェック</h2>
        <AffiliateButtons spike={s} size="lg" />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">よくある質問</h2>
        <dl className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border rounded-xl p-4">
              <dt className="font-bold text-sm">Q. {f.q}</dt>
              <dd className="text-sm text-slate-700 mt-2">A. {f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">この商品を見た人におすすめ</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r) => <SpikeCard key={r.slug} spike={r} />)}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-bold mb-2">{s.name} と比較する</h3>
            <ul className="flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/compare/${s.slug}-vs-${r.slug}`}
                    className="text-xs bg-brand text-white px-3 py-2 rounded-full hover:bg-brand-dark"
                  >
                    vs {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(s)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
    </div>
  );
}
