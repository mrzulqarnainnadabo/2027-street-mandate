# ISEYC 2027 Civic Mandate

> Don't tell us who you'll vote for. Tell them what they must deliver.

Non-partisan civic mandate platform by **ISEYC**.

## Phase 0

- Duty + office + state + optional LGA + demand
- Notion moderation (`New` → `Published`)
- Civic Pulse by duty (never candidate rankings)
- `/about` non-partisan charter
- Vote-intent removed from product path

## Env

```
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

Optional Notion columns: `Office` (select), `LGA` (rich text), `Duty` (select). Fallback embeds office/LGA in Device Fingerprint.

```bash
npm install && npm run build
```
