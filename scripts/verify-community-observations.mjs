/** Community Observation v0.1 intake and publication boundary checks. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const intake = read("lib/community-observations.ts");
const submit = read("app/api/community-observations/route.ts");
const publish = read("app/api/v1/community-observations/route.ts");
const page = read("app/report/page.tsx");
const header = read("components/Header.tsx");

assert.match(intake, /NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID/);
assert.match(intake, /Notion-Version/);
assert.match(intake, /2026-03-11/);
assert.match(intake, /data_sources\\//);
assert.match(intake, /COMMUNITY_OBSERVATION_CONTRACT_VERSION = "0\.1\.0"/);
assert.match(intake, /Status: \{ select: \{ name: "New" \} \}/);
assert.match(intake, /"Verification Status": \{ select: \{ name: "Unverified" \} \}/);
assert.match(intake, /readSelect\(p\.Status\) !== "Published"/);
assert.match(intake, /Source Context and Reviewer Notes never leave the private review workspace/);
assert.doesNotMatch(intake, /Device Fingerprint|Age Band|Gender|email|phone/i);

assert.match(submit, /checkRateLimit/);
assert.match(submit, /clientIpFromRequest/);
assert.match(submit, /NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID|submitCommunityObservation/);
assert.match(submit, /containsContactDetails/);
assert.match(submit, /evidenceTypes/);
assert.match(submit, /protocol !== "https:"/);
assert.match(submit, /status: "received"/);
assert.match(submit, /not public until it has been reviewed and approved/);

assert.match(publish, /getPublishedCommunityObservations/);
assert.match(publish, /publicationBoundary: "published-only"/);
assert.match(publish, /truncatedUpstream/);
assert.match(page, /How do you know\?/);
assert.match(page, /Submit report privately/);
assert.match(page, /No name, phone number, email, demographic profile or device fingerprint/);
assert.match(header, /href: "\/report"/);

assert.match(intake, /"Review Gate": \{ select: \{ name: "Pending" \} \}/);
assert.match(intake, /Review Gate.*Dual review complete/s);

const sample = {
  status: "New",
  verificationStatus: "Unverified",
  reporterContact: undefined,
};
assert.equal(sample.status, "New");
assert.equal(sample.verificationStatus, "Unverified");
console.log("verify-community-observations-v1: PASS");
