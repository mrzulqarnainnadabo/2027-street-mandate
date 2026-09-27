import assert from "node:assert/strict";
import fs from "node:fs";

const brief = fs.readFileSync("app/brief/page.tsx", "utf8");
const success = fs.readFileSync("components/SuccessPanel.tsx", "utf8");
const pulse = fs.readFileSync("components/LivePulse.tsx", "utf8");

for (const [name, src] of [
  ["brief", brief],
  ["SuccessPanel", success],
  ["LivePulse", pulse],
]) {
  assert.doesNotMatch(
    src,
    /\b(we endorse|endorses candidate|vote for [A-Z][a-z]+|ranking of candidates|poll results|who is leading)\b/i,
    name,
  );
  assert.match(src, /not a poll|not rankings|never candidate rankings|not a ranking/i, name);
}

assert.match(brief, /This is not a poll and not a ranking/);
assert.match(success, /brief\?state=/);
assert.match(success, /not a poll/);

console.log("verify-share-neutrality: PASS");
