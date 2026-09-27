# PR #48 + #49 shipment readiness

**Date:** 2026-09-27  
**Main SHA (production base):** `675514d8a10374a0761f81d69452bcbfbdbcc21d`  
**Authorization required to merge:** exact phrase `merge #48 and #49`  
**Authorization required to deploy:** exact phrase `Deploy.`  
**Hobby rule:** batch both PRs; one production deploy preferred

## Production today (without these PRs)

| Check | Result |
|-------|--------|
| `/api/health` | ok, Notion configured |
| Pulse | 3 Published · Kaduna · Health/Power/Water |
| `/brief?state=Kaduna` | 200 |
| `/blueprints` | 200 · honest empty published state |

Field loop works; LGA chips and updated hub/SuccessPanel Brief link are **not** on production until merge+deploy.

---

## PR #48 — `chore/hub-status-and-success-brief-link` @ `a189925`

**Intent:** Operator hub status truth + post-submit link to State Brief.

**Files (expected):**
- `app/operators/page.tsx` — stop claiming stale “PR #46 unmerged”; point to live Brief / field next step
- `components/SuccessPanel.tsx` — after submit, link `/brief?state=…` (civic memory, not poll)

**Readiness:** Ready to merge when authorised.  
**Conflicts:** None known vs main @ 675514d.  
**Governance risk:** None — no Status/schema/public boundary change.  
**Note:** Hub copy that still says “publish 1–3 Kaduna mandates” is partially outdated (3 already live); post-merge optional one-line copy tweak is fine, not a blocker.

---

## PR #49 — `feat/field-brief-share-and-lga` @ `ae1fc54`

**Intent:** Field-grade Brief for Street Reps.

**Includes:**
- LGA grouping under office  
- LGA filter chips  
- Stronger non-partisan share strings (WhatsApp / full / X) — public memory, not poll  

**Readiness:** Ready to merge when authorised.  
**Governance risk:** Low — language must stay non-ranking (inspect share builders on merge).  
**Field value:** High for Kaduna South protocol.

---

## Merge order (when authorised)

1. Merge **#48**  
2. Merge **#49** (resolve trivial conflicts if hub/brief both touch nav — prefer #49 Brief behaviour)  
3. Wait for founder **`Deploy.`**  
4. Phone-test:
   - `/operators` status box truthful  
   - Submit flow → SuccessPanel → Brief link  
   - `/brief?state=Kaduna` → Kaduna South chip / LGA under Governor  
   - WhatsApp copy: “not a vote / not a ranking”

---

## Explicit non-goals of this batch

- Candidate features  
- Blueprint political records  
- Schema renames  
- Commercial / partnership UI  

---

## Founder gate

| Action | Required words |
|--------|----------------|
| Merge these two | `merge #48 and #49` |
| Production deploy | `Deploy.` |
