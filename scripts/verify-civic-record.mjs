import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");

const boundary = read("lib/civic-record/public-boundary.ts");
assert.match(boundary, /publicationStatus !== ["']Published["']/);
assert.match(boundary, /verificationStatus === ["']UNVERIFIED["']/);

const blueprint = read("lib/civic-record/blueprint-governance.ts");
assert.match(blueprint, /evaluateBlueprintPublication/);
assert.match(blueprint, /Reviewer A/);
assert.match(blueprint, /Reviewer B/);
assert.doesNotMatch(blueprint, /\|\| ["']ACTOR_STATEMENT["']/);

const publicBlueprint = read("lib/civic-record/blueprint-public.ts");
assert.match(publicBlueprint, /PUBLIC_BLUEPRINT_KEYS/);
assert.doesNotMatch(
  publicBlueprint.match(/PUBLIC_BLUEPRINT_KEYS[\s\S]*/)?.[0] || "",
  /reviewer|fingerprint|payment|internal/i,
);

const session = read("lib/server/operator-session.ts");
assert.doesNotMatch(session, /NEXT_PUBLIC/);

const ALLOWED_STATEMENT_CLASSES = new Set(["ACTOR_STATEMENT", "OFFICIAL_RECORD", "MEDIA_REPORT", "OTHER"]);

const actions = read("lib/civic-record/operator-blueprint.ts");
assert.doesNotMatch(actions, /NEXT_PUBLIC_CIVIC_OPERATOR_KEY/);

const consoleUi = read("components/operators/BlueprintReviewConsole.tsx");
assert.doesNotMatch(consoleUi, /NEXT_PUBLIC_CIVIC_OPERATOR_KEY/);

const rulesSrc = read("lib/civic-record/blueprint-review-rules.ts");
assert.doesNotMatch(rulesSrc, /notes\.trim\(\)\.toLowerCase\(\) === ["']reject["']/);
assert.match(rulesSrc, /publishedRecordLocked|isPublishedRecordLocked/);

const govSrc = read("lib/civic-record/blueprint-governance.ts");
assert.match(govSrc, /Statement Class is required/);
assert.match(govSrc, /isPublishedRecordLocked/);
assert.match(govSrc, /source verification/i);

console.log("Civic Record public-boundary + governance checks: PASS");
console.log("Operator review console structure checks: PASS");
console.log("Blueprint targeted hardening checks: PASS");

/* Weekly State Civic Brief — field instrument (PR #46) */
const weekOf = read("lib/week-of.ts");
assert.match(weekOf, /export function weekOfLabel/);
assert.match(weekOf, /mondayOffset/);

const briefPage = read("app/brief/page.tsx");
assert.match(briefPage, /from "@\/lib\/week-of"/);
assert.match(briefPage, /Weekly State Civic Brief/);
assert.match(briefPage, /Not a poll\. Not a ranking\. Not an endorsement\./);
assert.match(briefPage, /not a scoreboard/i);
assert.match(briefPage, /not a system failure/i);
// Allow explicit *negation* of endorsement/poll language; forbid positive campaign framing.
assert.doesNotMatch(briefPage, /\b(we endorse|endorses|vote for [A-Z]|ranking of candidates|poll results)\b/i);

console.log("Weekly Civic Brief framing checks: PASS");

// Dead "VoteCards" must not return — duty selection is DutyCards only (non-poll language).
assert.equal(fs.existsSync("components/VoteCards.tsx"), false, "VoteCards.tsx must remain deleted");
assert.equal(fs.existsSync("components/DutyCards.tsx"), true, "DutyCards.tsx required");

const publicVoice = read("lib/public-voice.ts");
for (const key of ["id", "sentence", "mandate", "duty", "office", "state", "lga", "created"]) {
  assert.match(publicVoice, new RegExp('"' + key + '"'));
}
for (const forbidden of ["Device Fingerprint", "Age Band", "Gender", "Resolution Status"]) {
  assert.match(publicVoice, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const notionSrc = read("lib/notion.ts");
assert.match(notionSrc, /Published mandate could not load right now/);
assert.match(notionSrc, /isNotionNotFound/);
console.log("verify-civic-record: public boundary + VoteCards removal OK");
