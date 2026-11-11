# Civic Mandate Nigeria — Information Architecture

**Status:** Working product name on branch `feat/civic-mandate-nigeria-shell`  
**Repo:** mrzulqarnainnadabo/2027-street-mandate  
**Live domain:** unchanged until founder says Deploy / approves rename

## Product definition

Non-partisan citizen understanding and public participation platform. Its primary assignment is to help people understand their constitutional rights, civic responsibilities, public institutions and ways to participate peacefully. It then connects that understanding to source-backed public evidence and community experience.

1. **Citizen learning** — rights, responsibilities, constitutional structure, public money, elections and active citizenship.
2. **Public understanding** — states, institutions, public duties, profiles and explainers.
3. **Community experience** — published observations and specific public-service demands (human review preserved).
4. **Public Blueprints** — proposals with dual review and evidence boundaries.
5. **Tracked public record** — publication status and documented changes, never implied resolution.

## Routes (target)

| Path | Purpose |
|------|--------|
| `/` | Citizen-first home: learn, understand, participate; public record and demand submission are secondary |\n| `/learn` | Citizen Guide: rights, responsibilities, government, public resources, participation and patriotism |
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

No rankings, match scores, campaign CRM, party ownership of the ledger, or patriotic loyalty tests. Civic learning must distinguish constitutional duties from legal advice and must not equate patriotism with silence or uncritical government support.
