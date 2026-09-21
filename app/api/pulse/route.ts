import { NextResponse } from "next/server";
import { getPublishedPulse } from "@/lib/notion";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPublishedPulse();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
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
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}
