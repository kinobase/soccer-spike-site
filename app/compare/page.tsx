"use client";
import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { spikes } from "@/lib/data";

export default function ComparePicker() {
  const [a, setA] = useState(spikes[0].slug);
  const [b, setB] = useState(spikes[1]?.slug || spikes[0].slug);
  const valid = a !== b;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "スパイク比較", path: "/compare" }]} />
      <h1 className="text-2xl font-bold">スパイクを比較する</h1>
      <p className="text-slate-600 mt-2 text-sm">2モデルを選んで詳細を並べて比較できます。</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-slate-500">モデル A</span>
          <select value={a} onChange={(e) => setA(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
            {spikes.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">モデル B</span>
          <select value={b} onChange={(e) => setB(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
            {spikes.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6">
        {valid ? (
          <Link
            href={`/compare/${a}-vs-${b}`}
            className="inline-block bg-brand text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-dark"
          >
            比較ページを見る →
          </Link>
        ) : (
          <p className="text-sm text-rose-600">異なる2モデルを選んでください</p>
        )}
      </div>
    </div>
  );
}
