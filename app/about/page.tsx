import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata, SITE_NAME } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "運営者情報",
  description: "サイト運営者について",
  path: "/about"
});

export default function About() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "運営者情報", path: "/about" }]} />
      <h1 className="text-2xl font-bold">運営者情報</h1>

      <dl className="mt-6 bg-white border rounded-xl divide-y text-sm">
        <div className="p-4 grid grid-cols-3">
          <dt className="font-bold text-slate-600">サイト名</dt>
          <dd className="col-span-2">{SITE_NAME}</dd>
        </div>
        <div className="p-4 grid grid-cols-3">
          <dt className="font-bold text-slate-600">運営目的</dt>
          <dd className="col-span-2">サッカープレーヤーが自分に合ったスパイクを見つけるための情報提供</dd>
        </div>
        <div className="p-4 grid grid-cols-3">
          <dt className="font-bold text-slate-600">対象年代</dt>
          <dd className="col-span-2">小学生・中学生・高校生・社会人/シニア</dd>
        </div>
        <div className="p-4 grid grid-cols-3">
          <dt className="font-bold text-slate-600">収益化</dt>
          <dd className="col-span-2">Amazonアソシエイト・楽天アフィリエイト・Yahoo!ショッピング・KAMOアフィリエイト</dd>
        </div>
        <div className="p-4 grid grid-cols-3">
          <dt className="font-bold text-slate-600">お問い合わせ</dt>
          <dd className="col-span-2"><a href="/contact" className="text-brand hover:underline">お問い合わせフォーム</a></dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-slate-700">
        当サイトでは、最新スパイクの情報を毎日自動更新しています。気になる商品やリクエストがあればお気軽にお問い合わせください。
      </p>
    </article>
  );
}
