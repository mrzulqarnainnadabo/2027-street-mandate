import { NOT_PUBLICLY_SPECIFIED, type VerificationStatus } from "./types";
import { assertNotRankingCopy } from "./firewall";

export type BlueprintDraftInput = {
  actorDisplayName: string;
  officeSought: string;
  dutyOrPolicyArea: string;
  proposalText: string;
  sourceUrlOrCitation: string;
  mechanism?: string;
  target?: string;
  timeline?: string;
  funding?: string;
  politicalPlatform?: string;
  verificationStatus?: VerificationStatus;
};

export type BlueprintValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

function emptyToUnspecified(v?: string): string {
  const t = (v || "").trim();
  return t.length ? t : NOT_PUBLICLY_SPECIFIED;
}

/**
 * Validates a single pilot proposal row before operators set Published.
 * Does not talk to Notion — pure rules for Stage 2 quality.
 */
export function validateBlueprintDraft(input: BlueprintDraftInput): BlueprintValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.actorDisplayName?.trim()) errors.push("Actor display name is required.");
  if (!input.officeSought?.trim()) errors.push("Office sought is required.");
  if (!input.dutyOrPolicyArea?.trim()) errors.push("Duty / policy area is required.");
  if (!input.proposalText?.trim() || input.proposalText.trim().length < 20) {
    errors.push("Proposal text must be a concrete public statement (min ~20 characters).");
  }
  if (!input.sourceUrlOrCitation?.trim()) {
    errors.push("Source URL or citation is required — no undocumented claims.");
  }

  if (input.proposalText && !assertNotRankingCopy(input.proposalText)) {
    errors.push("Proposal text must not contain ranking/score/endorsement language from ISEYC voice.");
  }

  const optional = [
    input.mechanism,
    input.target,
    input.timeline,
    input.funding,
    input.politicalPlatform,
  ];
  if (optional.some((x) => x !== undefined && String(x).trim() === "")) {
    warnings.push(`Prefer explicit "${NOT_PUBLICLY_SPECIFIED}" over blank optional fields.`);
  }

  if (input.verificationStatus === "CONTENT_CORROBORATED") {
    warnings.push(
      "CONTENT_CORROBORATED is a high bar — pilot should usually stay SOURCE_CONFIRMED or UNVERIFIED."
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}

/** Normalize optional blanks for storage */
export function normalizeBlueprintOptionals(input: BlueprintDraftInput) {
  return {
    mechanism: emptyToUnspecified(input.mechanism),
    target: emptyToUnspecified(input.target),
    timeline: emptyToUnspecified(input.timeline),
    funding: emptyToUnspecified(input.funding),
    politicalPlatform: emptyToUnspecified(input.politicalPlatform),
  };
}
