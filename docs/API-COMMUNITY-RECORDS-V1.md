# CommunityRecord API v0.1

`GET /api/v1/community-records`

Versioned, read-only, **published-only** public interface aligned with Observatory `community-record.v0.1`.

## Query parameters

| Param | Notes |
|-------|--------|
| page | default 1 |
| pageSize | default 20, max 50 |
| state | exact match, case-insensitive |
| lga | exact match, case-insensitive |
| duty | exact match, case-insensitive |
| sector | reserved; currently always null on records — filter yields empty until sector is stored |
| since / until | ISO prefix compare on `createdAt` |

## Does not replace

`GET /api/pulse` — unchanged allowlist contract for existing consumers.

## Privacy

Allowlist mapping only. No Age Band, Gender, Device Fingerprint, contacts, or response-tracking fields.

## Semantics

- `verificationStatus` is `unverified` unless a future human verification artefact exists.
- Counts are published records only — not national need.
