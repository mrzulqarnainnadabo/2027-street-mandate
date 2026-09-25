import { Client } from "@notionhq/client";
import {
  canOperatorPublishFromStatus,
  evaluateBlueprintPublication,
  type BlueprintGovernance,
} from "./blueprint-governance";
import {
  assertBlueprintPageOwnership,
  blueprintDatabaseIdNormalized,
  notionPageId,
} from "./blueprint-ownership";
import { BLUEPRINT_DATABASE_ENV, BLUEPRINT_PILOT_DATABASE_ID } from "./notion-pilot-ids";
import { NOT_PUBLICLY_SPECIFIED } from "./types";

const PAGE_SIZE = 50;
const MAX_PAGES = 4;

export type OperatorBlueprintRecord = {
  id: string;
  name: string;
  actorDisplayName: string;
  officeSought: string;
  dutyOrPolicyArea: string;
  proposalText: string;
  mechanism: string;
  target: string;
  timeline: string;
  funding: string;
  responsibleInstitution: string;
  sourceUrl: string;
  sourceDate: string;
  statementClass: string;
  verification: string;
  status: string;
  reviewerA: string;
  reviewerADecision: string;
  reviewerADate: string;
  reviewerB: string;
  reviewerBDecision: string;
  reviewerBDate: string;
  publicationDecision: string;
  publicationDate: string;
  reviewNotes: string;
  geographyScope: string;
  archived: boolean;
  readiness: {
    sourcePresent: boolean;
    verificationAcceptable: boolean;
    reviewerAApproved: boolean;
    reviewerBApproved: boolean;
    reviewersDifferent: boolean;
    publicationDecisionPublish: boolean;
    statusAllowsPublish: boolean;
    publishable: boolean;
    reasons: string[];
  };
};

function dbId(): string {
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
function dateStart(props: any, name: string): string {
  return props?.[name]?.date?.start || "";
}
function display(value: string): string {
  return value.trim() || NOT_PUBLICLY_SPECIFIED;
}

export function mapOperatorBlueprint(page: any): OperatorBlueprintRecord | null {
  if (!page || page.object !== "page") return null;
  const ownership = assertBlueprintPageOwnership(page);
  if (!ownership.ok) return null;

  const props = page.properties || {};
  const sourceUrl = typeof props?.Source?.url === "string" ? props.Source.url : "";
  const governance: BlueprintGovernance = {
    status: sel(props, "Status"),
    verification: sel(props, "Verification"),
    sourceUrl,
    statementClass: sel(props, "Statement Class"),
    reviewerA: rt(props, "Reviewer A"),
    reviewerADecision: sel(props, "Reviewer A Decision"),
    reviewerB: rt(props, "Reviewer B"),
    reviewerBDecision: sel(props, "Reviewer B Decision"),
    publicationDecision: sel(props, "Publication Decision"),
  };

  const gate = evaluateBlueprintPublication({
    ...governance,
    status: "Published",
    publicationDecision: "Publish",
  });

  const a = governance.reviewerA.trim().toLowerCase();
  const b = governance.reviewerB.trim().toLowerCase();

  return {
    id: String(page.id).replace(/-/g, ""),
    name: title(props) || display(rt(props, "Actor Display Name")),
    actorDisplayName: display(rt(props, "Actor Display Name") || title(props)),
    officeSought: display(sel(props, "Office Sought")),
    dutyOrPolicyArea: display(sel(props, "Duty / Policy Area")),
    proposalText: display(rt(props, "Proposal Text")),
    mechanism: display(rt(props, "Mechanism")),
    target: display(rt(props, "Target")),
    timeline: display(rt(props, "Timeline")),
    funding: display(rt(props, "Funding")),
    responsibleInstitution: display(rt(props, "Responsible Institution")),
    sourceUrl,
    sourceDate: display(rt(props, "Source Date")),
    statementClass: display(sel(props, "Statement Class")),
    verification: display(governance.verification),
    status: display(governance.status),
    reviewerA: governance.reviewerA || NOT_PUBLICLY_SPECIFIED,
    reviewerADecision: governance.reviewerADecision || NOT_PUBLICLY_SPECIFIED,
    reviewerADate: dateStart(props, "Reviewer A Date") || NOT_PUBLICLY_SPECIFIED,
    reviewerB: governance.reviewerB || NOT_PUBLICLY_SPECIFIED,
    reviewerBDecision: governance.reviewerBDecision || NOT_PUBLICLY_SPECIFIED,
    reviewerBDate: dateStart(props, "Reviewer B Date") || NOT_PUBLICLY_SPECIFIED,
    publicationDecision: governance.publicationDecision || NOT_PUBLICLY_SPECIFIED,
    publicationDate: dateStart(props, "Publication Date") || NOT_PUBLICLY_SPECIFIED,
    reviewNotes: rt(props, "Review Notes"),
    geographyScope: display(rt(props, "Geography Scope")),
    archived: Boolean(page.archived),
    readiness: {
      sourcePresent: Boolean(sourceUrl.trim()),
      verificationAcceptable:
        Boolean(governance.verification.trim()) && governance.verification !== "UNVERIFIED",
      reviewerAApproved: governance.reviewerADecision === "Approved",
      reviewerBApproved: governance.reviewerBDecision === "Approved",
      reviewersDifferent: Boolean(a && b && a !== b),
      publicationDecisionPublish: governance.publicationDecision === "Publish",
      statusAllowsPublish: canOperatorPublishFromStatus(governance.status),
      publishable: gate.publishable && canOperatorPublishFromStatus(governance.status),
      reasons: gate.publishable ? [] : gate.reasons,
    },
  };
}

/** Operator queue — all statuses in Blueprint pilot DB (not public). */
export async function listOperatorBlueprints(): Promise<{
  records: OperatorBlueprintRecord[];
  configured: boolean;
  error?: string;
}> {
  if (!process.env.NOTION_TOKEN) {
    return { records: [], configured: false, error: "Notion is not configured." };
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const database_id = dbId();
  const pages: any[] = [];
  let cursor: string | undefined;

  try {
    for (let i = 0; i < MAX_PAGES; i++) {
      const response: any = await notion.databases.query({
        database_id,
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
        page_size: PAGE_SIZE,
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      pages.push(...(response.results || []));
      if (!response.has_more || !response.next_cursor) break;
      cursor = response.next_cursor;
    }
  } catch {
    return { records: [], configured: true, error: "Blueprint queue could not be loaded." };
  }

  const records: OperatorBlueprintRecord[] = [];
  for (const page of pages) {
    const row = mapOperatorBlueprint(page);
    if (row) records.push(row);
  }
  return { records, configured: true };
}

export async function getOperatorBlueprint(
  id: string,
): Promise<OperatorBlueprintRecord | null> {
  if (!process.env.NOTION_TOKEN || !id) return null;
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  try {
    const page: any = await notion.pages.retrieve({ page_id: notionPageId(id) });
    return mapOperatorBlueprint(page);
  } catch {
    return null;
  }
}

export function expectedBlueprintDatabaseId(): string {
  return blueprintDatabaseIdNormalized();
}
