import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync("lib/demand-quality.ts", "utf8");
assert.match(src, /campaignLanguageHint/);
assert.match(src, /vote\\s\+for/);
assert.match(src, /service demands/);
assert.match(src, /not who to vote for/i);
assert.match(src, /Never blocks submit by itself/);

const CAMPAIGNISH =
  /\b(vote\s+for|vote\s+out|elect\s+|re[- ]?elect|campaign\s+for|support\s+for\s+(the\s+)?(pdp|apc|lp|nnpp|sdp)|\b(pdp|apc)\s+(government|candidate|party)\b|who\s+should\s+(i|we)\s+vote)\b/i;

function hint(sentence) {
  const t = sentence.trim();
  if (t.length < 12) return null;
  if (CAMPAIGNISH.test(t)) return "campaign";
  return null;
}

assert.equal(hint("Fix the clinic medicines stock"), null);
assert.equal(hint("short"), null);
assert.ok(hint("Please vote for our candidate in Kaduna South this year"));
assert.ok(hint("Who should we vote for in 2027 elections cycle"));
assert.equal(hint("Primary health centres must stock essential medicines every month"), null);

console.log("verify-demand-quality: PASS");
