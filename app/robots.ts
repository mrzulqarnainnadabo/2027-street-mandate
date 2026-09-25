import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://2027-street-mandate.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/map", "/brief", "/about", "/mandate/", "/blueprints"],
      disallow: ["/api/", "/operators", "/operators/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
