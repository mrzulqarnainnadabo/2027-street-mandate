#!/usr/bin/env node
/** Regression checks for the civic-learning-first public experience. */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;
function ok(condition, message) {
  if (!condition) { console.error("FAIL:", message); failed += 1; }
  else console.log("OK:", message);
}
function read(path) { return readFileSync(join(root, path), "utf8"); }

ok(existsSync(join(root, "app/learn/page.tsx")), "civic learning route exists");
ok(existsSync(join(root, "components/CivicLearningPreview.tsx")), "home learning preview exists");
const learning = read("app/learn/page.tsx");
for (const term of ["Your rights", "Your responsibilities", "How government works", "How to participate", "Patriotism & shared values", "Freedom of Information Act 2011", "Voter education and guidelines"]) {
  ok(learning.includes(term), "learning hub covers " + term);
}
ok(learning.includes("Patriotism is not party loyalty"), "patriotism is explicitly non-partisan");
ok(learning.includes("not legal advice"), "civic learning includes legal-information boundary");
ok(learning.includes("nigeriareposit.nln.gov.ng"), "Constitution is linked to National Library repository");
ok(learning.includes("justice.gov.ng/freedom-of-information-portal"), "FOI source is linked to Ministry of Justice");
ok(learning.includes("inecnigeria.org/voters/education"), "voter education is linked to INEC");
const home = read("app/page.tsx");
ok(home.includes("CivicLearningPreview"), "home imports the civic learning preview");
ok(home.indexOf("<CivicLearningPreview") < home.indexOf("<DutyCards"), "civic learning precedes demand submission");
const hero = read("components/Hero.tsx");
ok(hero.includes("Know your rights"), "home hero leads with civic understanding");
ok(hero.includes('href="/learn"'), "home hero links to civic learning");
const header = read("components/Header.tsx");
for (const href of ['"/learn"', '"/explore"', '"/#mandate-form"', '"/report"', '"/methodology"']) {
  ok(header.includes(href), "primary navigation includes " + href);
}
const explore = read("app/explore/page.tsx");
for (const href of ['"/states"', '"/blueprints"', '"/profiles"', '"/intelligence"', '"/brief"', '"/tracked"']) {
  ok(explore.includes(href), "Explore hub preserves " + href);
}

const brand = read("public/iseyc-wordmark.svg");
const seal = read("public/iseyc-seal.svg");
const brandGuide = read("docs/ISEYC-BRAND-SYSTEM.md");
ok(brand.includes('href="/iseyc-seal.svg"'), "full wordmark uses the supplied official seal");
ok(brand.includes("Empowering Youth, Shaping Communities"), "wordmark carries the approved institutional tagline");
ok(seal.includes("ISEYC official seal"), "official seal remains present");
ok(brandGuide.includes("The supplied official seal is the source of truth"), "brand guide protects the official emblem");

if (failed) { console.error(`\\n${failed} failure(s)`); process.exit(1); }
console.log("\\nAll civic-learning-first experience checks passed.");
