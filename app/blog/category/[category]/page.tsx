import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { allBlogCategories, getPostsByCategory } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return allBlogCategories().map((c) => ({ category: encodeURIComponent(c) }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = decodeURIComponent(params.category);
  return buildMetadata({
    title: `${cat}カテゴリの記事一覧`,
    description: `${cat}に関するサッカースパイクのブログ記事`,
    path: `/blog/category/${params.category}`
  });
}

export default function BlogCategory({ params }: { params: { category: string } }) {
  const cat = decodeURIComponent(params.category);
  const list = getPostsByCategory(cat);
  if (list.length === 0) notFound();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: "ホーム", path: "/" },
        { name: "ブログ", path: "/blog" },
        { name: cat, path: `/blog/category/${params.category}` }
      ]} />
      <h1 className="text-2xl font-bold">{cat}カテゴリの記事</h1>
      <ul className="mt-6 space-y-4">
        {list.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="block bg-white border rounded-xl p-4 hover:shadow">
              <h2 className="font-bold">{p.title}</h2>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              <p className="text-xs text-slate-400 mt-2">{p.publishedAt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
