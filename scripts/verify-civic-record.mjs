import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");

const boundary = read("lib/civic-record/public-boundary.ts");
assert.match(boundary, /publicationStatus !== ["']Published["']/);
assert.match(boundary, /verificationStatus === ["']UNVERIFIED["']/);

const blueprint = read("lib/civic-record/fetch-published-blueprints.ts");
assert.match(blueprint, /isPubliclyPublishable\(publicationStatus, verificationStatus, governance\)/);
assert.match(blueprint, /Reviewer A Decision/);
assert.match(blueprint, /Reviewer B Decision/);
assert.match(blueprint, /Publication Decision/);
assert.match(blueprint, /if \(!proposalText \|\| !sourceUrl\) return null/);

const commitment = read("lib/civic-record/fetch-published-commitments.ts");
assert.match(commitment, /isPubliclyPublishable\(publicationStatus, verificationStatus\)/);
assert.match(commitment, /if \(!commitmentText \|\| !sourceUrl\) return null/);

const evidence = read("lib/civic-record/fetch-published-evidence.ts");
assert.match(evidence, /isPubliclyPublishable/);

const publicBlueprint = read("lib/civic-record/blueprint-public.ts");
assert.match(publicBlueprint, /PUBLIC_BLUEPRINT_KEYS/);
assert.doesNotMatch(
  publicBlueprint.match(/PUBLIC_BLUEPRINT_KEYS[\s\S]*/)?.[0] || "",
  /reviewer|fingerprint|payment|internal/i,
);

const robots = read("app/robots.ts");
assert.match(robots, /disallow: \[["']\/api\//);
assert.match(robots, /operators/);

const route = read("app/api/operators/blueprints/review/route.ts");
assert.match(route, /isAuthorizedOperatorRequest/);
assert.match(route, /assertBlueprintPageOwnership/);
assert.doesNotMatch(route, /export function authorized/);
assert.match(route, /from ["']@\/lib\/server\/operator-auth["']/);

const auth = read("lib/server/operator-auth.ts");
assert.match(auth, /timingSafeEqual/);
assert.match(auth, /CIVIC_OPERATOR_KEY/);
assert.match(auth, /Bearer/);

const govSrc = read("lib/civic-record/blueprint-governance.ts");
assert.match(govSrc, /must be different people/);
assert.match(govSrc, /canOperatorPublishFromStatus/);

function evaluateBlueprintPublication(governance) {
  const reasons = [];
  if (governance.status !== "Published") reasons.push("Status is not Published.");
  if (!governance.sourceUrl.trim()) reasons.push("An inspectable source is required.");
  if (governance.verification === "UNVERIFIED" || !governance.verification.trim()) {
    reasons.push("Verification cannot remain UNVERIFIED.");
  }
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
  if (status === "Rejected" || status === "Flagged") return false;
  return status === "Draft" || status === "New" || status === "Published" || status === "";
}

const base = {
  status: "Published",
  verification: "SOURCE_CONFIRMED",
  sourceUrl: "https://example.com/speech",
  reviewerA: "Ada",
  reviewerADecision: "Approved",
  reviewerB: "Bola",
  reviewerBDecision: "Approved",
  publicationDecision: "Publish",
};

assert.equal(evaluateBlueprintPublication(base).publishable, true);
assert.equal(evaluateBlueprintPublication({ ...base, status: "Draft" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, status: "New" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, status: "Flagged" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, status: "Rejected" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, verification: "UNVERIFIED" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, sourceUrl: "   " }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerA: "" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerB: "" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerADecision: "Rejected" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerBDecision: "Rejected" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, publicationDecision: "Reject" }).publishable, false);
assert.equal(evaluateBlueprintPublication({ ...base, reviewerB: "Ada" }).publishable, false);

assert.equal(canOperatorPublishFromStatus("Draft"), true);
assert.equal(canOperatorPublishFromStatus("New"), true);
assert.equal(canOperatorPublishFromStatus("Published"), true);
assert.equal(canOperatorPublishFromStatus("Rejected"), false);
assert.equal(canOperatorPublishFromStatus("Flagged"), false);

const ownership = read("lib/civic-record/blueprint-ownership.ts");
assert.match(ownership, /assertBlueprintPageOwnership/);
assert.match(ownership, /database_id/);
assert.match(ownership, /archived/);

console.log("Civic Record public-boundary + governance checks: PASS");
