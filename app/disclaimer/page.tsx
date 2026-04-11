import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "免責事項",
  description: "当サイトの情報の取り扱いに関する免責事項",
  path: "/disclaimer"
});

export default function Disclaimer() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "免責事項", path: "/disclaimer" }]} />
      <h1 className="text-2xl font-bold">免責事項</h1>

      <section className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>当サイトに掲載されている情報は、可能な限り正確を期しておりますが、その内容を保証するものではありません。</p>

        <h2 className="text-lg font-bold mt-6">1. 情報の正確性について</h2>
        <p>サッカースパイクの価格・スペック・在庫情報は変動する可能性があります。最終的な情報は必ず各販売店の公式サイトでご確認ください。</p>

        <h2 className="text-lg font-bold mt-6">2. レビュー・評価について</h2>
        <p>当サイトに掲載されているレビューや評価は、執筆者の主観に基づくものです。すべてのプレーヤーに同様の効果や満足感を保証するものではありません。</p>

        <h2 className="text-lg font-bold mt-6">3. 損害の責任</h2>
        <p>当サイトの情報を利用することによって生じたいかなる損害に対しても、当サイトは一切の責任を負いません。</p>

        <h2 className="text-lg font-bold mt-6">4. 外部リンクについて</h2>
        <p>当サイトから外部サイトへリンクしている場合、リンク先の内容について当サイトは責任を負いません。</p>

        <h2 className="text-lg font-bold mt-6">5. 著作権について</h2>
        <p>当サイトに掲載されている文章・画像の無断転載を禁じます。引用の際は出典を明記してください。</p>
      </section>
    </article>
  );
}
