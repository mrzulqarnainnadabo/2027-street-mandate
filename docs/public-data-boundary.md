# Public data boundary

This product exposes **civic public data** only after moderation.

## Public (allowed after Status = Published)

- Mandate sentence (`Name`)
- Duty / Top Mandate
- Office
- State
- LGA (if provided)
- Created time (system)
- Published status for public detail pages

Surfaces: `/api/pulse`, Civic Pulse UI, `/brief`, `/mandate/[id]`.

## Private / operator-only (never public APIs or pages)

- Device Fingerprint
- Age Band
- Gender
- **Responsible Institution**
- **Response Requested**
- **Response Received**
- **Follow-up Date**
- **Resolution Status**
- **Response Evidence**
- Any future operator notes or correspondence

## Status receipt (`/status/[id]`)

May show moderation status (`New` / `Published` / `Rejected`) plus the same civic fields as a receipt. Must not show demographics, fingerprints, or response-tracking fields.

## Implementation rule

`mapPageToVoice` in `lib/notion.ts` is the **only** mapper for public-shaped objects. It constructs an explicit allowlist object — never spreads Notion `properties`.

Published counts are **not** votes, rankings, or popularity.


## Separate Community Observations data boundary

Community Observations is a distinct dataset from Civic Mandate demands.

- Public submission route: `/report`.
- Submissions enter the separate `ISEYC Community Observations` database as `New`, `Unverified`, and `Review Gate = Pending`.
- Public API: `/api/v1/community-observations`.
- Publication requires both `Status = Published` and `Review Gate = Dual review complete`.
- The public mapper exposes only the approved report fields. Source Context, Reviewer Notes, reviewer identities, review dates and any contact details remain private.
- A published report remains unverified unless a separate verification process changes its verification status.
- Similar reports are not automatically independent corroboration, and counts are not prevalence estimates.


## Evidence Vault public boundary

- The private ISEYC Evidence Vault is exposed only through `GET /api/v1/evidence-records`.
- A record is public only when Publication Status is Published AND Review Gate is Dual review complete.
- Reviewer identities and review dates are never returned.
- SOURCE_CONFIRMED means a source is reachable and identified; it does not mean the content corroborates a community report.
- CONTENT_CORROBORATED is required before an evidence relation can be published as Corroborates.
- Corroborates and Contradicts require a linked Community Observation ID, content-checked source link and matching verification state.
- National evidence remains national context and cannot verify a named LGA, ward or facility.
