import { Client } from "@notionhq/client";
import { BLUEPRINT_DATABASE_ENV, BLUEPRINT_PILOT_DATABASE_ID } from "./notion-pilot-ids";
import type { PublicBlueprintProposal } from "./blueprint-public";
import { isPubliclyPublishable } from "./public-boundary";
import { assertBlueprintPageOwnership } from "./blueprint-ownership";

const PAGE_SIZE = 50;
const MAX_PAGES = 5;

function blueprintDatabaseId(): string {
  const fromEnv = (process.env[BLUEPRINT_DATABASE_ENV] || "").replace(/-/g, "");
  return fromEnv || BLUEPRINT_PILOT_DATABASE_ID.replace(/-/g, "");
}
function rt(props: any, name: string): string {
  return props?.[name]?.rich_text?.[0]?.plain_text?.trim() || "";
}
function sel(props: any, name: string): string {
  return props?.[name]?.select?.name || "";
}
function title(props: any): string {
  return props?.Name?.title?.[0]?.plain_text?.trim() || "";
}
function mapPage(page: any): PublicBlueprintProposal | null {
  if (!page || page.object !== "page") return null;
  if (page.archived || page.in_trash) return null;
  if (!assertBlueprintPageOwnership(page).ok) return null;
  const props = page.properties;
  const publicationStatus = sel(props, "Status");
  const verificationStatus = sel(props, "Verification");
  const statementClass = sel(props, "Statement Class");
  const governance = {
    status: publicationStatus,
    verification: verificationStatus,
    sourceUrl: props?.Source?.url || "",
    statementClass,
    reviewerA: rt(props, "Reviewer A"),
    reviewerADecision: sel(props, "Reviewer A Decision"),
    reviewerB: rt(props, "Reviewer B"),
    reviewerBDecision: sel(props, "Reviewer B Decision"),
    publicationDecision: sel(props, "Publication Decision"),
  };
  if (!isPubliclyPublishable(publicationStatus, verificationStatus, governance)) return null;

  const proposalText = rt(props, "Proposal Text");
  const sourceUrl = props?.Source?.url || "";
  if (!proposalText || !sourceUrl) return null;

  return {
    id: String(page.id).replace(/-/g, ""),
    actorDisplayName: rt(props, "Actor Display Name") || title(props),
    officeSought: sel(props, "Office Sought") || "Other",
    politicalPlatform: rt(props, "Political Platform") || "Not publicly specified",
    dutyOrPolicyArea: sel(props, "Duty / Policy Area") || "Other",
    proposalText,
    mechanism: rt(props, "Mechanism") || "Not publicly specified",
    target: rt(props, "Target") || "Not publicly specified",
    timeline: rt(props, "Timeline") || "Not publicly specified",
    funding: rt(props, "Funding") || "Not publicly specified",
    responsibleInstitution: rt(props, "Responsible Institution") || "Not publicly specified",
    sourceUrl,
    sourceDate: rt(props, "Source Date") || "Not publicly specified",
    version: rt(props, "Version") || "Not publicly specified",
    statementClass,
    verification: verificationStatus,
    geographyScope: rt(props, "Geography Scope") || "Nigeria",
    created: page.created_time,
  };
}

async function queryPublishedBlueprintPages(): Promise<any[]> {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const database_id = blueprintDatabaseId();
  const pages: any[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < MAX_PAGES; i++) {
    const response: any = await notion.databases.query({
      database_id,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: PAGE_SIZE,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    pages.push(...(response.results || []));
    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor;
  }
  return pages;
}

export async function getPublishedBlueprints(filters?: {
  state?: string; office?: string; duty?: string;
}): Promise<{ proposals: PublicBlueprintProposal[]; total: number; byDuty: Record<string, number>; truncated: boolean; configured: boolean }> {
  if (!process.env.NOTION_TOKEN) return { proposals: [], total: 0, byDuty: {}, truncated: false, configured: false };
  const pages = await queryPublishedBlueprintPages();
  const proposals: PublicBlueprintProposal[] = [];
  const byDuty: Record<string, number> = {};
  for (const page of pages) {
    const row = mapPage(page);
    if (!row) continue;
    if (filters?.state && !row.geographyScope.toLowerCase().includes(filters.state.toLowerCase())) continue;
    if (filters?.office && row.officeSought !== filters.office) continue;
    if (filters?.duty && row.dutyOrPolicyArea !== filters.duty) continue;
    proposals.push(row);
    byDuty[row.dutyOrPolicyArea] = (byDuty[row.dutyOrPolicyArea] || 0) + 1;
  }
  return { proposals, total: proposals.length, byDuty, truncated: pages.length >= PAGE_SIZE * MAX_PAGES, configured: true };
}

export async function getPublishedBlueprint(id: string): Promise<PublicBlueprintProposal | null> {
  if (!process.env.NOTION_TOKEN || !id) return null;
  const { notionPageId, assertBlueprintPageOwnership } = await import("./blueprint-ownership");
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  try {
    const page: any = await notion.pages.retrieve({ page_id: notionPageId(id) });
    const ownership = assertBlueprintPageOwnership(page);
    if (!ownership.ok) return null;
    return mapPage(page);
  } catch {
    return null;
  }
}
