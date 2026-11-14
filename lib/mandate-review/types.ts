/**
 * Internal review workspace types for community submissions → public mandates.
 * Private fields must never leak to public CommunityRecord API.
 */

import type { ReviewStatus } from "./lifecycle";

export type EvidenceAttachment = {
  id: string;
  label: string;
  sourceType: "primary" | "publisher_supported" | "secondary" | "community_reported";
  url?: string;
  geography?: string;
  reportingPeriod?: string;
  limitations: string[];
  relevanceNote?: string;
};

export type SpecialistRecommendation = {
  department: "civic" | "education" | "health" | "software-technology";
  advisorLabel: string;
  recommendation: string;
  at: string;
};

export type AuditEntry = {
  at: string;
  actor: "human" | "ai" | "system";
  action: string;
  fromStatus?: ReviewStatus;
  toStatus?: ReviewStatus;
  note?: string;
};

export type MandateReviewRecord = {
  id: string;
  fixture?: boolean;
  submissionText: string;
  state: string;
  lga?: string;
  duty: string;
  office: string;
  submittedAt: string;
  status: ReviewStatus;
  clarificationHistory: { at: string; question: string; response?: string }[];
  evidence: EvidenceAttachment[];
  evidenceLimitations: string[];
  specialistRecommendations: SpecialistRecommendation[];
  draftMandateText?: string;
  responsibleInstitution?: string;
  internalNotes: string[];
  contributorPrivate?: { deviceId?: string; ageBand?: string; gender?: string };
  audit: AuditEntry[];
  humanPublicationDecision?: "approve" | "reject" | null;
};

export type PublicMandateView = {
  id: string;
  publicationStatus: "published";
  text: string;
  duty: string;
  state: string;
  lga: string | null;
  officeLabel: string | null;
  responsibleInstitution: string | null;
  evidenceRefIds: string[];
  limitations: string[];
  status: ReviewStatus;
};

export function toPublicMandateView(r: MandateReviewRecord): PublicMandateView | null {
  if (
    r.status !== "published" &&
    r.status !== "response_recorded" &&
    r.status !== "implementation_reported" &&
    r.status !== "independently_verified" &&
    r.status !== "closed_with_evidence"
  ) {
    return null;
  }
  return {
    id: r.id,
    publicationStatus: "published",
    text: (r.draftMandateText || r.submissionText).trim(),
    duty: r.duty,
    state: r.state,
    lga: r.lga || null,
    officeLabel: r.office || null,
    responsibleInstitution: r.responsibleInstitution || null,
    evidenceRefIds: r.evidence.map((e) => e.id),
    limitations: r.evidenceLimitations,
    status: r.status,
  };
}
