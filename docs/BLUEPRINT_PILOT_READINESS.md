# ISEYC Civic Record — Blueprint Pilot Readiness Checklist

**Branch:** `feat/blueprint-governance-workflow`  
**Audit date:** 2026-09-25  
**Scope:** Pre-merge institutional audit (no deploy, no production claim)

Status legend: **PASS** | **FAIL** | **NOT TESTED** | **BLOCKED** | **LEGAL REVIEW REQUIRED** | **HUMAN PILOT REQUIRED**

---

## Technical

| Item | Status | Evidence / note |
|------|--------|-----------------|
| `npm test` | **PASS** | Structure + pure governance unit checks |
| Typecheck / build | **PASS** | `next build` includes type validation |
| Public boundary in code | **PASS** | `isPubliclyPublishable` + dual-review gate |
| Public boundary live against production | **NOT TESTED** | No live Published pilot rows exercised end-to-end |
| Authorization fail-closed | **PASS** | Missing/wrong key; no `NEXT_PUBLIC_` key |
| Ownership on mutation + detail | **PASS** | `assertBlueprintPageOwnership` |
| Ownership on list query | **PASS** (DB filter) | Queries Blueprint pilot DB only |
| Archived / trash on list | **NOT TESTED** | Detail path blocks archived/trash; list relies on Notion behaviour |
| Alternate mutation path | **PASS** | Only review API + server actions → shared service |

## Governance

| Item | Status | Evidence / note |
|------|--------|-----------------|
| Source required for public | **PASS** | mapPage requires `sourceUrl` |
| Verification not UNVERIFIED | **PASS** | public-boundary + evaluateBlueprintPublication |
| Dual human review | **PASS** | A + B Approved, identities different |
| Publication Decision = Publish | **PASS** | Gate requires select value |
| Neutrality firewall constants | **PASS** | `firewall.ts`, draft validators |
| Post-publish correction path | **HUMAN PILOT REQUIRED** | Published can still be re-mutated by operators; policy not locked |
| Reopen from Rejected/Flagged | **PASS** (code) | Publish blocked until human reopen of Status |

## Data

| Item | Status | Evidence / note |
|------|--------|-----------------|
| Public DTO allowlist | **PASS** | `PUBLIC_BLUEPRINT_KEYS` — no reviewer/notes |
| Internal fields protected | **PASS** (code) | Operator DTO separate; public map omits notes |
| Mandate / Blueprint separation | **PASS** | Separate DB IDs; ownership rejects wrong parent |
| Live Notion schema match | **PASS** | Pilot DB `05b4dd95…` includes governance columns |
| Provenance distinctions (statement vs implementation) | **PASS** (partial) | Statement Class exists; outcome/evidence not yet full chain |

## Operations

| Item | Status | Evidence / note |
|------|--------|-----------------|
| Operator key configured in production | **NOT TESTED** | Env-dependent; audit does not read secrets |
| Reviewer A / B workflow UI | **PASS** (code) | `/operators/blueprint-review` |
| Rejection / hold path | **PASS** (code + pure tests) | Notes ≥ 8 chars |
| Publication path | **PASS** (code) | Server re-evaluates full gate |
| Correction / withdraw path | **HUMAN PILOT REQUIRED** | Verification has WITHDRAWN; process not fully specified |

## Pilot restrictions

| Item | Status |
|------|--------|
| No real political records until governance team approves | **HUMAN PILOT REQUIRED** |
| No candidate rankings / scores / recommendations | **PASS** (code + copy intent) |
| No NIN / political profiling | **PASS** (no such fields in Blueprint path) |

## Legal (engineering flag only — not legal advice)

| Item | Status |
|------|--------|
| Publication of public-figure statements | **LEGAL REVIEW REQUIRED** |
| Defamation / fair reporting of quoted proposals | **LEGAL REVIEW REQUIRED** |
| NDPR / privacy for any residual personal data | **LEGAL REVIEW REQUIRED** |
| Source licensing / republication | **LEGAL REVIEW REQUIRED** |
| Election-period neutrality obligations | **LEGAL REVIEW REQUIRED** |

---

## Architecture chain (as implemented)

Citizen Mandate (separate Notion DB)  
→ Responsibility Map (static/code)  
→ Blueprint (pilot DB + dual review)  
→ Commitment / Evidence (pilot DBs; lighter gates)  
→ Outcome (schema intent; not fully productised)

**Mutation path (only):** Browser → server action or Bearer API → `performBlueprintReviewMutation` → Notion  
**Public path (only):** Notion → `getPublishedBlueprints` / `getPublishedBlueprint` → `/blueprints` pages

## Overall pre-merge verdict

**CONDITIONAL — ready for human institutional code review of PR #43.**  
**Not ready to claim a completed live pilot.**  
**Not ready for production deployment without founder merge + env configuration + non-political dry-run.**
