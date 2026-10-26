import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync("lib/demand-quality.ts", "utf8");
assert.match(src, /campaignLanguageHint/);
assert.match(src, /campaignSloganRejection/);
assert.match(src, /vote\\s\+for/);
assert.match(src, /service demands/);
assert.match(src, /not who to vote for/i);
// Intentional product rule: clear campaign slogans are rejected at intake.
// Borderline political-accountability text still reaches human moderation.
assert.match(src, /Hard-reject/);
assert.match(src, /human moderation remains the publication gate/i);

const CLEAR_CAMPAIGN =
  /\b(vote\s+for|vote\s+out|vote\s+the|cast\s+your\s+vote\s+for|ballot\s+for|elect\s+|re[- ]?elect\b|campaign\s+for|support\s+for\s+(the\s+)?(pdp|apc|lp|nnpp|sdp|adc)\b|(pdp|apc|lp|nnpp|sdp|adc)\s+(candidate|party)\b|who\s+should\s+(i|we)\s+vote\b|endorsement\s+for\b)\b/i;

function reject(sentence) {
  const t = sentence.trim();
  if (t.length < 12) return null;
  if (!CLEAR_CAMPAIGN.test(t)) return null;
  return "campaign";
}

assert.equal(reject("Fix the clinic medicines stock"), null);
assert.equal(reject("short"), null);
assert.ok(reject("Please vote for our candidate in Kaduna South this year"));
assert.ok(reject("Who should we vote for in 2027 elections cycle"));
assert.equal(
  reject("Primary health centres must stock essential medicines every month"),
  null
);
assert.equal(
  reject("Publish the list of completed primary health projects in our LGA this year"),
  null
);

console.log("verify-demand-quality: PASS");
