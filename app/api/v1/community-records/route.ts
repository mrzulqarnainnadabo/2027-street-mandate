import { NextRequest, NextResponse } from "next/server";
import { getPublishedPulse } from "@/lib/notion";
import { buildCommunityRecordsResponse } from "@/lib/community-record";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public published-only CommunityRecord v0.1. CORS open for GET (Brain / Observatory). */
const PUBLIC_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-ISEYC-Contract": "community-record.v0.1",
} as const;

/** Non-sensitive diagnostic category for public 503 responses (Brain/Observatory clients). */
function communityRecordsErrorCode(error: unknown): string {
  const value = error as { status?: number; code?: string } | null;
  if (value?.status === 401 || value?.code === "unauthorized") return "NOTION_TOKEN_UNAUTHORIZED";
  if (value?.status === 403 || value?.code === "restricted_resource") return "NOTION_ACCESS_DENIED";
  if (value?.status === 404 || value?.code === "object_not_found") return "NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED";
  if (value?.status === 400 || value?.code === "validation_error") return "NOTION_REQUEST_VALIDATION_FAILED";
  if (value?.status === 429 || value?.code === "rate_limited") return "NOTION_RATE_LIMITED";
  if (error instanceof Error && /not configured|missing/i.test(error.message)) return "NOTION_CONFIGURATION_MISSING";
  return "NOTION_UPSTREAM_UNAVAILABLE";
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...PUBLIC_HEADERS } });
}

/**
 * GET /api/v1/community-records
 * Query: page, pageSize, state, lga, duty, sector, since, until
 * Published-only. Does not replace /api/pulse.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const pulse = await getPublishedPulse();
    const body = buildCommunityRecordsResponse(
      pulse.voices,
      {
        page: Number(sp.get("page") || 1),
        pageSize: Number(sp.get("pageSize") || 20),
        state: sp.get("state") || undefined,
        lga: sp.get("lga") || undefined,
        duty: sp.get("duty") || undefined,
        sector: sp.get("sector") || undefined,
        since: sp.get("since") || undefined,
        until: sp.get("until") || undefined,
      },
      { total: pulse.total, truncated: pulse.truncated },
    );

    return NextResponse.json(body, { headers: { ...PUBLIC_HEADERS } });
  } catch (err: unknown) {
    console.error("community-records error:", err);
    const diagnosticCode = communityRecordsErrorCode(err);
    return NextResponse.json(
      {
        error: "COMMUNITY_RECORDS_UNAVAILABLE",
        message:
          "Published community records are temporarily unavailable. Please try again later.",
        contractVersion: "0.1.0",
        diagnosticCode,
      },
      { status: 503, headers: { ...PUBLIC_HEADERS } },
    );
  }
}
