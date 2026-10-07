# ADR 004 — Civic Intelligence is Published-record synthesis only

**Status:** Accepted (implemented on `feat/civic-intelligence-foundation`)

**Date:** 2026-10-07

## Context

Partners and the public need a clear answer to “What are citizens asking for?” without the platform inventing national public opinion or political rankings.

## Decision

1. Civic Intelligence aggregates **only** records that already pass the Published-only public boundary (`getPublishedPulse` / `mapPageToVoice` allowlist).
2. All public statements must use record-based language:
   - Allowed: “Among N published Civic Mandate records from S states…”
   - Forbidden: “Nigerians have decided…”, “the most important issue to Nigerians is…”, candidate rankings, vote advice.
3. Every snapshot includes **methodology** and **limitations** arrays; the UI must surface both.
4. Aggregation is a pure function (`buildCivicIntelligence`) so it can be unit-tested without Notion.
5. Truncation from the underlying fetch is preserved and disclosed.

## Consequences

- Empty public memory → honest empty framing (not a fake zero-as-rejection).
- Pilot-scale geographic bias is disclosed; absence of a state is not treated as absence of need.
- Future clustering / time filters must preserve the same language discipline.
- Media drafts that use this layer still require human approval (`docs/MEDIA-AUTOMATION.md`).
