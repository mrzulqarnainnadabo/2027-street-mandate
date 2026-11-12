# Mandate published data sources — operations checklist

Public APIs that depend on Notion data sources:

| Endpoint | Env var (value never committed) | Production symptom when broken |
|----------|----------------------------------|--------------------------------|
| `GET /api/v1/community-observations` | `NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID` | HTTP 503 · `NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED` |
| `GET /api/v1/evidence-records` | `NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID` | HTTP 503 · `NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED` |
| Shared | `NOTION_TOKEN` | 401 → `NOTION_TOKEN_UNAUTHORIZED`; missing → `CONFIGURATION_MISSING` |

## Confirmed production state (independent probe)

- `/api/v1/community-records` — **200** (published demands path works; Notion token is present for at least one database)
- `/api/pulse` — **200**
- `/api/health` — **200**, `notionConfigured: true`
- `/api/v1/community-observations` — **503** `NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED`
- `/api/v1/evidence-records` — **503** `NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED`

Interpretation: application code maps Notion **404 / object_not_found** to that diagnostic. Root cause is almost always:

1. Data source ID env var missing or wrong in Vercel, **or**
2. The Notion database/data source is **not shared** with the integration that owns `NOTION_TOKEN`.

This is **not** fixed by deploying application code alone.

## Founder recovery steps (no secrets in chat)

1. Open Notion → the Community Observations database → **Connections** → ensure the production integration is connected.
2. Open the Evidence Vault database → same connection check.
3. Copy each database’s **data source id** (Notion data sources API id, not the page URL slug).
4. Vercel → Civic Mandate project → Settings → Environment Variables → set:
   - `NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID`
   - `NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID`
   - confirm `NOTION_TOKEN` is the same integration that was shared above
5. Redeploy production (or wait for next deployment that picks up env).
6. Verify:
   ```bash
   curl -sS https://2027-street-mandate.vercel.app/api/v1/community-observations | head -c 200
   curl -sS https://2027-street-mandate.vercel.app/api/v1/evidence-records | head -c 200
   ```
   Expect HTTP 200 with `publicationBoundary` and `records` (possibly empty if none published yet). Empty published set is success; 503 is not.

## Diagnostic codes (public, non-sensitive)

| Code | Meaning |
|------|---------|
| `CONFIGURATION_MISSING` | Env var absent in runtime |
| `NOTION_TOKEN_UNAUTHORIZED` | Token rejected (401) |
| `NOTION_ACCESS_DENIED` | Integration lacks permission (403) |
| `NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED` | ID wrong or not shared (404) |
| `NOTION_REQUEST_VALIDATION_FAILED` | Query/schema mismatch (400) |
| `NOTION_RATE_LIMITED` | Upstream 429 |
| `NOTION_UPSTREAM_UNAVAILABLE` | Other upstream failure |

Never put token values or data-source IDs in git, PR bodies, or chat logs.
