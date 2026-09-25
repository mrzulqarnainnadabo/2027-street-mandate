export type BlueprintGovernance = {
  status: string;
  verification: string;
  sourceUrl: string;
  statementClass: string;
  reviewerA: string;
  reviewerADecision: string;
  reviewerB: string;
  reviewerBDecision: string;
  publicationDecision: string;
};

export type BlueprintPublicationDecision =
  | { publishable: true }
  | { publishable: false; reasons: string[] };

const ALLOWED_STATEMENT_CLASSES = new Set([
  "ACTOR_STATEMENT",
  "OFFICIAL_RECORD",
  "MEDIA_REPORT",
]);

/**
 * Complete public-publication gate for Blueprint records.
 * Status=Published alone is never sufficient.
 *
 * Verification means: source contains the recorded statement (source verification).
 * It does NOT mean ISEYC independently certified the political truth of the proposal.
 */
export function evaluateBlueprintPublication(
  governance: BlueprintGovernance,
): BlueprintPublicationDecision {
  const reasons: string[] = [];

  if (governance.status !== "Published") {
    reasons.push("Status is not Published.");
  }
  if (!governance.sourceUrl.trim()) {
    reasons.push("An inspectable source is required.");
  }
  if (governance.verification === "UNVERIFIED" || !governance.verification.trim()) {
    reasons.push("Verification cannot remain UNVERIFIED.");
  }
  const sc = (governance.statementClass || "").trim();
  if (!sc) {
    reasons.push("Statement Class is required (UNKNOWN is not publishable).");
  } else if (!ALLOWED_STATEMENT_CLASSES.has(sc)) {
    reasons.push("Statement Class must be an explicit allowed value.");
  }
  if (!governance.reviewerA.trim()) {
    reasons.push("Reviewer A is required.");
  }
  if (!governance.reviewerB.trim()) {
    reasons.push("Reviewer B is required.");
  }
  if (governance.reviewerADecision !== "Approved") {
    reasons.push("Reviewer A must approve.");
  }
  if (governance.reviewerBDecision !== "Approved") {
    reasons.push("Reviewer B must approve.");
  }
  if (governance.publicationDecision !== "Publish") {
    reasons.push("Publication Decision must be Publish.");
  }
  const a = governance.reviewerA.trim().toLowerCase();
  const b = governance.reviewerB.trim().toLowerCase();
  if (a && b && a === b) {
    reasons.push("Reviewer A and Reviewer B must be different people.");
  }

  return reasons.length ? { publishable: false, reasons } : { publishable: true };
}

/**
 * Whether the operator "publish" action may run from the current Status.
 * Rejected / Flagged must not jump straight to Published without a human reopen.
 * Published is locked against normal mutation paths (see review service).
 */
export function canOperatorPublishFromStatus(status: string): boolean {
  if (status === "Rejected" || status === "Flagged" || status === "Published") return false;
  return status === "Draft" || status === "New" || status === "";
}

/**
 * Published records must not be altered through ordinary review/publish/reject actions.
 * A separate human-governed reopen/correction protocol is required (not implemented here).
 */
export function isPublishedRecordLocked(status: string): boolean {
  return status === "Published";
}

export function reviewLifecycle(status: string, governance: BlueprintGovernance): string {
  if (status === "Draft" || status === "New") return "Draft";
  if (status === "Flagged" || status === "Rejected") return "Rejected / held";
  if (status === "Published") return "Published (locked)";
  if (
    governance.reviewerA.trim() &&
    governance.reviewerADecision === "Approved" &&
    governance.reviewerB.trim() &&
    governance.reviewerBDecision === "Approved" &&
    governance.publicationDecision === "Publish"
  ) {
    return "Publication approved";
  }
  return "Under review";
}
