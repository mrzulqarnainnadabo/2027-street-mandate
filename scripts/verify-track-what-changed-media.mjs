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

const track = read("lib/track-mandate.ts");
ok(track.includes("NOT a vote"), "track disclaims vote");
ok(!/support percentage|popularity/i.test(track), "no popularity in track");

const what = read("lib/what-changed.ts");
ok(what.includes("Never invent"), "what-changed no invent");
ok(what.includes("confirmed: false"), "unconfirmed stages allowed");

const story = read("lib/mandate-story-draft.ts");
ok(story.includes("draft_pending_human_approval"), "media draft needs human approval");
ok(story.includes("do not invent"), "media forbids inventing response");
ok(story.includes("requiresHumanApproval"), "requiresHumanApproval field");

const page = read("app/mandate/[id]/page.tsx");
ok(page.includes("TrackMandateButton"), "detail has track");
ok(page.includes("WhatChangedTimeline"), "detail has timeline");
ok(page.includes("MandateStoryDraftPanel"), "detail has media draft");

if (failed) {
  console.error(failed + " failures");
  process.exit(1);
}
console.log("Track / What Changed / Media draft contracts passed.");
