import { Client } from "@notionhq/client";
import {
  BLUEPRINT_DATABASE_ENV,
  BLUEPRINT_PILOT_DATABASE_ID,
} from "./notion-pilot-ids";
import type { PublicBlueprintProposal } from "./blueprint-public";

const PAGE_SIZE = 50;
const MAX_PAGES = 5;

function blueprintDatabaseId(): string {
  const fromEnv = (process.env[BLUEPRINT_DATABASE_ENV] || "").replace(/-/g, "");
  if (fromEnv) return fromEnv;
  // Pilot default for local/staff tooling only — production should set env explicitly
  return BLUEPRINT_PILOT_DATABASE_ID.replace(/-/g, "");
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
  const props = page.properties;
  if (sel(props, "Status") !== "Published") return null;

  const proposalText = rt(props, "Proposal Text");
  if (!proposalText) return null;

  return {
    id: String(page.id).replace(/-/g, ""),
    actorDisplayName: rt(props, "Actor Display Name") || title(props),
    officeSought: sel(props, "Office Sought"),
    politicalPlatform: rt(props, "Political Platform") || "Not publicly specified",
    dutyOrPolicyArea: sel(props, "Duty / Policy Area") || "Other",
    proposalText,
    mechanism: rt(props, "Mechanism") || "Not publicly specified",
    target: rt(props, "Target") || "Not publicly specified",
    timeline: rt(props, "Timeline") || "Not publicly specified",
    funding: rt(props, "Funding") || "Not publicly specified",
    responsibleInstitution: rt(props, "Responsible Institution") || "Not publicly specified",
    sourceUrl: props?.Source?.url || "",
    sourceDate: rt(props, "Source Date") || "Not publicly specified",
    version: rt(props, "Version") || "",
    statementClass: sel(props, "Statement Class") || "ACTOR_STATEMENT",
    verification: sel(props, "Verification") || "UNVERIFIED",
    geographyScope: rt(props, "Geography Scope") || "Nigeria",
    created: page.created_time,
  };
}

/**
 * Fetch Published blueprint proposals only.
 * Not wired to any public route yet.
 */
export async function getPublishedBlueprints(): Promise<{
  proposals: PublicBlueprintProposal[];
  total: number;
  byDuty: Record<string, number>;
  truncated: boolean;
  configured: boolean;
}> {
  if (!process.env.NOTION_TOKEN) {
    return { proposals: [], total: 0, byDuty: {}, truncated: false, configured: false };
  }

  const database_id = blueprintDatabaseId();
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const proposals: PublicBlueprintProposal[] = [];
  const byDuty: Record<string, number> = {};
  let cursor: string | undefined;
  let truncated = false;

  for (let i = 0; i < MAX_PAGES; i++) {
    const response: any = await notion.databases.query({
      database_id,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: PAGE_SIZE,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const result of response.results as any[]) {
      const row = mapPage(result);
      if (!row) continue;
      proposals.push(row);
      byDuty[row.dutyOrPolicyArea] = (byDuty[row.dutyOrPolicyArea] || 0) + 1;
    }

    if (!response.has_more) {
      truncated = false;
      break;
    }
    cursor = response.next_cursor || undefined;
    if (!cursor) break;
    if (i === MAX_PAGES - 1) truncated = true;
  }

  return {
    proposals,
    total: proposals.length,
    byDuty,
    truncated,
    configured: true,
  };
}
