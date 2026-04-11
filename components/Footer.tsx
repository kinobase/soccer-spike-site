import { SITE_NAME } from "@/lib/seo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} {SITE_NAME}</p>
        <p className="mt-2 text-xs">
          当サイトはAmazonアソシエイト・楽天アフィリエイト等の広告プログラムにより収益を得ています。
        </p>
      </div>
    </footer>
  );
}
