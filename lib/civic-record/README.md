# ISEYC Civic Record (foundation)

Parent institutional model:

**Demand → Blueprint → Commitment → Action → Evidence → Outcome**

## Modules

| Module | Product surface | Data |
|--------|-----------------|------|
| Civic Mandate | Live citizen app | Notion Mandate DB (existing) |
| Public Blueprint Register | Pilot staff only | Separate Notion DB |
| Accountability Commitments | Later | Separate Notion DB |
| Evidence Vault | Later | Separate Notion DB |

## Rules

- No rankings, scores, endorsements, or demand-match percentages.
- `Not publicly specified` instead of invented facts.
- Payment never changes public publication or verification outcomes.
- Citizen Mandate rows must never store aspirant blueprints.

## Code map

- `types.ts` — entities
- `firewall.ts` — forbidden features / commercial boundary
- `blueprint-fields.ts` / `commitment-fields.ts` / `evidence-fields.ts` — Notion pilot columns
- `validate-blueprint.ts` — draft quality checks
- `duties.ts` — shared duty ids with Mandate

## Staff URLs (noindex)

- `/operators`
- `/operators/blueprint-pilot`

Do not promote these publicly. Do not merge to production without founder approval.
