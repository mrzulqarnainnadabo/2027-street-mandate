/**
 * Neutrality + commercial firewall — executable constants for product reviews.
 */

export const CIVIC_RECORD_MISSION =
  "ISEYC does not tell Nigerians who to support; it builds the public record of demands, proposals, commitments, and evidence under the same rules for everyone.";

/** Features that must never ship on public Civic Record surfaces */
export const FORBIDDEN_PUBLIC_FEATURES = [
  "candidate ranking",
  "candidate scoring",
  "match percentage to demands",
  "endorsement",
  "vote recommendation",
  "popularity leaderboard",
  "paid preferential placement",
  "suppression of non-paying actors",
] as const;

/** Payment may fund tools — never public methodology outcomes */
export const PAYMENT_NEVER_CHANGES = [
  "publication eligibility",
  "ranking or sort order",
  "editorial language tone",
  "visibility boost",
  "removal of peer records",
  "verification status without source process",
] as const;

export const REVENUE_STREAMS_ALLOWED = [
  "workspace tools (submit, version, staff, export)",
  "institutional dashboards",
  "published-data API",
  "methodology-fixed research reports",
  "document structuring service",
  "accountability OS (internal SaaS, later)",
] as const;

export function assertNotRankingCopy(text: string): boolean {
  const bad =
    /\b(rank(ed|ing)?|score(card)?|%\s*match|endors(e|ement)|vote\s+for|leading\s+candidate|most\s+popular)\b/i;
  return !bad.test(text);
}
