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

export function evaluateBlueprintPublication(
  governance: BlueprintGovernance,
): BlueprintPublicationDecision {
  const reasons: string[] = [];

  if (governance.status !== "Published") reasons.push("Status is not Published.");
  if (!governance.sourceUrl.trim()) reasons.push("An inspectable source is required.");
  if (governance.verification === "UNVERIFIED") reasons.push("Verification cannot remain UNVERIFIED.");
  if (governance.reviewerA.trim() === "") reasons.push("Reviewer A is required.");
  if (governance.reviewerB.trim() === "") reasons.push("Reviewer B is required.");
  if (governance.reviewerADecision !== "Approved") reasons.push("Reviewer A must approve.");
  if (governance.reviewerBDecision !== "Approved") reasons.push("Reviewer B must approve.");
  if (governance.publicationDecision !== "Publish") reasons.push("Publication Decision must be Publish.");

  return reasons.length ? { publishable: false, reasons } : { publishable: true };
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
  ) return "Publication approved";
  return "Under review";
}
