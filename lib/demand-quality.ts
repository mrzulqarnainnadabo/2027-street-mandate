/**
 * Demand quality gate — hard-reject clear non-civic / campaign text at intake.
 * Soft guidance remains in the form; this blocks only unambiguous slogans.
 */

export type DemandQualityResult =
  | { ok: true }
  | { ok: false; code: "CAMPAIGN_SLOGAN" | "TOO_VAGUE"; message: string };

const CAMPAIGN_PATTERNS: RegExp[] = [
  /\bvote\s+for\s+(our\s+)?party\b/i,
  /\bvote\s+for\s+[a-z]{2,}\b/i,
  /\bsupport\s+our\s+candidate\b/i,
  /\belect\s+(our\s+)?(party|candidate)\b/i,
  /\bparty\s+now\s+and\s+forever\b/i,
  /\bdonat(e|ion)\s+(to\s+)?(our\s+)?(campaign|party)\b/i,
];

export function assessDemandQuality(sentence: string): DemandQualityResult {
  const t = (sentence || "").trim();
  if (!t) {
    return { ok: false, code: "TOO_VAGUE", message: "Write a concrete public-service demand." };
  }
  for (const re of CAMPAIGN_PATTERNS) {
    if (re.test(t)) {
      return {
        ok: false,
        code: "CAMPAIGN_SLOGAN",
        message:
          "This looks like campaign or party language. Civic Mandate records public-service demands only — not votes, parties, or candidates.",
      };
    }
  }
  return { ok: true };
}
