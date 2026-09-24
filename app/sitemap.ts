import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://2027-street-mandate.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/map`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/brief`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/blueprints`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
