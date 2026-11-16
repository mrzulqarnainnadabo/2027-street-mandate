import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getPublicSiteUrl } from "../lib/public-site-url.mjs";

const expected = "https://2027-street-mandate.vercel.app";
assert.equal(getPublicSiteUrl("https://example.org"), "https://example.org");
assert.equal(getPublicSiteUrl("https://example.org/"), "https://example.org");
assert.equal(getPublicSiteUrl("https://example.org////"), "https://example.org");
assert.equal(getPublicSiteUrl(""), expected);
assert.equal(getPublicSiteUrl(undefined), expected);

const sitemapSource = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
const robotsSource = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
assert.match(sitemapSource, /getPublicSiteUrl/);
assert.match(robotsSource, /getPublicSiteUrl/);
assert.match(robotsSource, /disallow:\s*\[[^\]]*"\/api\/"[^\]]*"\/operators"[^\]]*\]/);
assert.ok(robotsSource.includes("/sitemap.xml"));

const base = getPublicSiteUrl("https://example.org////");
const publicPaths = ["/", "/map", "/brief", "/blueprints", "/about"];
const urls = publicPaths.map((path) => path === "/" ? base : base + path);
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.every((url) => url.startsWith("https://example.org/") || url === "https://example.org"));
assert.ok(urls.every((url) => !url.includes("//map") && !url.includes("//brief") && !url.includes("//blueprints") && !url.includes("//about")));
assert.ok(!urls.some((url) => url.includes("/api/") || url.includes("/operators")));

console.log("Public site URL, sitemap URL and robots boundary checks passed.");
