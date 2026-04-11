import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { posts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "ブログ｜サッカースパイク選びのコツ",
  description: "サッカースパイクの選び方・最新情報を発信",
  path: "/blog"
});

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "ブログ", path: "/blog" }]} />
      <h1 className="text-2xl font-bold">ブログ</h1>
      <ul className="mt-6 space-y-4">
        {sorted.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="block bg-white border rounded-xl p-4 hover:shadow">
              <p className="text-xs text-brand font-bold">{p.category}</p>
              <h2 className="font-bold mt-1">{p.title}</h2>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              <p className="text-xs text-slate-400 mt-2">{p.publishedAt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
