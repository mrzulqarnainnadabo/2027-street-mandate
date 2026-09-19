# ISEYC 2027 Civic Mandate — Phase 0

A small, non-partisan civic instrument for turning citizen demands into a moderated public mandate wall.

## Phase 0

A citizen can:

1. Select the public office they want to address: President, Governor, Senator, or Representative.
2. Select a Kaduna LGA.
3. Select one duty: Health, Security, Education, Jobs, Power, Water, Roads, or Corruption control.
4. Submit one short, concrete demand.
5. See only **Published** voices on the public wall.
6. Share a location-aware mandate link.

Phase 0 is Kaduna-first. It does not rank candidates, collect vote preferences, publish candidate profiles, or run election-day collation.

## Moderation

New submissions are stored in the Notion database with:

- `Status = New`
- `Office`
- `LGA`
- `Duty`
- `State = Kaduna`
- `Source = Direct Link`

Only a moderator changing `Status` to **Published** makes a submission visible on the public wall.

## Environment

Production requires:

NOTION_TOKEN=...
NOTION_DATABASE_ID=d46f6a3d47294c718519952b8497b911

The Notion database must be shared with the integration.

## Deploy

pnpm install
pnpm build
npx vercel

The application uses the existing Next.js + Notion architecture; no new backend or database is introduced for Phase 0.

## Product rule

> If it does not help a citizen demand something measurable from the right office, it is not Phase 0.