/**
 * Statement classes for the Civic Record (Document 10 alignment).
 * Pilot: citizen demands are CITIZEN_REPORT after human Publish.
 * Do not claim CONTENT-CORROBORATED or ISEYC_FINDING on public pages yet.
 */

export const STATEMENT_CLASS = {
  OFFICIAL_RECORD: "OFFICIAL_RECORD",
  ACTOR_STATEMENT: "ACTOR_STATEMENT",
  CITIZEN_REPORT: "CITIZEN_REPORT",
  MEDIA_REPORT: "MEDIA_REPORT",
  ISEYC_FINDING: "ISEYC_FINDING",
  ISEYC_DERIVED: "ISEYC_DERIVED",
} as const;

export type StatementClass = (typeof STATEMENT_CLASS)[keyof typeof STATEMENT_CLASS];

export const VERIFICATION_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  SOURCE_CONFIRMED: "SOURCE_CONFIRMED",
  CONTENT_CORROBORATED: "CONTENT_CORROBORATED",
  DISPUTED: "DISPUTED",
  CORRECTED: "CORRECTED",
  SUPERSEDED: "SUPERSEDED",
  WITHDRAWN: "WITHDRAWN",
} as const;

/** Public label for a published Civic Mandate row */
export const PUBLISHED_DEMAND_LABEL = "Citizen demand · Reviewed";

export const PUBLISHED_DEMAND_HINT =
  "This is what a citizen asked public office to deliver. It is not proof of delivery, not a vote, and not an endorsement.";

export const NOT_PUBLICLY_SPECIFIED = "Not publicly specified";
