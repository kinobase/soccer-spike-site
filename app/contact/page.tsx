import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "お問い合わせ",
  description: "サイトへのお問い合わせ・リクエスト",
  path: "/contact"
});

export default function Contact() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "お問い合わせ", path: "/contact" }]} />
      <h1 className="text-2xl font-bold">お問い合わせ</h1>
      <p className="mt-3 text-sm text-slate-600">スパイクのリクエスト・記事の誤りの指摘・コラボのご相談などお気軽にどうぞ。</p>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="mt-6 space-y-4 bg-white border rounded-xl p-6"
      >
        <label className="block">
          <span className="text-sm font-bold">お名前</span>
          <input name="name" required className="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-bold">メールアドレス</span>
          <input name="email" type="email" required className="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-bold">お問い合わせ内容</span>
          <textarea name="message" required rows={6} className="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <button type="submit" className="bg-brand text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-dark">
          送信する
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">
        ※ フォーム送信にはFormspree等の外部サービスを利用しています。送信前にプライバシーポリシーをご確認ください。
      </p>
    </article>
  );
}
