import type { MetadataRoute } from "next";
import { spikes, ageCategories, priceRanges, grounds, allBrands, posts } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/ranking/overall`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: now, priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, priority: 0.6 },
    { url: `${SITE_URL}/compare`, lastModified: now, priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, priority: 0.2 },
    { url: `${SITE_URL}/contact`, lastModified: now, priority: 0.3 }
  ];
  posts.forEach((p) => urls.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.publishedAt) }));
  ageCategories.forEach((c) => urls.push({ url: `${SITE_URL}/age/${c.key}`, lastModified: now }));
  priceRanges.forEach((p) => urls.push({ url: `${SITE_URL}/ranking/price/${p.key}`, lastModified: now }));
  grounds.forEach((g) => urls.push({ url: `${SITE_URL}/ranking/ground/${g.key}`, lastModified: now }));
  allBrands().forEach((b) => urls.push({ url: `${SITE_URL}/ranking/brand/${b}`, lastModified: now }));
  spikes.forEach((s) => urls.push({ url: `${SITE_URL}/spikes/${s.slug}`, lastModified: new Date(s.updatedAt) }));
  return urls;
}
