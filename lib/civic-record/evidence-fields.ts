/** Evidence vault — links to commitments/blueprints/demands without scoring them */

export const EVIDENCE_DB_TITLE = "ISEYC Evidence Vault (Pilot)";

export const EVIDENCE_NOTION_PROPERTIES = [
  { name: "Name", type: "title", notes: "Short evidence label" },
  { name: "Title", type: "rich_text", notes: "Human-readable title" },
  { name: "Source", type: "url", notes: "Inspectable URL" },
  { name: "Evidence Type", type: "select", notes: "official | legislative | media | other" },
  { name: "Linked Commitment Id", type: "rich_text", notes: "Optional" },
  { name: "Linked Blueprint Id", type: "rich_text", notes: "Optional" },
  { name: "Linked Demand Id", type: "rich_text", notes: "Optional Mandate page id" },
  { name: "Verification", type: "select", notes: "UNVERIFIED | SOURCE_CONFIRMED | …" },
  { name: "Publication Status", type: "select", notes: "Draft | Published | …" },
] as const;
