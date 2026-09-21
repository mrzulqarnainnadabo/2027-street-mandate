# ISEYC 2027 Civic Mandate — Focused UI and Brand Audit

## Scope

The audit covered the home hero, duty selection and submission form, submission receipt, Civic Pulse, State Civic Brief, status page, methodology page, shared styles, and official identity assets. The review used the current `main` baseline at `82249e8`; PR #21 and PR #22 were inspected separately and both remain independently mergeable against `main`.

## What is already working

The product has a restrained forest-green, cream, paper-like visual language; uses the official ISEYC seal and logo assets; keeps the tone non-partisan; labels public counts as published mandates rather than votes; separates `New`, `Published`, and `Rejected`; and has honest unavailable-state handling in the pulse path. The form already provides concrete examples and a quality floor. The receipt and status route avoid showing private demographic and device fields.

## Highest-value gaps

| Surface | Finding | Small safe direction |
|---|---|---|
| Home hero | The promise is clear, but the primary action is currently communicated as scroll instruction rather than a direct action. | Add one prominent text CTA to the existing form flow; do not add a decorative hero section. |
| Form | The form is usable on narrow screens and has large controls, but repeated border/background patterns are not tokenised and focus/hover states are inconsistent across controls. | Introduce a few shared civic tokens and component classes; preserve existing content and fields. |
| Receipt | The reference, lifecycle message, and privacy boundary are clear. | Leave behaviour unchanged in this increment. |
| Civic Pulse | Public record framing and unavailable state are present. | Leave data semantics unchanged; do not add ranking or trend language. |
| State Civic Brief | Print/PDF utility is present and the page is oriented toward meetings and WhatsApp. | Leave content and print behaviour unchanged. |
| Status page | It distinguishes unavailable/not found in the current review branch history and keeps the public boundary narrow. | Leave lifecycle and route behaviour unchanged. |
| Methodology | The transparency page is supplied by PR #22. | Keep as a separate reviewable change; do not merge it into this UI branch. |
| Brand system | Core colours and official assets are already present, but states are mostly expressed ad hoc with utility classes. | Add semantic tokens/classes for surface, notice, action, and form controls. |

## Focused improvement selected

This branch adds only a small, token-based comprehension improvement:

1. A direct **State your mandate** action in the existing hero, linked to the existing duty/form flow.
2. A stable `mandate-form` anchor on the existing form section.
3. Shared CSS component tokens for civic action, notice, and field states.
4. A clearer focus treatment and touch-target baseline without changing the form payload, validation, Notion schema, moderation status, or public data mapping.

No decorative sections, response-tracking UI, operator routes, public write endpoints, candidate content, rankings, or deployment are included.

## Acceptance checks

- The first screen states what the tool is and is not.
- The primary action is visible and points to the existing flow.
- The form remains mobile-first with large controls.
- All new styling respects reduced motion and accessible focus.
- No public/private boundary changes occur.
- `Status` remains exactly `New`, `Published`, or `Rejected`.
