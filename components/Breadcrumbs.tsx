import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav className="text-xs text-slate-500 mb-4">
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <span>›</span>}
            {i === items.length - 1 ? (
              <span className="text-slate-700">{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:underline">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
