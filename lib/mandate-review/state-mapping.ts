/**
 * Backward-compatible mapping between existing Notion Status values
 * and the community-submission review lifecycle.
 *
 * Existing live values observed in code:
 * - New (default on submit)
 * - Published (public pulse filter)
 * Blueprint statuses (Approved/Rejected/etc.) are a different record type.
 */

import type { ReviewStatus } from "./lifecycle";

/** Known Notion Status select values on the community mandate database. */
export type NotionCommunityStatus =
  | "New"
  | "Published"
  | "Rejected"
  | "Under Review"
  | "Clarification"
  | "Withdrawn"
  | string;

/**
 * Map storage status → lifecycle status.
 * Unknown values map to under_review so operators must act explicitly.
 */
export function notionStatusToLifecycle(status: string | null | undefined): ReviewStatus {
  const s = (status || "").trim();
  switch (s) {
    case "New":
      return "submitted";
    case "Clarification":
    case "Clarification Required":
      return "clarification_required";
    case "Under Review":
    case "In Review":
      return "under_review";
    case "Evidence Review":
      return "evidence_review";
    case "Awaiting Publication":
    case "Ready to Publish":
      return "awaiting_publication_decision";
    case "Published":
      return "published";
    case "Rejected":
      return "rejected";
    case "Withdrawn":
      return "withdrawn";
    case "Response Recorded":
      return "response_recorded";
    case "Implementation Reported":
      return "implementation_reported";
    case "Independently Verified":
      return "independently_verified";
    case "Closed":
    case "Closed with Evidence":
      return "closed_with_evidence";
    default:
      return "under_review";
  }
}

/**
 * Map lifecycle → preferred Notion Status label for writes.
 * Only used when operator review API persists; does not rewrite history silently.
 */
export function lifecycleToNotionStatus(status: ReviewStatus): string {
  switch (status) {
    case "submitted":
      return "New";
    case "clarification_required":
      return "Clarification";
    case "under_review":
      return "Under Review";
    case "evidence_review":
      return "Evidence Review";
    case "awaiting_publication_decision":
      return "Awaiting Publication";
    case "published":
      return "Published";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Withdrawn";
    case "response_recorded":
      return "Response Recorded";
    case "implementation_reported":
      return "Implementation Reported";
    case "independently_verified":
      return "Independently Verified";
    case "closed_with_evidence":
      return "Closed with Evidence";
    default:
      return "Under Review";
  }
}

export const COMPATIBILITY_NOTES = [
  "Existing Notion Status \"New\" maps to lifecycle submitted.",
  "Existing Notion Status \"Published\" maps to lifecycle published.",
  "Blueprint dual-review statuses are a different record type and are not mapped here.",
  "No automatic migration rewrites historical pages; operator actions write explicitly.",
] as const;
