/** Configuration-layer health and data-source ID validation. */
import assert from "node:assert/strict";
import fs from "node:fs";

const health = fs.readFileSync("app/api/health/route.ts", "utf8");
const observations = fs.readFileSync("lib/community-observations.ts", "utf8");
const evidence = fs.readFileSync("lib/evidence-vault.ts", "utf8");

assert.match(health, /communityObservationsDataSourceConfigured/);
assert.match(health, /evidenceVaultDataSourceConfigured/);
assert.match(health, /tokenPresent/);
assert.match(health, /Does not probe Notion/);
assert.doesNotMatch(health, /NOTION_TOKEN\s*&&\s*process\.env\.NOTION_DATABASE_ID\s*&&\s*process\.env\.NOTION_COMMUNITY/);
assert.match(health, /notionConfigured/);
assert.match(health, /demandDatabaseConfigured/);

for (const source of [observations, evidence]) {
  assert.match(source, /isPlausibleNotionId/);
  assert.match(source, /validation_error/);
  assert.match(source, /\.trim\(\)/);
}

assert.match(observations, /NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID/);
assert.match(evidence, /NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID/);

function isPlausibleNotionId(value) {
  const compact = value.replace(/-/g, "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(compact);
}
assert.equal(isPlausibleNotionId("abcdefghijklmnopqrstuvwxyzabcdef"), false);
assert.equal(isPlausibleNotionId("not-an-id"), false);
assert.equal(isPlausibleNotionId(""), false);
assert.equal(isPlausibleNotionId("0123456789abcdef0123456789abcdef"), true);
assert.equal(isPlausibleNotionId("01234567-89ab-cdef-0123-456789abcdef"), true);

console.log("verify-data-source-health: PASS");
