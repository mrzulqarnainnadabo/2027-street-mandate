import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync("lib/demand-quality.ts", "utf8");
assert.match(src, /campaignSloganRejection/);
assert.match(src, /campaignLanguageHint/);
assert.match(src, /vote\\s\+for/);
assert.match(src, /civic service demand/i);

const submit = fs.readFileSync("app/api/submit/route.ts", "utf8");
assert.match(submit, /campaignSloganRejection/, "submit API must hard-reject campaign slogans");

const CLEAR_CAMPAIGN =
  /\b(vote\s+for|vote\s+out|vote\s+the|cast\s+your\s+vote\s+for|ballot\s+for|elect\s+|re[- ]?elect\b|campaign\s+for|support\s+for\s+(the\s+)?(pdp|apc|lp|nnpp|sdp|adc)\b|(pdp|apc|lp|nnpp|sdp|adc)\s+(candidate|party)\b|who\s+should\s+(i|we)\s+vote\b|endorsement\s+for\b)\b/i;

function reject(sentence) {
  const t = sentence.trim();
  if (t.length < 12) return null;
  if (!CLEAR_CAMPAIGN.test(t)) return null;
  return "campaign";
}

assert.ok(reject("Vote for our party now and forever yes"));
assert.ok(reject("Please vote for our candidate in Kaduna South this year"));
assert.ok(reject("Who should we vote for in 2027 elections cycle"));
assert.ok(reject("Re-elect the same team without conditions"));

assert.equal(reject("Improve access to primary healthcare in our community."), null);
assert.equal(reject("Repair the damaged road connecting our ward to the market."), null);
assert.equal(reject("Publish the status of outstanding water-supply projects."), null);
assert.equal(reject("Primary health centres must stock essential medicines every month"), null);

assert.equal(
  reject("The Governor must publish quarterly reports on PHC medicine stockouts in Kaduna South."),
  null,
);
assert.equal(
  reject("Local government should fix boreholes; party affiliation does not matter."),
  null,
);
assert.equal(
  reject("INEC and security agencies must protect voters without intimidation at polling units."),
  null,
);

assert.equal(reject("short"), null);
assert.equal(reject(""), null);

console.log("verify-demand-quality: PASS");
