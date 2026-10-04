# ISEYC Media Automation

**Status:** Architecture + safety rules (no auto-publish of political/civic claims)

## Pipeline

```
Approved civic record (Published Mandate / Blueprint / Profile)
  → automated draft generation (optional)
  → editorial queue
  → human approval
  → ISEYC Media publication
```

The civic record remains authoritative. Media is a **derived** representation.

## Content types (registry)

| Type | Source requirement | Human approval |
|------|-------------------|----------------|
| MANDATE_STORY | Published mandate | Required |
| STATE_BRIEF | Published mandates for state | Required |
| BLUEPRINT_EXPLAINER | Published blueprint | Required |
| WHAT_CHANGED | Documented status change | Required |
| SOURCE_EXPLAINER | Public source URL | Required |
| CIVIC_DIGEST | Aggregated published records | Required |
| SECTOR_BRIEF | Published records by duty | Required |

## Provenance (every draft)

- source record IDs
- source URLs
- publication / retrieval timestamps
- generation timestamp
- content type
- editor approval status
- final publication timestamp (if published)

## Forbidden

- AI → automatic public political/civic publication without human approval
- Media layer modifying the underlying civic ledger
- Endorsement, ranking, or “best candidate” language in drafts

## Corrections

If the source civic record changes: identify affected drafts/stories; use Original → Updated → reason → date. Do not silent-rewrite history.
