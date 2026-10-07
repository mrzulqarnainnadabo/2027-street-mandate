# Public-service duty taxonomy (pilot)

**Status:** Documentation of *existing* duty labels already used in Civic Mandate forms.
This is **not** an automatic classifier and is **not** forced onto free text.

## Principle

Classification is only as strong as the citizen-chosen **duty** field on a Published record.
Ambiguous free text must not be re-labeled by AI into a false certainty for public display.

## Existing product duties (allowlist)

The form uses fixed duty chips (see `lib/constants`). Those labels already approximate:

| Conceptual family | Typical duty labels in product |
|-------------------|-------------------------------|
| Essential human services | Health, Education, Water, (related social asks under Other) |
| Infrastructure & mobility | Roads & Transport, Power, Infrastructure-related Other |
| Economic opportunity | Jobs/livelihoods-style demands when labeled Other or Education/skills |
| Environment & resilience | Environment, flood/drainage language under Water or Other |
| Safety & public institutions | Security, Justice |
| Local development | Local government services, community facilities under Other |

Exact IDs live in code; do not invent new public duty labels without founder approval and i18n parity.

## Limitations

1. Frequency of a duty ≠ national priority ranking.
2. "Other" is a legitimate bucket, not failure.
3. Future AI-assisted suggestion may draft a suggested family for **operators only**; public surfaces keep the published duty string.
4. Geographic hierarchy (State → LGA) is independent of duty taxonomy.

## Safe language for public Intelligence

- "Among published records tagged Health…"
- Not: "Nigerians prioritize Health above all else."
