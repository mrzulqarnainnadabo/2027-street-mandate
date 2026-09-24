/**
 * Live Stage-2 pilot resources (created 2026-09-24 via Notion connector).
 * Separate from citizen Civic Mandate DB (NOTION_DATABASE_ID on Vercel).
 * Do not point production Mandate submit/pulse at these databases.
 */

export const BLUEPRINT_PILOT_DATABASE_ID = "05b4dd95d02e4578b629a20a0f34f10b";
export const BLUEPRINT_PILOT_DATA_SOURCE_ID = "699a8c47-10bb-4dbb-926b-451392548990";
export const BLUEPRINT_PILOT_NOTION_URL =
  "https://www.notion.so/05b4dd95d02e4578b629a20a0f34f10b";

export const COMMITMENT_PILOT_DATABASE_ID = "130a06c6c9d149efab6cef4431aa0804";
export const COMMITMENT_PILOT_DATA_SOURCE_ID = "1cd24628-6872-482d-b78b-4c2ccb2d9b0d";
export const COMMITMENT_PILOT_NOTION_URL =
  "https://www.notion.so/130a06c6c9d149efab6cef4431aa0804";

export const EVIDENCE_PILOT_DATABASE_ID = "2bc9d99c565d45219d301d866367bf15";
export const EVIDENCE_PILOT_DATA_SOURCE_ID = "bf650adb-1068-4335-a0bf-4979e6925e7b";
export const EVIDENCE_PILOT_NOTION_URL =
  "https://www.notion.so/2bc9d99c565d45219d301d866367bf15";

/** Staff ops page (private/draft workspace page) */
export const CIVIC_RECORD_OPS_HUB_PAGE_ID = "3e55db88ef4681cba049d3c45843092e";
export const CIVIC_RECORD_OPS_HUB_URL =
  "https://www.notion.so/3e55db88ef4681cba049d3c45843092e";

export const BLUEPRINT_DATABASE_ENV = "NOTION_BLUEPRINT_DATABASE_ID";
export const COMMITMENT_DATABASE_ENV = "NOTION_COMMITMENT_DATABASE_ID";
export const EVIDENCE_DATABASE_ENV = "NOTION_EVIDENCE_DATABASE_ID";

/** Existing citizen Mandate — do not overwrite */
export const MANDATE_DATABASE_ID_KNOWN = "19b213d55bfc4ce8a653a05147cbbe2a";
