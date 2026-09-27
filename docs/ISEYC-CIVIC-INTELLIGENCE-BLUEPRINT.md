# ISEYC Civic Intelligence — Master Blueprint (Internal Architecture)

**Status:** Architecture documentation — **not** public product policy and **not** product launch  
**Public product name remains:** ISEYC 2027 Civic Mandate  
**Date:** 2026-09-27  
**Repo:** `mrzulqarnainnadabo/2027-street-mandate`  
**Audited main SHA:** `675514d8a10374a0761f81d69452bcbfbdbcc21d`  
**Live:** https://2027-street-mandate.vercel.app  
**Governance pass:** Founder Decision Gate 2026-09-27 (documentation only)

**Labels used in this document**

| Label | Meaning |
|-------|---------|
| DOCUMENTED FACT | Observed in repo, live product, or Notion schema |
| APPROVED ARCHITECTURAL PRINCIPLE | Design constraint for this codebase (not a board resolution) |
| FOUNDER-APPROVED GOVERNANCE DIRECTION | Explicit direction from founder decision gate (2026-09-27) |
| PROPOSED POLICY — NOT YET APPROVED | Must not be treated as policy or built as feature |
| BEST PRACTICE | Common civic-tech practice |
| OPEN QUESTION / UNDECIDED | Requires further founder or legal input |
| LEGAL REVIEW REQUIRED | Do not treat as law |
| DEFERRED | Explicitly not decided now |

---

## DECISION REGISTER (2026-09-27)

This register converts ambiguous architecture into explicit statuses.  
**Nothing in this register authorises application features, merges, or deploys.**

| Decision ID | Question | Decision | Rationale | Status | Date | Legal review? | Future founder approval? |
|-------------|----------|----------|-----------|--------|------|---------------|--------------------------|
| **D-01** | May public-office seekers submit blueprints? | **Direction: yes, submission is allowed as a pathway** — submission ≠ publication ≠ endorsement. If operated: equal process for all eligible submitters; provenance label **Candidate/Party Submitted**; inspectable source; dual-review mandatory; ISEYC may reject or request clarification; **no** ranking, scoring, match %, preferential visibility, or campaign CTA. | Equal-process public record of *documented proposals*, not campaign service. | **FOUNDER-APPROVED GOVERNANCE DIRECTION** | 2026-09-27 | No for the rule itself; yes before large-scale public political content | Yes before expanding beyond pilot capacity |
| **D-02** | Paid blueprint services to candidates/parties during pilot? | **Do NOT offer** paid formatting, verification, publication acceleration, visibility, or preferential technical services to candidates or parties during the pilot. | Appearance of pay-to-play damages credibility even if publish stays independent. | **FOUNDER-APPROVED GOVERNANCE DIRECTION** | 2026-09-27 | Any future paid political-actor service | **Required** before any exception |
| **D-03** | Are institutional responses public by default? | **No.** Response tracking remains **operational/private by default**. Do not auto-expose private correspondence, internal notes, staff comments, or unresolved internal assessments. A public response requires an **explicit publication decision** and appropriate evidence/provenance. | Prevents misrepresentation and leaks of incomplete assessments. | **FOUNDER-APPROVED GOVERNANCE DIRECTION** | 2026-09-27 | Before any public response surface | Yes before first public response UI |
| **D-04** | Staff conflict / recusal? | **Governance requirement — SOP required:** where a reviewer has relevant political, financial, personal, or organisational conflict, another qualified reviewer handles the record. **Do not** implement complex staff-account systems yet. | Integrity of dual-review without premature identity infrastructure. | **FOUNDER-APPROVED GOVERNANCE DIRECTION** (SOP text still to be written) | 2026-09-27 | Optional with HR/legal if formalised | Yes when SOP is adopted |
| **D-05** | Public brand = “Civic Intelligence Infrastructure”? | **Do NOT adopt** as primary public-facing product name yet. Keep as **internal architectural direction** only. Public product remains **ISEYC 2027 Civic Mandate**. Layers (Civic Record, Public Blueprint Register, Institutional Response, Evidence, Civic Intelligence) introduced gradually only when data and governance justify them. | Avoid surveillance / political-intel optics while n is small. | **FOUNDER-APPROVED GOVERNANCE DIRECTION** | 2026-09-27 | No | Yes if ever used publicly |

### Classification summary (post gate)

**1. APPROVED ARCHITECTURAL PRINCIPLES**

- Core question: what must public office deliver?
- Published ≠ votes, rankings, endorsements, predictions, campaign support.
- Public data allowlist; Mandate DB ≠ Blueprint DB.
- Human publish gate; AI must not publish, rank candidates, or certify political truth alone.
- Payment must not alter publication state.
- Never sell identities, voter lists, rankings, or preferential visibility.
- Field Mandate usefulness before intelligence or commercial theatre.
- Provenance for blueprints must not collapse seeker-filed vs ISEYC-documented sources.

**2. FOUNDER-APPROVED GOVERNANCE DIRECTION**

- D-01 through D-05 above (submission pathway rules; no paid pilot services; response private by default; recusal SOP required; no public “Intelligence Infrastructure” brand yet).

**3. PROPOSED POLICY — NOT YET APPROVED**

- Detailed staff recusal SOP text (roles, duration, logs).
- Criteria catalogue for “ISEYC-documented public source.”
- Research bulk-export programme terms.
- Any commercial SKU involving political actors (blocked in pilot by D-02).
- Public institutional-response card design.

**4. LEGAL REVIEW REQUIRED**

- NDPR: fingerprint, optional demographics, retention, deletion.
- Defamation / host liability for seeker claims and any future public responses.
- Electoral-period publication constraints (jurisdiction-specific; not assumed as fact here).
- “Reviewed / dual-reviewed” wording as implied certification.
- Contracts for institutional or research access if ever offered.

**5. DEFERRED**

- Postgres / non-Notion analytical store.
- Per-user staff accounts beyond shared operator key.
- Public Civic Intelligence dashboard product.
- Named Partnership Exchange portal.
- Formal commercial price list.
- Heavy multi-state intelligence products before field volume.

---

## PHASE 0 — CURRENT STATE AUDIT

### A. What exists (DOCUMENTED FACT)

**Stack:** Next.js App Router · React · TypeScript · Tailwind · Notion as operational store · Vercel.

**Public routes:** `/` · `/brief` · `/map` · `/about` · `/mandate/[id]` · `/status/[id]` · `/blueprints` · `/blueprints/[id]`  
**Operator routes:** `/operators` · `/operators/mandate-review` · `/operators/blueprint-review` · `/operators/blueprint-pilot`  
**APIs:** `/api/pulse` · `/api/health` · submit path · blueprint review (operator-authenticated)

**Mandate lifecycle:** Submit → Notion `Status=New` → human review → `Published` → Pulse / Brief / mandate page.

**Public allowlist (lib/notion.ts):** sentence, duty, office, state, LGA, id, created — **not** demographics, device fingerprint, response-tracking fields.

**Operator-only Notion fields (already present):** Responsible Institution, Response Requested/Received, Follow-up Date, Resolution Status (`Not assessed` | `Open` | `Partly addressed` | `Addressed` | `Unresolved`), Response Evidence URL, Age Band, Gender, Device Fingerprint.

**Blueprint layer (code + pilot):** Separate Notion DB; dual-review publication; `CIVIC_OPERATOR_KEY`; public register Published-only; synthetic pilot completed; public register empty after cleanup.

**Docs already in repo:** `public-data-boundary.md` · `mandate-to-response-protocol.md` · `operator-pilot-checklist.md` · `BLUEPRINT_PILOT_READINESS.md`

**Live pulse (2026-09-27):** 3 Published · Kaduna · Health/Power/Water · Governor · LGA Kaduna South.

**Open PRs (unmerged at audit):**  
- #48 hub status + SuccessPanel → Brief  
- #49 field Brief share + LGA chips  
- #50 this blueprint document

### B. What is working

- Non-partisan citizen demand capture and public memory (Pulse + Brief).
- Published-only boundary enforced in mapping code.
- Responsibility map (duty → office Primary/Shared/Unclear).
- Weekly Brief framing (week-of label, share/print).
- Blueprint dual-review governance in application path (pilot).
- Field ops materials exist outside code (Street Rep protocol, Notion field page).

### C. What is incomplete

- Institutional **response** workflow is Notion fields + docs — not a first-class public UI (aligned with D-03).
- Evidence is URL-shaped, not a verified evidence object with chain of custody.
- Civic Intelligence (aggregates with methodology) is implicit in Pulse/Brief counts, not a dedicated layer.
- Partnership / commercial layer is undefined in code (correctly; D-02 / deferred).
- Field loop volume: only 3 Published seeds; Street Rep week not yet proven at scale.
- Hub status on production still stale until #48 ships.

### D. What is fragile

- Single Vercel Hobby project discipline (duplicate projects burned quota before).
- Notion as sole store: rate limits, schema drift if fields renamed without code migration.
- Operator key is shared secret model — no per-user staff accounts yet (deferred by D-04).
- Device fingerprint stored in Notion (operator-only) — privacy risk if mis-published.
- Low published volume makes any “trend” language misleading.

### E. What is duplicated

- Some duty labels legacy-mapped (`LEGACY_DUTY_MAP`).
- Multiple Notion pilot DBs + ops hub pages (intentional separation, but cognitive load).
- Share copy logic in Brief vs SuccessPanel (improved in open PRs).

### F. What should remain untouched

- Meaning of `Status` (New / Published / Rejected).
- Public allowlist principle.
- Mandate DB ≠ Blueprint DB.
- No candidate scores/rankings/polls.
- Existing response-tracking field *names* until a deliberate migration.
- Human publish gate.

### G. What can be extended safely

- Brief LGA UX and share language (#49).
- Operator hub honesty and post-submit Brief link (#48).
- Operator use of existing response fields without new DB (private; D-03).
- Documentation, methodology pages, ADRs.
- Published-only aggregates (duty × state × office) with explicit “not votes” framing.

### H. What requires architectural change (later)

- True multi-actor identity for “Person / Office-seeker” with provenance.
- Versioned Blueprint + correction protocol beyond lock/unpublish.
- Durable audit log outside Notion comments.
- Institutional response as public record (only after D-03 explicit publish path).
- Any commercial access tier (blocked in pilot by D-02).

---

## SECTION A — PRODUCT PURPOSE

**ISEYC 2027 Civic Mandate** is a non-partisan civic instrument: citizens state **one concrete delivery demand** linked to duty, office (or unsure), and geography. ISEYC reviews; only Published items become public civic memory.

**Serves:** Citizens, Street Reps, operators, later researchers/institutions — **not** campaigns as primary customers.

**Does not:** Rank candidates, predict elections, endorse parties, score “who matches the people,” sell voter lists, or replace INEC/government systems.

**Neutrality is architectural:** Public surfaces, DTOs, operator gates, and forbidden features are designed so the product *cannot* honestly be used as a campaign scoreboard without breaking its own rules. Communications alone are insufficient.

---

## SECTION B — PRODUCT EVOLUTION (internal direction)

Proposed chain (internal architecture — **not** public brand per D-05):

`Citizen Mandate → Public Blueprint → Institutional Response → Evidence → Civic Intelligence → Partnership`

| Layer | Purpose | Users | Input | Output | Public? | Verification | Ownership |
|-------|---------|-------|-------|--------|---------|--------------|-------------|
| **Mandate** | Delivery demand memory | Citizens, Reps | Sentence + duty + office + geo | Published demand | Yes if Published | Editorial fitness, not truth of claim | Citizen text; ISEYC publication decision |
| **Blueprint** | Documented proposals of office-seekers / public sources | Seekers, ISEYC documenters | Structured proposal + source | Published blueprint | Yes if dual-reviewed | Source + dual human review | Submitter + ISEYC gate |
| **Institutional Response** | What institutions say/do re: a demand | Operators; public only if explicit decision (D-03) | Notion response fields | Status + evidence URL | Default **private** | Human | Institution claim ≠ ISEYC fact |
| **Evidence** | Pointers to documents/records | Operators | URL + notes | Evidence row | Selective | Source check, not legal authenticity | Linked object |
| **Civic Intelligence** | Structured public aggregates | Public, researchers | Published only | Briefs, maps, counts | Yes | Methodology disclosure | ISEYC |
| **Partnership** | Institutional use of aggregates | Agencies, unis, media | Contracts + policy | Briefs/API (future) | Negotiated | Legal + CoI firewall | ISEYC |

**Challenge held:** Jumping to Partnership/Commercial before Mandate field volume is cargo-cult infrastructure. Blueprint pilot already exists — **do not rebuild it**. Institutional Response extends **existing Notion fields** before new apps. D-02 blocks paid political-actor services in pilot.

---

## SECTION C — INFORMATION OBJECTS (keep separate)

| Object | Definition | Must not collapse into |
|--------|------------|-------------------------|
| **Citizen Demand / Mandate** | One published delivery ask | Vote, endorsement |
| **Public Blueprint** | Structured proposal record with provenance | Party platform, “official policy” |
| **Party Platform** | Party-level document | Candidate personal pledge |
| **Candidate/Aspirant Statement** | Speech/interview claim | Verified Blueprint |
| **Public Office** | Constitutional/statutory role | Person currently holding it |
| **Institution** | MDA, LGA, assembly, etc. | Campaign organisation |
| **Institutional Response** | Claimed action/reply | Independent evaluation |
| **Commitment** | Explicit promise tied to office period | Vague slogan |
| **Evidence** | Citable artefact | Social media rumour |
| **Source** | Where text came from | Truth |
| **Person** | Named individual | Automatic “candidate product” |
| **Geography** | State / LGA / ward | Constituency claim without source |
| **Duty** | Taxonomy of government delivery | Campaign theme |
| **Verification state** | Scoped claim (see H) | Global “verified = good person” |
| **Review / Publication / Version / Correction / Audit** | Process objects | Content objects |

**FOUNDER-APPROVED GOVERNANCE DIRECTION (D-01):** Seeker-submitted vs ISEYC-documented must not appear equivalent.

---

## SECTION D — MANDATE ↔ BLUEPRINT ↔ RESPONSE

**Allowed relationship language (neutral):**

- Related **duty / policy area** identified  
- Related **Published mandate(s)** exist  
- **Blueprint** documents a proposal in that area  
- **Institutional response** recorded (operator; public only under D-03)  
- **Evidence URL** attached  
- **No documented relationship** found  

**Prohibited:** “Candidate X satisfies 72% of demands,” match scores, ranked “best for Health.”

---

## SECTION E — BLUEPRINT REGISTER

**Already partially built.** Extend; do not replace.

**Submission channels (aligned with D-01):**

1. **CANDIDATE/PARTY SUBMITTED** — material offered by seeker/team  
2. **ISEYC-DOCUMENTED PUBLIC SOURCE** — ISEYC files public document with citation  

These must never look equivalent in UI.

**Justified fields (align with pilot where possible):** office, jurisdiction, election cycle (label only — **LEGAL REVIEW REQUIRED** for official dates), person name, party (optional text, not scored), title, source URL, publication date, policy areas, proposal body, mechanism, responsible institution, timeline (claimed), financing (claimed), geographic scope, verification state, publication decision, version, updated, correction notes.

**Do not invent:** popularity, donation, “electability.”

**D-02:** No paid preferential services during pilot.

---

## SECTION F — PARTY VS CANDIDATE VS OFFICE

| Concept | Treat as |
|---------|----------|
| Party Platform | Document about party |
| Candidate Blueprint | Document about a person’s documented proposal |
| Candidate Statement | Weaker provenance; often ISEYC-documented quote |
| Public Office | Role (Governor, Senator…) |
| Institutional Position | Position of a government body |
| Implementation Record | Evidence of delivery |

No automatic inheritance across these objects.

---

## SECTION G — INSTITUTIONAL RESPONSE

**Reuse existing Notion fields** (`mandate-to-response-protocol.md`).

Flow: Mandate → Response Requested → Responsible Institution → Response Received → Follow-up → Evidence URL → Resolution Status.

**Per D-03:** Remain operator-only by default. Public only after explicit publication decision + evidence/provenance.

**NO CHANGE REQUIRED** to field names for MVP-1.

---

## SECTION H — EVIDENCE & VERIFICATION

Split “verified”:

| State | Meaning |
|-------|---------|
| Source present | URL/document cited |
| Source inspectable | Operator opened link |
| Identity claimed | Name as stated by submitter |
| Statement recorded | Text captured |
| Document authenticity | **Usually unknown** without external authority |
| Implementation evidence | Artefact claims delivery |
| Independent verification | Third party — rare; label explicitly |
| ISEYC editorial verification | Passed dual-review / publish rules |

Also: `Unknown` · `Not publicly specified` · `Conflicting records` · `No evidence published`.

**ISEYC does not** certify legal truth of political claims by publishing them.

---

## SECTION I — TRUST & METHODOLOGY

Public methodology should state (product + governance content):

- Mandate = concrete delivery demand, not vote  
- Blueprint = documented proposal with provenance, not endorsement  
- Published = passed human gate  
- What ISEYC does **not** verify  
- Corrections / unpublish / version  
- How disputes are handled  
- Uncertainty disclosure  
- No paid publish privilege (D-02)  

---

## SECTION J — DATA GOVERNANCE

| Class | Examples | Rule |
|-------|----------|------|
| Public | Published mandate text, duty, office, state, LGA | Allowlisted |
| Restricted institutional | Response tracking | Operators (D-03) |
| Private operational | Reviewer notes, keys | Staff only |
| Sensitive | Age/gender if collected | Never public |
| Never-public | Phone, exact address, raw device id as public field, NIN | **Do not collect NIN** (architectural constraint) |

**Political affiliation:** do not collect as citizen field.

---

## SECTION K — DATA ARCHITECTURE

| Data | Where | Why |
|------|-------|-----|
| Mandates | Notion Mandate DB | Working ops + moderation |
| Blueprints | Notion Blueprint pilot DB | Already dual-reviewed path |
| Response fields | Same Mandate row | Avoid migration; private (D-03) |
| Static duty/office map | `lib/responsibility-map.ts` | Code versioned |
| App secrets | Vercel env | Not in git |
| Future high-volume audit | Possible later DB | **DEFERRED** at n=3 |

---

## SECTION L — PUBLIC INFORMATION ARCHITECTURE

**Per D-05:** Do not lead with “Intelligence Infrastructure.”

**Recommended mobile-first IA:**

1. **Civic Mandate** (home + submit + Pulse)  
2. **State Brief**  
3. **Responsibility map**  
4. **Public Blueprints** (empty-state honest)  
5. **Charter / Methodology**  
6. Operators: unlinked staff area  

Partnership stays off primary nav until real institutional product exists.

---

## SECTION M — CIVIC INTELLIGENCE (internal term)

**Allowed:** Published counts by duty/state/office/LGA; coverage gaps; methodology-bound summaries.

**Forbidden:** Vote prediction, candidate rank/score, preference inference, targeting, “who to support.”

At n=3 Published, any “trend” language is **misleading** — prefer “published record” wording.

---

## SECTION N — PARTNERSHIP

Prefer **ISEYC Institutional Briefs** / **Research Access (Published aggregates)** over “Exchange” marketplace language.

**STAKEHOLDER INTEREST SIGNAL only:** Aspirant interest in blueprints is **not** product-market fit or endorsement. Same rules for all seekers (D-01).

---

## SECTION O — COMMERCIAL MODEL

Pilot: **D-02 blocks** paid political-actor blueprint services.

Investigated models (not launched): free public layer; institutional briefs; research access; Mandate Lab; technical services — last two especially high CoI risk.

**Never sell:** identities, voter lists, persuasion audiences, rankings, preferential visibility.

---

## SECTION P — CONFLICT-OF-INTEREST FIREWALL

- D-01: equal process; no preferential visibility.  
- D-02: no paid preferential services in pilot.  
- D-04: recusal SOP required.  
- Free: public Mandate, Brief, Published Blueprints (when any), methodology.

---

## SECTION Q — POST-ELECTION

**ISEYC POLICY direction (not fully specified SOP):** Archive election-cycle labels; keep delivery duties continuous; corrections allowed; no “scorecard of winners.” **LEGAL REVIEW REQUIRED** for retention/defamation.

---

## SECTION R — SECURITY

- Operator: `CIVIC_OPERATOR_KEY` bearer (shared secret — per-user staff **DEFERRED**).  
- Secrets in Vercel only.  
- Human review is primary control against mass political flooding.  
- AI: no autonomous publish.

---

## SECTION S — AI GOVERNANCE

**AI may:** retrieve, extract, classify duty, summarise Published text, flag missing fields, draft operator notes.

**AI must not:** verify political truth alone, publish, rank candidates, recommend votes, infer preference, set Status.

---

## SECTION T — OPPORTUNITY / RISK (compressed)

**Do not build:** Candidate ranker; match %; vote predictor; voter file; NIN capture; paid placement; dark-pattern share as poll; party comparison widget; recommendation engine; auto-publish AI.

---

## SECTION U — MINIMUM VIABLE EVOLUTION

### MVP-1 (now — mostly non-code)
1. Run Kaduna South **field loop**.  
2. Ship **#48 + #49** when founder authorises merge/deploy.  
3. Operators use **existing** response fields privately (D-03).  
4. Keep Blueprint public empty until real dual-reviewed non-synthetic rows exist under D-01 rules.

### MVP-2 / LATER
As Decision Register and legal items allow — not automatic.

---

## SECTION V — IMPLEMENTATION MAP

| Proposal | Existing | Action |
|----------|----------|--------|
| Mandate submit/Pulse/Brief | Working | **NO CHANGE REQUIRED** for architecture |
| LGA Brief UX | #49 | Merge when authorised |
| Hub/SuccessPanel | #48 | Merge when authorised |
| Blueprint dual-review | lib/civic-record + operators | **NO rebuild** |
| Response tracking | Notion fields + docs | **Private use** (D-03) |
| Civic Intelligence UI | Pulse/Brief counts | **DEFERRED** product |
| Partnership / paid political services | None | **D-02** / deferred |
| New Postgres | None | **DEFERRED** |

---

## SECTION W — ARCHITECTURE DECISION RECORDS

**ADR-001 — Notion remains Mandate SoT** — working moderation; low volume.  
**ADR-002 — No candidate ranking ever in this product** — neutrality architecture.  
**ADR-003 — Blueprint dual-review stays** — pilot proven.  
**ADR-004 — Response fields operator-first** — D-03.  
**ADR-005 — Field volume before intelligence theatre** — product principle.  
**ADR-006 — Decision Register D-01…D-05** — founder gate 2026-09-27.

---

## SECTION X — ROADMAP (repo-based)

| Phase | Focus | Gate |
|-------|-------|------|
| 0 | Audit + Decision Register | Done (this doc) |
| 1 | Field ops Kaduna South | New Published beyond seeds |
| 2 | Merge/deploy #48+#49 | Founder words |
| 3 | Response field discipline (private) | Operator checklist |
| 4 | Methodology public clarity | Copy review |
| 5 | Real Blueprint rows under D-01 | Dual-review + capacity |
| 6+ | Evidence / intelligence / partnership | Explicit later approvals |

---

## ELECTORAL / LEGAL

Election dates, INEC procedures, campaign finance, NDPR/data protection specifics: **LEGAL REVIEW REQUIRED** — not asserted as facts in this blueprint.

---

## FIELD VS BLUEPRINT

| | Mandate field loop | Blueprint register |
|--|--------------------|--------------------|
| Validation | Partial (3 seeds + protocol written) | Synthetic pilot only |
| Priority | **Higher now** | Parallel, strict gates (D-01/D-02) |
| Risk if rushed | Low | High partisanship perception |

---

## FINAL PRINCIPLE

Build **trust, structure, evidence, usefulness, institutional credibility** — not political influence.

Connect, when ready (internal architecture — **not** a public brand commitment):

`CITIZEN MANDATES ↔ PUBLIC BLUEPRINTS ↔ INSTITUTIONAL RESPONSES ↔ EVIDENCE ↔ CIVIC INTELLIGENCE`

without collapsing them into a candidate platform.

**Public name remains ISEYC 2027 Civic Mandate** until a separate founder decision changes D-05.

---

## IMPLEMENTATION BOUNDARY (DOCUMENTATION ONLY)

This document does **not** authorise:

- candidate UI
- public blueprint political records
- new databases
- Mandate schema changes
- production data changes
- merge or deploy

Next *implementation* work, if any, remains subject to separate founder words (e.g. field ops; `merge #48 and #49`; `Deploy.`).
