# Community Observations v0.1

## Why this is separate from Civic Mandate

Civic Mandate collects citizen demands about what public office should deliver. A demand is not an observed service condition.

Community Observations is a separate intake for specific, place- and time-bounded reports about conditions people say they observed or have evidence for. The two datasets must not be merged or counted as the same kind of public signal.

## Intake

- Public form: `/report`
- Private submission endpoint: `POST /api/community-observations`
- Private system of record: Notion data source `ISEYC Community Observations`
- Required: short title, report type, sector, state, description, evidence basis, and source context.
- Optional: LGA, ward, facility/place, observation date and HTTPS evidence link.
- No reporter name, phone, email, demographic profile or device fingerprint is requested or stored by this intake.
- The endpoint applies IP-based rate limiting and rejects personal contact details in text fields.
- Reports are saved as `Status = New`, `Verification Status = Unverified`, and `Review Gate = Pending`.

## Review and publication

Publication requires both:
1. `Status = Published`
2. `Review Gate = Dual review complete`

The database includes separate primary and secondary reviewer fields and review dates. These are internal-only.

Suggested workflow:

`New → Needs clarification → Ready for review → Published`

Rejected reports use `Status = Rejected`. A published report can still have `Verification Status = Unverified`; publication means it passed editorial review, not that the underlying claim has been independently established.

Verification states:
- `Unverified`: no corroboration recorded.
- `Corroborated`: at least one independent corroborating source has been documented by reviewers.
- `Independently verified`: a documented verification method and evidence support the specific claim.
- `Disputed`: credible evidence materially conflicts with the report.

Do not change verification state solely because multiple people submit similar reports. Repeated submissions may be related signals, not independent verification.

## Public API

`GET /api/v1/community-observations`

Query parameters:
- `page` (default 1)
- `pageSize` (default 20, max 50)
- `state`, `lga`, `sector`, `reportType`
- `q` text search

The API returns only rows that satisfy both publication gates. It includes an explicit contract version, publication boundary, verification status, evidence basis, place, dates, and public HTTPS evidence link.

The public mapper is an allowlist. It never returns:
- Source Context
- Reviewer Notes
- Primary Reviewer / Secondary Reviewer
- Primary Review Date / Secondary Review Date
- any reporter identity or contact information

If the Notion query exceeds the safe retrieval cap, `truncatedUpstream` is true. Consumers must not present that response as a complete collection.

## Evidence and interpretation boundaries

- A first-hand observation is still an unverified report until checked.
- A witness account is not automatically independent corroboration.
- A photo or document must be checked for date, location, authenticity and context.
- A public media report is a source to inspect, not automatic confirmation.
- A facility appearing in the national registry does not prove it is functional, staffed or supplied.
- National statistics cannot establish conditions at a named ward or facility.
- Missing reports do not mean a service is functioning.
- Report counts are not prevalence estimates or representative public opinion.

## Integration sequence

1. Configure `NOTION_COMMUNITY_OBSERVATIONS_DATABASE_ID` in Vercel for Preview and Production.
2. Deploy the Mandate intake and public API.
3. Verify a new report appears privately with New / Unverified / Pending states.
4. Complete a controlled two-review test; confirm it is invisible until both publication gates are satisfied.
5. Confirm the public endpoint returns only the approved redacted record.
6. Add a read-only Observatory adapter for this contract.
7. Allow Civic Brain to reason over these observations only with their source, location, date, evidence basis and verification state attached.

No demo or synthetic records should be mixed into this live feed.
