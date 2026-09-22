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
