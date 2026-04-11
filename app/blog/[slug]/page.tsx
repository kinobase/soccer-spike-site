import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { posts, getPostBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPostBySlug(params.slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.description, path: `/blog/${p.slug}` });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = getPostBySlug(params.slug);
  if (!p) notFound();
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: "ホーム", path: "/" },
        { name: "ブログ", path: "/blog" },
        { name: p.title, path: `/blog/${p.slug}` }
      ]} />
      <p className="text-xs text-brand font-bold">{p.category}</p>
      <h1 className="text-2xl md:text-3xl font-bold mt-1">{p.title}</h1>
      <p className="text-xs text-slate-500 mt-2">{p.publishedAt}</p>
      <div className="prose mt-6 whitespace-pre-line text-slate-700 leading-relaxed">{p.body}</div>
    </article>
  );
}
