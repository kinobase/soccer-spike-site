import type { Spike } from "@/lib/types";
import { availableShops, shopMeta, affiliateUrlFor } from "@/lib/affiliate";

export default function AffiliateButtons({ spike, size = "md" }: { spike: Spike; size?: "sm" | "md" | "lg" }) {
  const shops = availableShops(spike);
  const sz = size === "lg" ? "py-4 text-base" : size === "sm" ? "py-2 text-xs" : "py-3 text-sm";
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {shops.map((s) => {
        const meta = shopMeta[s];
        return (
          <a
            key={s}
            href={affiliateUrlFor(spike, s)}
            target="_blank"
            rel="nofollow sponsored noopener"
            className={`${meta.color} ${sz} font-bold rounded-lg text-center shadow transition`}
          >
            {meta.label}
          </a>
        );
      })}
    </div>
  );
}
