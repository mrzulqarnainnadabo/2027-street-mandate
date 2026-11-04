/** CommunityRecord v0.1 + pulse privacy contracts */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (r) => fs.readFileSync(path.join(root, r), "utf8");
assert.ok(fs.existsSync(path.join(root, "lib/community-record.ts")));
assert.ok(fs.existsSync(path.join(root, "app/api/v1/community-records/route.ts")));
const lib = read("lib/community-record.ts");
const route = read("app/api/v1/community-records/route.ts");
const pulse = read("app/api/pulse/route.ts");
assert.match(lib, /contractVersion/);
assert.match(lib, /publicationStatus: "published"/);
assert.match(lib, /verificationStatus: "unverified"/);
assert.match(lib, /prevalenceNote/);
assert.match(lib, /COMMUNITY_RECORD_PRIVATE_DENYLIST/);
assert.match(route, /getPublishedPulse/);
assert.match(route, /buildCommunityRecordsResponse/);
assert.match(pulse, /getPublishedPulse/);
assert.doesNotMatch(route, /Age Band|Gender|Device Fingerprint/);
function map(v) {
  const n = (s) => { const t = String(s || "").trim(); return t || null; };
  return {
    id: String(v.id), contractVersion: "0.1.0", publicationStatus: "published",
    verificationStatus: "unverified", text: (v.sentence || "").trim(), sector: null,
    duty: n(v.duty), issueCategory: null, state: n(v.state), lga: n(v.lga), ward: null,
    facilityRef: null, officeLabel: n(v.office), reportedAt: null, publishedAt: null,
    createdAt: v.created || "", evidenceRefIds: [], followUpStatus: "none", relatedSuggestedIds: [],
  };
}
function page(voices, q) {
  let r = voices.map(map).filter((x) => x.text);
  if (q.state) r = r.filter((x) => (x.state || "").toLowerCase() === q.state.toLowerCase());
  const size = Math.min(50, Math.max(1, q.pageSize || 20));
  const p = Math.max(1, q.page || 1);
  const total = r.length;
  const pages = Math.max(1, Math.ceil(total / size) || 1);
  const sp = Math.min(p, pages);
  return { contractVersion: "0.1.0", page: sp, pageSize: size, total, totalPages: pages, records: r.slice((sp - 1) * size, sp * size) };
}
const sample = [
  { id: "1", sentence: "PHC water", duty: "Health", office: "LGA", state: "Kaduna", lga: "Chikun", created: "2026-10-01T00:00:00.000Z" },
  { id: "2", sentence: "School roof", duty: "Education", office: "State", state: "Ondo", lga: "Owo", created: "2026-10-02T00:00:00.000Z" },
];
const m = map(sample[0]);
assert.equal(m.verificationStatus, "unverified");
assert.equal(m.sector, null);
assert.ok(!("Gender" in m));
const p1 = page(sample, { page: 1, pageSize: 1 });
assert.equal(p1.records.length, 1);
assert.equal(p1.total, 2);
const fk = page(sample, { state: "Kano" });
assert.equal(fk.total, 0);
const live = await fetch("https://2027-street-mandate.vercel.app/api/pulse").then((r) => r.json()).catch(() => null);
if (live?.voices?.length) {
  const keys = new Set(live.voices.flatMap((v) => Object.keys(v)));
  for (const b of ["Gender", "Age Band", "Device Fingerprint", "email"]) assert.ok(!keys.has(b));
  for (const r of live.voices.map(map)) {
    assert.equal(r.publicationStatus, "published");
    assert.equal(r.contractVersion, "0.1.0");
  }
  console.log("live mapped", live.voices.length);
}
console.log("verify-community-records-v1: PASS");
