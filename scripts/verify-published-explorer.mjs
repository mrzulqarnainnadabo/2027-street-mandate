import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else console.log("OK:", msg);
}

ok(existsSync(join(root, "components/PublishedExplorer.tsx")), "PublishedExplorer component exists");
ok(existsSync(join(root, "app/explore/page.tsx")), "explore page exists");
const hero = readFileSync(join(root, "components/Hero.tsx"), "utf8");
ok(hero.includes('href="/explore"'), "Hero links to /explore");
const header = readFileSync(join(root, "components/Header.tsx"), "utf8");
ok(header.includes('href: "/explore"'), "Header nav includes Explore");
const pulse = readFileSync(join(root, "app/api/pulse/route.ts"), "utf8");
ok(pulse.includes("Access-Control-Allow-Origin"), "Pulse exposes public CORS for published feed");
ok(pulse.includes("OPTIONS"), "Pulse handles OPTIONS");

if (failed) process.exit(1);
console.log("Published explorer checks passed.");
