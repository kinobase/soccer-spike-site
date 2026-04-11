import Link from "next/link";
import type { Spike } from "@/lib/types";
import SpikeImage from "./SpikeImage";

export default function SpikeCard({ spike, rank }: { spike: Spike; rank?: number }) {
  return (
    <Link
      href={`/spikes/${spike.slug}`}
      className="group block rounded-xl border bg-white overflow-hidden hover:shadow-lg transition"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <SpikeImage src={spike.image} alt={spike.name} className="w-full h-full object-cover" />
        {rank && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
            #{rank}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-500 uppercase">{spike.brand} / {spike.series}</p>
        <h3 className="font-semibold text-sm leading-tight group-hover:text-brand">{spike.name}</h3>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-amber-500">★ {spike.rating.toFixed(1)}</span>
          <span className="font-bold text-slate-900">¥{spike.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
