# Submit rate limit

**Status:** Implemented (in-memory per server instance)

- Key: `submit:{ip}:{deviceIdPrefix}`
- Limit: 8 successful attempts per 15 minutes per key
- Response: HTTP 429 + `Retry-After` + calm citizen message
- Drafts remain client-side

**Limitation:** Serverless instances do not share memory. This reduces burst spam; it is not a global distributed quota. Upgrade path: Upstash Redis / Vercel KV if abuse appears at scale.

**Does not** block legitimate multi-citizen use from different IPs (e.g. field day with many phones).
