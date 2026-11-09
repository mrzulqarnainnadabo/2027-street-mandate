import fs from "node:fs";
import assert from "node:assert/strict";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");

const home = read("../components/CitizenHome.tsx");
const page = read("../app/page.tsx");
const guide = read("../app/learn/page.tsx");
const header = read("../components/Header.tsx");
const standard = read("../docs/CITIZEN-LEARNING-EDITORIAL-STANDARD.md");
const ia = read("../docs/CIVIC-MANDATE-NIGERIA-IA.md");

assert.match(page, /CitizenHome/);
assert.match(page, /showDemandForm/);
assert.match(home, /Know your rights\. Understand public duty\. Take part in Nigeria/);
assert.match(home, /Start the citizen guide/);
assert.match(home, /Submit a public demand/);
assert.match(home, /Report an observation/);
assert.match(header, /href: "\/learn", label: "Citizen Guide"/);
assert.match(guide, /Sections 33–46/);
assert.match(guide, /Section 24/);
assert.match(guide, /Section 45/);
assert.match(guide, /Section 46/);
assert.match(guide, /not legal advice/);
assert.match(guide, /Patriotism without partisanship/);
assert.match(standard, /Patriotism is not silence/);
assert.match(standard, /government endorsement/);
assert.match(ia, /Citizen learning/);
assert.match(ia, /\/learn/);
assert.doesNotMatch(home, /candidate rankings|vote recommendations|party scorecards/i);

console.log("Citizen-first Civic Mandate experience checks passed.");
