import type { PublicationStatus, VerificationStatus } from "./types";

/**
 * Single server-side publication gate for Civic Record public surfaces.
 *
 * A record is public only when:
 * - its publication status is Published
 * - its verification status is not UNVERIFIED
 *
 * UI filtering is never a substitute for this gate.
 */
export function isPubliclyPublishable(
  publicationStatus: PublicationStatus | string | undefined,
  verificationStatus: VerificationStatus | string | undefined
): boolean {
  return publicationStatus === "Published" && verificationStatus !== "UNVERIFIED";
}
