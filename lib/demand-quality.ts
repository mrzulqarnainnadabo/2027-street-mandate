/** Soft quality signals — never blocks submit alone. */

const CAMPAIGNISH =
  /\b(vote\s+for|vote\s+out|elect\s+|re[- ]?elect|campaign\s+for|support\s+for\s+(the\s+)?(pdp|apc|lp|nnpp|sdp)|\b(pdp|apc)\s+(government|candidate|party)\b|who\s+should\s+(i|we)\s+vote)\b/i;

export function campaignLanguageHint(sentence: string): string | null {
  const t = sentence.trim();
  if (t.length < 12) return null;
  if (CAMPAIGNISH.test(t)) {
    return "This reads like campaign or party language. ISEYC publishes service demands — name a concrete outcome public office must deliver, not who to vote for.";
  }
  return null;
}
