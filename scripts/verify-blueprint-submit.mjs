/**
 * Contract tests for Public Blueprint intake (no network / no Notion).
 */
import assert from "node:assert/strict";

function assertNotRankingCopy(text) {
  const bad =
    /\b(rank(ed|ing)?|score(card)?|%\s*match|endors(e|ement)|vote\s+for|leading\s+candidate|most\s+popular)\b/i;
  return !bad.test(text);
}

function validateBlueprintDraft(input) {
  const errors = [];
  if (!input.actorDisplayName?.trim()) errors.push("Actor display name is required.");
  if (!input.officeSought?.trim()) errors.push("Office sought is required.");
  if (!input.dutyOrPolicyArea?.trim()) errors.push("Duty / policy area is required.");
  if (!input.proposalText?.trim() || input.proposalText.trim().length < 20) {
    errors.push("Proposal text must be a concrete public statement (min ~20 characters).");
  }
  if (!input.sourceUrlOrCitation?.trim()) {
    errors.push("Source URL or citation is required — no undocumented claims.");
  }
  if (input.proposalText && !assertNotRankingCopy(input.proposalText)) {
    errors.push("Proposal text must not contain ranking/score/endorsement language from ISEYC voice.");
  }
  return { ok: errors.length === 0, errors };
}

const valid = validateBlueprintDraft({
  actorDisplayName: "Pilot Actor",
  officeSought: "President",
  dutyOrPolicyArea: "Jobs & Economic Opportunity",
  proposalText: "Establish transparent skills centres that lead to paid work within twelve months.",
  sourceUrlOrCitation: "https://example.org/public-manifesto",
});
assert.equal(valid.ok, true, valid.errors.join("; "));

const noSource = validateBlueprintDraft({
  actorDisplayName: "Pilot Actor",
  officeSought: "President",
  dutyOrPolicyArea: "Health",
  proposalText: "Every public primary health centre stocked with essential medicines.",
  sourceUrlOrCitation: "",
});
assert.equal(noSource.ok, false);

const ranked = validateBlueprintDraft({
  actorDisplayName: "Pilot Actor",
  officeSought: "Governor",
  dutyOrPolicyArea: "Education",
  proposalText: "We are the leading candidate with the best score on education reform.",
  sourceUrlOrCitation: "https://example.org/x",
});
assert.equal(ranked.ok, false);

const intakeCopy = "Received. This is not publication. ISEYC dual-review is required before any public Blueprint record appears.";
assert.match(intakeCopy, /not publication/i);
assert.match(intakeCopy, /dual-review/i);

console.log("verify-blueprint-submit: ok");
