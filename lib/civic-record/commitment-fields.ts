import { NOT_PUBLICLY_SPECIFIED } from "./types";

/** Stage 2/3 prep — separate DB from Mandate and Blueprint */
export const COMMITMENT_DB_TITLE = "ISEYC Accountability Commitments (Pilot)";

export const COMMITMENT_NOTION_PROPERTIES = [
  { name: "Name", type: "title", notes: "Short label e.g. Governor X — PHC staffing Y1" },
  { name: "Office Holder Display Name", type: "rich_text", notes: "Public office holder name" },
  { name: "Office", type: "select", notes: "Governor | President | Senator | …" },
  { name: "Duty / Policy Area", type: "select", notes: "Align with Mandate duty taxonomy" },
  { name: "Commitment Text", type: "rich_text", notes: "What was publicly committed" },
  { name: "Responsible Institution", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Timeline", type: "rich_text", notes: NOT_PUBLICLY_SPECIFIED },
  { name: "Status", type: "select", notes: "Announced | Commitment recorded | … | No public update" },
  { name: "Source", type: "url", notes: "Required for publication" },
  { name: "Verification", type: "select", notes: "UNVERIFIED | SOURCE_CONFIRMED | …" },
  { name: "Publication Status", type: "select", notes: "Draft | New | Published | …" },
  { name: "Geography Scope", type: "rich_text", notes: "State / district as applicable" },
] as const;

export const COMMITMENT_STATUS_VALUES = [
  "Announced",
  "Commitment recorded",
  "Implementation reported",
  "Evidence submitted",
  "Evidence published",
  "Ongoing",
  "Delayed",
  "Completed/closed",
  "No public update",
] as const;
