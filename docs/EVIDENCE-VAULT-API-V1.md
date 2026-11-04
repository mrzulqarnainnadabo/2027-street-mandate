# Evidence Vault API v0.1

## Purpose

The ISEYC Evidence Vault is the human-reviewed register of source-linked evidence. It is distinct from both Civic Mandate demands and Community Observations.

The public API exposes only evidence records approved for publication. It does not expose the private review workspace.

## Source and configuration

- Private system of record: ISEYC Evidence Vault (Pilot) Notion data source.
- Vercel environment variable: NOTION_EVIDENCE_VAULT_DATA_SOURCE_ID.
- Notion API version: 2026-03-11.
- Public endpoint: GET /api/v1/evidence-records.
- Publication gate: Publication Status = Published AND Review Gate = Dual review complete.

## Public record fields

- Evidence ID and stable page ID.
- Evidence type and scope.
- Title and source title.
- HTTPS source URL, source registry ID and publisher.
- Indicator code, measure, unit, observed value and value status where applicable.
- Geographic level and geographic unit.
- Reference period and retrieval date.
- Methodology, limitations and data status.
- Evidence link review status and evidence relation.
- Linked Community Observation ID and Linked Demand ID where explicitly recorded.

Reviewer identities and review dates are never exposed.

## Verification semantics

- UNVERIFIED: the source or content has not yet been checked.
- SOURCE_CONFIRMED: the source is reachable and the publisher/source identity has been checked. This does not mean the source content corroborates a community report.
- CONTENT_CORROBORATED: the specific source content has been checked against the specific claim.
- DISPUTED: material conflicting evidence exists.
- CORRECTED, SUPERSEDED and WITHDRAWN: retain the lifecycle state; do not treat as current confirmation.

Evidence Link Review is a separate field:
- Not reviewed
- Source reachable
- Content checked
- Disputed

## Evidence relationship semantics

- Not assessed: no relationship review has been completed.
- Context only: relevant background, but not proof of the reported condition.
- Corroborates: the source content supports the specific linked observation.
- Contradicts: the source content materially conflicts with the specific linked observation.
- Unrelated: reviewed and determined not relevant to the linked observation.

The public API fails closed if:
- Corroborates is set without a linked Community Observation ID, CONTENT_CORROBORATED verification and Content checked link review.
- Contradicts is set without a linked Community Observation ID, DISPUTED verification and Content checked link review.

A source being official or reachable is not enough to mark a relationship as corroborating.

## Geography and time rules

Every evidence record should preserve:
- geographic level (national, state, LGA, ward, facility, point or multiple);
- geographic unit;
- reference period;
- indicator/measure definition and unit;
- retrieval date;
- methodology and limitations.

A national WDI indicator can provide national context only. It cannot verify a Kaduna state, LGA, ward or facility report. Different reference periods and measures must not be merged into one trend or score.

A null value is not zero. A missing value remains missing. A catalogue entry is not an ingested observation.

## Current pilot records

The private Evidence Vault has been seeded with:
- World Bank WDI Nigeria population total, 2024 value 232,679,478, marked Estimated and New/Pending review.
- World Bank primary gross enrolment and under-five mortality source catalogue entries, with no numeric values asserted in this pass.
- Kaduna HEFA source-access record, marked Access required.
- Nigeria Health Facility Registry API access record, marked Access required.
- NPHCDA data requisition portal record, marked Access required.

These records are not publicly published. The World Bank population figure is national-level context only and must not be presented as a Kaduna population or a PHC service measure.

## Failure and privacy rules

- Only published and dual-reviewed rows are returned.
- Empty feed is valid and does not mean no evidence exists.
- Truncated upstream retrieval is reported; consumers must not treat it as complete.
- Source URLs must be HTTPS.
- No reviewer names or review dates are public.
- No private intake source context, reporter identity, phone, email or device fingerprint is stored in this database.

## Next integration

The Observatory and Civic Brain may consume this API only after the Mandate production deployment is updated and the Vercel Notion integration is confirmed to have read access to the Evidence Vault data source.
