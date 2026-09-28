import assert from "node:assert/strict";
import fs from "node:fs";

const form = fs.readFileSync("components/FormPanel.tsx", "utf8");
assert.match(form, /submittingRef/);
assert.match(form, /submittingRef\.current/);
assert.match(form, /aria-busy=\{loading\}/);
assert.match(form, /disabled=\{loading\}/);

const success = fs.readFileSync("components/SuccessPanel.tsx", "utf8");
assert.match(success, /not public yet/i);
assert.match(success, /Published/);
assert.match(success, /brief\?state=/);
assert.doesNotMatch(success, /your mandate is live on the pulse/i);

const pulse = fs.readFileSync("components/LivePulse.tsx", "utf8");
assert.match(pulse, /never candidate rankings/);
assert.match(pulse, /Published/);
assert.match(pulse, /aria-busy/);

console.log("verify-stage3-ux: PASS");
