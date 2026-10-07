# Civic Mandate Nigeria — Ecosystem Architecture Report

**Date:** 2026-10-07  
**Scope:** Pre-deployment architecture discovery across `mrzulqarnainnadabo` GitHub + open civic building blocks  
**Status:** Analysis only — no cross-repo integration implemented in this pass

---

## A. Current state (repositories)

| Repository | Role today | Relevance |
|------------|------------|-----------|
| **2027-street-mandate** | Public Civic Mandate Nigeria: submit → review → Published pulse/brief/intelligence | **Core public civic record** |
| **iseyc-civic-brain** | Institutional chat UI + Claude proxy; hard-coded ISEYC pillars/dashboard narrative | Institutional AI shell; **not yet grounded in Published mandate data** |
| **ai-platform** | Governed AI runtime: capabilities, auth, cases, assertions, evidence, audit, providers | **Governed intelligence substrate** (domain-agnostic) |
| **iseyc-command-hub** | Notion + Vercel institutional hub linking Mandate + Brain | Navigation/ops shell |
| **iseyc-digital-operations-centre** / **-notion** | Internal DOC / Notion ops | Operator workspace — not public record |
| **iseyc-field-register-desk** | Field RSVP / participation intake | Separate programme intake |
| **agent-phone** | Mobile agent workspace PWA | Future channel — not civic record |
| **whatsapp-assistant** | Private WhatsApp assistant | Channel experiment |
| **hubil-firstline-system** | Hubil product line | Adjacent, not CM core |
| **Autoverse** | Separate product | Out of scope for CM launch |
| book / book-ops | Publishing ops | Out of scope |

## B. Duplication

- Multiple Notion + Vercel “ops” shells (Command Hub, DOC, Field Desk) share intake patterns.
- Civic Brain currently embeds institutional strategy copy in the client rather than consuming Civic Mandate’s published APIs.
- AI Platform already models Case → Assertions → Evidence → Audit — parallel to Mandate → Response → Evidence → What Changed, but **not wired**.

## C. What Civic Mandate still lacks (post this branch)

- Operator-published response/evidence fields on the **public** allowlist (honest empties exist)
- Time filters on Intelligence
- Explainable clustering (defer until volume + taxonomy policy)
- LGA validation against authoritative lists
- Production rate-limit store (in-memory is pilot-OK)
- Dedicated public DB beyond Notion soft ~500-row cap (documented)

## D. What Civic Brain lacks

- Live retrieval of **Published-only** Civic Mandate / Intelligence JSON
- Strict methodology prompts (“among published records…”)
- Separation of institutional strategy chat vs civic-evidence Q&A
- Governance: no candidate/ranking paths (must be hard policy)

## E. AI Platform opportunity

Reuse **as infrastructure**, not as civic domain:

- Capability checks, rate limits, audit events
- Intelligence case model for *internal* investigation workflows
- Knowledge retrieval for documents **after** human source rules

Do **not** put Civic Mandate taxonomy or political rules inside the AI kernel.

## F. External data (scored)

| Source | Free/open | Nigeria useful | Score (1–10) | Note |
|--------|-----------|----------------|--------------|------|
| temikeezy/nigeria-geojson-data | MIT JSON | High | **9** | States/LGA/wards coords — best first geo dependency |
| xosasx/nigerian-local-government-areas | MIT | High | **8** | 774 LGAs + coords |
| Some19ice/nigeria-geo | MIT npm | High | **8** | SDK; verify data against official lists |
| geoBoundaries / OSM / HDX | Open | Medium–High | **7** | Boundaries; heavier ops |
| World Bank / UN open data | Open | Medium | **6** | Context indicators — not citizen demands |
| Live third-party “locations API” Heroku clones | Uncertain | Low | **3** | Avoid fragile hosted clones |

## G. Open civic architectures (ideas, not copies)

| Project | Solves | Takeaway for CM |
|---------|--------|-----------------|
| DIGIT / CCRS | Complaint lifecycle routing | CM is **not** a municipal ticket system; keep demand≠service desk |
| Decidim / Consul | Participation processes | CM is evidence/record, not voting |
| OpenPolice / GlobaLeaks | Secure reporting + public repository | Privacy boundary + human review patterns |
| TownReporter | Human editorial gate for civic news | Aligns with ISEYC Media human-approval rule |

## H. Recommended architecture

```
Civic Mandate Nigeria (public record)
        │ Published-only APIs
        ▼
Civic Intelligence (aggregation + methodology)
        │
        ├── Citizens / media / CSOs (web)
        │
        └── (later) Civic Brain application layer
                    │ governed calls
                    ▼
              AI Platform (runtime, audit, retrieval)
                    │
                    └── Human review → ISEYC Media / internal briefs
```

Evidence graph: start as **relational/JSON on public allowlist fields** + optional operator evidence tables; graph DB only if relationship queries justify it.

## I. First integration (ONE)

**Option A (recommended):**  
`GET /api/civic-intelligence` (+ existing pulse) → **read-only** Civic Brain tool/context that answers only with Published snapshot + methodology disclaimer.

- Useful immediately  
- No schema change  
- No AI Platform kernel pollution  
- Cheap  
- Auditable  

**Not first:** full Case sync into AI Platform (valuable later for internal investigations).

## J. Phases

1. **Launch CM** — this branch: trust UX, intelligence, honest What Changed empties  
2. **Brain ground truth** — Brain consumes Intelligence API (read-only, published-only)  
3. **Evidence loop** — public response/evidence when operator fields are dual-reviewed for public surface  
4. **Geo** — LGA list validation via MIT nigeria geo data  
5. **Platform** — internal cases via AI Platform for analysts only  

## K. Security / governance never bypass

- Published-only public boundary  
- Human review before public  
- No rankings / endorsements / vote advice  
- No automatic political publication  
- Privacy: demographics/fingerprint never public  
- AI drafts require human approval  

## L. Cost

- CM on Vercel + Notion: pilot cost profile OK  
- Civic Brain Claude API: usage-based  
- AI Platform + Supabase: when multi-tenant agents need it  
- Geo JSON: free (MIT)  

---

## READY FOR DEPLOYMENT?

**NO — conditional almost.**

### Why not unconditional YES

1. Branch not merged; production still on main without Intelligence + UX elevation.  
2. Founder should smoke-test mobile submit + Intelligence on preview.  
3. Civic Brain still ungrounded (acceptable for CM-only launch).  
4. Notion volume soft-cap remains.

### Why close

- Governance tests pass  
- Institutional front door + methodology honesty  
- Form privacy boundary explicit  
- Mandate detail + What Changed honest empties  
- Architecture path clear without new repos  

### Before deploy

1. Merge only when founder orders  
2. Single Vercel project + env check  
3. Operator checklist: Publish vs New  
4. Optional preview URL QA on mobile  

### First Civic Brain integration

Read-only consumption of `/api/civic-intelligence` with hard methodology system prompt.

### Do not build yet

- Candidate tools, ranking, auto-publish  
- Neo4j / decorative national map  
- Full AI Platform case mirror on day one  
- New monorepo  

### Single highest-value next step after merge

**Preview deploy of this branch → founder mobile QA → merge → production deploy of Civic Mandate only.**
