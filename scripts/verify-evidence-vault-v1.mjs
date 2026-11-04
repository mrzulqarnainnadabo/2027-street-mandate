import assert from "node:assert/strict";
import fs from "node:fs";

const module = fs.readFileSync("lib/evidence-vault.ts", "utf8");
const route = fs.readFileSync("app/api/v1/evidence-records/route.ts", "utf8");

assert.match(module, /NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID/);
assert.match(module, /Notion-Version/);
assert.match(module, /2026-03-11/);
assert.ok(module.includes('data_sources/'));
assert.match(module, /Publication Status.*Published/);
assert.match(module, /Review Gate.*Dual review complete/);
assert.match(module, /Reviewer identities and review dates are never returned/);
assert.match(module, /evidenceRelation === "Corroborates"/);
assert.match(module, /verification !== "CONTENT_CORROBORATED"/);
assert.match(module, /evidenceRelation === "Contradicts"/);
assert.match(module, /verification !== "DISPUTED"/);
assert.match(module, /evidenceLinkReview !== "Content checked"/);
assert.match(module, /linkedObservationId/);
assert.match(route, /SOURCE_CONFIRMED/);
assert.match(module, /CONTENT_CORROBORATED/);

assert.match(route, /publicationBoundary: "published-and-dual-reviewed-only"/);
assert.match(route, /linkedCommunityObservationId/);
assert.match(route, /indicatorCode/);
assert.match(route, /geographicLevel/);
assert.match(route, /truncatedUpstream/);
assert.match(route, /Corroborates and Contradicts require a linked Community Observation ID/);
assert.match(route, /Access-Control-Allow-Origin/);

assert.doesNotMatch(module, /Reporter Email|Reporter Phone|Device Fingerprint|Primary Reviewer.*records|Secondary Reviewer.*records/);
console.log("verify-evidence-vault-v1: PASS");
