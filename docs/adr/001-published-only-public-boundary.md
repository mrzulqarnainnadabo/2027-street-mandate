# ADR 001 — Published-only public boundary

**Status:** Accepted (implemented)

**Date:** 2026-09-27

## Context

ISEYC 2027 Civic Mandate must expose civic data without leaking moderation fields, demographics, or unpublished submissions.

## Decision

1. Public surfaces (`/api/pulse`, Civic Pulse, `/brief`, `/mandate/[id]`, public Blueprint register) may only show records that pass the server-side publication gate.
2. Mandate public rows use an explicit allowlist mapper (`mapPageToVoice`) — never spread Notion properties.
3. Status receipt (`/status/[id]`) may show Status + civic fields only; never Age Band, Gender, Device Fingerprint, or response-tracking fields.
4. Published counts are **not** votes, rankings, or popularity.

## Consequences

- Operators review in Notion / operator consoles; citizens see only Published civic memory.
- Outages must not be presented as “empty” or “rejected” where distinguishable (see `getPublishedMandate` / Pulse error UX).
- Schema field renames require updating the allowlist and `docs/public-data-boundary.md`.
