import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl">⚽</p>
      <h1 className="text-3xl font-bold mt-4">ページが見つかりません</h1>
      <p className="text-slate-600 mt-3">お探しのスパイクはどこかへドリブル中かもしれません。</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="bg-brand text-white px-5 py-3 rounded-lg font-bold hover:bg-brand-dark">
          トップに戻る
        </Link>
        <Link href="/search" className="bg-slate-100 px-5 py-3 rounded-lg font-bold hover:bg-slate-200">
          スパイクを探す
        </Link>
      </div>
    </div>
  );
}
