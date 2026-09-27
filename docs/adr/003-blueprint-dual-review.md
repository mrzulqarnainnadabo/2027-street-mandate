# ADR 003 — Blueprint dual-review publication

**Status:** Accepted (implemented in pilot)

**Date:** 2026-09-27

## Context

Public Blueprints document proposals attributed to public-office actors. A single reviewer creates concentration of power and error risk.

## Decision

1. Publication requires **Reviewer A** and **Reviewer B** approvals.
2. A and B must be **different** humans.
3. An explicit **Publication Decision = Publish** is required in addition to dual approval.
4. Source must be inspectable; **UNVERIFIED** cannot publish.
5. Operator API mutations require server-side `CIVIC_OPERATOR_KEY` (Bearer); key never enters client bundles.
6. Ordinary review mutations cannot alter a record once **Status = Published** without a separate correction protocol (not yet productized).

## Consequences

- Blueprint public register can stay empty until governance is exercised.
- Faster single-click publish paths are intentionally rejected.
- Correction/versioning for published political claims remains an open operational design (do not silently rewrite history).
