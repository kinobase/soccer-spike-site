import type { Metadata } from "next";
import type { Spike } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "サッカースパイクNavi";

export const buildMetadata = (opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata => {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image || `${SITE_URL}/api/og?title=${encodeURIComponent(opts.title)}`;
  return {
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "ja_JP",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image]
    }
  };
};

export const productJsonLd = (spike: Spike) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: spike.name,
  image: [spike.image],
  description: spike.review,
  brand: { "@type": "Brand", name: spike.brand },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: spike.rating,
    reviewCount: 1,
    bestRating: 5
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "JPY",
    price: spike.price,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/spikes/${spike.slug}`
  }
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a }
  }))
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`
  }))
});
