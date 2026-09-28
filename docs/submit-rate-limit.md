# Submit rate limit

**Status:** Implemented (in-memory per server instance)

- Key: `submit:{ip}:{deviceIdPrefix}`
- Limit: **8 validated attempts / 15 minutes** per key (invalid form payloads do not consume quota)
- Response: HTTP 429 + `Retry-After` + calm citizen message
- Drafts remain client-side (not written to Notion when limited)

## IP trust model

On **Vercel production**, prefer:

1. `x-vercel-forwarded-for` (platform-controlled)
2. `x-real-ip`
3. first hop of `x-forwarded-for`

Do not treat arbitrary client-supplied forwarded lists as authoritative outside a trusted edge.

## Limitations

- Serverless instances do **not** share memory → not a global distributed quota.
- Upgrade path if abuse scales: Upstash Redis / Vercel KV.
- Does **not** block legitimate multi-citizen field days (different phones / IPs).
- `deviceId` is only used as a soft key fragment; it is not returned in API responses and is not a public identity.

## Privacy

Rate-limit keys are ephemeral process memory. They are not persisted to Notion or logs beyond normal request handling.
