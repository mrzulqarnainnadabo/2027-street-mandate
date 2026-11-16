const DEFAULT_PUBLIC_SITE_URL = "https://2027-street-mandate.vercel.app";

export function getPublicSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  return (value || DEFAULT_PUBLIC_SITE_URL).trim().replace(/\\/+$/, "");
}
