# Civic Mandate Nigeria — Partnership Architecture

**Status:** Governance document for institutional outreach  
**Product:** Civic Mandate Nigeria (https://2027-street-mandate.vercel.app)  
**Operator:** ISEYC (Institute for Strategic Engagement of Youth & Communities)  
**Last verified against repository:** main @ f297776 + this branch  

This document separates **what the product already does** from **what partners may propose**. It is not a list of signed partnerships, endorsements, or verified institutional responses.

---

## 1. Public-interest purpose

Civic Mandate Nigeria is a non-partisan public record of concrete public-service demands organised by place and responsibility. Citizens submit demands; ISEYC performs human review; only **Published** records appear on public surfaces (Civic Pulse, State Brief, Civic Intelligence, mandate detail pages).

It is **not**:

- A poll, survey sample of all Nigerians, or opinion ranking  
- A candidate platform, electability score, or vote recommendation  
- A campaign tool or political advertising channel  
- An automatic publisher of submissions  

Honest framing for partners: *“Building Nigeria’s public civic record.”* Coverage is limited to published records from the states and periods actually present in the data.

---

## 2. ISEYC governance and publication authority

| Responsibility | Owner |
|----------------|--------|
| Publication decision (Status = Published) | ISEYC human operators |
| Correction / unpublish process | ISEYC operators under documented policy |
| Methodology and public claims | ISEYC; must match published evidence |
| Non-partisan charter enforcement | ISEYC |
| Technical operation of the public product | ISEYC engineering under founder direction |

**Funding, grants, or partnership agreements do not buy publication, favourable treatment, ranking, or editorial control.** Partners may support outreach, research, or capacity; they do not set which records appear.

---

## 3. Public vs private data boundaries

**Public (Published records only):**

- Demand sentence (reviewed)  
- Duty / mandate category  
- Named office of responsibility (or “unsure”)  
- State and optional LGA  
- Publication metadata required for accountability views  
- Aggregate counts derived only from Published rows  

**Private / never on public surfaces:**

- Submissions with Status ≠ Published  
- Optional demographics  
- Device / fingerprint signals used only for rate limiting  
- Operator notes and internal review fields  
- Receipt identifiers used for citizen status checks (status links are for the submitter; detail pages remain gated until Published)  
- Secrets, tokens, and infrastructure credentials  

See also `docs/public-data-boundary.md`.

---

## 4. Human moderation and correction

1. Citizen submits → Status **New** (or equivalent intake state).  
2. Operator reviews for clarity, safety, non-partisanship, and concrete demand quality.  
3. Operator sets **Published** only when criteria are met.  
4. Controlled unpublish / correction paths exist for errors and policy violations.  
5. Absence of a public institutional response is **not** treated as proof of institutional failure; it is shown as missing evidence.

Blueprints remain a **separate** record class with dual-review and source requirements; they are not auto-published from citizen mandates.

---

## 5. Appropriate partner roles

| Partner type | Appropriate roles | Not appropriate |
|--------------|-------------------|-----------------|
| **CSO / civic organisations** | Outreach, literacy, field facilitation, independent monitoring of *published* records | Controlling publication queue; inserting partisan framing |
| **Media** | Reporting on published records with methodology context; linking to canonical URLs | Treating unpublished submissions as public; inventing national statistics |
| **Universities / researchers** | Secondary analysis of published aggregates under licence/terms; methodology critique | Re-identifying private fields; claiming representativeness beyond published coverage |
| **Development partners / donors** | Capacity, infrastructure, independent evaluation funding | Editorial control; payment for publication volume |
| **Institutions (MDAs, legislatures)** | Optional formal responses logged through governed channels when implemented | Demanding removal of lawful published civic records without process |

No partner is granted write access to the public record without ISEYC operator workflow.

---

## 6. Research and media usage conditions

- Cite **published** Civic Mandate records and the product methodology page.  
- State coverage limits (e.g. number of published records and states represented at time of access).  
- Do not present the dataset as a national probability sample.  
- Do not scrape or republish private status/receipt endpoints as public data.  
- Prefer canonical URLs for individual published mandates and briefs.

---

## 7. Data-quality limitations (honest)

- Volume is currently modest; published counts and state coverage change as operators publish.  
- Geographic coverage is not uniform across Nigeria.  
- Office-of-responsibility labels reflect citizen perception and a responsibility map, not a legal assignment of guilt.  
- Aggregate “share of published” is share among published rows, not share of national opinion.  
- Backend or Notion outages must surface as **unavailable**, never fabricated zero counts presented as true empty state without status.

---

## 8. Privacy and security expectations for partners

- Partners do not receive bulk private submission dumps.  
- Any research extract must be limited to public Published fields or explicitly approved de-identified aggregates.  
- Rate limits, operator auth, and published-boundary checks remain in force.  
- Partners must not attempt to reverse-engineer device identifiers or private demographics.

---

## 9. Phased partnership model

| Phase | Focus | Product dependency |
|-------|--------|--------------------|
| **Now** | Clarity of public record, operator publish discipline, documented boundaries | Current production surfaces |
| **Near** | Structured institutional response logging (when dual-review fields are ready) | Existing mandate-to-response protocol docs |
| **Later** | Research extracts, media packs, optional CSO facilitation tools | Still human publication authority |

Each phase requires founder approval before implementation. No automatic national “dashboard for partners” that bypasses Published-only rules.

---

## 10. Implemented vs planned (do not conflate)

**Implemented / verified in product code paths (subject to env and operator activity):**

- Citizen submit → Notion intake  
- Human status control for publication  
- Public Pulse / Brief / Intelligence restricted to Published  
- Share helpers for public URLs  
- Methodology and non-partisan policy pages  
- Blueprint dual-review pilot path  

**Proposed / not in this release:**

- Civic Brain public chat grounded on Civic Intelligence (see separate plan; requires auth, rate limits, citations)  
- National map productisation  
- Automated institutional response ingestion  
- Paid “featured” placement of any kind  

---

## 11. Contact and process

Institutional partnership inquiries should go through ISEYC’s designated outreach channel (`iseycglobal@gmail.com` or successor official address). Technical integration proposals are evaluated against the non-partisan charter, public-data boundary, and this architecture.

**This document does not create partnership agreements.** Agreements are separate instruments and must not contradict the rules above.
