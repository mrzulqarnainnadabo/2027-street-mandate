import { NOT_PUBLICLY_SPECIFIED } from "./types";
import { assertNotRankingCopy } from "./firewall";
import { COMMITMENT_STATUS_VALUES } from "./commitment-fields";

export type CommitmentDraftInput = {
  officeHolderDisplayName: string;
  office: string;
  dutyOrPolicyArea: string;
  commitmentText: string;
  sourceUrlOrCitation: string;
  commitmentStatus?: string;
  responsibleInstitution?: string;
  timeline?: string;
};

export type CommitmentValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

export function validateCommitmentDraft(
  input: CommitmentDraftInput
): CommitmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.officeHolderDisplayName?.trim()) {
    errors.push("Office holder display name is required.");
  }
  if (!input.office?.trim()) errors.push("Office is required.");
  if (!input.dutyOrPolicyArea?.trim()) errors.push("Duty / policy area is required.");
  if (!input.commitmentText?.trim() || input.commitmentText.trim().length < 20) {
    errors.push("Commitment text must be concrete (min ~20 characters).");
  }
  if (!input.sourceUrlOrCitation?.trim()) {
    errors.push("Source URL or citation is required.");
  }
  if (input.commitmentText && !assertNotRankingCopy(input.commitmentText)) {
    errors.push("Commitment text must not use ranking/score/endorsement language.");
  }
  if (
    input.commitmentStatus &&
    !(COMMITMENT_STATUS_VALUES as readonly string[]).includes(input.commitmentStatus)
  ) {
    warnings.push(`Unknown commitment status: ${input.commitmentStatus}`);
  }
  if (!input.timeline?.trim()) {
    warnings.push(`Timeline empty — prefer "${NOT_PUBLICLY_SPECIFIED}".`);
  }
  if (!input.responsibleInstitution?.trim()) {
    warnings.push(`Responsible institution empty — prefer "${NOT_PUBLICLY_SPECIFIED}".`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
