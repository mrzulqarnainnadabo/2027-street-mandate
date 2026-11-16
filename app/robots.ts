import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "../lib/public-site-url.mjs";

const BASE = getPublicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/map", "/brief", "/about", "/mandate/", "/blueprints"],
      disallow: ["/api/", "/operators", "/operators/"],
    },
    sitemap: \`${BASE}/sitemap.xml\`,
  };
}
