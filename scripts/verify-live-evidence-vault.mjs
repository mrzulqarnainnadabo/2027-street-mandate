/**
 * Read-only production smoke test for the Evidence Vault v0.1 public API.
 * Empty feeds are valid; no records are created or changed.
 */
import assert from "node:assert/strict";

const BASE = "https://2027-street-mandate.vercel.app/api/v1/evidence-records";
const PAGE_SIZE = 50;
const MAX_PAGES = 20;

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "ISEYC-Evidence-Vault-Smoke/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch { body = { raw: raw.slice(0, 1000) }; }
  assert.equal(response.status, 200, `Expected HTTP 200 from ${url}, received ${response.status}: ${JSON.stringify(body).slice(0, 1500)}`);
  return body;
}

const firstUrl = new URL(BASE);
firstUrl.searchParams.set("page", "1");
firstUrl.searchParams.set("pageSize", String(PAGE_SIZE));
const first = await getJson(firstUrl);
assert.equal(first.contractVersion, "0.1.0");
assert.equal(first.publicationBoundary, "published-and-dual-reviewed-only");
assert.ok(Array.isArray(first.records));
assert.equal(first.page, 1);
assert.ok(Number.isInteger(first.total));
assert.ok(Number.isInteger(first.totalPages) && first.totalPages >= 1);
assert.equal(first.truncatedUpstream, false);
assert.ok(first.totalPages <= MAX_PAGES);

const records = [...first.records];
for (let page = 2; page <= first.totalPages; page += 1) {
  const url = new URL(BASE);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  const next = await getJson(url);
  assert.equal(next.contractVersion, "0.1.0");
  assert.equal(next.publicationBoundary, "published-and-dual-reviewed-only");
  assert.equal(next.page, page);
  assert.equal(next.truncatedUpstream, false);
  assert.ok(Array.isArray(next.records));
  records.push(...next.records);
}

const forbidden = [
  "primaryReviewer", "secondaryReviewer", "primaryReviewDate", "secondaryReviewDate",
  "reviewerNotes", "sourceContext", "reporterEmail", "reporterPhone", "deviceFingerprint",
];
const ids = [];
for (const record of records) {
  assert.equal(record.contractVersion, "0.1.0");
  assert.equal(record.publicationStatus, "published");
  assert.ok(typeof record.id === "string" && record.id.length > 0);
  assert.ok(typeof record.title === "string" && record.title.length > 0);
  assert.ok(typeof record.sourceUrl === "string" && record.sourceUrl.startsWith("https://"));
  assert.ok(typeof record.evidenceScope === "string");
  assert.ok(typeof record.verificationStatus === "string");
  assert.ok(typeof record.evidenceRelation === "string");
  if (record.evidenceRelation === "corroborates") {
    assert.ok(record.linkedCommunityObservationId);
    assert.equal(record.verificationStatus, "content_corroborated");
    assert.equal(record.evidenceLinkReview, "content_checked");
  }
  if (record.evidenceRelation === "contradicts") {
    assert.ok(record.linkedCommunityObservationId);
    assert.equal(record.verificationStatus, "disputed");
    assert.equal(record.evidenceLinkReview, "content_checked");
  }
  const keys = Object.keys(record).map((key) => key.toLowerCase());
  for (const key of forbidden) assert.ok(!keys.includes(key.toLowerCase()), `Private field exposed: ${key}`);
  ids.push(record.id);
}
assert.equal(new Set(ids).size, ids.length);
assert.equal(first.total, records.length);

console.log(JSON.stringify({
  ok: true,
  contractVersion: first.contractVersion,
  publicationBoundary: first.publicationBoundary,
  publishedEvidenceRecords: records.length,
  emptyFeedIsValid: records.length === 0,
  reviewerFieldsExcluded: true,
  limitations: first.coverageNote,
}, null, 2));
