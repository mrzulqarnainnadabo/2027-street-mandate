# Civic Mandate review workflow — architecture audit and state mapping

**Branch:** feat/civic-mandate-review-workflow  
**Base main:** 6f29b98e9463eeeb286ca7a43a9b35d92e66a6a0  
**Date:** 2026-11-14

## Architecture audit (existing)

| Area | Finding |
|------|---------|
| Community submit | `app/api/submit/route.ts` → Notion Status **New** |
| Public list | `getPublishedPulse` filters Status **Published** only |
| CommunityRecord API | Published-only; private denylist enforced |
| Blueprint review | Dual reviewer A/B + publish/reject — **different record type** |
| Operator auth | Bearer `CIVIC_OPERATOR_KEY`, timing-safe, fail closed |
| Evidence Vault | Separate published evidence API |

Blueprint review is **not** community mandate review. This branch adds a dedicated community-submission lifecycle without changing Blueprint governance.

## Record types (kept distinct)

1. **Community submission** — citizen account; not verified by default  
2. **Evidence record** — own provenance (Evidence Vault / attachments)  
3. **Public mandate** — human-reviewed demand after publication gate  

## State mapping (backward compatible)

| Notion Status | Lifecycle |
|---------------|-----------|
| New | submitted |
| Clarification | clarification_required |
| Under Review | under_review |
| Evidence Review | evidence_review |
| Awaiting Publication | awaiting_publication_decision |
| Published | published |
| Rejected | rejected |
| Withdrawn | withdrawn |
| Response Recorded | response_recorded |
| Implementation Reported | implementation_reported |
| Independently Verified | independently_verified |
| Closed with Evidence | closed_with_evidence |

**Migration policy:** No bulk rewrite of historical Notion pages. Mapping is applied when reading; writes occur only on explicit operator actions. This increment persists to an in-memory fixture store only — **not** production Notion.

## Publication control

- Only `actor: human` may approve/reject  
- Only from `awaiting_publication_decision`  
- Approve requires responsible institution, draft text, and evidence or limitations  
- AI may set draft; AI publish attempts fail  

## What this branch implements

- Pure lifecycle + transition rules  
- Notion ↔ lifecycle mapping  
- In-memory review service + fixture journey  
- Operator API (`/api/operators/mandates/review`) auth-gated, fixture-bound  
- Review workspace UI at `/operators/mandates/review`  
- Automated verify script  

## What it does not do

- Merge to main or deploy  
- Publish fixtures to live public API  
- Change production Notion schema  
- Alter Blueprint dual-review flow  
- Expose drafts on public endpoints  
