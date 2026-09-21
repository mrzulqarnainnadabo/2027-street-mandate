# ISEYC 2027 Civic Mandate — Operator Pilot Checklist

## Verification note

The live Notion data source **ISEYC 2027 Civic Mandate** was inspected on 21 September 2026. The existing fields remain present, including `Name`, `Top Mandate`, `State`, `Status`, `Device Fingerprint`, `Duty`, `Office`, `LGA`, `Age Band`, and `Gender`. The six approved response-tracking fields are also present with the requested types and values:

| Field | Type | Verified configuration |
|---|---|---|
| Responsible Institution | Rich text | Present; separate from Office |
| Response Requested | Date | Present |
| Response Received | Date | Present |
| Follow-up Date | Date | Present |
| Resolution Status | Select | Not assessed; Open; Partly addressed; Addressed; Unresolved |
| Response Evidence | URL | Present |

The live data source currently exposes one record, and it is `New`. No published records were returned, so the five-record pilot cannot yet be completed against live published data. This checklist is ready for use once ISEYC has selected five already-published mandates in the protected operator workspace. No records were changed during verification.

## Protected views to create in Notion

1. **Published — needs assessment**: `Status = Published` and `Resolution Status = Not assessed`.
2. **Open — due for follow-up**: `Resolution Status = Open` and `Follow-up Date` is on or before today.
3. **Response received — awaiting assessment**: `Response Received` is not empty and `Resolution Status = Not assessed`.
4. **Addressed**: `Resolution Status = Addressed`.
5. **Unresolved**: `Resolution Status = Unresolved`.

Keep these views private to the ISEYC operator group. Do not expose Device Fingerprint, Age Band, Gender, internal notes, private correspondence, or raw operator metadata in a public view.

## Five-record pilot worksheet

Complete one row per already-published mandate. Use the record’s existing Notion page; do not duplicate or rewrite the mandate.

| Pilot record | Existing status confirmed | Responsible Institution | Response Requested | Response Received | Follow-up Date | Resolution Status | Response Evidence | Operator initials / date |
|---|---|---|---|---|---|---|---|---|
| 1 | ☐ Published |  |  |  |  | Not assessed |  |  |
| 2 | ☐ Published |  |  |  |  | Not assessed |  |  |
| 3 | ☐ Published |  |  |  |  | Not assessed |  |  |
| 4 | ☐ Published |  |  |  |  | Not assessed |  |  |
| 5 | ☐ Published |  |  |  |  | Not assessed |  |  |

## Decision rules to agree before entry

| Question | Pilot decision to record |
|---|---|
| What counts as an institutional response? | Record the minimum source and substance required. |
| Does an acknowledgement count? | Decide whether acknowledgement alone is insufficient, and document the rule. |
| What qualifies as evidence of delivery? | Prefer an official, verifiable source; record what is not sufficient. |
| When is a mandate Partly addressed? | Define the threshold for partial completion and what remains open. |
| Who sets Follow-up Date? | Name the role responsible and the review cadence. |
| Who may mark Addressed or Unresolved? | Name the accountable ISEYC role; do not infer this from public activity. |

## Safe pilot sequence

1. Confirm that each selected record is already `Published`.
2. Enter `Responsible Institution` only when the responsible body can be named specifically; do not repurpose `Office`.
3. Set `Response Requested` only when ISEYC has actually requested a response.
4. Set `Response Received` only when a response has actually been received.
5. Add `Follow-up Date` for the next planned review or contact.
6. Keep `Resolution Status` as `Not assessed` until the team applies the agreed decision rules.
7. Add `Response Evidence` only after checking that the URL is official, relevant, accessible, and safe to share with operators.
8. Reconfirm that changing response fields did not change `Status`.

## Pilot exit criteria

The pilot is ready for review when all five records have a documented operator decision, the team has resolved the ambiguity questions above, evidence-quality rules are written down, and the original publication status of each record is unchanged. Do not add public response-tracking UI until this review is complete.

## Permission note

The connected Notion workspace and data-source schema were readable through the configured integration. Write permission was not exercised because doing so would mutate live civic records; operator write access should be confirmed by an authorised ISEYC operator during the protected pilot, using the sequence above.

## Exactly one next step

Select five already-published mandates in a protected Notion view and run the worksheet with an authorised ISEYC operator.
