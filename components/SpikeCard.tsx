import Link from "next/link";
import type { Spike } from "@/lib/types";
import SpikeImage from "./SpikeImage";

export default function SpikeCard({ spike, rank }: { spike: Spike; rank?: number }) {
  return (
    <Link
      href={`/spikes/${spike.slug}`}
      className="group block rounded-2xl bg-white overflow-hidden border border-slate-100 card-glow-hover"
    >
      {/* 画像エリア */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <SpikeImage
          src={spike.image}
          alt={spike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* ランクバッジ */}
        {rank && (
          <span className="badge-rank">
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
          </span>
        )}
        {/* グラウンドタグ */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {spike.ground.slice(0, 2).map((g) => (
            <span
              key={g}
              className="bg-pitch/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* テキストエリア */}
      <div className="p-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          {spike.brand}
        </p>
        <h3 className="font-bold text-sm leading-tight mt-0.5 group-hover:text-brand transition-colors line-clamp-2">
          {spike.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs">
            <span className="text-amber-400 font-black">★</span>
            <span className="font-bold text-slate-700">{spike.rating.toFixed(1)}</span>
          </span>
          <span className="text-sm font-black text-accent">
            ¥{spike.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ボトムバー：ホバー時にスライドイン */}
      <div className="h-0.5 bg-gradient-to-r from-brand to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}
