/**
 * Public allowlist for Blueprint rows — never spread Notion properties.
 * Internal review notes, reviewer identity, raw Notion properties, and operator
 * metadata must never cross the public boundary.
 */
export type PublicBlueprintProposal = {
  id: string;
  actorDisplayName: string;
  officeSought: string;
  politicalPlatform: string;
  dutyOrPolicyArea: string;
  proposalText: string;
  mechanism: string;
  target: string;
  timeline: string;
  funding: string;
  responsibleInstitution: string;
  sourceUrl: string;
  sourceDate: string;
  version: string;
  statementClass: string;
  verification: string;
  geographyScope: string;
  created: string;
};

export const PUBLIC_BLUEPRINT_KEYS: (keyof PublicBlueprintProposal)[] = [
  "id","actorDisplayName","officeSought","politicalPlatform","dutyOrPolicyArea",
  "proposalText","mechanism","target","timeline","funding","responsibleInstitution",
  "sourceUrl","sourceDate","version","statementClass","verification","geographyScope","created",
];
