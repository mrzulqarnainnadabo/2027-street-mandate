/** Statement / verification labels for public civic records (Mandate product). */

export const NOT_PUBLICLY_SPECIFIED = "Not publicly specified";

export const PUBLISHED_DEMAND_LABEL = "Citizen demand · Reviewed";

export const PUBLISHED_DEMAND_HINT =
  "This is a citizen demand for public delivery — not a claim that the service was delivered, not a vote, and not an endorsement of any candidate or party.";

export type StatementClass =
  | "OFFICIAL_RECORD"
  | "ACTOR_STATEMENT"
  | "CITIZEN_REPORT"
  | "MEDIA_REPORT"
  | "ISEYC_FINDING"
  | "ISEYC_DERIVED";

export type VerificationStatus =
  | "UNVERIFIED"
  | "SOURCE_CONFIRMED"
  | "CONTENT_CORROBORATED"
  | "DISPUTED"
  | "CORRECTED"
  | "SUPERSEDED"
  | "WITHDRAWN";
