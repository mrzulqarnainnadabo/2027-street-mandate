# Founder diagnostic — Evidence Vault & Community Observations 503

## What production returns

Scheduled and live checks against:

- `GET /api/v1/evidence-records`
- `GET /api/v1/community-observations`

have returned **HTTP 503** with diagnostic code:

`NOTION_DATA_SOURCE_NOT_FOUND_OR_NOT_SHARED`

This is an **integration access** problem, not a publication-gate bug and not a reason to return private rows.

## What the code already does

- Public APIs fail closed on upstream Notion errors.
- Responses include a non-sensitive `diagnosticCode`.
- Publication filters (Published + dual review where required) are not bypassed.

## Canonical configuration (names only — no secret values)

| Surface | Environment variable | Documented data source |
|---------|----------------------|------------------------|
| Evidence Vault | `NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID` | `bf650adb-1068-4335-a0bf-4979e7055e7b` |
| Community Observations | `NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID` | (set in Vercel; must match the shared Notion data source) |
| Shared Notion token | `NOTION_TOKEN` | Integration token used by the Vercel project |

## Exact founder checks

1. Open the **Vercel** project for Civic Mandate → Settings → Environment Variables.
2. Confirm `NOTION_TOKEN`, `NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID`, and `NOTION_COMMUNITY_OBSERVATIONS_DATA_SOURCE_ID` are set for **Production**.
3. Confirm the Evidence Vault ID matches the documented canonical ID above.
4. In **Notion**, open the Evidence Vault and Community Observations data sources.
5. Confirm the **same** Notion integration that owns `NOTION_TOKEN` is invited with access to both data sources.
6. If the integration was recreated, re-share both data sources and redeploy Mandate so the runtime picks up the token.
7. Re-run the live verification workflows (or `GET` the two public endpoints) and confirm HTTP 200 with `publicationBoundary` present — not 503.

## What not to do

- Do not invent alternate database IDs in code.
- Do not weaken publication or dual-review filters to make smoke tests pass.
- Do not publish test rows as real community evidence.
- Do not put tokens or connection strings in git.

## Code owners

After access is restored, no application change is required for the basic published-list path. If diagnostics still return `NOTION_TOKEN_UNAUTHORIZED` or `NOTION_ACCESS_DENIED`, rotate or re-issue the integration token and update Vercel only.
