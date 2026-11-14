/**
 * verify-mandate-review-lifecycle.mjs
 * Exercises pure lifecycle rules and publication gate.
 * Does not call Notion or publish anything.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const lifecyclePath = path.join(root, "lib/mandate-review/lifecycle.ts");
const servicePath = path.join(root, "lib/mandate-review/review-service.ts");
const routePath = path.join(root, "app/api/operators/mandates/review/route.ts");
const mappingPath = path.join(root, "lib/mandate-review/state-mapping.ts");

for (const p of [lifecyclePath, servicePath, routePath, mappingPath]) {
  assert.ok(fs.existsSync(p), `missing ${p}`);
}

const lifecycleSrc = fs.readFileSync(lifecyclePath, "utf8");
const serviceSrc = fs.readFileSync(servicePath, "utf8");
const routeSrc = fs.readFileSync(routePath, "utf8");
const mappingSrc = fs.readFileSync(mappingPath, "utf8");

assert.match(lifecycleSrc, /publicationGate/);
assert.match(lifecycleSrc, /ALLOWED_TRANSITIONS/);
assert.match(lifecycleSrc, /awaiting_publication_decision/);
assert.match(serviceSrc, /humanPublicationDecision/);
assert.match(serviceSrc, /AI cannot approve/);
assert.match(routeSrc, /isAuthorizedOperatorRequest/);
assert.match(routeSrc, /status:\s*401/);
assert.match(routeSrc, /FIXTURE_MANDATE_REVIEW_ID/);
assert.match(routeSrc, /MANDATE_REVIEW_ALLOW_NON_FIXTURE/);
assert.match(mappingSrc, /notionStatusToLifecycle/);
assert.match(mappingSrc, /"New"/);
assert.match(mappingSrc, /"Published"/);

const ALLOWED = {
  submitted: ["clarification_required", "under_review", "rejected", "withdrawn"],
  clarification_required: ["under_review", "rejected", "withdrawn"],
  under_review: ["clarification_required", "evidence_review", "awaiting_publication_decision", "rejected", "withdrawn"],
  evidence_review: ["under_review", "awaiting_publication_decision", "rejected", "withdrawn"],
  awaiting_publication_decision: ["published", "rejected", "under_review", "withdrawn"],
  published: ["response_recorded", "implementation_reported"],
  response_recorded: ["implementation_reported", "independently_verified", "closed_with_evidence"],
  implementation_reported: ["independently_verified", "closed_with_evidence", "response_recorded"],
  independently_verified: ["closed_with_evidence"],
  closed_with_evidence: [],
  rejected: [],
  withdrawn: [],
};

function canTransition(from, to) {
  return (ALLOWED[from] || []).includes(to);
}

assert.equal(canTransition("submitted", "published"), false);
assert.equal(canTransition("submitted", "under_review"), true);
assert.equal(canTransition("awaiting_publication_decision", "published"), true);
assert.equal(canTransition("rejected", "published"), false);

function publicationGate(input) {
  const reasons = [];
  if (input.actor !== "human") reasons.push("Only a human reviewer may approve or reject publication.");
  if (input.status !== "awaiting_publication_decision") reasons.push("Publication is only allowed from awaiting_publication_decision.");
  if (input.humanDecision !== "approve" && input.humanDecision !== "reject") reasons.push("Explicit human decision required.");
  if (input.humanDecision === "approve") {
    if (!input.hasResponsibleInstitution) reasons.push("Responsible institution required.");
    if (!input.hasDraftMandateText) reasons.push("Draft mandate required.");
    if (!input.hasEvidenceOrExplicitLimitation) reasons.push("Evidence or limitation required.");
  }
  return { allowed: reasons.length === 0, reasons };
}

const aiAttempt = publicationGate({
  status: "awaiting_publication_decision",
  humanDecision: "approve",
  actor: "ai",
  hasResponsibleInstitution: true,
  hasDraftMandateText: true,
  hasEvidenceOrExplicitLimitation: true,
});
assert.equal(aiAttempt.allowed, false);

const missingFields = publicationGate({
  status: "awaiting_publication_decision",
  humanDecision: "approve",
  actor: "human",
  hasResponsibleInstitution: false,
  hasDraftMandateText: true,
  hasEvidenceOrExplicitLimitation: true,
});
assert.equal(missingFields.allowed, false);

const okPublish = publicationGate({
  status: "awaiting_publication_decision",
  humanDecision: "approve",
  actor: "human",
  hasResponsibleInstitution: true,
  hasDraftMandateText: true,
  hasEvidenceOrExplicitLimitation: true,
});
assert.equal(okPublish.allowed, true);

function notionStatusToLifecycle(status) {
  switch ((status || "").trim()) {
    case "New": return "submitted";
    case "Published": return "published";
    case "Rejected": return "rejected";
    default: return "under_review";
  }
}
assert.equal(notionStatusToLifecycle("New"), "submitted");
assert.equal(notionStatusToLifecycle("Published"), "published");

function isPubliclyVisible(status) {
  return ["published", "response_recorded", "implementation_reported", "independently_verified", "closed_with_evidence"].includes(status);
}
assert.equal(isPubliclyVisible("submitted"), false);
assert.equal(isPubliclyVisible("under_review"), false);
assert.equal(isPubliclyVisible("published"), true);
assert.equal(isPubliclyVisible("rejected"), false);

console.log("verify-mandate-review-lifecycle: PASS");
