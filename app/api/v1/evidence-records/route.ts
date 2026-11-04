import { NextRequest, NextResponse } from "next/server";
import { evidenceVaultErrorCode, getPublishedEvidenceRecords } from "@/lib/evidence-vault";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-ISEYC-Contract": "evidence-record.v0.1",
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...HEADERS } });
}

/**
 * GET /api/v1/evidence-records
 * Only published Evidence Vault rows that passed the dual-review gate are exposed.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const bundle = await getPublishedEvidenceRecords();
    let records = bundle.records;

    const sourceId = sp.get("sourceId")?.trim().toLowerCase();
    const observationId = sp.get("linkedCommunityObservationId")?.trim().toLowerCase();
    const indicatorCode = sp.get("indicatorCode")?.trim().toLowerCase();
    const geographicLevel = sp.get("geographicLevel")?.trim().toLowerCase();
    const dataStatus = sp.get("dataStatus")?.trim().toLowerCase();
    const evidenceRelation = sp.get("evidenceRelation")?.trim().toLowerCase();
    const query = sp.get("q")?.trim().toLowerCase();

    if (sourceId) records = records.filter((r) => (r.sourceId || "").toLowerCase() === sourceId);
    if (observationId) records = records.filter((r) => (r.linkedCommunityObservationId || "").toLowerCase() === observationId);
    if (indicatorCode) records = records.filter((r) => (r.indicatorCode || "").toLowerCase() === indicatorCode);
    if (geographicLevel) records = records.filter((r) => r.geographicLevel === geographicLevel);
    if (dataStatus) records = records.filter((r) => r.dataStatus === dataStatus);
    if (evidenceRelation) records = records.filter((r) => r.evidenceRelation === evidenceRelation);
    if (query) records = records.filter((r) => [
      r.title, r.sourceTitle || "", r.publisher || "", r.measure || "", r.geographicUnit || "",
    ].join(" ").toLowerCase().includes(query));

    const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize")) || 20));
    const total = records.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const requestedPage = Math.max(1, Number(sp.get("page")) || 1);
    const page = Math.min(requestedPage, totalPages);
    const start = (page - 1) * pageSize;

    return NextResponse.json({
      contractVersion: "0.1.0",
      publicationBoundary: "published-and-dual-reviewed-only",
      verificationNote: "SOURCE_CONFIRMED means the source was reachable and identified. CONTENT_CORROBORATED means the source content was checked against a specific claim. These states are not interchangeable.",
      relationNote: "Corroborates and Contradicts require a linked Community Observation ID, content-checked source link and corresponding verification state. Context only does not verify a report.",
      coverageNote: "This is the curated set of evidence records approved for publication, not a complete catalogue of all public evidence or a representative dataset.",
      page,
      pageSize,
      total,
      totalPages,
      truncatedUpstream: bundle.truncated,
      filters: {
        sourceId: sourceId || null,
        linkedCommunityObservationId: observationId || null,
        indicatorCode: indicatorCode || null,
        geographicLevel: geographicLevel || null,
        dataStatus: dataStatus || null,
        evidenceRelation: evidenceRelation || null,
        q: query || null,
      },
      records: records.slice(start, start + pageSize),
    }, { headers: { ...HEADERS } });
  } catch (error: any) {
    const diagnosticCode = evidenceVaultErrorCode(error);
    console.error("Evidence Vault public API error:", { code: diagnosticCode, status: error?.status });
    return NextResponse.json({
      error: "EVIDENCE_VAULT_UNAVAILABLE",
      diagnosticCode,
      message: "Published evidence records are temporarily unavailable.",
      contractVersion: "0.1.0",
    }, { status: 503, headers: { ...HEADERS } });
  }
}
