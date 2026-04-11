import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

const nav = [
  { href: "/age/elementary", label: "小学生" },
  { href: "/age/junior", label: "中学生" },
  { href: "/age/high", label: "高校生" },
  { href: "/age/adult", label: "社会人" },
  { href: "/ranking/overall", label: "ランキング" },
  { href: "/search", label: "検索" },
  { href: "/blog", label: "ブログ" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-brand-dark">
          ⚽ {SITE_NAME}
        </Link>
        <nav className="hidden md:flex gap-5 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="md:hidden flex overflow-x-auto gap-3 px-4 pb-2 text-xs">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap text-slate-600">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
