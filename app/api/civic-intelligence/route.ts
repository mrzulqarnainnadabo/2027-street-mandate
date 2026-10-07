import { NextResponse } from "next/server";
import { getPublishedPulse } from "@/lib/notion";
import { buildCivicIntelligence } from "@/lib/civic-intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Public Civic Intelligence API.
 * Aggregates Published-only records. Never invents counts or national opinion.
 */
export async function GET() {
  try {
    const pulse = await getPublishedPulse();
    const snapshot = buildCivicIntelligence(pulse.voices, {
      truncated: pulse.truncated,
      generatedAt: new Date().toISOString(),
    });

    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: any) {
    console.error("Civic intelligence error:", err?.message || err);
    return NextResponse.json(
      {
        error: "CIVIC_INTELLIGENCE_UNAVAILABLE",
        message:
          "Published civic records could not be loaded for aggregation. No synthetic counts are returned.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}
