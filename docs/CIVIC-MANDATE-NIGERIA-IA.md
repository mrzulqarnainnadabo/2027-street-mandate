# Civic Mandate Nigeria — Information Architecture

**Status:** Working product name on branch `feat/civic-mandate-nigeria-shell`  
**Repo:** mrzulqarnainnadabo/2027-street-mandate  
**Live domain:** unchanged until founder says Deploy / approves rename

## Product definition

Non-partisan civic information platform organising:

1. **Citizen demands** (Mandate lifecycle — preserved)
2. **Public Blueprints** (proposals; dual-review)
3. **Source-backed Profiles** (information records, not campaign pages)
4. **Institutional participation** (equal process; ISEYC keeps methodology control)

## Routes (target)

| Path | Purpose |
|------|--------|
| `/` | Submit demand + Civic Pulse |
| `/states` | 36 states + FCT → Brief |
| `/brief?state=` | State Civic Brief |
| `/blueprints` | Public Blueprint Register |
| `/profiles` | Profile register (foundation) |
| `/methodology` | Public methodology |
| `/about` | Non-partisan charter |
| `/mandate/[id]` | Published demand detail |
| `/operators/*` | Staff only |

## Verification states

- **Unverified**
- **Source-linked**
- **Institution-reviewed** (integrity only — never endorsement)

## Monetization constraints (product law)

Forbidden: pay-to-rank, pay-to-feature, pay-to-publish-faster, paid endorsement badges.

Allowed later (not in this increment): equal-fee technical formatting, institutional briefs, grants.

## Non-goals

No rankings, match scores, campaign CRM, party ownership of the ledger.
