export type BlueprintGovernance = {
  status: string;
  verification: string;
  sourceUrl: string;
  reviewerA: string;
  reviewerADecision: string;
  reviewerB: string;
  reviewerBDecision: string;
  publicationDecision: string;
};

export type BlueprintPublicationDecision =
  | { publishable: true }
  | { publishable: false; reasons: string[] };

/**
 * Complete public-publication gate for Blueprint records.
 * Status=Published alone is never sufficient.
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
 */
export function canOperatorPublishFromStatus(status: string): boolean {
  if (status === "Rejected" || status === "Flagged") return false;
  return status === "Draft" || status === "New" || status === "Published" || status === "";
}

export function reviewLifecycle(status: string, governance: BlueprintGovernance): string {
  if (status === "Draft" || status === "New") return "Draft";
  if (status === "Flagged" || status === "Rejected") return "Rejected / held";
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
