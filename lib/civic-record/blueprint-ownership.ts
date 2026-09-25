import { BLUEPRINT_DATABASE_ENV, BLUEPRINT_PILOT_DATABASE_ID } from "./notion-pilot-ids";

/** Normalized (no dashes) Blueprint pilot / env database id. */
export function blueprintDatabaseIdNormalized(): string {
  const fromEnv = (process.env[BLUEPRINT_DATABASE_ENV] || "").replace(/-/g, "");
  return fromEnv || BLUEPRINT_PILOT_DATABASE_ID.replace(/-/g, "");
}

export function notionPageId(id: string): string {
  const clean = id.replace(/-/g, "").toLowerCase();
  if (clean.length !== 32 || !/^[0-9a-f]+$/.test(clean)) {
    return id;
  }
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

/**
 * A mutable Blueprint page must:
 * - not be archived
 * - live in the Blueprint pilot database (not Mandate / unrelated)
 */
export function assertBlueprintPageOwnership(page: any): { ok: true } | { ok: false; error: string } {
  if (!page || page.object !== "page") {
    return { ok: false, error: "Not a Notion page." };
  }
  if (page.archived) {
    return { ok: false, error: "Archived records cannot be mutated." };
  }
  if (page.in_trash) {
    return { ok: false, error: "Trashed records cannot be mutated." };
  }
  if (page.parent?.type !== "database_id") {
    return { ok: false, error: "Record is not a database row." };
  }
  const parentId = String(page.parent.database_id || "").replace(/-/g, "").toLowerCase();
  const expected = blueprintDatabaseIdNormalized().toLowerCase();
  if (!parentId || parentId !== expected) {
    return { ok: false, error: "Record is not in the Blueprint pilot database." };
  }
  return { ok: true };
}
