import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

const links = [
  { href: "/about", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclaimer", label: "免責事項" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/feed.xml", label: "RSS" }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:text-brand">{l.label}</Link></li>
          ))}
        </ul>
        <p className="mt-4">© {new Date().getFullYear()} {SITE_NAME}</p>
        <p className="mt-2 text-xs">
          当サイトはAmazonアソシエイト・楽天アフィリエイト等の広告プログラムにより収益を得ています。
        </p>
      </div>
    </footer>
  );
}
