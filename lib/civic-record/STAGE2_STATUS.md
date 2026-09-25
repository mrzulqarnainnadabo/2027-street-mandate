# Civic Record — Stage 2 / early Stage 3 status

**Deploy:** Do not merge to `main` until founder explicitly orders merge.

## Stage 2 complete

- Types, firewall, field schemas, validators, overlap helper
- Staff `/operators` + blueprint pilot UI
- Notion pilots: Blueprint, Commitment, Evidence + views + ops hub
- IDs in `notion-pilot-ids.ts`

## Stage 3 started (library only)

- `blueprint-public.ts` — public allowlist type
- `fetch-published-blueprints.ts` — Published-only Notion reader
- **No public route or page yet**
- Optional env: `NOTION_BLUEPRINT_DATABASE_ID` (falls back to pilot id in code for staff tooling)

## Blocked on human pilot data

Enter 5–10 real public-source Blueprint rows, dual-review, set Published — then wire a calm public list if ordered.

## Separate

PR #39 Mandate map UX — still unmerged.

## Operator review console (branch work)

- `/operators/blueprint-review` — queue + Reviewer A/B + publish/hold
- Auth: `CIVIC_OPERATOR_KEY` via httpOnly session (never `NEXT_PUBLIC_`)
- Mutations: `performBlueprintReviewMutation` (shared by API + server actions)
- Pure rules: `blueprint-review-rules.ts` (unit-testable without Notion)
- **Not on production until explicit deploy/merge**
