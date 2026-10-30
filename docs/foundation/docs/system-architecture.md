# System architecture — ISEYC Civic Intelligence (v1)

## Principle

Two independently deployable applications share **versioned contracts**, not a monorepo or a third production service (yet).

```
Civic Mandate (Next.js + Notion SoR)
  publish gate → public Pulse / public APIs
        ↓  PublicMandateRecord v1 (allowlist only)
Civic Brain (Vite + serverless)
  retrieve → cite → structured brief / chat
```

## Component ownership

| Component | System of record | Consumers |
|-----------|------------------|-----------|
| Community submissions & moderation | Mandate (Notion) | Mandate UI, operators |
| Published civic records | Mandate public API | Mandate UI, Brain |
| Geographic reference contract | Shared contract file (v1) | Both apps |
| Institutional responsibility | Shared contract + dual local registries until aligned | Both apps |
| Evidence metadata | Shared schema; Mandate submissions typed as `community_submission` | Brain primarily |
| Civic Brief | Brain response contract | Brain UI, future embeds |
| Accountability events | Mandate resolution tracker + Brain referral lifecycle (human-logged) | Operators |

## Non-negotiables

- Published-only on public surfaces
- No submitter PII on public APIs
- No candidate/party rankings or endorsements
- AI never invents statistics or marks issues resolved without evidence
- Routing is recommendation-only; no auto-contact of officials

## Integration versioning

Contracts use `schemaVersion: "1.0.0"`. Breaking changes require `2.0.0` and dual-read window.

## Deployment

- Mandate: Vercel project → 2027-street-mandate.vercel.app  
- Brain: Vercel project → iseyc-civic-brain.vercel.app  
- Foundation changes ship on feature branches; production only via approved merge.
