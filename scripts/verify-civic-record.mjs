import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");

const boundary = read("lib/civic-record/public-boundary.ts");
assert.match(boundary, /publicationStatus === ["']Published["']/);
assert.match(boundary, /verificationStatus !== ["']UNVERIFIED["']/);

const blueprint = read("lib/civic-record/fetch-published-blueprints.ts");
assert.match(blueprint, /isPubliclyPublishable\(publicationStatus, verificationStatus\)/);
assert.match(blueprint, /if \(!proposalText \|\| !sourceUrl\) return null/);
assert.match(blueprint, /return \{/);

const commitment = read("lib/civic-record/fetch-published-commitments.ts");
assert.match(commitment, /isPubliclyPublishable\(publicationStatus, verificationStatus\)/);
assert.match(commitment, /if \(!commitmentText \|\| !sourceUrl\) return null/);

const evidence = read("lib/civic-record/fetch-published-evidence.ts");
assert.match(evidence, /isPubliclyPublishable\(sel\(props, "Publication Status"\), sel\(props, "Verification"\)\)/);

const publicBlueprint = read("lib/civic-record/blueprint-public.ts");
assert.match(publicBlueprint, /PUBLIC_BLUEPRINT_KEYS/);
assert.doesNotMatch(publicBlueprint.match(/PUBLIC_BLUEPRINT_KEYS[\\s\\S]*/)?.[0] || "", /reviewer|fingerprint|payment|internal/i);

const robots = read("app/robots.ts");
assert.match(robots, /disallow: \[["']\/api\//);
assert.match(robots, /operators/);

console.log("Civic Record public-boundary checks: PASS");
