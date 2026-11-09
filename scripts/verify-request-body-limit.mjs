import assert from "node:assert/strict";
import fs from "node:fs";

const helper = fs.readFileSync("lib/server/read-json-body.ts", "utf8");
assert.match(helper, /content-length/);
assert.match(helper, /Number\(declaredLength\) > maxBytes/);
assert.match(helper, /total > maxBytes/);
assert.match(helper, /reader\.cancel/);
assert.match(helper, /TextDecoder\("utf-8", \{ fatal: true \}\)/);
assert.match(helper, /JSON\.parse\(text\)/);
assert.match(helper, /status: 413/);

const routes = [
  ["app/api/submit/route.ts", /8 \* 1024/],
  ["app/api/blueprints/submit/route.ts", /16 \* 1024/],
  ["app/api/operators/blueprints/review/route.ts", /16 \* 1024/],
];

for (const [path, limit] of routes) {
  const source = fs.readFileSync(path, "utf8");
  assert.match(source, /readJsonBodyLimited/, path + " uses bounded JSON parsing");
  assert.match(source, limit, path + " declares a request-specific byte limit");
  assert.match(source, /parsed\.status/, path + " returns the parser's safe HTTP status");
  assert.doesNotMatch(source, /await (?:req|request)\.json\(\)/, path + " must not parse an unbounded JSON body");
}

console.log("verify-request-body-limit: PASS");
