/** Exercise the production CommunityRecord v0.1 mapper and response builder. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (r) => fs.readFileSync(path.join(root, r), "utf8");
const source = read("lib/community-record.ts");
const route = read("app/api/v1/community-records/route.ts");
const pulse = read("app/api/pulse/route.ts");

assert.match(route, /getPublishedPulse/);
assert.match(route, /buildCommunityRecordsResponse/);
assert.match(route, /diagnosticCode/);
assert.match(route, /communityRecordsErrorCode/);
assert.match(route, /COMMUNITY_RECORDS_UNAVAILABLE/);
assert.match(pulse, /getPublishedPulse/);

// Transpile the real TypeScript module and provide only its harmless allowlist import.
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const module = { exports: {} };
const sandbox = {
  module,
  exports: module.exports,
  require: (id) => {
    if (id === "@/lib/public-voice") return { PUBLIC_VOICE_KEYS: ["id", "sentence", "mandate", "duty", "office", "state", "lga", "created"] };
    throw new Error("Unexpected test dependency: " + id);
  },
};
vm.runInNewContext(compiled, sandbox, { filename: "community-record.ts" });
const { pulseVoiceToCommunityRecord, buildCommunityRecordsResponse, assertNoPrivateKeys } = module.exports;

const fixture = {
  id: "cr-kaduna-001",
  sentence: "Primary health centre needs reliable water.",
  duty: "Health",
  office: "Local Government",
  state: "Kaduna",
  lga: "Kaduna South",
  created: "2026-10-01T10:00:00.000Z",
  "Age Band": "25-34",
  Gender: "private",
  email: "private@example.test",
  phone: "+234000000000",
  "Device Fingerprint": "private-device",
  ip: "127.0.0.1",
};
const mapped = pulseVoiceToCommunityRecord(fixture);
assert.equal(mapped.contractVersion, "0.1.0");
assert.equal(mapped.publicationStatus, "published");
assert.equal(mapped.verificationStatus, "unverified");
assert.equal(mapped.id, "cr-kaduna-001");
assert.equal(mapped.text, fixture.sentence);
assert.equal(mapped.duty, "Health");
assert.equal(mapped.officeLabel, "Local Government");
assert.equal(mapped.state, "Kaduna");
assert.equal(mapped.lga, "Kaduna South");
assert.equal(mapped.createdAt, fixture.created);
assert.deepEqual(Object.keys(mapped).sort(), [
  "id", "contractVersion", "publicationStatus", "verificationStatus", "text",
  "sector", "duty", "officeLabel", "state", "lga", "createdAt",
].sort());
assert.equal("email" in mapped, false);
assert.equal("phone" in mapped, false);
assert.equal("ip" in mapped, false);
assert.equal("Age Band" in mapped, false);
assert.equal("Gender" in mapped, false);
assert.equal("Device Fingerprint" in mapped, false);
assertNoPrivateKeys(mapped);

const page = buildCommunityRecordsResponse([fixture], { page: 1, pageSize: 10 }, { total: 1, truncated: false });
assert.equal(page.contractVersion, "0.1.0");
assert.equal(page.publicationBoundary, "published-only");
assert.equal(page.page, 1);
assert.equal(page.pageSize, 10);
assert.equal(page.total, 1);
assert.equal(page.truncatedUpstream, false);
assert.equal(page.records.length, 1);
assert.equal(page.records[0].id, "cr-kaduna-001");
assertNoPrivateKeys(page.records[0]);

const truncated = buildCommunityRecordsResponse([fixture], {}, { total: 100, truncated: true });
assert.equal(truncated.truncatedUpstream, true);

console.log("verify-community-records-v1: PASS (production mapper + response builder)");
