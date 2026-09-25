import { NOT_PUBLICLY_SPECIFIED } from "./types";

/**
 * Stage 2 manual pilot — Notion/sheet columns for one public blueprint dossier.
 * Create a separate Notion database; do not mix with citizen Mandate rows.
 */

export const BLUEPRINT_DB_TITLE = "ISEYC Public Blueprint Register (Pilot)";

export const BLUEPRINT_NOTION_PROPERTIES = [
  { name: "Name", type: "title", notes: "Short label e.g. Agada — Economy proposal 1" },
  { name: "Actor Display Name", type: "rich_text", notes: "Public figure name" },
  { name: "Office Sought", type: "select", notes: "President | Vice President | Governor | …" },
  { name: "Political Platform", type: "rich_text", notes: `Or literal: ${NOT_PUBLICLY_SPECIFIED}` },
  { name: "Duty / Policy Area", type: "select", notes: "Same taxonomy as Civic Mandate duties where possible" },
  { name: "Proposal Text", type: "rich_text", notes: "Exact public proposal; no ISEYC invention" },
  { name: "Mechanism", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Target", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Timeline", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Funding", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Responsible Institution", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Source", type: "url", notes: "Speech, PDF, interview URL" },
  { name: "Source Date", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Version", type: "rich_text", notes: "e.g. 2026-09-pilot-v1" },
  { name: "Statement Class", type: "select", notes: "ACTOR_STATEMENT | OFFICIAL_RECORD | MEDIA_REPORT" },
  { name: "Verification", type: "select", notes: "UNVERIFIED | SOURCE_CONFIRMED | DISPUTED | …" },
  { name: "Status", type: "select", notes: "Draft | New | Published | Flagged | Rejected" },
  { name: "Geography Scope", type: "rich_text", notes: "e.g. Nigeria | Kaduna | …" },
  // Internal governance (never public DTO)
  { name: "Reviewer A", type: "rich_text", notes: "Human identity — internal" },
  { name: "Reviewer A Decision", type: "select", notes: "Approved | Rejected" },
  { name: "Reviewer A Date", type: "date", notes: "ISO date of Review A" },
  { name: "Reviewer B", type: "rich_text", notes: "Must differ from Reviewer A" },
  { name: "Reviewer B Decision", type: "select", notes: "Approved | Rejected" },
  { name: "Reviewer B Date", type: "date", notes: "ISO date of Review B" },
  { name: "Publication Decision", type: "select", notes: "Publish | Reject | Hold" },
  { name: "Publication Date", type: "date", notes: "Set only when Published" },
  { name: "Review Notes", type: "rich_text", notes: "Internal only — never public" },
] as const;

export const BLUEPRINT_PILOT_RULES = [
  "One pilot actor first — to test the format, not to centre the product on one ticket.",
  "Only document what is already public or explicitly submitted with permission.",
  "Never fill gaps with ISEYC assumptions — use Not publicly specified.",
  "Paying for workspace (later) never changes Status or Verification.",
  "No ranking, scoring, or demand-match percentage against any actor.",
  "Citizen Mandate database stays separate; do not write blueprints into Mandate rows.",
  "Dual review before any Published blueprint row (same institutional standard as Mandate).",
] as const;
