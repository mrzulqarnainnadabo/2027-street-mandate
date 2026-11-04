export const EVIDENCE_VAULT_CONTRACT_VERSION = "0.1.0" as const;
const MAX_PUBLISHED_PAGES = 20;
const PAGE_SIZE = 100;
const NOTION_API_VERSION = "2026-03-11";

export type PublicEvidenceRecord = {
  id: string;
  displayId: string | null;
  contractVersion: typeof EVIDENCE_VAULT_CONTRACT_VERSION;
  publicationStatus: "published";
  verificationStatus: string;
  evidenceType: string;
  evidenceScope: string;
  title: string;
  sourceTitle: string | null;
  sourceUrl: string;
  sourceId: string | null;
  publisher: string | null;
  indicatorCode: string | null;
  measure: string | null;
  unit: string | null;
  observedValue: number | null;
  valueStatus: string | null;
  geographicLevel: string | null;
  geographicUnit: string | null;
  referencePeriod: string | null;
  retrievedAt: string | null;
  methodology: string | null;
  limitations: string | null;
  dataStatus: string | null;
  evidenceLinkReview: string | null;
  evidenceRelation: string;
  linkedCommunityObservationId: string | null;
  linkedDemandId: string | null;
  createdAt: string;
};

type NotionApiError = Error & { code?: string; status?: number };

async function notionRequest(path: string, method: "GET" | "POST", body?: unknown): Promise<any> {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("Evidence Vault Notion token is not configured.");

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
  const id = process.env.NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID;
  if (!id) throw new Error("Evidence Vault data source is not configured.");
  return id;
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

function readNumber(property: any): number | null {
  return typeof property?.number === "number" && Number.isFinite(property.number) ? property.number : null;
}

function readDate(property: any): string | null {
  return typeof property?.date?.start === "string" ? property.date.start : null;
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

function mapPublishedEvidenceRecord(page: any): PublicEvidenceRecord | null {
  const p = page?.properties || {};
  if (readSelect(p["Publication Status"]) !== "Published" || readSelect(p["Review Gate"]) !== "Dual review complete") return null;

  const title = readTitle(p.Name);
  const sourceUrl = typeof p.Source?.url === "string" ? p.Source.url : "";
  const evidenceType = readSelect(p["Evidence Type"]);
  const evidenceScope = readSelect(p["Evidence Scope"]);
  const verification = readSelect(p.Verification);
  const evidenceRelation = readSelect(p["Evidence Relation"]) || "Not assessed";
  const evidenceLinkReview = readSelect(p["Evidence Link Review"]);
  const linkedObservationId = readRichText(p["Linked Community Observation ID"]) || null;

  if (!title || !sourceUrl.startsWith("https://") || !evidenceType || !evidenceScope || !verification) return null;

  if (evidenceRelation === "Corroborates" &&
    (verification !== "CONTENT_CORROBORATED" || evidenceLinkReview !== "Content checked" || !linkedObservationId)) return null;
  if (evidenceRelation === "Contradicts" &&
    (verification !== "DISPUTED" || evidenceLinkReview !== "Content checked" || !linkedObservationId)) return null;

  const uniqueId = p["Evidence ID"]?.unique_id || p["Evidence ID"]?.auto_increment_id;
  const displayId = uniqueId && Number.isInteger(uniqueId.number)
    ? (uniqueId.prefix || "EV") + "-" + uniqueId.number
    : null;

  return {
    id: String(page.id || "").replace(/-/g, ""),
    displayId,
    contractVersion: EVIDENCE_VAULT_CONTRACT_VERSION,
    publicationStatus: "published",
    verificationStatus: slug(verification),
    evidenceType: slug(evidenceType),
    evidenceScope: slug(evidenceScope),
    title,
    sourceTitle: readRichText(p.Title) || null,
    sourceUrl,
    sourceId: readRichText(p["Source ID"]) || null,
    publisher: readRichText(p.Publisher) || null,
    indicatorCode: readRichText(p["Indicator Code"]) || null,
    measure: readRichText(p.Measure) || null,
    unit: readRichText(p.Unit) || null,
    observedValue: readNumber(p["Observed Value"]),
    valueStatus: readSelect(p["Value Status"]) ? slug(readSelect(p["Value Status"])) : null,
    geographicLevel: readSelect(p["Geographic Level"]) ? slug(readSelect(p["Geographic Level"])) : null,
    geographicUnit: readRichText(p["Geographic Unit"]) || null,
    referencePeriod: readRichText(p["Reference Period"]) || null,
    retrievedAt: readDate(p["Retrieved At"]),
    methodology: readRichText(p.Methodology) || null,
    limitations: readRichText(p.Limitations) || null,
    dataStatus: readSelect(p["Data Status"]) ? slug(readSelect(p["Data Status"])) : null,
    evidenceLinkReview: evidenceLinkReview ? slug(evidenceLinkReview) : null,
    evidenceRelation: slug(evidenceRelation),
    linkedCommunityObservationId: linkedObservationId,
    linkedDemandId: readRichText(p["Linked Demand Id"]) || null,
    createdAt: typeof page.created_time === "string" ? page.created_time : "",
  };
}

/** Public allowlist. Reviewer identities and review dates are never returned. */
export async function getPublishedEvidenceRecords(): Promise<{
  records: PublicEvidenceRecord[];
  truncated: boolean;
}> {
  const id = dataSourceId();
  const pages: any[] = [];
  let cursor: string | undefined;
  let truncated = false;

  for (let pageNumber = 0; pageNumber < MAX_PUBLISHED_PAGES; pageNumber += 1) {
    const response = await notionRequest("data_sources/" + id + "/query", "POST", {
      filter: { and: [
        { property: "Publication Status", select: { equals: "Published" } },
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
    records: pages.map(mapPublishedEvidenceRecord).filter((record): record is PublicEvidenceRecord => record !== null),
    truncated,
  };
}

export function evidenceVaultErrorCode(error: unknown): string {
  const value = error as NotionApiError;
  if (/not configured/i.test(String(value?.message || ""))) return "CONFIGURATION_MISSING";
  if (value?.status === 401 || value?.code === "unauthorized") return "NOTION_TOKEN_UNAUTHORIZED";
  if (value?.status === 403 || value?.code === "restricted_resource") return "NOTION_ACCESS_DENIED";
  if (value?.status === 404 || value?.code === "object_not_found") return "NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED";
  if (value?.status === 400 || value?.code === "validation_error") return "NOTION_REQUEST_VALIDATION_FAILED";
  if (value?.status === 429 || value?.code === "rate_limited") return "NOTION_RATE_LIMITED";
  return "NOTION_UPSTREAM_UNAVAILABLE";
}
