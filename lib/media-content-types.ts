/**
 * ISEYC Media content-type registry.
 * Draft generation may use these keys; publication still requires human approval.
 */
export const MEDIA_CONTENT_TYPES = [
  {
    id: "MANDATE_STORY" as const,
    label: "Mandate story",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "STATE_BRIEF" as const,
    label: "State Civic Brief",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "BLUEPRINT_EXPLAINER" as const,
    label: "Blueprint explainer",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "WHAT_CHANGED" as const,
    label: "What changed",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "SOURCE_EXPLAINER" as const,
    label: "Source explainer",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "CIVIC_DIGEST" as const,
    label: "National Civic Digest",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
  {
    id: "SECTOR_BRIEF" as const,
    label: "Sector brief",
    requiresPublishedSource: true,
    requiresHumanApproval: true,
  },
] as const;

export type MediaContentTypeId = (typeof MEDIA_CONTENT_TYPES)[number]["id"];

export function mediaTypeRequiresHumanApproval(id: string): boolean {
  const row = MEDIA_CONTENT_TYPES.find((t) => t.id === id);
  return row?.requiresHumanApproval ?? true;
}
