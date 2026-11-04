import { NextRequest, NextResponse } from "next/server";
import { communityObservationErrorCode, getPublishedCommunityObservations } from "@/lib/community-observations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-ISEYC-Contract": "community-observation.v0.1",
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...HEADERS } });
}

/**
 * GET /api/v1/community-observations
 * Published-only. Never returns source context or internal reviewer notes.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const bundle = await getPublishedCommunityObservations();
    let records = bundle.records;

    const state = sp.get("state")?.trim().toLowerCase();
    const lga = sp.get("lga")?.trim().toLowerCase();
    const sector = sp.get("sector")?.trim().toLowerCase();
    const reportType = sp.get("reportType")?.trim().toLowerCase();
    const query = sp.get("q")?.trim().toLowerCase();

    if (state) records = records.filter((r) => r.state.toLowerCase() === state);
    if (lga) records = records.filter((r) => (r.lga || "").toLowerCase() === lga);
    if (sector) records = records.filter((r) => r.sector.toLowerCase() === sector);
    if (reportType) records = records.filter((r) => r.reportType.toLowerCase() === reportType);
    if (query) records = records.filter((r) => `${r.title} ${r.description} ${r.placeOrFacility || ""}`.toLowerCase().includes(query));

    const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize")) || 20));
    const total = records.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const requestedPage = Math.max(1, Number(sp.get("page")) || 1);
    const page = Math.min(requestedPage, totalPages);
    const start = (page - 1) * pageSize;

    return NextResponse.json({
      contractVersion: "0.1.0",
      publicationBoundary: "published-only",
      verificationNote: "Published community observations have passed ISEYC review. Publication is not independent verification; each record carries its own verification status.",
      coverageNote: "This is a collection of submitted and published community observations, not a representative survey or prevalence estimate. Missing reports do not mean a service is functioning.",
      page,
      pageSize,
      total,
      totalPages,
      truncatedUpstream: bundle.truncated,
      filters: { state: state || null, lga: lga || null, sector: sector || null, reportType: reportType || null, q: query || null },
      records: records.slice(start, start + pageSize),
    }, { headers: { ...HEADERS } });
  } catch (error: any) {
    console.error("Community observations public API error:", error?.message || error);
    return NextResponse.json({
      error: "COMMUNITY_OBSERVATIONS_UNAVAILABLE",
      message: "Published community observations are temporarily unavailable.",
      contractVersion: "0.1.0",
      diagnosticCode: communityObservationErrorCode(error),
    }, { status: 503, headers: { ...HEADERS } });
  }
}
