/**
 * Live Stage-2 pilot resources (created 2026-09-24 via Notion API).
 * Separate from citizen Civic Mandate DB (NOTION_DATABASE_ID on Vercel).
 * Do not point production Mandate submit/pulse at this database.
 */

export const BLUEPRINT_PILOT_DATABASE_ID = "05b4dd95d02e4578b629a20a0f34f10b";

export const BLUEPRINT_PILOT_DATA_SOURCE_ID = "699a8c47-10bb-4dbb-926b-451392548990";

export const BLUEPRINT_PILOT_NOTION_URL =
  "https://www.notion.so/05b4dd95d02e4578b629a20a0f34f10b";

/** Env name if/when a server integration is added for Blueprint reads only */
export const BLUEPRINT_DATABASE_ENV = "NOTION_BLUEPRINT_DATABASE_ID";
