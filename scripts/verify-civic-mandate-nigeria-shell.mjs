#!/usr/bin/env node
/**
 * Contract checks for Civic Mandate Nigeria shell + neutrality.
 * Run: node scripts/verify-civic-mandate-nigeria-shell.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function ok(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("OK:", msg);
  }
}

function read(p) {
  return readFileSync(join(root, p), "utf8");
}

ok(existsSync(join(root, "app/states/page.tsx")), "app/states/page.tsx exists");
ok(existsSync(join(root, "app/profiles/page.tsx")), "app/profiles/page.tsx exists");
ok(existsSync(join(root, "app/methodology/page.tsx")), "app/methodology/page.tsx exists");
ok(existsSync(join(root, "lib/verification.ts")), "lib/verification.ts exists");
ok(existsSync(join(root, "lib/media-content-types.ts")), "lib/media-content-types.ts exists");

const brand = read("lib/brand.ts");
ok(brand.includes("Civic Mandate Nigeria"), "PRODUCT_NAME includes Civic Mandate Nigeria");
ok(brand.includes("PRODUCT_NAME_LEGACY"), "legacy product name retained");

const verification = read("lib/verification.ts");
ok(verification.includes("Unverified"), "Unverified state");
ok(verification.includes("Source-linked"), "Source-linked state");
ok(verification.includes("Institution-reviewed"), "Institution-reviewed state");
ok(
  verification.includes("not an endorsement") || verification.includes("NOT endorsement"),
  "institution-reviewed is not endorsement"
);
ok(!/ISEYC Endorsed/i.test(verification), "no ISEYC Endorsed badge text");

const profiles = read("app/profiles/page.tsx");
ok(!/who to vote for/i.test(profiles) || /Not.*who to vote for/i.test(profiles), "profiles reject vote advice");
ok(/not an endorsement/i.test(profiles), "profiles disclaim endorsement");

const media = read("lib/media-content-types.ts");
ok(media.includes("requiresHumanApproval: true"), "media types require human approval");
ok(media.includes("MANDATE_STORY"), "MANDATE_STORY registered");

const header = read("components/Header.tsx");
ok(header.includes("/states"), "header links states");
ok(header.includes("/profiles"), "header links profiles");
ok(header.includes("/methodology") || header.includes("Method"), "header links methodology");

const constants = read("lib/constants.ts");
ok(constants.includes("\"FCT\""), "FCT in STATES");
ok((constants.match(/"[A-Z][a-z]+(?: [A-Z][a-z]+)?"/g) || []).length >= 30, "many state names present");

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nAll civic-mandate-nigeria shell contracts passed.");
