# ISEYC 2027 Civic Mandate

> Don’t tell them who you’ll vote for. Tell them what they must deliver.

Non-partisan civic data product by **ISEYC** (Initiative for Sustainable Evolution for Youth and Community).

**Live:** https://2027-street-mandate.vercel.app

## What this is

Citizens submit **one concrete demand** tied to a **duty** of government, an **office** (or “not sure”), and a **state** (optional LGA).

ISEYC moderates. Only **Published** rows appear on:

- **Civic Pulse** (`/`) — public wall by duty
- **State Civic Brief** (`/brief?state=Kaduna`) — State × Duty × Office (+ copy / print)
- **Mandate page** (`/mandate/[id]`) — single published receipt
- **Status receipt** (`/status/[id]`) — private-ish submission reference (not the public wall)

This is **not** a poll, ranking, endorsement, or campaign tool.

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

- [Mandate-to-response protocol](docs/mandate-to-response-protocol.md)
- [Public data boundary](docs/public-data-boundary.md)
- [Operator pilot checklist](docs/operator-pilot-checklist.md)

Without **Publish**, the wall correctly shows **zero published**. That is an **empty public record**, not a system failure.

If Notion or env fails, `/api/pulse` returns **503** (not a fake zero). Submit uses **503** for configuration failures.

## Env (Vercel)

```
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

Share the Notion database with the integration (Connections).

### One Vercel project only

Keep a **single** production project linked to this repo (recommended name: `2027-street-mandate`).

Duplicate projects each deploy on every push and can exhaust capacity. Disconnect extras under **Project → Settings → Git** before the next production deploy.

### Notion fields

**Public-shaped (via code allowlist):** Name, Top Mandate / Duty, State, Office, LGA, Status (Published only on public surfaces).

**Operator-only (never public APIs):** Device Fingerprint, Age Band, Gender, Responsible Institution, Response Requested, Response Received, Follow-up Date, Resolution Status, Response Evidence.

Do not rename fields in Notion without a code migration.

## Local

```bash
npm install && npm run build
```

## Blueprint Register governance\n\nBlueprints use the existing Notion pilot database. Public publication requires an inspectable source, non-UNVERIFIED verification, Reviewer A approval, Reviewer B approval by a different reviewer, and an explicit Publication Decision = Publish. The guarded operator review endpoint requires `Authorization: Bearer <CIVIC_OPERATOR_KEY>` and is disabled unless `CIVIC_OPERATOR_KEY` is configured. Payment or actor requests never alter publication state.\n\n## Product rule

Measure **demands by duty and place**. Never candidate scores, parties, or “who is leading.”

## Release note

Ship when: main is green, **one** Vercel project remains linked, env vars set, and operators understand Publish vs New. Prefer deploying once after hardening, not after every commit.
