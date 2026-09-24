import { Client } from "@notionhq/client";
import {
  COMMITMENT_DATABASE_ENV,
  COMMITMENT_PILOT_DATABASE_ID,
} from "./notion-pilot-ids";
import type { PublicCommitment } from "./commitment-public";

const PAGE_SIZE = 50;
const MAX_PAGES = 5;

function databaseId(): string {
  const fromEnv = (process.env[COMMITMENT_DATABASE_ENV] || "").replace(/-/g, "");
  if (fromEnv) return fromEnv;
  return COMMITMENT_PILOT_DATABASE_ID.replace(/-/g, "");
}

function rt(props: any, name: string): string {
  return props?.[name]?.rich_text?.[0]?.plain_text?.trim() || "";
}

function sel(props: any, name: string): string {
  return props?.[name]?.select?.name || "";
}

function mapPage(page: any): PublicCommitment | null {
  const props = page.properties;
  if (sel(props, "Publication Status") !== "Published") return null;
  const commitmentText = rt(props, "Commitment Text");
  if (!commitmentText) return null;

  return {
    id: String(page.id).replace(/-/g, ""),
    officeHolderDisplayName: rt(props, "Office Holder Display Name"),
    office: sel(props, "Office"),
    dutyOrPolicyArea: sel(props, "Duty / Policy Area") || "Other",
    commitmentText,
    responsibleInstitution: rt(props, "Responsible Institution") || "Not publicly specified",
    timeline: rt(props, "Timeline") || "Not publicly specified",
    commitmentStatus: sel(props, "Commitment Status") || "Announced",
    sourceUrl: props?.Source?.url || "",
    verification: sel(props, "Verification") || "UNVERIFIED",
    geographyScope: rt(props, "Geography Scope") || "",
    created: page.created_time,
  };
}

export async function getPublishedCommitments(): Promise<{
  commitments: PublicCommitment[];
  total: number;
  byDuty: Record<string, number>;
  truncated: boolean;
  configured: boolean;
}> {
  if (!process.env.NOTION_TOKEN) {
    return { commitments: [], total: 0, byDuty: {}, truncated: false, configured: false };
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const database_id = databaseId();
  const commitments: PublicCommitment[] = [];
  const byDuty: Record<string, number> = {};
  let cursor: string | undefined;
  let truncated = false;

  for (let i = 0; i < MAX_PAGES; i++) {
    const response: any = await notion.databases.query({
      database_id,
      filter: {
        property: "Publication Status",
        select: { equals: "Published" },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: PAGE_SIZE,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const result of response.results as any[]) {
      const row = mapPage(result);
      if (!row) continue;
      commitments.push(row);
      byDuty[row.dutyOrPolicyArea] = (byDuty[row.dutyOrPolicyArea] || 0) + 1;
    }

    if (!response.has_more) break;
    cursor = response.next_cursor || undefined;
    if (!cursor) break;
    if (i === MAX_PAGES - 1) truncated = true;
  }

  return {
    commitments,
    total: commitments.length,
    byDuty,
    truncated,
    configured: true,
  };
}
