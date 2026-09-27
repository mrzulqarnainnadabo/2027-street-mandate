# ISEYC Civic Intelligence Infrastructure — Master Blueprint

**Status:** Architecture documentation (not product launch)  
**Date:** 2026-09-27  
**Repo:** `mrzulqarnainnadabo/2027-street-mandate`  
**Audited main SHA:** `675514d8a10374a0761f81d69452bcbfbdbcc21d`  
**Live:** https://2027-street-mandate.vercel.app  
**Authors of this pass:** Principal product/architecture review against *existing* code  

**Labels used in this document**

| Label | Meaning |
|-------|---------|
| DOCUMENTED FACT | Observed in repo, live product, or Notion schema |
| ISEYC POLICY PROPOSAL | Recommended rule; needs founder approval |
| BEST PRACTICE | Common civic-tech practice |
| OPEN QUESTION | Requires founder or legal decision |
| LEGAL REVIEW REQUIRED | Do not treat as law |

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

**Open PRs (unmerged):**  
- #48 hub status + SuccessPanel → Brief  
- #49 field Brief share + LGA chips  

### B. What is working

- Non-partisan citizen demand capture and public memory (Pulse + Brief).
- Published-only boundary enforced in mapping code.
- Responsibility map (duty → office Primary/Shared/Unclear).
- Weekly Brief framing (week-of label, share/print).
- Blueprint dual-review governance in application path (pilot).
- Field ops materials exist outside code (Street Rep protocol, Notion field page).

### C. What is incomplete

- Institutional **response** workflow is Notion fields + docs — not a first-class public UI.
- Evidence is URL-shaped, not a verified evidence object with chain of custody.
- Civic Intelligence (aggregates with methodology) is implicit in Pulse/Brief counts, not a dedicated layer.
- Partnership / commercial layer is undefined in code (correctly).
- Field loop volume: only 3 Published seeds; Street Rep week not yet proven at scale.
- Hub status on production still stale until #48 ships.

### D. What is fragile

- Single Vercel Hobby project discipline (duplicate projects burned quota before).
- Notion as sole store: rate limits, schema drift if fields renamed without code migration.
- Operator key is shared secret model — no per-user staff accounts yet.
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
- Operator use of existing response fields without new DB.
- Documentation, methodology pages, ADRs.
- Published-only aggregates (duty × state × office) with explicit “not votes” framing.

### H. What requires architectural change (later)

- True multi-actor identity for “Person / Office-seeker” with provenance.
- Versioned Blueprint + correction protocol beyond lock/unpublish.
- Durable audit log outside Notion comments.
- Institutional response as public record (not only operator Notion).
- Any commercial access tier.

---

## SECTION A — PRODUCT PURPOSE

**ISEYC 2027 Civic Mandate** is a non-partisan civic instrument: citizens state **one concrete delivery demand** linked to duty, office (or unsure), and geography. ISEYC reviews; only Published items become public civic memory.

**Serves:** Citizens, Street Reps, operators, later researchers/institutions — **not** campaigns as primary customers.

**Does not:** Rank candidates, predict elections, endorse parties, score “who matches the people,” sell voter lists, or replace INEC/government systems.

**Neutrality is architectural:** Public surfaces, DTOs, operator gates, and forbidden features are designed so the product *cannot* honestly be used as a campaign scoreboard without breaking its own rules. Communications alone are insufficient.

---

## SECTION B — PRODUCT EVOLUTION (challenged)

Proposed chain:

`Citizen Mandate → Public Blueprint → Institutional Response → Evidence → Civic Intelligence → Partnership`

| Layer | Purpose | Users | Input | Output | Public? | Verification | Ownership |
|-------|---------|-------|-------|--------|---------|--------------|-------------|
| **Mandate** | Delivery demand memory | Citizens, Reps | Sentence + duty + office + geo | Published demand | Yes if Published | Editorial fitness, not truth of claim | Citizen text; ISEYC publication decision |
| **Blueprint** | Documented proposals of office-seekers / public sources | Seekers, ISEYC documenters | Structured proposal + source | Published blueprint | Yes if dual-reviewed | Source + dual human review | Submitter + ISEYC gate |
| **Institutional Response** | What institutions say/do re: a demand | Operators, later public | Notion response fields | Status + evidence URL | Mostly operator today | Human | Institution claim ≠ ISEYC fact |
| **Evidence** | Pointers to documents/records | Operators | URL + notes | Evidence row | Selective | Source check, not legal authenticity | Linked object |
| **Civic Intelligence** | Structured public aggregates | Public, researchers | Published only | Briefs, maps, counts | Yes | Methodology disclosure | ISEYC |
| **Partnership** | Institutional use of aggregates | Agencies, unis, media | Contracts + policy | Briefs/API (future) | Negotiated | Legal + CoI firewall | ISEYC |

**Challenge:** Jumping to Partnership/Commercial before Mandate field volume and response discipline is cargo-cult infrastructure. Blueprint pilot already exists — **do not rebuild it**. Institutional Response should extend **existing Notion fields** before new apps.

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

**ISEYC POLICY PROPOSAL:** Never display Party Platform and Candidate Blueprint as equivalent cards without distinct labels.

---

## SECTION D — MANDATE ↔ BLUEPRINT ↔ RESPONSE

**Allowed relationship language (neutral):**

- Related **duty / policy area** identified  
- Related **Published mandate(s)** exist  
- **Blueprint** documents a proposal in that area  
- **Institutional response** recorded (operator)  
- **Evidence URL** attached  
- **No documented relationship** found  

**Prohibited:** “Candidate X satisfies 72% of demands,” match scores, ranked “best for Health.”

Relationships are **editorial/structured links**, not algorithmic endorsement. Prefer human-asserted links in MVP.

---

## SECTION E — BLUEPRINT REGISTER

**Already partially built.** Extend; do not replace.

**Submission channels (ISEYC POLICY PROPOSAL):**

1. **CANDIDATE-SUBMITTED** — material offered by seeker/team  
2. **ISEYC-DOCUMENTED PUBLIC SOURCE** — ISEYC files public document with citation  

These must never look equivalent in UI.

**Justified fields (align with pilot where possible):** office, jurisdiction, election cycle (label only — **LEGAL REVIEW REQUIRED** for official dates), person name, party (optional text, not scored), title, source URL, publication date, policy areas, proposal body, mechanism, responsible institution, timeline (claimed), financing (claimed), geographic scope, verification state, publication decision, version, updated, correction notes.

**Do not invent:** popularity, donation, “electability.”

**OPEN QUESTION:** Accept paid “submission facilitation”? See Section P — default **no preferential publish**.

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

No automatic inheritance: party platform ≠ candidate blueprint ≠ institutional position.

---

## SECTION G — INSTITUTIONAL RESPONSE

**Reuse existing Notion fields** (`mandate-to-response-protocol.md`).

Flow: Mandate → Response Requested → Responsible Institution → Response Received → Follow-up → Evidence URL → Resolution Status.

**MVP:** Remain operator-only in Notion.  
**Later:** Optional public “response summary” only for fields explicitly cleared for public and never including private citizen data.

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

## SECTION I — TRUST & METHODOLOGY (public page outline)

Public methodology must state:

- Mandate = concrete delivery demand, not vote  
- Blueprint = documented proposal with provenance, not endorsement  
- Published = passed human gate  
- What ISEYC does **not** verify  
- Corrections / unpublish / version  
- How disputes are handled  
- Uncertainty disclosure  
- No paid publish privilege  

**BEST PRACTICE:** Methodology linked from Brief, Blueprints, About.

---

## SECTION J — DATA GOVERNANCE

| Class | Examples | Rule |
|-------|----------|------|
| Public | Published mandate text, duty, office, state, LGA | Allowlisted |
| Restricted institutional | Response tracking | Operators |
| Private operational | Reviewer notes, keys | Staff only |
| Sensitive | Age/gender if collected | Never public |
| Never-public | Phone, exact address, raw device id as public field, NIN | **Do not collect NIN** (ISEYC POLICY PROPOSAL) |

**Political affiliation:** do not collect as citizen field.

---

## SECTION K — DATA ARCHITECTURE

| Data | Where | Why |
|------|-------|-----|
| Mandates | Notion Mandate DB | Working ops + moderation |
| Blueprints | Notion Blueprint pilot DB | Already dual-reviewed path |
| Response fields | Same Mandate row | Avoid migration |
| Static duty/office map | `lib/responsibility-map.ts` | Code versioned |
| App secrets | Vercel env | Not in git |
| Future high-volume audit | Possible later DB | **Not justified at n=3** |

**Do not** add Postgres “because enterprise.” Notion remains SoT until field volume and audit needs force otherwise.

---

## SECTION L — PUBLIC INFORMATION ARCHITECTURE

**Challenge:** A five-tab “Mandate | Blueprint | Response | Intelligence | Partnership” nav is heavy for mobile and campaign-shaped.

**Recommended mobile-first IA (ISEYC POLICY PROPOSAL):**

1. **Civic Mandate** (home + submit + Pulse)  
2. **State Brief**  
3. **Responsibility map**  
4. **Public Blueprints** (empty-state honest)  
5. **Charter / Methodology**  
6. Operators: unlinked staff area  

Partnership stays off primary nav until real institutional product exists.

---

## SECTION M — CIVIC INTELLIGENCE

**Allowed:** Published counts by duty/state/office/LGA; coverage gaps; response-status aggregates (if public); methodology-bound summaries.

**Forbidden:** Vote prediction, candidate rank/score, preference inference, targeting, “who to support.”

**Civic intelligence ≠ political intelligence.** Former structures public delivery demands; latter optimises electoral advantage.

At n=3 Published, any “trend” language is **misleading** — prefer “published record” wording.

---

## SECTION N — PARTNERSHIP (name challenged)

“Civic Partnership Exchange” sounds like a marketplace. Prefer **ISEYC Institutional Briefs** or **Research Access (Published aggregates)**.

| Actor | Legitimate use | Must not get |
|-------|----------------|--------------|
| INEC / MDAs | Understand demand themes | Voter lists, ranks |
| NGOs / funders | Programme design | Preferential publish |
| Universities | Research on Published data | Deanonymised citizens |
| Media | Cite public record | Unpublished queue |
| Parties / seekers | Submit blueprints under same rules | Bought ranking |

**STAKEHOLDER INTEREST SIGNAL only:** A presidential aspirant’s interest in blueprints is **not** product-market fit or endorsement. Same rules for all seekers.

---

## SECTION O — COMMERCIAL MODEL (investigate, not launch)

| Model | Customer | Value | Risk |
|-------|----------|-------|------|
| Free public layer | Everyone | Trust | Cost of ops |
| Institutional briefs | Agencies | Packaged Published aggregates | Neutrality if framed as lobbying |
| Research access | Unis | Bulk Published export | Re-identification |
| Mandate Lab | NGOs | Facilitation of field collection | Becoming campaign vendor |
| Technical services | Seekers | Help *format* public blueprint | Pay-to-play perception |

**Never sell:** identities, voter lists, persuasion audiences, rankings, preferential visibility.

---

## SECTION P — CONFLICT-OF-INTEREST FIREWALL

**ISEYC POLICY PROPOSAL:**

- Seekers may submit blueprints; **payment never changes** dual-review outcome.  
- Technical formatting help, if any, is disclosed and does not include publish guarantee.  
- Parties may not buy higher placement.  
- Free: public Mandate, Brief, Published Blueprints, methodology.  
- Staff with political office aspirations: recuse from review of related records (**OPEN QUESTION** process).

---

## SECTION Q — POST-ELECTION

**Sustainable record:** Mandates + responses + evidence can outlive 2027 as delivery memory.

**Risks:** Harassment of named officials; outdated blueprints treated as current policy; mission drift into permanent campaign mode.

**ISEYC POLICY PROPOSAL:** Archive election-cycle labels; keep delivery duties continuous; corrections allowed; no “scorecard of winners.”

---

## SECTION R — SECURITY

- Operator: `CIVIC_OPERATOR_KEY` bearer (shared secret — improve later).  
- Secrets in Vercel only.  
- Rate limits / abuse: fingerprint stored operator-only — **do not** expand tracking.  
- Mass submit / political flooding: human review is primary control.  
- AI: no autonomous publish.  
- Source manipulation: dual-review + source URL inspection.

---

## SECTION S — AI GOVERNANCE

**AI may:** retrieve, extract, classify duty, summarise Published text, flag missing fields, draft operator notes.

**AI must not:** verify political truth alone, publish, rank candidates, recommend votes, infer preference, set Status.

Human review remains the gate.

---

## SECTION T — OPPORTUNITY / RISK (compressed)

**Opportunities (10):** Field memory; LGA briefs; response tracking; dual-review blueprints; methodology trust; Street Rep protocol; multi-state same model; research briefs; university partners; long-term delivery archive.

**Risks (10):** Seen as campaign tool; pay-to-play; privacy leak; fake volume; empty intelligence theatre; schema chaos; Vercel quota; operator burnout; legal claim of “verification”; aspirant capture.

**Do not build (10):** Candidate ranker; match %; vote predictor; voter file; NIN capture; paid placement; dark-pattern share as poll; party comparison widget; recommendation engine; auto-publish AI.

**Institutional value features (10):** Field ops; Brief; map; publish gate; response fields; blueprint dual-review; public boundary docs; status receipt; multilingual chrome; correction/unpublish.

**Revenue (5):** Free public; institutional brief; research export; disclosed formatting service; grants for field ops.

**Partnership (5):** Uni research; NGO field; media citation standards; MDA listening (not control); funder for ops not content bias.

**Trust (5):** Methodology; dual-review; allowlist; empty-state honesty; CoI rules.

**Accidental partisanship (5):** UI looks like scoreboard; only one aspirant’s blueprints; paid boost; staff tweets as ISEYC; “top demand” leaderboard.

**Prevention (5):** Copy rules; equal process; no paid publish; recusal; forbid ranking features in acceptance criteria.

---

## SECTION U — MINIMUM VIABLE EVOLUTION

### MVP-1 (now — mostly non-code)
1. Run Kaduna South **field loop** (Street Rep protocol).  
2. Ship **#48 + #49** when founder authorises merge/deploy (Brief LGA + hub truth).  
3. Operators use **existing** response fields on a few Published rows.  
4. Keep Blueprint public empty until real dual-reviewed non-synthetic rows exist.

### MVP-2 (after field evidence)
1. Public methodology page polish.  
2. Optional public “response summary” for cleared fields only.  
3. First **ISEYC-documented** or dual-reviewed blueprints with strict provenance labels.  

### LATER
Partnership portal, commercial tiers, separate analytical DB, per-user staff auth, Civic Brain automation beyond summaries.

---

## SECTION V — IMPLEMENTATION MAP

| Proposal | Existing | Action |
|----------|----------|--------|
| Mandate submit/Pulse/Brief | Working | **NO CHANGE REQUIRED** for architecture |
| LGA Brief UX | #49 | Merge when authorised |
| Hub/SuccessPanel | #48 | Merge when authorised |
| Blueprint dual-review | lib/civic-record + operators | **NO rebuild** |
| Response tracking | Notion fields + docs | **Extend usage**, not schema rename |
| Civic Intelligence UI | Pulse/Brief counts | Methodology only until volume |
| Partnership | None | **Do not build** now |
| New Postgres** | None | **Not justified** |

---

## SECTION W — ARCHITECTURE DECISION RECORDS

**ADR-001 — Notion remains Mandate SoT**  
Reason: Working moderation; low volume. Alternatives: Postgres. Risk: scale. Reversible later. Approval: founder if migrating.

**ADR-002 — No candidate ranking ever in this product**  
Reason: Neutrality architecture. Alternatives: separate campaign org tool (not ISEYC). Risk: political pressure. Reversible: no.

**ADR-003 — Blueprint dual-review stays**  
Reason: Pilot proven. Alternatives: single reviewer. Risk: slower publish. Approval: keep.

**ADR-004 — Response fields stay operator-first**  
Reason: Avoid public misrepresentation of government claims. Approval: founder before any public response UI.

**ADR-005 — Field volume before intelligence theatre**  
Reason: n=3 cannot support trend products. Approval: product principle.

---

## SECTION X — ROADMAP (repo-based)

| Phase | Focus | Gate |
|-------|-------|------|
| 0 | Audit (this doc) | Done |
| 1 | Field ops Kaduna South | New Published beyond seeds |
| 2 | Merge/deploy #48+#49 | Founder words |
| 3 | Response field discipline | Operator checklist used |
| 4 | Methodology public clarity | Copy review |
| 5 | Real Blueprint rows (dual-review) | Equal process all actors |
| 6 | Evidence hygiene | URLs + labels |
| 7 | Light Civic Intelligence | Only with volume + methodology |
| 8 | Partnership briefs | CoI policy signed |
| 9 | Commercial | Legal + firewall |

---

## ELECTORAL / LEGAL

Election dates, INEC procedures, campaign finance, NDPR/data protection specifics: **LEGAL REVIEW REQUIRED** — not asserted as facts in this blueprint. Architecture avoids depending on unverified legal claims.

---

## FIELD VS BLUEPRINT

| | Mandate field loop | Blueprint register |
|--|--------------------|--------------------|
| Validation | Partial (3 seeds + protocol written) | Synthetic pilot only |
| Priority | **Higher now** | Parallel, strict gates |
| Risk if rushed | Low | High partisanship perception |

---

## FINAL PRINCIPLE

Build **trust, structure, evidence, usefulness, institutional credibility** — not political influence.

Connect, when ready:

`CITIZEN MANDATES ↔ PUBLIC BLUEPRINTS ↔ INSTITUTIONAL RESPONSES ↔ EVIDENCE ↔ CIVIC INTELLIGENCE`

without collapsing them into a candidate platform.
