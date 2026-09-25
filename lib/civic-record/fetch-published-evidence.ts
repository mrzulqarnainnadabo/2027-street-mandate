import { Client } from "@notionhq/client";
import { EVIDENCE_DATABASE_ENV, EVIDENCE_PILOT_DATABASE_ID } from "./notion-pilot-ids";
import type { EvidenceRecord } from "./types";
import { isPubliclyPublishable } from "./public-boundary";

function databaseId(): string {
  const fromEnv = (process.env[EVIDENCE_DATABASE_ENV] || "").replace(/-/g, "");
  return fromEnv || EVIDENCE_PILOT_DATABASE_ID.replace(/-/g, "");
}
function rt(props: any, name: string): string { return props?.[name]?.rich_text?.[0]?.plain_text?.trim() || ""; }
function sel(props: any, name: string): string { return props?.[name]?.select?.name || ""; }

/** Evidence is public only when explicitly published and no longer unverified. */
function mapPage(page: any): EvidenceRecord | null {
  const props = page.properties;
  if (!isPubliclyPublishable(sel(props, "Publication Status"), sel(props, "Verification"))) return null;
  const title = rt(props, "Title") || props?.Name?.title?.[0]?.plain_text?.trim() || "";
  const source = props?.Source?.url || "";
  if (!title || !source) return null;

  return {
    id: String(page.id).replace(/-/g, ""),
    linkedCommitmentId: rt(props, "Linked Commitment Id") || undefined,
    linkedBlueprintId: rt(props, "Linked Blueprint Id") || undefined,
    linkedDemandId: rt(props, "Linked Demand Id") || undefined,
    title,
    sourceUrlOrCitation: source,
    evidenceType: (sel(props, "Evidence Type") || "other") as EvidenceRecord["evidenceType"],
    verificationStatus: sel(props, "Verification") as EvidenceRecord["verificationStatus"],
    publicationStatus: "Published",
    createdAt: page.created_time,
  };
}

export async function getPublishedEvidence(): Promise<EvidenceRecord[]> {
  if (!process.env.NOTION_TOKEN) return [];
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const response: any = await notion.databases.query({
    database_id: databaseId(),
    filter: { property: "Publication Status", select: { equals: "Published" } },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
    page_size: 50,
  });
  return (response.results as any[]).map(mapPage).filter(Boolean) as EvidenceRecord[];
}
