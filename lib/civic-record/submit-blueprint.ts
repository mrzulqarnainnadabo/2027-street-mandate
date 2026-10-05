/**
 * Public Blueprint intake — creates a Draft/New row in the pilot Blueprint DB.
 * Never auto-publishes. Dual review remains the only path to Published.
 * Does not write to the citizen Mandate database.
 */

import { Client } from "@notionhq/client";
import { BLUEPRINT_DATABASE_ENV, BLUEPRINT_PILOT_DATABASE_ID } from "./notion-pilot-ids";
import { NOT_PUBLICLY_SPECIFIED } from "./types";
import {
  normalizeBlueprintOptionals,
  validateBlueprintDraft,
  type BlueprintDraftInput,
} from "./validate-blueprint";

export type BlueprintSubmitInput = BlueprintDraftInput & {
  geographyScope?: string;
  statementClass?: "ACTOR_STATEMENT" | "OFFICIAL_RECORD" | "MEDIA_REPORT";
  sourceDate?: string;
  contactEmail?: string;
};

function blueprintDatabaseId(): string {
  const fromEnv = (process.env[BLUEPRINT_DATABASE_ENV] || "").replace(/-/g, "");
  if (fromEnv) return fromEnv;
  return BLUEPRINT_PILOT_DATABASE_ID.replace(/-/g, "");
}

function rt(content: string) {
  return { rich_text: [{ type: "text" as const, text: { content: content.slice(0, 1900) } }] };
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Persist a public-facing Blueprint submission as Status=New, Verification=UNVERIFIED.
 * Publication Decision starts as Pending — operators must dual-review before Publish.
 */
export async function submitBlueprintRecord(input: BlueprintSubmitInput): Promise<{ id: string }> {
  const validation = validateBlueprintDraft(input);
  if (!validation.ok) {
    throw new Error(validation.errors[0] || "Invalid blueprint submission.");
  }

  const source = input.sourceUrlOrCitation.trim();
  if (!isHttpUrl(source) && source.length < 12) {
    throw new Error("Provide a public source URL or a clear citation (min ~12 characters).");
  }

  if (!process.env.NOTION_TOKEN) {
    throw new Error("Notion is not configured.");
  }

  const optionals = normalizeBlueprintOptionals(input);
  const statementClass = input.statementClass || "ACTOR_STATEMENT";
  const geography = (input.geographyScope || "Nigeria").trim() || "Nigeria";
  const sourceDate = (input.sourceDate || "").trim() || NOT_PUBLICLY_SPECIFIED;
  const nameLabel = `${input.actorDisplayName.trim().slice(0, 80)} — ${input.dutyOrPolicyArea.trim().slice(0, 40)}`;

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const database_id = blueprintDatabaseId();

  const properties: Record<string, unknown> = {
    Name: {
      title: [{ type: "text", text: { content: nameLabel.slice(0, 200) } }],
    },
    "Actor Display Name": rt(input.actorDisplayName.trim()),
    "Office Sought": { select: { name: input.officeSought.trim() } },
    "Political Platform": rt(optionals.politicalPlatform),
    "Duty / Policy Area": { select: { name: input.dutyOrPolicyArea.trim() } },
    "Proposal Text": rt(input.proposalText.trim()),
    Mechanism: rt(optionals.mechanism),
    Target: rt(optionals.target),
    Timeline: rt(optionals.timeline),
    Funding: rt(optionals.funding),
    "Responsible Institution": rt(NOT_PUBLICLY_SPECIFIED),
    "Source Date": rt(sourceDate),
    Version: rt("public-submit-v1"),
    "Statement Class": { select: { name: statementClass } },
    Verification: { select: { name: "UNVERIFIED" } },
    Status: { select: { name: "New" } },
    "Geography Scope": rt(geography),
    "Publication Decision": { select: { name: "Pending" } },
  };

  if (isHttpUrl(source)) {
    properties.Source = { url: source.trim().slice(0, 2000) };
  } else {
    properties["Review Notes"] = rt(`Public citation (no URL): ${source.slice(0, 500)}`);
  }

  if (input.contactEmail?.trim()) {
    const existing = (properties["Review Notes"] as { rich_text: { text: { content: string } }[] })
      ?.rich_text?.[0]?.text?.content;
    const note = [existing, `Contact (internal): ${input.contactEmail.trim().slice(0, 120)}`]
      .filter(Boolean)
      .join(" | ");
    properties["Review Notes"] = rt(note);
  }

  try {
    const page = await notion.pages.create({
      parent: { database_id },
      properties: properties as any,
    });
    return { id: String(page.id).replace(/-/g, "") };
  } catch (err: any) {
    const msg = String(err?.message || err || "");
    if (/select|option|validation/i.test(msg)) {
      throw new Error(
        "Blueprint database schema rejected a field value. Operators must ensure Office, Duty, Statement Class, Status, and Verification options exist."
      );
    }
    throw new Error("Could not save blueprint submission. Please try again later.");
  }
}
