/**
 * ISEYC Civic Record — core types (foundation).
 * Parent concept: Demand → Blueprint → Commitment → Action → Evidence → Outcome
 * Mandate product remains citizen Demand only. Blueprint/Commitment are next modules.
 * NEVER introduce ranking, score, endorsement, or "match %" fields here.
 */

export const NOT_PUBLICLY_SPECIFIED = "Not publicly specified" as const;

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

export type PublicationStatus = "Draft" | "New" | "Published" | "Flagged" | "Rejected" | "Withdrawn";

/** Offices aligned with Civic Mandate OFFICES (+ clarity for sought office). */
export type OfficeSought =
  | "President"
  | "Vice President"
  | "Governor"
  | "Deputy Governor"
  | "Senator"
  | "House of Representatives"
  | "State House of Assembly"
  | "Other";

export type GeographyScope = {
  country: "Nigeria";
  state?: string;
  senatorialDistrict?: string;
  federalConstituency?: string;
  stateConstituency?: string;
  lga?: string;
  /** Ward/community: prefer internal; public only if policy allows */
  ward?: string;
};

/** Module A — already live as Civic Mandate rows */
export type CitizenDemandRecord = {
  id: string;
  statementClass: "CITIZEN_REPORT";
  sentence: string;
  duty: string;
  office: string;
  geography: GeographyScope;
  publicationStatus: PublicationStatus;
  createdAt: string;
  publishedAt?: string;
};

/** Module B — Public Blueprint Register (pilot schema) */
export type BlueprintProposal = {
  id: string;
  /** Display name of the political actor — public figure, not private citizen */
  actorDisplayName: string;
  officeSought: OfficeSought;
  politicalPlatform?: string | typeof NOT_PUBLICLY_SPECIFIED;
  dutyOrPolicyArea: string;
  proposalText: string;
  mechanism?: string | typeof NOT_PUBLICLY_SPECIFIED;
  target?: string | typeof NOT_PUBLICLY_SPECIFIED;
  timeline?: string | typeof NOT_PUBLICLY_SPECIFIED;
  funding?: string | typeof NOT_PUBLICLY_SPECIFIED;
  responsibleInstitution?: string | typeof NOT_PUBLICLY_SPECIFIED;
  sourceUrlOrCitation: string;
  sourceDate?: string | typeof NOT_PUBLICLY_SPECIFIED;
  version: string;
  statementClass: "ACTOR_STATEMENT" | "OFFICIAL_RECORD" | "MEDIA_REPORT";
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  geography?: GeographyScope;
  createdAt: string;
  updatedAt: string;
};

/** Module C — Accountability / commitments of those in office */
export type CommitmentStatus =
  | "Announced"
  | "Commitment recorded"
  | "Implementation reported"
  | "Evidence submitted"
  | "Evidence published"
  | "Ongoing"
  | "Delayed"
  | "Completed/closed"
  | "No public update";

export type CommitmentRecord = {
  id: string;
  officeHolderDisplayName: string;
  office: OfficeSought | string;
  dutyOrPolicyArea: string;
  commitmentText: string;
  responsibleInstitution?: string | typeof NOT_PUBLICLY_SPECIFIED;
  timeline?: string | typeof NOT_PUBLICLY_SPECIFIED;
  status: CommitmentStatus;
  sourceUrlOrCitation: string;
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  geography?: GeographyScope;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceRecord = {
  id: string;
  linkedCommitmentId?: string;
  linkedBlueprintId?: string;
  linkedDemandId?: string;
  title: string;
  sourceUrlOrCitation: string;
  evidenceType: "official" | "legislative" | "media" | "other";
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  createdAt: string;
};

/**
 * Relationship view — overlap of policy areas only.
 * FORBIDDEN: satisfaction %, ranking, endorsement language.
 */
export type PolicyAreaOverlap = {
  dutyOrPolicyArea: string;
  publishedDemandCount: number;
  publishedBlueprintProposalCount: number;
  note: "Inspect underlying records. This is not a score.";
};
