# Civic Brief response schema — v1.0.0

## Backward-compatible strategy

1. Default chat remains narrative text.
2. Brief mode (`format: "civic_brief_v1"`) returns JSON matching the schema.
3. Validate before display; on failure use safe text with limitations — never invent sources.

## Classifications

FACT | COMMUNITY_REPORT | ANALYSIS | HYPOTHESIS | RECOMMENDATION | UNKNOWN

FACT requires citations. Community reports are not prevalence statistics.
