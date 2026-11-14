/**
 * Civic Mandate community-submission review lifecycle (pure).
 * Distinct from Blueprint dual-reviewer governance.
 * Publication is always a human decision — never AI.
 */

export const REVIEW_STATUSES = [
  "submitted",
  "clarification_required",
  "under_review",
  "evidence_review",
  "awaiting_publication_decision",
  "published",
  "rejected",
  "withdrawn",
  "response_recorded",
  "implementation_reported",
  "independently_verified",
  "closed_with_evidence",
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** Allowed transitions. Invalid transitions are rejected. */
export const ALLOWED_TRANSITIONS: Record<ReviewStatus, readonly ReviewStatus[]> = {
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

export type TransitionResult =
  | { ok: true; from: ReviewStatus; to: ReviewStatus }
  | { ok: false; error: string; from: ReviewStatus; to: ReviewStatus };

export function canTransition(from: ReviewStatus, to: ReviewStatus): boolean {
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
}

export function transition(from: ReviewStatus, to: ReviewStatus): TransitionResult {
  if (from === to) {
    return { ok: false, error: "No-op transition is not allowed.", from, to };
  }
  if (!canTransition(from, to)) {
    return {
      ok: false,
      error: `Invalid transition: ${from} → ${to}.`,
      from,
      to,
    };
  }
  return { ok: true, from, to };
}

/** Statuses visible on public APIs (published wall / community-records). */
export function isPubliclyVisible(status: ReviewStatus): boolean {
  return (
    status === "published" ||
    status === "response_recorded" ||
    status === "implementation_reported" ||
    status === "independently_verified" ||
    status === "closed_with_evidence"
  );
}

/** Publication requires explicit human action — never AI auto-approve. */
export function publicationGate(input: {
  status: ReviewStatus;
  humanDecision: "approve" | "reject" | null;
  actor: "human" | "ai" | "system";
  hasResponsibleInstitution: boolean;
  hasDraftMandateText: boolean;
  hasEvidenceOrExplicitLimitation: boolean;
}): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (input.actor !== "human") {
    reasons.push("Only a human reviewer may approve or reject publication.");
  }
  if (input.status !== "awaiting_publication_decision") {
    reasons.push("Publication is only allowed from awaiting_publication_decision.");
  }
  if (input.humanDecision !== "approve" && input.humanDecision !== "reject") {
    reasons.push("Explicit human decision (approve or reject) is required.");
  }
  if (input.humanDecision === "approve") {
    if (!input.hasResponsibleInstitution) {
      reasons.push("Responsible institution is required before publication.");
    }
    if (!input.hasDraftMandateText) {
      reasons.push("Draft public mandate text is required before publication.");
    }
    if (!input.hasEvidenceOrExplicitLimitation) {
      reasons.push("At least one evidence reference or explicit limitation note is required.");
    }
  }
  return { allowed: reasons.length === 0, reasons };
}
