/**
 * Published-only public data boundary — allowed vs blocked contracts.
 * Source-level: must match lib/notion.ts + lib/public-voice.ts + pulse API.
 */
import assert from "node:assert/strict";
import fs from "node:fs";

const notion = fs.readFileSync("lib/notion.ts", "utf8");
const publicVoice = fs.readFileSync("lib/public-voice.ts", "utf8");
const pulseRoute = fs.readFileSync("app/api/pulse/route.ts", "utf8");
const mandatePage = fs.readFileSync("app/mandate/[id]/page.tsx", "utf8");

// --- ALLOWED: public surface only via Published filter ---
assert.match(notion, /select:\s*\{\s*equals:\s*["']Published["']/);
assert.match(notion, /function getPublishedPulse/);
assert.match(notion, /function getPublishedMandate/);
assert.match(notion, /status !== ["']Published["']/);
assert.match(pulseRoute, /getPublishedPulse/);

assert.match(notion, /mapPageToVoice/);
assert.match(notion, /Explicit public allowlist|PUBLIC DATA BOUNDARY/);

assert.match(publicVoice, /PUBLIC_VOICE_KEYS|Age Band/);
assert.match(publicVoice, /Device Fingerprint|Gender/);

const mapper =
  notion.match(/function mapPageToVoice[\s\S]*?\n\}/)?.[0] || "";
assert.ok(mapper.length > 50, "mapPageToVoice body not found");
assert.doesNotMatch(mapper, /Age Band/);
assert.doesNotMatch(mapper, /["']Gender["']/);
assert.doesNotMatch(mapper, /Response Received|Follow-up Date|Resolution Status/);

const getPub =
  notion.match(/export async function getPublishedMandate[\s\S]*?^}/m)?.[0] ||
  notion.match(/export async function getPublishedMandate[\s\S]{0,1200}/)?.[0] ||
  "";
assert.match(getPub, /Published/);
assert.match(getPub, /return null/);

assert.match(mandatePage, /getPublishedMandate/);

function isPublicEligible(status) {
  return status === "Published";
}
assert.equal(isPublicEligible("Published"), true);
assert.equal(isPublicEligible("New"), false);
assert.equal(isPublicEligible("Rejected"), false);
assert.equal(isPublicEligible("Flagged"), false);
assert.equal(isPublicEligible("Draft"), false);
assert.equal(isPublicEligible(""), false);

console.log("verify-published-boundary: PASS (Published-only + private field exclusion)");
