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
ok(
  /not endorsements?/i.test(profiles) || /never means support/i.test(profiles),
  "profiles disclaim endorsement"
);

const media = read("lib/media-content-types.ts");
ok(media.includes("requiresHumanApproval: true"), "media types require human approval");
ok(media.includes("MANDATE_STORY"), "MANDATE_STORY registered");

const header = read("components/Header.tsx");
ok(header.includes("/states"), "header links states");
ok(header.includes("/explore"), "header links the civic tools hub");
ok(header.includes("/methodology") || header.includes("Method"), "header links methodology");
ok(header.includes("CIVIC_BRAIN_URL"), "header links Civic Brain");
ok(header.includes("Observatory · in development"), "header shows Observatory public-release status");
for (const department of ["education", "health", "software-technology", "civic"]) {
  ok(header.includes(department), `header links ${department} department workspace`);
}
const footer = read("components/Footer.tsx");
ok(footer.includes("CIVIC_BRAIN_URL") && footer.includes("Civic Intelligence Observatory · in development"), "footer links Brain and accurately labels Observatory status");
for (const department of ["education", "health", "software-technology", "civic"]) {
  ok(footer.includes(department), `footer links ${department} department workspace`);
}
const brandUrl = read("lib/brand.ts");
ok(brandUrl.includes("https://iseyc-civic-intelligence-observatory.vercel.app/"), "Observatory URL uses canonical project hostname");
ok(!brandUrl.includes("iseyc-civic-intelligence-observator.vercel.app"), "no misspelled Observatory hostname");

const explore = read("app/explore/page.tsx");
for (const route of ["/blueprints", "/profiles", "/intelligence", "/brief", "/tracked", "/states"]) {
  ok(explore.includes(route), `Explore hub preserves ${route}`);
}
ok(header.includes("/?action=submit"), "header provides a global submit-demand action");
ok(read("app/page.tsx").includes('params.get("action") === "submit"'), "global submit action opens the demand form");
const citizenHome = read("components/CitizenHome.tsx");
ok(citizenHome.includes("One mission. Three connected products."), "citizen home explains the connected product architecture");
ok(citizenHome.includes("Public release is in development"), "unreleased Observatory is not presented as a live public service");

const constants = read("lib/constants.ts");
ok(constants.includes("\"FCT\""), "FCT in STATES");
ok((constants.match(/"[A-Z][a-z]+(?: [A-Z][a-z]+)?"/g) || []).length >= 30, "many state names present");

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nAll civic-mandate-nigeria shell contracts passed.");
