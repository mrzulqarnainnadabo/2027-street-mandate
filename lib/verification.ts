/**
 * Public verification states for profiles / blueprints.
 * Institution-reviewed = source integrity review only — NEVER endorsement.
 */
export const VERIFICATION_STATES = [
  {
    id: "Unverified" as const,
    label: "Unverified",
    meaning:
      "Record exists in the system but sources have not been linked or checked for this public view.",
  },
  {
    id: "Source-linked" as const,
    label: "Source-linked",
    meaning:
      "At least one inspectable source URL or document reference is attached. ISEYC has not certified the person or proposal.",
  },
  {
    id: "Institution-reviewed" as const,
    label: "Institution-reviewed",
    meaning:
      "ISEYC reviewed source integrity and completeness for publication hygiene. This is not an endorsement, recommendation, or electability claim.",
  },
] as const;

export type VerificationStateId = (typeof VERIFICATION_STATES)[number]["id"];

export function verificationMeaning(id: string): string {
  const row = VERIFICATION_STATES.find((v) => v.id === id);
  return row?.meaning ?? "Verification state not defined.";
}
