# Public Mandate Record DTO — v1.0.0

**Purpose:** Exact fields Civic Brain (and any public consumer) may retrieve.
**Source of truth for allowlist:** Mandate `mapPageToVoice` / public-data-boundary.

## Status rule

Only records with human-approved **Published** status appear in this DTO.

## Allowed fields

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Stable public identifier |
| `sentence` | string | Public demand text |
| `duty` | string | Duty / sector label |
| `mandate` | string | Alias of duty where API still emits both |
| `office` | string | Claimed responsible office or "Not sure" |
| `state` | string | State or FCT name |
| `lga` | string | Optional; may be empty |
| `created` | string (ISO-8601) | System timestamp |

## Forbidden fields

- Submitter name, email, phone
- Device fingerprint, age band, gender
- Operator notes, internal Notion properties dump
- Response tracking / resolution fields

## Observed live Pulse (2026-10-30)

`GET /api/pulse` → `{ voices, tally, total, states, truncated }` with total **24**.
