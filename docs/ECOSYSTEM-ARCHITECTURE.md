# Civic Mandate Nigeria — Ecosystem Architecture Report

**Updated:** 2026-10-07 (pre-deployment verification pass)  
**Branch:** `feat/civic-intelligence-foundation`  
**Status:** Analysis + CM product hardening only — **no deploy, no merge, no cross-repo integration code**

---

## 1. Current architecture (Civic Mandate)

```
Citizen form → /api/submit → Notion (Status=New)
                    ↓ human review
              Status=Published
                    ↓
        getPublishedPulse (allowlist fields)
                    ↓
   ┌────────────────┼────────────────┐
   │                │                │
 Pulse/Brief   /intelligence    Mandate detail
   │                │           + What Changed
   └────────────────┼────────────────┘
                    │
            Published-only boundary
```

- Soft cap ~500 Published rows (`MAX_PUBLISHED_PAGES`).
- Blueprints separate from Mandates; media drafts require human approval.
- Rate limits + privacy: demographics/fingerprint not public.

## 2. Repository inventory (`mrzulqarnainnadabo`)

| Repo | Actual role | CM relevance |
|------|-------------|--------------|
| **2027-street-mandate** | Public civic record product | **Core** |
| **iseyc-civic-brain** | React/Vite chat UI; `api/chat.js` multi-provider proxy (Groq → Anthropic → xAI); hard-coded pillars in client | Institutional AI shell; **not yet reading CM APIs** |
| **ai-platform** | Python governed runtime: capabilities, JWT auth, case→assertions→evidence→audit, providers | **Substrate** for future agents |
| iseyc-command-hub | Notion+Vercel institutional links | Ops navigation |
| iseyc-digital-operations-centre / -notion | Internal DOC | Operator only |
| iseyc-field-register-desk | Field RSVP intake | Separate programme |
| agent-phone | Mobile agent PWA | Future channel |
| whatsapp-assistant (private) | WhatsApp assistant | Channel experiment |
| hubil-firstline-system | Adjacent product | Not CM |
| Autoverse | Separate | Out of scope |
| book / book-ops | Publishing | Out of scope |

## 3. Reusable existing capabilities

- CM: pulse API, intelligence API, responsibility map, human review workflow, governance tests.
- AI Platform: authorization, cases, evidence attach, audit, provider-neutral generate/stream.
- Civic Brain: multi-provider chat proxy pattern (keys server-side).

## 4. Duplication

- Multiple Notion intake UIs (Field Desk, DOC, CM form) — keep CM as the **public mandate** path only.
- Brain embeds institutional narrative instead of consuming CM Intelligence JSON.
- AI Platform case model parallels What Changed but is **not** wired to CM.

## 5. External data opportunities (scored summary)

| Source | Class | Notes |
|--------|-------|-------|
| **HDX COD-AB Nigeria** (OSGOF/OCHA) | **USE NOW (maps later)** | Admin 0–3 boundaries; highest authority for GIS; not for form dropdowns alone |
| **temikeezy/nigeria-geojson-data** | **USE NOW (dropdowns)** | MIT; states/LGA/wards JSON; open PR on Nasarawa spelling — **validate spellings** before production bind |
| xosasx / nigeria-geo npm | STUDY | MIT LGA lists; cross-check against HDX |
| World Bank / UN indicators | STUDY | Context only — never replace citizen demands |
| Live Heroku “locations” APIs | REJECT | Fragile, unmaintained clones |

### temikeezy verification

- License: **MIT**
- Coverage claim: 36+FCT, 774 LGAs, wards + coordinates
- Activity: community PRs (including spelling fixes) — treat as **community dataset**, not official boundary authority
- **Production rule:** use for form autocomplete **after** spell-check against HDX/official list; use **HDX COD-AB** for any map polygons

## 6. Open-source civic architectures (lessons)

| Project | Lesson for CM | Do not copy |
|---------|---------------|-------------|
| DIGIT / CCRS | Lifecycle of report→department | Ticket-desk politics; CM is not a municipal CRM |
| Decidim / Consul | Participation process design | Voting/ranking incentives |
| GlobaLeaks / OpenPolice | Privacy + public repository | Different domain |
| TownReporter | Human editorial gate | — aligns with ISEYC Media |

## 7. Geographic architecture

- **Phase now:** State select (product list) + optional free-text LGA.
- **Phase next:** LGA select from validated MIT/JSON list.
- **Phase later:** Map “where Published records exist” using HDX boundaries — only when volume supports it.
- **No decorative national map at launch.**

## 8. Evidence architecture

Prefer **structured JSON + relational allowlist fields** on public records:

`Mandate → Location → Duty → Office → Published → (Response?) → (Evidence?) → (Outcome?)`

Graph DB only if multi-hop investigation queries become daily operator work.

AI Platform cases are for **internal** analyst workflows, not the public wall.

## 9. Civic Brain (from code, not README alone)

**What it is today**

- `api/chat.js`: CORS-open POST proxy; tries Groq (Llama), then Anthropic Claude, then xAI Grok.
- Client `App.jsx`: large institutional UI (pillars, quick actions, dashboard narrative).
- Knowledge is **prompt/system + hard-coded UI**, not live Civic Mandate retrieval.
- **No** authentication on chat endpoint (keys on server; anyone who can hit the URL can spend quota).

**What it is good at**

- Institutional strategy conversation for internal operators.
- Multi-provider fallback for cost.

**What would differentiate it**

- Read-only tools: `/api/civic-intelligence`, `/api/pulse` (Published only).
- Answers must cite **published record counts**, not invent national opinion.
- Labels: known / unknown / needs verification.
- Never candidate ranking or campaign advice.

## 10. AI Platform role

```
AI Platform = governed AI infrastructure
Civic Brain = application (may call platform later)
Civic Intelligence = domain aggregation on CM
Civic Mandate = public record of truth
```

Reuse: auth, capabilities, case/evidence **internally**, audit, provider adapters.  
Do **not** put CM taxonomy or political rules in the kernel.

## 11. Security boundaries

Public Brain or public APIs must **never** receive:

- Status=New mandates
- Operator notes
- Demographics / device fingerprints
- Auth secrets
- Draft media without human approval
- Private evidence

## 12. Recommended first integration (ONE)

**A — Read-only Civic Intelligence → Civic Brain**

1. CM already exposes `GET /api/civic-intelligence`.
2. Brain server fetches snapshot (server-side), injects into system prompt with methodology hard rules.
3. No schema change; no AI Platform required for v1.
4. Add auth on Brain chat before any public exposure.

**Do not implement Brain integration in this CM branch until founder orders.**

## 13. Cost

- CM: Vercel + Notion (pilot OK)
- Brain: Groq free tier useful; Anthropic/xAI usage-based
- Geo JSON: free MIT / HDX open
- AI Platform + Supabase: when multi-tenant agents need durable cases

## 14. Phase 2

- Preview CM branch → founder mobile QA → merge → production CM only
- Optional: LGA list validation from curated JSON
- Brain: optional internal-only Intelligence grounding

## 15. Phase 3

- Public response/evidence fields (dual-reviewed)
- AI Platform internal investigation cases
- HDX-backed geographic views when volume justifies
- ISEYC Media pipeline with human gate

---

## Verification log (this pass)

- Branch: `feat/civic-intelligence-foundation`
- FormPanel privacy boundary **pushed** (commit includes “What happens after you submit”)
- Intelligence flagship + methodology banner on remote
- Mandate detail + What Changed honesty on remote
- `docs/ECOSYSTEM-ARCHITECTURE.md` updated
- `docs/DUTY-TAXONOMY.md` added (documentation only — no forced classifier)
- Full `npm test` PASS locally

## READY FOR DEPLOYMENT?

**Not yet production-merged.** Product layer is **preview-ready** after founder QA.

### Deployment gate

1. Founder mobile QA on Vercel **preview** of this branch  
2. Explicit order to merge  
3. Explicit order to deploy production  
4. Operator Publish checklist confirmed  
5. Env secrets verified on the single production project  

### Do not build yet

- National decorative map  
- Ranking / vote / candidate tools  
- Brain public without auth  
- Notion schema expansion without approval  
- Neo4j  
- Merging AI Platform domain rules into CM  

### Single next action

**Open a Vercel preview of `feat/civic-intelligence-foundation` and walk the citizen path on a phone.**
