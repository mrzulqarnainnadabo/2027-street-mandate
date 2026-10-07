# Civic Record — Stage status

**Deploy rule:** Do not merge feature branches to `main` or deploy until the founder explicitly orders it.

## Live on main (after PR #58 / #59)

- Citizen Mandate lifecycle (submit → New → human Publish → Pulse / Brief)
- Public data boundary (`mapPageToVoice` allowlist)
- State Civic Brief + professional share copy
- Public Blueprint Register routes (`/blueprints`, submit, detail) with dual-review gate
- Operator blueprint review console (`/operators/blueprint-review`)
- Product name: **Civic Mandate Nigeria**
- Civic Intelligence foundation (`/intelligence`, `/api/civic-intelligence`) — Published-record synthesis only (this branch)

## Stage 2 complete

- Types, firewall, field schemas, validators, overlap helper
- Staff `/operators` + blueprint pilot UI
- Notion pilots: Blueprint, Commitment, Evidence + views + ops hub
- IDs in `notion-pilot-ids.ts`

## Stage 3 in progress

- `blueprint-public.ts` — public allowlist type
- `fetch-published-blueprints.ts` — Published-only Notion reader
- Public Blueprint list/detail pages exist; volume still limited by real dual-reviewed rows
- Optional env: `NOTION_BLUEPRINT_DATABASE_ID`

## Still pilot / incomplete

- Commitment + Evidence public surfaces (library present; thin public UX)
- Demand clustering with human-correctable taxonomy
- National-scale data layer (Notion remains appropriate until volume thresholds are hit)
- In-app mandate review console (operators still primarily use Notion for Mandate Status)
- Correction path automation (documented gap)

## Governance constants

- Published-only public boundary
- No rankings, vote advice, or candidate scores
- Media drafts require human approval
- Monetization must not buy editorial influence
