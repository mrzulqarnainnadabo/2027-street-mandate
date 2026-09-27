import assert from "node:assert/strict";
import fs from "node:fs";

const auth = fs.readFileSync("lib/server/operator-auth.ts", "utf8");
const session = fs.readFileSync("lib/server/operator-session.ts", "utf8");
const reviewRoute = fs.readFileSync("app/api/operators/blueprints/review/route.ts", "utf8");

assert.match(auth, /timingSafeEqual/);
assert.match(auth, /Bearer/);
assert.match(auth, /isAuthorizedOperatorRequest/);
assert.match(auth, /getOperatorKeyConfigured/);
assert.doesNotMatch(auth, /NEXT_PUBLIC/);
assert.match(auth, /if \(!expected\) return false/);

assert.match(session, /httpOnly:\s*true/);
assert.match(session, /sameSite:\s*["']strict["']/);
assert.match(session, /createHmac/);
assert.doesNotMatch(session, /NEXT_PUBLIC/);
assert.match(session, /never written into the cookie/i);

assert.match(reviewRoute, /isAuthorizedOperatorRequest/);
assert.match(reviewRoute, /status:\s*401/);
assert.doesNotMatch(reviewRoute, /NEXT_PUBLIC_CIVIC_OPERATOR/);

console.log("verify-operator-auth: PASS");
