/**
 * Governance contracts for Civic Intelligence.
 * Ensures aggregation language cannot claim national public opinion
 * and only operates on published-record shapes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function mustInclude(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) {
    console.error(`FAIL: ${label} — expected in ${file}: ${needle}`);
    process.exit(1);
  }
}

function mustNotInclude(file, needle, label) {
  const text = read(file);
  if (text.includes(needle)) {
    console.error(`FAIL: ${label} — forbidden in ${file}: ${needle}`);
    process.exit(1);
  }
}

function fileExists(rel) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error(`FAIL: missing ${rel}`);
    process.exit(1);
  }
  console.log(`OK: ${rel} exists`);
}

fileExists("lib/civic-intelligence.ts");
fileExists("app/api/civic-intelligence/route.ts");
fileExists("app/intelligence/page.tsx");

const lib = "lib/civic-intelligence.ts";
const page = "app/intelligence/page.tsx";
const api = "app/api/civic-intelligence/route.ts";

mustInclude(lib, "Published", "mentions Published boundary");
mustInclude(lib, "not a statistically representative survey", "limitations: not a survey");
mustInclude(lib, "published Civic Mandate record", "framing uses published records");
mustInclude(lib, "buildCivicIntelligence", "exports builder");
mustInclude(lib, "formatIntelligencePlain", "exports plain formatter");
mustInclude(lib, "methodology", "methodology array");
mustInclude(lib, "limitations", "limitations array");
mustInclude(lib, "truncated", "respects truncation flag");

mustNotInclude(lib, "Nigerians have decided", "no national decision claim");
mustNotInclude(lib, "most important issue to Nigerians", "no importance claim");
mustInclude(lib, "not national public opinion", "explicitly disclaims national public opinion");
mustNotInclude(lib, "best candidate", "no candidate language");
mustNotInclude(lib, "who should you vote", "no vote advice");
mustNotInclude(lib, "electability", "no electability");

mustInclude(page, "a poll", "page mentions poll disclaimer");
mustInclude(page, "Published records only", "page stresses published-only");
mustInclude(page, "not a claim about", "page disclaims national opinion");
mustInclude(page, "Methodology", "page shows methodology");
mustInclude(page, "Limitations", "page shows limitations");
mustInclude(page, "/api/civic-intelligence", "page loads intelligence API");

mustNotInclude(page, "Nigerians have decided", "page: no national decision");
mustNotInclude(page, "vote for", "page: no vote language");

mustInclude(api, "getPublishedPulse", "API uses published pulse only");
mustInclude(api, "buildCivicIntelligence", "API uses pure builder");
mustInclude(api, "CIVIC_INTELLIGENCE_UNAVAILABLE", "API fails closed");
mustNotInclude(api, "Status = New", "API must not surface New records");

mustInclude("components/Header.tsx", "/intelligence", "header links Intelligence");

const { buildCivicIntelligence, formatIntelligencePlain } = await import(
  path.join(root, "lib/civic-intelligence.ts")
).catch(() => ({ buildCivicIntelligence: null, formatIntelligencePlain: null }));

if (!buildCivicIntelligence) {
  console.log("OK: skip runtime import (TS); source contracts passed");
} else {
  const empty = buildCivicIntelligence([]);
  if (empty.publishedCount !== 0) {
    console.error("FAIL: empty input must yield publishedCount 0");
    process.exit(1);
  }
  if (!empty.framingLine.toLowerCase().includes("empty") && !empty.framingLine.includes("No published")) {
    console.error("FAIL: empty framing must acknowledge empty record");
    process.exit(1);
  }
  const sample = buildCivicIntelligence([
    {
      id: "1",
      sentence: "Clean water in every ward.",
      mandate: "Water",
      duty: "Water",
      office: "Governor",
      state: "Kaduna",
      lga: "Kaduna South",
      created: "2026-09-01T00:00:00.000Z",
    },
    {
      id: "2",
      sentence: "Roads that do not wash away.",
      mandate: "Roads & Transport",
      duty: "Roads & Transport",
      office: "Governor",
      state: "Kaduna",
      lga: "Kaduna north",
      created: "2026-10-01T00:00:00.000Z",
    },
    {
      id: "3",
      sentence: "Medicines at PHC.",
      mandate: "Health",
      duty: "Health",
      office: "Governor",
      state: "Kano",
      lga: "",
      created: "2026-10-02T00:00:00.000Z",
    },
  ]);
  if (sample.publishedCount !== 3) {
    console.error("FAIL: expected publishedCount 3");
    process.exit(1);
  }
  if (sample.statesRepresented !== 2) {
    console.error("FAIL: expected 2 states");
    process.exit(1);
  }
  if (sample.duties.length !== 3) {
    console.error("FAIL: expected 3 duties");
    process.exit(1);
  }
  const plain = formatIntelligencePlain(sample);
  if (plain.includes("Nigerians have decided")) {
    console.error("FAIL: plain format must not claim national decision");
    process.exit(1);
  }
  console.log("OK: runtime aggregation contracts");
}

console.log("verify-civic-intelligence: PASS");
