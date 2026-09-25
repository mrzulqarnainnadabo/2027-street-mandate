/**
 * Pure Blueprint review decision rules (no Notion I/O).
 * Used by the server mutation service and structure/unit tests.
 */

export type ReviewDecision = "Approved" | "Rejected";

export type ReviewActionKind = "review_a" | "review_b" | "publish" | "reject";

export type RuleResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Decision must be explicit. Notes must never imply approve/reject.
 * Accepts Approved|Rejected (Notion values) or approve|reject aliases.
 */
export function resolveReviewDecision(
  decision: string | undefined,
): ReviewDecision | null {
  const d = (decision || "").trim();
  if (d === "Approved" || d === "approve") return "Approved";
  if (d === "Rejected" || d === "reject") return "Rejected";
  return null;
}

export function validateReviewerIdentity(reviewer: string): RuleResult {
  if (!reviewer.trim()) {
    return { ok: false, status: 400, error: "Reviewer name is required." };
  }
  return { ok: true };
}

export function validateRejectionNotes(
  decision: ReviewDecision,
  notes: string,
): RuleResult {
  if (decision === "Rejected" && notes.trim().length < 8) {
    return {
      ok: false,
      status: 400,
      error: "Rejection requires a meaningful internal reason (at least 8 characters).",
    };
  }
  return { ok: true };
}

export function validateHoldNotes(notes: string): RuleResult {
  if (notes.trim().length < 8) {
    return {
      ok: false,
      status: 400,
      error: "Hold/rejection requires a meaningful internal reason (at least 8 characters).",
    };
  }
  return { ok: true };
}

export function validateReviewerBPrerequisites(input: {
  reviewerA: string;
  reviewerADecision: string;
  reviewerBCandidate: string;
}): RuleResult {
  if (input.reviewerADecision !== "Approved") {
    return {
      ok: false,
      status: 409,
      error: "Reviewer B cannot act until Reviewer A has approved.",
    };
  }
  const a = input.reviewerA.trim().toLowerCase();
  const b = input.reviewerBCandidate.trim().toLowerCase();
  if (a && b && a === b) {
    return {
      ok: false,
      status: 409,
      error: "Reviewer A and Reviewer B must be different reviewers.",
    };
  }
  return { ok: true };
}

export function validateReviewerANotSameAsB(input: {
  reviewerACandidate: string;
  reviewerB: string;
}): RuleResult {
  const a = input.reviewerACandidate.trim().toLowerCase();
  const b = input.reviewerB.trim().toLowerCase();
  if (a && b && a === b) {
    return {
      ok: false,
      status: 409,
      error: "Reviewer A and Reviewer B must be different reviewers.",
    };
  }
  return { ok: true };
}

export function institutionalConflictMessage(): string {
  return "Publication was not completed. The record changed before the request was processed. Review the current governance state and try again if appropriate.";
}

export function publishedRecordLockedMessage(): string {
  return "Published Blueprint records are locked against ordinary review mutations. A separate reopen/correction protocol is required (governance decision — not available on this path).";
}
