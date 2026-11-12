import { NextResponse } from "next/server";
import { RESPONSIBILITY_MAP_VERSION } from "@/lib/responsibility-map";

export const dynamic = "force-dynamic";

/**
 * Ops health — no secrets, no civic PII, no upstream Notion probes.
 *
 * Distinguishes:
 * - tokenPresent: NOTION_TOKEN is set
 * - dataSourceConfigured: specific data-source env vars are set
 *
 * Presence is not accessibility. Accessibility is not published data.
 * Empty published sets are success; missing configuration is not.
 */
export async function GET() {
  const tokenPresent = Boolean(process.env.NOTION_TOKEN?.trim());
  const demandDatabaseConfigured = Boolean(process.env.NOTION_DATABASE_ID?.trim());
  const communityObservationsConfigured = Boolean(
    process.env.NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID?.trim()
  );
  const evidenceVaultConfigured = Boolean(
    process.env.NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID?.trim()
  );

  // Backward-compatible boolean: legacy clients expected token + demand DB.
  const notionConfigured = tokenPresent && demandDatabaseConfigured;

  return NextResponse.json(
    {
      ok: true,
      service: "civic-mandate-nigeria",
      notionConfigured,
      integrations: {
        tokenPresent,
        demandDatabaseConfigured,
        communityObservationsDataSourceConfigured: communityObservationsConfigured,
        evidenceVaultDataSourceConfigured: evidenceVaultConfigured,
      },
      notes: {
        scope:
          "Configuration presence only. Does not probe Notion, does not prove share access, does not count published rows.",
        communityObservations:
          "Requires NOTION_TOKEN and NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID; database must be shared with the integration.",
        evidenceVault:
          "Requires NOTION_TOKEN and NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID; database must be shared with the integration.",
      },
      freezeBanner: process.env.NEXT_PUBLIC_CIVIC_FREEZE === "1",
      responsibilityMapVersion: RESPONSIBILITY_MAP_VERSION,
      timestamp: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
