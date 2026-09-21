# ISEYC 2027 Civic Mandate

> Don’t tell them who you’ll vote for. Tell them what they must deliver.

Non-partisan civic data product by **ISEYC** (Initiative for Sustainable Evolution for Youth and Community).

**Live:** https://2027-street-mandate.vercel.app

## What this is

Citizens submit **one concrete demand** tied to a **duty** of government, an **office** (or “not sure”), and a **state** (optional LGA).

ISEYC moderates. Only **Published** rows appear on:

- **Civic Pulse** (`/`) — public wall by duty
- **State Civic Brief** (`/brief`) — State × Duty × Office
- **Mandate page** (`/mandate/[id]`) — single published receipt

This is **not** a poll, ranking, endorsement, or campaign tool.

## Lifecycle (operators)

```
Citizen submits
  → Notion Status = New
  → ISEYC reviews (reject hate / slogans / empty attacks)
  → Status = Published
  → appears on Civic Pulse + State Civic Brief
```

Without **Publish**, the wall correctly shows zero. That is empty data, not a system failure.

If Notion or env fails, `/api/pulse` should return **503** (not a fake zero) once the Track C deploy is live.

## Env (Vercel)

```
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

Share the Notion database with the integration (Connections).

### Notion fields (do not rename in code without migration)

| Field | Role |
|-------|------|
| Name | Mandate sentence (title) |
| Top Mandate | Duty select |
| State | State select |
| Status | New / Published / … |
| Device Fingerprint | Anti-spam + office/lga fallback |
| Duty | Optional select |
| Office | Optional select |
| LGA | Optional rich text |

## Local

```bash
npm install && npm run build
```

## Product rule

Measure **demands by duty and place**. Never candidate scores, parties, or “who is leading.”
