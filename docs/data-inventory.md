# Data inventory — ISEYC 2027 Civic Mandate

**Status:** Operational inventory (not a legal privacy policy).
**Retention periods:** LEGAL REVIEW REQUIRED — not defined here.

| Field / data | Purpose | Source | Public? | Access |
|--------------|---------|--------|---------|--------|
| Mandate sentence (Name) | Civic demand text | Citizen submit | Yes if Status=Published | Public APIs / Pulse / Brief / mandate page |
| Duty / Top Mandate | Classification | Citizen select | Yes if Published | Public |
| Office | Responsible office claim | Citizen select | Yes if Published | Public |
| State | Geography | Citizen select | Yes if Published | Public |
| LGA | Local geography | Citizen optional | Yes if Published | Public |
| Status | Moderation lifecycle | Operator (Notion) | Only as receipt on `/status/[id]`; public wall uses Published only | Operator + limited status receipt |
| Created time | Provenance | System | Yes if Published | Public |
| Device Fingerprint | Soft abuse signal / draft meta | Client local id | **Never public** | Notion operator only |
| Age Band | Optional demographic | Citizen optional | **Never public** | Notion operator only |
| Gender | Optional demographic | Citizen optional | **Never public** | Notion operator only |
| Response Requested / Received / Follow-up / Resolution / Evidence | Operator accountability tracking | Operator | **Never public** | Notion operator only |
| CIVIC_OPERATOR_KEY | Operator API auth | Env | Never | Server only |
| NOTION_TOKEN | Data access | Env | Never | Server only |

## Rules

1. `mapPageToVoice` is the public allowlist for mandate-shaped objects.
2. Counts of Published rows are **not** votes.
3. Blueprint records use a separate database and dual-review gate.
4. Do not expand collection (NIN, phone, precise home address, biometrics) without founder + legal review.
