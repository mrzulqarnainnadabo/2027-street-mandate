import { NextResponse } from "next/server";
import { getPublishedPulse } from "@/lib/notion";

export const revalidate = 30;

export async function GET() {
  try {
    const data = await getPublishedPulse();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Pulse error:", err);
    return NextResponse.json(
      { voices: [], tally: {}, total: 0, states: 0 },
      { status: 200 }
    );
  }
}
