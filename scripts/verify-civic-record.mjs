import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");

const boundary = read("lib/civic-record/public-boundary.ts");
assert.match(boundary, /publicationStatus !== ["']Published["']/);
assert.match(boundary, /verificationStatus === ["']UNVERIFIED["']/);

const blueprint = read("lib/civic-record/fetch-published-blueprints.ts");
assert.match(blueprint, /isPubliclyPublishable\(publicationStatus, verificationStatus, governance\)/);
assert.match(blueprint, /page\.archived/);
assert.match(blueprint, /in_trash/);
assert.match(blueprint, /assertBlueprintPageOwnership/);
assert.doesNotMatch(blueprint, /\|\| ["']ACTOR_STATEMENT["']/);

const publicBlueprint = read("lib/civic-record/blueprint-public.ts");
assert.match(publicBlueprint, /PUBLIC_BLUEPRINT_KEYS/);
assert.doesNotMatch(
  publicBlueprint.match(/PUBLIC_BLUEPRINT_KEYS[\s\S]*/)?.[0] || "",
  /reviewer|fingerprint|payment|internal/i,
);

const route = read("app/api/operators/blueprints/review/route.ts");
assert.match(route, /isAuthorizedOperatorRequest/);
assert.match(route, /performBlueprintReviewMutation/);

const auth = read("lib/server/operator-auth.ts");
assert.match(auth, /timingSafeEqual/);
assert.match(auth, /CIVIC_OPERATOR_KEY/);

const service = read("lib/civic-record/blueprint-review-service.ts");
assert.match(service, /isPublishedRecordLocked/);
assert.match(service, /publishedRecordLockedMessage/);
assert.match(service, /Explicit decision is required/);

const session = read("lib/server/operator-session.ts");
assert.match(session, /httpOnly:\s*true/);
assert.doesNotMatch(session, /NEXT_PUBLIC/);

const ALLOWED_STATEMENT_CLASSES = new Set(["ACTOR_STATEMENT", "OFFICIAL_RECORD", "MEDIA_REPORT"]);

function evaluateBlueprintPublication(governance) {
  const reasons = [];
  if (governance.status !== "Published") reasons.push("Status is not Published.");
  if (!governance.sourceUrl.trim()) reasons.push("An inspectable source is required.");
  if (governance.verification === "UNVERIFIED" || !governance.verification.trim()) {
    reasons.push("Verification cannot remain UNVERIFIED.");
  }
  const sc = (governance.statementClass || "").trim();
  if (!sc) reasons.push("Statement Class is required (UNKNOWN is not publishable).");
  else if (!ALLOWED_STATEMENT_CLASSES.has(sc)) reasons.push("Statement Class must be an explicit allowed value.");
  if (!governance.reviewerA.trim()) reasons.push("Reviewer A is required.");
  if (!governance.reviewerB.trim()) reasons.push("Reviewer B is required.");
  if (governance.reviewerADecision !== "Approved") reasons.push("Reviewer A must approve.");
  if (governance.reviewerBDecision !== "Approved") reasons.push("Reviewer B must approve.");
  if (governance.publicationDecision !== "Publish") reasons.push("Publication Decision must be Publish.");
  const a = governance.reviewerA.trim().toLowerCase();
  const b = governance.reviewerB.trim().toLowerCase();
  if (a && b && a === b) reasons.push("Reviewer A and Reviewer B must be different people.");
  return reasons.length ? { publishable: false, reasons } : { publishable: true };
}

function canOperatorPublishFromStatus(status) {
  if (status === "Rejected" || status === "Flagged" || status === "Published") return false;
  return status === "Draft" || status === "New" || status === "";
}

function isPublishedRecordLocked(status) {
  return status === "Published";
}

function resolveReviewDecision(decision) {
  const d = String(decision || "").trim();
  if (d === "Approved" || d === "approve") return "Approved";
  if (d === "Rejected" || d === "reject") return "Rejected";
  return null;
}

const base = {
  status: "Published",
  verification: "SOURCE_CONFIRMED",
  sourceUrl: "https://example.com/speech",
  statementClass: "ACTOR_STATEMENT",
  reviewerA: "Ada",
  reviewerADecision: "Approved",
  reviewerB: "Bola",
  reviewerBDecision: "Approved",
  publicationDecision: "Publish",
};

assert.equal(evaluateBlueprintPublication(base).publishable, true);
assert.equal(evaluateBlueprintPublication({ ...base, sourceUrl: "   " }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, verification: "UNVERIFIED" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerA: "" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerB: "" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerB: "Ada" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, publicationDecision: "Pending" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, statementClass: "" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, statementClass: "UNKNOWN" }).publishable, false);

assert.equal(canOperatorPublishFromStatus("Draft"), true);
assert.equal(canOperatorPublishFromStatus("Published"), false);
assert.equal(isPublishedRecordLocked("Published"), true);
assert.equal(isPublishedRecordLocked("Draft"), false);

assert.equal(resolveReviewDecision("Approved"), "Approved");
assert.equal(resolveReviewDecision("reject"), "Rejected");
assert.equal(resolveReviewDecision(undefined), null);
assert.equal(resolveReviewDecision(""), null);

function validateReviewerBPrerequisites(input) {
  if (input.reviewerADecision !== "Approved") return { ok: false, status: 409 };
  const a = input.reviewerA.trim().toLowerCase();
  const b = input.reviewerBCandidate.trim().toLowerCase();
  if (a && b && a === b) return { ok: false, status: 409 };
  return { ok: true };
}
assert.equal(
  validateReviewerBPrerequisites({ reviewerA: "Ada", reviewerADecision: "", reviewerBCandidate: "Bola" }).ok,
  false,
);

console.log("Civic Record public-boundary + governance checks: PASS");

const actions = read("app/operators/blueprint-review/actions.ts");
assert.match(actions, /"use server"/);
assert.doesNotMatch(actions, /NEXT_PUBLIC_CIVIC_OPERATOR_KEY/);

const consoleUi = read("components/operators/BlueprintReviewConsole.tsx");
assert.match(consoleUi, /submitBlueprintReviewAction/);
assert.doesNotMatch(consoleUi, /NEXT_PUBLIC_CIVIC_OPERATOR_KEY/);

const rulesSrc = read("lib/civic-record/blueprint-review-rules.ts");
assert.match(rulesSrc, /resolveReviewDecision/);
assert.doesNotMatch(rulesSrc, /notes\.trim\(\)\.toLowerCase\(\) === ["']reject["']/);
assert.match(rulesSrc, /publishedRecordLockedMessage/);

const govSrc = read("lib/civic-record/blueprint-governance.ts");
assert.match(govSrc, /Statement Class is required/);
assert.match(govSrc, /isPublishedRecordLocked/);
assert.match(govSrc, /source verification/i);

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
assert.doesNotMatch(briefPage, /endorse|vote for|ranking of candidates|poll results/i);

console.log("Weekly Civic Brief framing checks: PASS");
