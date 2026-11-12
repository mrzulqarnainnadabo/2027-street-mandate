export const COMMUNITY_OBSERVATION_CONTRACT_VERSION = "0.1.0" as const;
const MAX_PUBLISHED_PAGES = 20;
const PAGE_SIZE = 100;
const NOTION_API_VERSION = "2026-03-11";

export type CommunityObservationInput = {
  title: string;
  reportType: string;
  sector: string;
  state: string;
  lga?: string;
  ward?: string;
  placeOrFacility?: string;
  observedOn?: string;
  description: string;
  evidenceTypes: string[];
  evidenceLink?: string;
  sourceContext: string;
};

export type PublicCommunityObservation = {
  id: string;
  displayId: string | null;
  contractVersion: typeof COMMUNITY_OBSERVATION_CONTRACT_VERSION;
  publicationStatus: "published";
  verificationStatus: "unverified" | "corroborated" | "independently-verified" | "disputed";
  title: string;
  reportType: string;
  sector: string;
  state: string;
  lga: string | null;
  ward: string | null;
  placeOrFacility: string | null;
  observedOn: string | null;
  description: string;
  evidenceTypes: string[];
  evidenceLink: string | null;
  submittedAt: string;
  publishedAt: string | null;
};

type NotionApiError = Error & { code?: string; status?: number };

function isPlausibleNotionId(value: string): boolean {
  // Notion IDs are 32 hex chars, optionally hyphenated UUID form.
  const compact = value.replace(/-/g, "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(compact);
}

async function notionRequest(path: string, method: "GET" | "POST", body?: unknown): Promise<any> {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("Community observation Notion token is not configured.");

  const response = await fetch("https://api.notion.com/v1/" + path, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      "Notion-Version": NOTION_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  const raw = await response.text();
  let payload: any = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = {}; }
  if (!response.ok) {
    const error = new Error(typeof payload.message === "string" ? payload.message : "Notion API request failed.") as NotionApiError;
    error.code = typeof payload.code === "string" ? payload.code : "notion_api_error";
    error.status = response.status;
    throw error;
  }
  return payload;
}

function dataSourceId(): string {
  const id = process.env.NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID?.trim();
  if (!id) throw new Error("Community observation data source is not configured.");
  if (!isPlausibleNotionId(id)) {
    const error = new Error("Community observation data source ID is not a valid Notion identifier.") as NotionApiError;
    error.code = "validation_error";
    error.status = 400;
    throw error;
  }
  return id;
}

function richText(value: string) {
  return value ? [{ type: "text", text: { content: value.slice(0, 1900) } }] : [];
}

export async function submitCommunityObservation(input: CommunityObservationInput): Promise<string> {
  const properties: Record<string, unknown> = {
    Name: { title: [{ type: "text", text: { content: input.title.slice(0, 120) } }] },
    "Report Type": { select: { name: input.reportType } },
    Sector: { select: { name: input.sector } },
    State: { rich_text: richText(input.state) },
    LGA: { rich_text: richText(input.lga || "") },
    Ward: { rich_text: richText(input.ward || "") },
    "Place or Facility": { rich_text: richText(input.placeOrFacility || "") },
    Description: { rich_text: richText(input.description) },
    "Evidence Type": { multi_select: input.evidenceTypes.map((name) => ({ name })) },
    "Source Context": { rich_text: richText(input.sourceContext) },
    Status: { select: { name: "New" } },
    "Verification Status": { select: { name: "Unverified" } },
    "Review Gate": { select: { name: "Pending" } },
  };

  if (input.observedOn) properties["Observed On"] = { date: { start: input.observedOn } };
  if (input.evidenceLink) properties["Evidence Link"] = { url: input.evidenceLink };

  const page = await notionRequest("pages", "POST", {
    parent: { type: "data_source_id", data_source_id: dataSourceId() },
    properties,
  });
  return String(page.id);
}

function readRichText(property: any): string {
  return Array.isArray(property?.rich_text)
    ? property.rich_text.map((part: any) => part.plain_text || part.text?.content || "").join("").trim()
    : "";
}

function readTitle(property: any): string {
  return Array.isArray(property?.title)
    ? property.title.map((part: any) => part.plain_text || part.text?.content || "").join("").trim()
    : "";
}

function readSelect(property: any): string {
  return typeof property?.select?.name === "string" ? property.select.name : "";
}

function readMultiSelect(property: any): string[] {
  return Array.isArray(property?.multi_select)
    ? property.multi_select.map((item: any) => item.name).filter((name: unknown): name is string => typeof name === "string")
    : [];
}

function verificationStatus(value: string): PublicCommunityObservation["verificationStatus"] {
  switch (value) {
    case "Corroborated": return "corroborated";
    case "Independently verified": return "independently-verified";
    case "Disputed": return "disputed";
    default: return "unverified";
  }
}

/** Explicit public allowlist. Source Context and Reviewer Notes never leave the private review workspace. */
export function mapPublishedCommunityObservation(page: any): PublicCommunityObservation | null {
  const p = page?.properties || {};
  if (readSelect(p.Status) !== "Published" || readSelect(p["Review Gate"]) !== "Dual review complete") return null;

  const title = readTitle(p.Name);
  const description = readRichText(p.Description);
  const state = readRichText(p.State);
  const reportType = readSelect(p["Report Type"]);
  const sector = readSelect(p.Sector);
  if (!title || !description || !state || !reportType || !sector) return null;

  const uniqueId = p["Report ID"]?.unique_id;
  const displayId = uniqueId && Number.isInteger(uniqueId.number)
    ? (uniqueId.prefix || "CR") + "-" + uniqueId.number
    : null;
  const evidenceLink = typeof p["Evidence Link"]?.url === "string" ? p["Evidence Link"].url : null;

  return {
    id: String(page.id || "").replace(/-/g, ""),
    displayId,
    contractVersion: COMMUNITY_OBSERVATION_CONTRACT_VERSION,
    publicationStatus: "published",
    verificationStatus: verificationStatus(readSelect(p["Verification Status"])),
    title,
    reportType,
    sector,
    state,
    lga: readRichText(p.LGA) || null,
    ward: readRichText(p.Ward) || null,
    placeOrFacility: readRichText(p["Place or Facility"]) || null,
    observedOn: p["Observed On"]?.date?.start || null,
    description,
    evidenceTypes: readMultiSelect(p["Evidence Type"]),
    evidenceLink: evidenceLink && evidenceLink.startsWith("https://") ? evidenceLink : null,
    submittedAt: typeof page.created_time === "string" ? page.created_time : "",
    publishedAt: p["Published At"]?.date?.start || null,
  };
}

export async function getPublishedCommunityObservations(): Promise<{
  records: PublicCommunityObservation[];
  truncated: boolean;
}> {
  const id = dataSourceId();
  const pages: any[] = [];
  let cursor: string | undefined;
  let truncated = false;

  for (let pageNumber = 0; pageNumber < MAX_PUBLISHED_PAGES; pageNumber += 1) {
    const response = await notionRequest("data_sources/" + id + "/query", "POST", {
      filter: { and: [
        { property: "Status", select: { equals: "Published" } },
        { property: "Review Gate", select: { equals: "Dual review complete" } },
      ] },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: PAGE_SIZE,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    pages.push(...(response.results || []));
    if (!response.has_more) break;
    cursor = response.next_cursor || undefined;
    if (!cursor || pageNumber === MAX_PUBLISHED_PAGES - 1) {
      truncated = true;
      break;
    }
  }

  return {
    records: pages.map(mapPublishedCommunityObservation).filter((record): record is PublicCommunityObservation => record !== null),
    truncated,
  };
}

/** A non-sensitive category suitable for a public 503 response and smoke-test diagnostics. */
export function communityObservationErrorCode(error: unknown): string {
  const value = error as NotionApiError;
  if (/not configured/i.test(String(value?.message || ""))) return "CONFIGURATION_MISSING";
  if (value?.status === 401 || value?.code === "unauthorized") return "NOTION_TOKEN_UNAUTHORIZED";
  if (value?.status === 403 || value?.code === "restricted_resource") return "NOTION_ACCESS_DENIED";
  if (value?.status === 404 || value?.code === "object_not_found") return "NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED";
  if (value?.status === 400 || value?.code === "validation_error") return "NOTION_REQUEST_VALIDATION_FAILED";
  if (value?.status === 429 || value?.code === "rate_limited") return "NOTION_RATE_LIMITED";
  return "NOTION_UPSTREAM_UNAVAILABLE";
}
