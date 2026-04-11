import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata, SITE_NAME } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "プライバシーポリシー",
  description: "個人情報の取り扱いについて",
  path: "/privacy"
});

export default function Privacy() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "プライバシーポリシー", path: "/privacy" }]} />
      <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

      <section className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>{SITE_NAME}（以下「当サイト」）における個人情報の取り扱いについて以下のとおり定めます。</p>

        <h2 className="text-lg font-bold mt-6">1. 取得する情報</h2>
        <p>当サイトでは、お問い合わせフォームの送信時に氏名・メールアドレスを取得する場合があります。また、アクセス解析ツール（Google Analyticsなど）により、Cookie・IPアドレス・閲覧履歴などの匿名情報を取得します。</p>

        <h2 className="text-lg font-bold mt-6">2. 利用目的</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>お問い合わせへの返信</li>
          <li>サイト改善のためのアクセス解析</li>
          <li>広告配信の最適化</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">3. アフィリエイトプログラムについて</h2>
        <p>当サイトは、Amazon.co.jpアソシエイト、楽天アフィリエイト、Yahoo!ショッピング、サッカーショップKAMOアフィリエイト等のプログラムにより収益を得ています。これらのプログラムでは、ユーザーがリンクを経由して商品を購入した場合、Cookieを通じて購入情報が取得されます。</p>

        <h2 className="text-lg font-bold mt-6">4. アクセス解析ツール</h2>
        <p>当サイトはGoogle Analyticsを使用しています。Google AnalyticsはCookieを使用して匿名のトラフィックデータを収集します。お使いのブラウザでCookieを無効にすることで、データ収集を拒否できます。</p>

        <h2 className="text-lg font-bold mt-6">5. 第三者提供</h2>
        <p>法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。</p>

        <h2 className="text-lg font-bold mt-6">6. 改定</h2>
        <p>本ポリシーは予告なく変更される場合があります。最新の内容は本ページに掲載します。</p>

        <p className="mt-8 text-xs text-slate-500">最終更新日: 2026年4月11日</p>
      </section>
    </article>
  );
}
