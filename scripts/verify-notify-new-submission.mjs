import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync("lib/notify-new-submission.ts", "utf8");
assert.match(src, /notifyAdminsOfNewSubmission/);
assert.match(src, /RESEND_API_KEY/);
assert.match(src, /iseycglobal@gmail\.com|ISEYC_EMAIL/);
assert.match(src, /Pending Human Review/);
assert.match(src, /does not mean publication/i);
assert.match(src, /Idempotency-Key/);
assert.doesNotMatch(src, /deviceId|ageBand|fingerprint/i);

const submit = fs.readFileSync("app/api/submit/route.ts", "utf8");
assert.match(submit, /notifyAdminsOfNewSubmission/);
assert.match(submit, /void notifyAdminsOfNewSubmission/);

console.log("verify-notify-new-submission: PASS");
