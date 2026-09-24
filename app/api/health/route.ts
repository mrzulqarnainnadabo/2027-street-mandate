import { NextResponse } from "next/server";
import { RESPONSIBILITY_MAP_VERSION } from "@/lib/responsibility-map";

export const dynamic = "force-dynamic";

/**
 * Ops health — no secrets, no civic PII.
 * notionConfigured is boolean presence of env vars only.
 */
export async function GET() {
  const notionConfigured = Boolean(
    process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID
  );

  return NextResponse.json(
    {
      ok: true,
      service: "iseyc-2027-civic-mandate",
      notionConfigured,
      freezeBanner: process.env.NEXT_PUBLIC_CIVIC_FREEZE === "1",
      responsibilityMapVersion: RESPONSIBILITY_MAP_VERSION,
      timestamp: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
