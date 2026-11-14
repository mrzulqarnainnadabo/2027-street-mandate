/**
 * Labelled synthetic fixture — NOT a real community submission.
 * Use only in tests and controlled review demos.
 */

import type { MandateReviewRecord } from "./types";

export const FIXTURE_MANDATE_REVIEW_ID = "fixture-mandate-review-2026-11-14-001";

export function createFixtureReviewRecord(
  overrides: Partial<MandateReviewRecord> = {},
): MandateReviewRecord {
  return {
    id: FIXTURE_MANDATE_REVIEW_ID,
    fixture: true,
    submissionText:
      "TEST FIXTURE: Primary health facilities in the pilot LGA often lack publicly posted information about which services are available during clinic hours.",
    state: "Plateau",
    lga: "Jos North",
    duty: "Health",
    office: "State Government",
    submittedAt: "2026-11-14T10:00:00.000Z",
    status: "submitted",
    clarificationHistory: [],
    evidence: [],
    evidenceLimitations: [],
    specialistRecommendations: [],
    internalNotes: ["TEST FIXTURE — do not publish to production."],
    contributorPrivate: { deviceId: "fixture-device" },
    audit: [
      {
        at: "2026-11-14T10:00:00.000Z",
        actor: "system",
        action: "created_fixture",
        note: "Synthetic record for workflow tests only.",
      },
    ],
    humanPublicationDecision: null,
    ...overrides,
  };
}
