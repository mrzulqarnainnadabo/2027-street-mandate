# Scale limits and next phases

**Status:** Working notes (not a migration plan to execute without founder order)

## Current public data plane

- Published mandates are read from Notion via `getPublishedPulse`.
- Soft cap: `MAX_PUBLISHED_PAGES = 10` × `PAGE_SIZE = 50` ≈ **500** published rows per snapshot.
- Truncation is flagged on pulse and Civic Intelligence snapshots.

## When to consider a dedicated public data layer

Document thresholds (illustrative, not automatic triggers):

- Sustained Published volume beyond a few hundred records **and** frequent Intelligence/Brief load
- Need for LGA/ward GIS queries, research exports, or public API SLAs
- Multi-region read latency or Notion rate-limit pressure

Until then, Notion remains appropriate for the pilot operator workspace.

## Product phases (priority)

1. **Trust + UX** — institutional homepage, clear standards, submission comfort (in progress on this branch)
2. **Civic Intelligence** — flagship “What Nigerians are asking for” from Published records only
3. **Accountability** — Demand → responsibility → blueprint → response → evidence → What Changed (honest empty states)
4. **National geography** — Nigeria → state → LGA briefs without fabricating coverage
5. **Ecosystem** — ISEYC Media drafts, research dataset, documented API

## Non-goals for premature build

- Decorative national map without useful geography queries
- Invented issue taxonomy not grounded in duty labels already in data
- Automatic publication or AI-authored political claims
