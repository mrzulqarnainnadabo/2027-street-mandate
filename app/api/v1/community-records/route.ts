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
    return NextResponse.json(
      {
        error: "COMMUNITY_RECORDS_UNAVAILABLE",
        message:
          "Published community records are temporarily unavailable. Please try again later.",
        contractVersion: "0.1.0",
      },
      { status: 503, headers: { ...PUBLIC_HEADERS } },
    );
  }
}
