import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync("lib/rate-limit.ts", "utf8");
assert.match(src, /checkRateLimit/);
assert.match(src, /clientIpFromRequest/);
assert.match(src, /x-forwarded-for/);
assert.match(src, /retryAfterSec/);

const submit = fs.readFileSync("app/api/submit/route.ts", "utf8");
assert.match(submit, /checkRateLimit/);
assert.match(submit, /status: 429/);
assert.match(submit, /Retry-After/);
assert.match(submit, /Too many submissions/);

console.log("verify-rate-limit: PASS");
