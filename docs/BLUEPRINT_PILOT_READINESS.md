# ISEYC Civic Record — Blueprint Pilot Readiness Checklist

**Branch:** `feat/blueprint-governance-workflow`
**Updated:** 2026-09-25 (post targeted hardening)
**Scope:** Pre-merge · no deploy · no production claim

Legend: **PASS** | **FAIL** | **NOT TESTED** | **BLOCKED** | **HUMAN PILOT REQUIRED** | **LEGAL REVIEW REQUIRED** | **GOVERNANCE DECISION REQUIRED**

---

## Technical

| Item | Status |
|------|--------|
| `npm test` | **PASS** (when run locally on this branch) |
| Typecheck / build | **PASS** (when run locally) |
| Public boundary code | **PASS** |
| Public boundary live production | **NOT TESTED — REQUIRES HUMAN PILOT** |
| Authorization fail-closed | **PASS** (code) |
| Ownership mutation + detail | **PASS** (code) |
| Archived/trash on list + detail | **PASS** (code guards) · live API behaviour **NOT TESTED — REQUIRES HUMAN PILOT** |
| Published record ordinary mutation lock | **PASS** (code) |
| Explicit review decision (no notes-as-signal) | **PASS** (code) |
| Missing Statement Class fails closed | **PASS** (code) |

## Governance

| Item | Status |
|------|--------|
| Dual human review | **PASS** (code) |
| Source + verification required | **PASS** (code) |
| Source verification ≠ truth verification | **PASS** (documented in code) |
| Post-publication correction protocol | **GOVERNANCE DECISION REQUIRED** |
| Multi-operator identity / audit trail | **GOVERNANCE DECISION REQUIRED** (shared secret is interim only) |
| Election-period operating policy | **GOVERNANCE DECISION REQUIRED** |

## Data

| Item | Status |
|------|--------|
| Public DTO allowlist | **PASS** |
| Internal fields not in public DTO | **PASS** (code) |
| Mandate / Blueprint DB separation | **PASS** (code) |
| Live Notion schema match | **PASS** (fetched 2026-09-25) |
| Live dry-run of full lifecycle | **NOT TESTED — REQUIRES HUMAN PILOT** |

## Operations

| Item | Status |
|------|--------|
| `CIVIC_OPERATOR_KEY` in production | **NOT TESTED — REQUIRES HUMAN PILOT** |
| Shared operator secret | **Interim controlled-pilot mechanism — not production-grade multi-operator IAM** |
| Reviewer A/B console | **PASS** (code) |
| Rejection/hold | **PASS** (code) |

## Legal (not legal advice)

| Item | Status |
|------|--------|
| Public-figure statement republication | **LEGAL REVIEW REQUIRED** |
| Defamation / fair reporting | **LEGAL REVIEW REQUIRED** |
| NDPR / privacy | **LEGAL REVIEW REQUIRED** |
| Source licensing | **LEGAL REVIEW REQUIRED** |
| Election-period neutrality | **LEGAL REVIEW REQUIRED** |

---

## KNOWN OPEN DECISIONS

1. **Post-publication correction / reopen** — Published rows are locked against ordinary review mutations. How (and who) may reopen, correct, or withdraw a published Blueprint is a human governance decision. Not implemented as a product workflow.
2. **Multi-operator identity** — `CIVIC_OPERATOR_KEY` is a shared interim secret, not a complete identity/audit system.
3. **Live Notion dry-run** — Non-political template row through A → B → publish must be run by humans with real env vars.
4. **Legal counsel** — See legal table above.
5. **Source licensing** — How external speech/PDF/interview sources may be quoted publicly.
6. **Election-period policy** — Whether and how the register operates during regulated campaign periods.

---

## Caching / publication lag (actual behaviour)

- Operator console: dynamic / session-driven; mutations hit Notion immediately on success.
- Public `/blueprints` routes: server-rendered; **no** explicit `revalidateTag` invalidation on publish in this codebase.
- **Do not claim real-time public visibility.** Expect normal Next/Vercel caching lag until a human confirms measured behaviour.

---

## Overall verdict

**CONDITIONAL** — suitable for **human institutional review of PR #43**.
**Not** production-certified. **Not** a completed live pilot.
