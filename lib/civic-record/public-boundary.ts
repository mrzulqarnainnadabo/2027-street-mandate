import type { PublicationStatus, VerificationStatus } from "./types";
import { evaluateBlueprintPublication, type BlueprintGovernance } from "./blueprint-governance";

/**
 * Single server-side publication gate for Civic Record public surfaces.
 * UI filtering is never a substitute for this gate.
 *
 * Blueprint records additionally require explicit dual-review approval and
 * a publication decision. Existing non-Blueprint record classes retain the
 * established Published + verified gate until their own governance model is
 * expanded.
 */
export function isPubliclyPublishable(
  publicationStatus: PublicationStatus | string | undefined,
  verificationStatus: VerificationStatus | string | undefined,
  governance?: BlueprintGovernance,
): boolean {
  if (publicationStatus !== "Published" || verificationStatus === "UNVERIFIED") {
    return false;
  }

  if (!governance) return true;
  return evaluateBlueprintPublication(governance).publishable;
}
