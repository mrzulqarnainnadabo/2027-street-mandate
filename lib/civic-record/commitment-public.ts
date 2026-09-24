/** Public allowlist for Commitment rows — process status, not moral score. */

export type PublicCommitment = {
  id: string;
  officeHolderDisplayName: string;
  office: string;
  dutyOrPolicyArea: string;
  commitmentText: string;
  responsibleInstitution: string;
  timeline: string;
  commitmentStatus: string;
  sourceUrl: string;
  verification: string;
  geographyScope: string;
  created: string;
};
