# Civic Mandate Nigeria

> Don’t tell them who you’ll vote for. Tell them what they must deliver.

Non-partisan civic data product by **ISEYC** (Initiative for Sustainable Evolution for Youth and Community).

**Live:** https://2027-street-mandate.vercel.app

## What this is

Citizens submit **one concrete demand** tied to a **duty** of government, an **office** (or “not sure”), and a **state** (optional LGA).

ISEYC moderates. Only **Published** rows appear on:

- **Civic Pulse** (`/`) — public wall by duty
- **State Civic Brief** (`/brief?state=Kaduna`) — State × Duty × Office (+ copy / print)
- **Civic Intelligence** (`/intelligence`) — synthesis of published records only (not national public opinion)
- **Mandate page** (`/mandate/[id]`) — single published receipt
- **Status receipt** (`/status/[id]`) — private-ish submission reference (not the public wall)
- **Community observations** (`/report`) — separate anonymous intake for specific observed conditions; not a demand or petition
- **Community Observation API** (`/api/v1/community-observations`) — published-only records after dual review
- **Evidence Vault API** (`/api/v1/evidence-records`) — published source-linked evidence after dual review

Community observations are stored separately from demands. Publication is not independent verification. Evidence relations require a linked observation and content review.

This is **not** a poll, ranking, endorsement, or campaign tool.

**Pilot framing:** Published rows are a reviewed public record — not a survey of all Nigerians. See [docs/PILOT-STANDARD.md](docs/PILOT-STANDARD.md).

## Lifecycle (operators)

```
Citizen submits
  → Notion Status = New
  → ISEYC reviews (reject hate / slogans / empty attacks)
  → Status = Published
  → appears on Civic Pulse + State Civic Brief
  → operator may track response/follow-up internally (Notion only)
```

### Operator docs

- [Pilot standard](docs/PILOT-STANDARD.md)
- [Mandate-to-response protocol](docs/mandate-to-response-protocol.md)
- [Public data boundary](docs/public-data-boundary.md)
- [Operator pilot checklist](docs/operator-pilot-checklist.md)
- [Community Observations v0.1](docs/COMMUNITY-OBSERVATIONS-V1.md)
- [Evidence Vault API v0.1](docs/EVIDENCE-VAULT-API-V1.md)

Without **Publish**, the wall correctly shows **zero published**. That is an **empty public record**, not a system failure.
