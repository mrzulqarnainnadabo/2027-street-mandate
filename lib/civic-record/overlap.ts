import type { PolicyAreaOverlap } from "./types";

/**
 * Build relationship rows: shared policy areas only.
 * FORBIDDEN: percentages, rankings, "satisfies", endorsement language.
 */
export function buildPolicyAreaOverlaps(input: {
  demandCountsByDuty: Record<string, number>;
  blueprintCountsByDuty: Record<string, number>;
}): PolicyAreaOverlap[] {
  const duties = new Set([
    ...Object.keys(input.demandCountsByDuty),
    ...Object.keys(input.blueprintCountsByDuty),
  ]);

  const rows: PolicyAreaOverlap[] = [];
  for (const duty of [...duties].sort()) {
    const publishedDemandCount = input.demandCountsByDuty[duty] ?? 0;
    const publishedBlueprintProposalCount = input.blueprintCountsByDuty[duty] ?? 0;
    if (publishedDemandCount === 0 && publishedBlueprintProposalCount === 0) continue;
    rows.push({
      dutyOrPolicyArea: duty,
      publishedDemandCount,
      publishedBlueprintProposalCount,
      note: "Inspect underlying records. This is not a score.",
    });
  }
  return rows;
}

/** Guardrail for any future UI copy */
export function formatOverlapLabel(row: PolicyAreaOverlap): string {
  return `${row.dutyOrPolicyArea}: ${row.publishedDemandCount} published demand(s), ${row.publishedBlueprintProposalCount} published proposal(s). Not a ranking.`;
}
