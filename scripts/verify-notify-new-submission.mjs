#!/usr/bin/env node
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;
function ok(c, m) {
  if (!c) {
    console.error("FAIL:", m);
    failed++;
  } else console.log("OK:", m);
}
function read(p) {
  return readFileSync(join(root, p), "utf8");
}

const notify = read("lib/notify-new-submission.ts");
ok(notify.includes("RESEND"), "notify references Resend");
ok(notify.includes("best-effort") || notify.includes("does not throw") || notify.includes("catch"), "notify is best-effort");

const route = read("app/api/submit/route.ts");
ok(route.includes("notify") || route.includes("notifyNewSubmission"), "submit wires notify");

if (failed) {
  console.error(failed + " failures");
  process.exit(1);
}
console.log("Notify contracts passed.");
