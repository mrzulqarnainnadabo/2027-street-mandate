# Mandate-to-Response Operator Protocol

This protocol defines how ISEYC should track a **Published** civic mandate after publication.

The purpose is to preserve a factual public record of what was requested, which institution was identified, what response was sought, what evidence exists, and what remains unresolved.

## Core rule

A published mandate should have a clear next step, a responsible institution where identifiable, a status, and an honest account of what is still unknown.

This system does **not** promise government service delivery. ISEYC documents, follows up, and preserves public civic information.

## Response-tracking fields

These fields are operator/internal fields in the existing Notion data source:

- **Responsible Institution** — the public institution or office identified as relevant to the mandate.
- **Response Requested** — date ISEYC formally requests a substantive response.
- **Response Received** — date a substantive institutional response is actually received.
- **Follow-up Date** — next planned review or contact date.
- **Resolution Status** — Not assessed, Open, Partly addressed, Addressed, or Unresolved.
- **Response Evidence** — URL to an official or otherwise verifiable source supporting the recorded response.

## Evidence standard

Record evidence that another operator can independently inspect where practical.

Examples include:
- an official government publication;
- an official institutional webpage;
- a formal letter or response;
- a publicly attributable statement from the responsible institution;
- a verifiable project or service update.

A citizen statement alone is not evidence that an institution responded or that a mandate was addressed.

## Status definitions

### Not assessed
No substantive institutional response or action has yet been assessed.

### Open
The matter remains active and requires a response, action, clarification, or follow-up.

### Partly addressed
There is credible evidence that a meaningful part of the mandate has been addressed, while a material part remains incomplete.

### Addressed
Available evidence indicates that the concrete mandate has been fulfilled. Record the evidence and the basis for that assessment.

### Unresolved
The mandate remains materially unaddressed after relevant response and follow-up activity, or available evidence does not establish that it has been addressed.

An institution saying that it cannot fulfil a request is a response; it is not, by itself, evidence that the mandate was addressed.

## Operator sequence

1. Confirm the mandate is **Published**.
2. Identify the responsible institution where reasonably possible.
3. Record **Response Requested** when ISEYC makes the request.
4. Record **Response Received** only after a substantive response is actually received.
5. Attach **Response Evidence** when a verifiable source exists.
6. Set **Resolution Status** according to the definitions above.
7. Set **Follow-up Date** when another review or contact is needed.
8. Reassess the record when new evidence arrives.

Do not alter the original citizen mandate to make the response appear stronger or weaker.

## Public-data boundary

The response-tracking fields are operator/internal data unless a separately approved public presentation is implemented.

Do not expose:
- phone numbers;
- exact home addresses;
- device fingerprints;
- private demographic fields;
- internal moderation notes;
- internal contact details;
- sensitive evidence that could put a contributor or community at risk.

Only publish response information when its public presentation has been deliberately designed, reviewed, and approved.

## What the platform should measure

The long-term product should track factual process indicators such as:
- specific and actionable published mandates;
- review turnaround;
- citizens able to retrieve submission status;
- briefs used by community organisations;
- institutions contacted;
- substantive responses received;
- follow-ups completed;
- mandates assessed as addressed, partly addressed, open, or unresolved;
- reliability on low-cost phones and unstable connections.

These are operational indicators, not measures of candidate popularity, party support, voting intention, or election outcomes.

## Safety and limitations

The platform is not an emergency response service. A civic mandate submission must not be presented as a guarantee of immediate help with danger, medical emergencies, food crises, or other urgent situations.

When emergency or humanitarian guidance is added, it should use verified and current channels appropriate to the user's location and situation.

## Product principle

> Every published demand should have a clear next step, a responsible institution where identifiable, a status, and an honest account of what is still unknown.
