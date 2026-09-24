# Civic Record — Stage 2 status

**Date:** 2026-09-24  
**Deploy:** Do not merge to `main` until founder explicitly orders merge.

## Complete

### Code (draft PR #40)
- Entity types (Demand / Blueprint / Commitment / Evidence)
- Neutrality + payment firewall constants
- Notion field definitions for three pilots
- `validateBlueprintDraft` / `validateCommitmentDraft`
- Policy-area overlap helper (counts only, not scores)
- Shared duty ids with Civic Mandate
- Staff routes: `/operators`, `/operators/blueprint-pilot` (noindex)
- Live Notion IDs in `notion-pilot-ids.ts`

### Notion (live)
| Resource | ID / URL |
|----------|----------|
| Blueprint Register | `05b4dd95d02e4578b629a20a0f34f10b` |
| Commitments | `130a06c6c9d149efab6cef4431aa0804` |
| Evidence Vault | `2bc9d99c565d45219d301d866367bf15` |
| Ops hub page | `3e55db88ef4681cba049d3c45843092e` |
| Mandate (citizens) | `19b213d55bfc4ce8a653a05147cbbe2a` — **do not mix** |

Views: Draft & New / Published only on relevant DBs.

## Not in scope until ordered
- Public `/blueprints` pages
- Vercel env for Blueprint DB
- Notion API read in production routes
- Billing / workspace SaaS
- Rankings or demand-match %

## Founder / operator next step
1. Move pilot DBs into main ISEYC workspace if private.
2. Enter 5–10 **real public-source** Blueprint rows (one proposal each).
3. Dual-review before Status = Published.
4. Only then consider Stage 3 read API + calm public list.

## Separate draft
PR #39 — Mandate responsibility map UX — also unmerged.
