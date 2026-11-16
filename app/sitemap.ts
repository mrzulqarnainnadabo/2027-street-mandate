import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "../lib/public-site-url.mjs";

const BASE = getPublicSiteUrl();

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
