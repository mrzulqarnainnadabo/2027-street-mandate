import { NextResponse } from "next/server";
import { getPublishedPulse } from "@/lib/notion";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public published-only feed. CORS open for GET so Civic Brain can read the same contract. */
const PUBLIC_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...PUBLIC_HEADERS } });
}

export async function GET() {
  try {
    const data = await getPublishedPulse();
    return NextResponse.json(data, {
      headers: { ...PUBLIC_HEADERS },
    });
  } catch (err: any) {
    console.error("Pulse error:", err);
    return NextResponse.json(
      {
        error: "CIVIC_PULSE_UNAVAILABLE",
        message: "Published civic records are temporarily unavailable. Please try again later.",
      },
      {
        status: 503,
        headers: { ...PUBLIC_HEADERS },
      }
    );
  }
}
