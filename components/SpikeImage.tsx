"use client";
import { useState } from "react";

const placeholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='%230ea5e9'/><stop offset='100%' stop-color='%230369a1'/>
      </linearGradient></defs>
      <rect width='400' height='300' fill='url(%23g)'/>
      <text x='50%' y='50%' font-family='sans-serif' font-size='42' fill='white' text-anchor='middle' dominant-baseline='middle'>⚽</text>
    </svg>`
  );

export default function SpikeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={errored ? placeholder : src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}
