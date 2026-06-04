import Link from "next/link";
import SpikeCard from "@/components/SpikeCard";
import { ageCategories, featuredSpikes, spikes } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { AgeCategory } from "@/lib/types";

export const metadata = buildMetadata({
  title: "全年代対応！失敗しないサッカースパイクの選び方",
  description: "小学生から社会人まで、年代・価格・グラウンド別にスパイクを徹底比較。実際のレビューとランキングで最適な一足が見つかります。",
  path: "/"
});

const ageMeta: Record<AgeCategory, { icon: string; gradient: string }> = {
  elementary: { icon: "🧒", gradient: "from-emerald-500 to-teal-600" },
  junior:     { icon: "👦", gradient: "from-brand to-brand-dark" },
  high:       { icon: "⚡", gradient: "from-violet-500 to-purple-700" },
  adult:      { icon: "👤", gradient: "from-accent to-accent-dark" },
};

const quickLinks = [
  {
    href: "/ranking/price/under5000",
    icon: "💴",
    category: "価格帯で選ぶ",
    title: "5,000円以下のおすすめ",
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    accent: "text-emerald-600",
  },
  {
    href: "/ranking/ground/fg",
    icon: "🏟️",
    category: "グラウンドで選ぶ",
    title: "FG（天然芝）ランキング",
    gradient: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    iconBg: "bg-sky-100",
    accent: "text-sky-600",
  },
  {
    href: "/ranking/brand/nike",
    icon: "👟",
    category: "ブランドで選ぶ",
    title: "Nike 人気モデル",
    gradient: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    accent: "text-orange-600",
  },
];

export default function HomePage() {
  const featured = featuredSpikes(4);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ヒーローセクション */}
      <section
        className="relative overflow-hidden rounded-2xl hero-diagonal"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #0369a1 45%, #0ea5e9 100%)" }}
      >
        {/* 背景装飾円 */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-8 w-48 h-48 rounded-full bg-accent/10 border border-accent/20 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-14">
          {/* バッジ */}
          <span className="inline-flex items-center gap-2 bg-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            ⚡ スパイク選びの決定版
          </span>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-gradient-sports">
            年代別で選ぶ、<br className="md:hidden" />
            <span className="text-accent">本当に良い</span>サッカースパイク
          </h1>

          <p className="mt-4 text-sm md:text-base text-sky-100 max-w-lg">
            小学生・中学生・高校生・社会人。価格・グラウンド・ブランドから
            あなたに最適な1足を即座に発見。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ranking/overall"
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-black px-7 py-3.5 rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-200 hover:-translate-y-0.5 text-sm uppercase tracking-wide"
            >
              総合ランキングを見る
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-sm"
            >
              🔍 スパイクを検索
            </Link>
          </div>

          {/* 統計バー */}
          <div className="mt-8 flex gap-6 text-white/70 text-xs">
            <span><strong className="text-white text-lg font-black">{spikes.length}</strong><br />スパイク掲載</span>
            <span className="w-px bg-white/20" />
            <span><strong className="text-white text-lg font-black">{ageCategories.length}</strong><br />年代対応</span>
            <span className="w-px bg-white/20" />
            <span><strong className="text-white text-lg font-black">毎月</strong><br />情報更新</span>
          </div>
        </div>
      </section>

      {/* 年代から選ぶ */}
      <section className="mt-12">
        <h2 className="section-heading mb-6">年代から選ぶ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ageCategories.map((c) => {
            const meta = ageMeta[c.key];
            return (
              <Link
                key={c.key}
                href={`/age/${c.key}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} text-white p-5 card-glow-hover`}
              >
                {/* 背景の円装飾 */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
                <div className="text-3xl mb-3">{meta.icon}</div>
                <p className="font-black text-base">{c.label}</p>
                <p className="text-xs mt-1 opacity-80 leading-relaxed">{c.description}</p>
                <span className="mt-3 inline-block text-xs font-bold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 注目のスパイク */}
      <section className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-heading">注目のスパイク</h2>
            <p className="mt-1 text-xs text-slate-500 pl-4">評価・人気・コスパで選んだ厳選モデル</p>
          </div>
          <Link
            href="/ranking/overall"
            className="text-xs text-brand font-bold hover:text-brand-dark flex items-center gap-1 shrink-0"
          >
            すべて見る <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((s, i) => (
            <SpikeCard key={s.slug} spike={s} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* カテゴリから探す */}
      <section className="mt-14">
        <h2 className="section-heading mb-6">カテゴリから探す</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-br ${link.gradient} border ${link.border} p-5 card-glow-hover`}
            >
              <div className={`shrink-0 w-12 h-12 ${link.iconBg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
                {link.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold uppercase tracking-wide ${link.accent}`}>
                  {link.category}
                </p>
                <p className="font-black text-pitch text-sm mt-0.5 group-hover:text-brand transition-colors leading-tight">
                  {link.title}
                </p>
              </div>
              <span className="ml-auto text-slate-400 group-hover:text-brand group-hover:translate-x-1 transition-all duration-200 shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
