/**
 * Deterministic demand-quality signals for Civic Mandate Nigeria.
 *
 * Hard-reject: clear campaign / vote-instruction slogans (not civic service demands).
 * Soft hint: retained for UI coaching.
 *
 * Does NOT ban mentioning parties, officeholders, or institutions when the
 * text still asks for a public-service or accountability outcome.
 */

/** Clear vote/campaign instruction patterns — explainable, narrow. */
const CLEAR_CAMPAIGN =
  /\b(vote\s+for|vote\s+out|vote\s+the|cast\s+your\s+vote\s+for|ballot\s+for|elect\s+|re[- ]?elect\b|campaign\s+for|support\s+for\s+(the\s+)?(pdp|apc|lp|nnpp|sdp|adc)\b|(pdp|apc|lp|nnpp|sdp|adc)\s+(candidate|party)\b|who\s+should\s+(i|we)\s+vote\b|endorsement\s+for\b)\b/i;

/**
 * Returns a user-facing error if the sentence is a clear campaign slogan.
 * Null means intake may proceed (human moderation remains the publication gate).
 */
export function campaignSloganRejection(sentence: string): string | null {
  const t = sentence.trim();
  if (t.length < 12) return null;
  if (!CLEAR_CAMPAIGN.test(t)) return null;
  return "This reads as campaign or voting instruction, not a civic service demand. Please name a concrete public service or outcome that public office should deliver — not who to vote for.";
}

/** Soft UI hint (same rule as hard reject for consistency). */
export function campaignLanguageHint(sentence: string): string | null {
  return campaignSloganRejection(sentence);
}
