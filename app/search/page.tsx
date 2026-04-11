"use client";
import { useMemo, useState } from "react";
import SpikeCard from "@/components/SpikeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { spikes, ageCategories, priceRanges, grounds, allBrands } from "@/lib/data";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [age, setAge] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [ground, setGround] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const brands = allBrands();

  const filtered = useMemo(() => {
    return spikes.filter((s) => {
      if (q && !`${s.name} ${s.brand} ${s.series} ${s.features.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (age && !s.ageTarget.includes(age as any)) return false;
      if (price && s.priceRange !== price) return false;
      if (ground && !s.ground.includes(ground as any)) return false;
      if (brand && s.brand !== brand) return false;
      return true;
    });
  }, [q, age, price, ground, brand]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "検索", path: "/search" }]} />
      <h1 className="text-2xl font-bold">スパイクを探す</h1>

      <div className="mt-4 grid md:grid-cols-5 gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワード"
          className="md:col-span-5 border rounded px-3 py-2"
        />
        <select value={age} onChange={(e) => setAge(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="">年代すべて</option>
          {ageCategories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <select value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="">価格すべて</option>
          {priceRanges.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
        <select value={ground} onChange={(e) => setGround(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="">グラウンドすべて</option>
          {grounds.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
        </select>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="">ブランドすべて</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <button
          onClick={() => { setQ(""); setAge(""); setPrice(""); setGround(""); setBrand(""); }}
          className="border rounded px-2 py-2 text-sm bg-slate-100 hover:bg-slate-200"
        >リセット</button>
      </div>

      <p className="mt-4 text-sm text-slate-600">{filtered.length}件 ヒット</p>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((s) => <SpikeCard key={s.slug} spike={s} />)}
      </div>
    </div>
  );
}
