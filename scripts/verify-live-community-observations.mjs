/**
 * Live read-only smoke test for the Community Observation v0.1 public API.
 * Empty feeds are valid. Private review fields must never be exposed.
 */
import assert from "node:assert/strict";

const BASE = "https://2027-street-mandate.vercel.app/api/v1/community-observations";
const PAGE_SIZE = 50;
const MAX_PAGES = 20;
const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 15_000;

async function getJson(url) {
  let response;
  let body;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "ISEYC-Community-Observation-Smoke/1.0" },
      signal: AbortSignal.timeout(20_000),
    });
    const raw = await response.text();
    try { body = JSON.parse(raw); } catch { body = { raw: raw.slice(0, 1000) }; }
    if (response.status < 500 || attempt === MAX_ATTEMPTS) break;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }
  assert.equal(response.status, 200, `Expected HTTP 200 from ${url}, received ${response.status}: ${JSON.stringify(body).slice(0, 1500)}`);
  return body;
}

const firstUrl = new URL(BASE);
firstUrl.searchParams.set("page", "1");
firstUrl.searchParams.set("pageSize", String(PAGE_SIZE));
const first = await getJson(firstUrl);

assert.equal(first.contractVersion, "0.1.0");
assert.equal(first.publicationBoundary, "published-only");
assert.ok(Array.isArray(first.records));
assert.equal(first.page, 1);
assert.ok(Number.isInteger(first.total));
assert.ok(Number.isInteger(first.totalPages) && first.totalPages >= 1);
assert.equal(first.truncatedUpstream, false, "Refusing to treat an upstream-truncated feed as complete");
assert.ok(first.totalPages <= MAX_PAGES);

const records = [...first.records];
for (let page = 2; page <= first.totalPages; page += 1) {
  const url = new URL(BASE);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  const next = await getJson(url);
  assert.equal(next.contractVersion, "0.1.0");
  assert.equal(next.publicationBoundary, "published-only");
  assert.equal(next.page, page);
  assert.ok(Array.isArray(next.records));
  assert.equal(next.truncatedUpstream, false);
  records.push(...next.records);
}

const forbidden = [
  "sourceContext", "reviewerNotes", "primaryReviewer", "secondaryReviewer",
  "primaryReviewDate", "secondaryReviewDate", "reporterName", "reporterEmail",
  "reporterPhone", "deviceFingerprint", "ageBand", "gender",
];
const ids = [];
for (const record of records) {
  assert.equal(record.contractVersion, "0.1.0");
  assert.equal(record.publicationStatus, "published");
  assert.ok(typeof record.id === "string" && record.id.length > 0);
  assert.ok(typeof record.title === "string" && record.title.trim());
  assert.ok(typeof record.description === "string" && record.description.trim());
  assert.ok(typeof record.state === "string" && record.state.trim());
  assert.ok(Array.isArray(record.evidenceTypes));
  assert.ok(["unverified", "corroborated", "independently-verified", "disputed"].includes(record.verificationStatus));
  assert.ok(record.evidenceLink === null || (typeof record.evidenceLink === "string" && record.evidenceLink.startsWith("https://")));
  const keys = Object.keys(record).map((key) => key.toLowerCase());
  for (const key of forbidden) assert.ok(!keys.includes(key.toLowerCase()), `Private field exposed: ${key}`);
  ids.push(record.id);
}
assert.equal(new Set(ids).size, ids.length, "Duplicate observation IDs returned");
assert.equal(first.total, records.length, "Total does not match the complete published feed");

const mandate = await getJson("https://2027-street-mandate.vercel.app/api/v1/community-records?page=1&pageSize=5");
assert.equal(mandate.contractVersion, "0.1.0");
assert.equal(mandate.publicationBoundary, "published-only");

console.log(JSON.stringify({
  ok: true,
  contractVersion: first.contractVersion,
  publicationBoundary: first.publicationBoundary,
  publishedObservationCount: records.length,
  emptyFeedIsValid: records.length === 0,
  privateFieldsExcluded: true,
  mandateDemandContractStillAvailable: true,
  limitations: first.coverageNote,
}, null, 2));
