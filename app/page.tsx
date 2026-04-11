import Link from "next/link";
import SpikeCard from "@/components/SpikeCard";
import { ageCategories, featuredSpikes } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "全年代対応！失敗しないサッカースパイクの選び方",
  description: "小学生から社会人まで、年代・価格・グラウンド別にスパイクを徹底比較。実際のレビューとランキングで最適な一足が見つかります。",
  path: "/"
});

export default function HomePage() {
  const featured = featuredSpikes(4);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white p-8 md:p-12">
        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
          年代別で選ぶ、本当に良いサッカースパイク
        </h1>
        <p className="mt-3 text-sm md:text-base opacity-90">
          小学生・中学生・高校生・社会人。あなたに合った1足を、価格・グラウンド・ブランドから探せます。
        </p>
        <Link
          href="/ranking/overall"
          className="inline-block mt-6 bg-white text-brand-dark font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg"
        >
          総合ランキングを見る →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">年代から選ぶ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ageCategories.map((c) => (
            <Link
              key={c.key}
              href={`/age/${c.key}`}
              className="block rounded-xl bg-white border p-4 hover:shadow-md transition"
            >
              <p className="text-lg font-bold text-brand-dark">{c.label}</p>
              <p className="text-xs text-slate-600 mt-1">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">注目のスパイク</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((s) => <SpikeCard key={s.slug} spike={s} />)}
        </div>
      </section>

      <section className="mt-10 grid md:grid-cols-3 gap-4">
        <Link href="/ranking/price/under5000" className="rounded-xl bg-white border p-5 hover:shadow">
          <p className="text-sm text-slate-500">価格帯で選ぶ</p>
          <p className="font-bold mt-1">5,000円以下のおすすめ</p>
        </Link>
        <Link href="/ranking/ground/fg" className="rounded-xl bg-white border p-5 hover:shadow">
          <p className="text-sm text-slate-500">グラウンドで選ぶ</p>
          <p className="font-bold mt-1">FG（天然芝）ランキング</p>
        </Link>
        <Link href="/ranking/brand/nike" className="rounded-xl bg-white border p-5 hover:shadow">
          <p className="text-sm text-slate-500">ブランドで選ぶ</p>
          <p className="font-bold mt-1">Nike人気モデル</p>
        </Link>
      </section>
    </div>
  );
}
