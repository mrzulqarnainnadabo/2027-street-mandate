# Admin email on new Civic Mandate submission

## Behaviour
After `submitVoice` succeeds, the API **best-effort** notifies internal admins.
Citizen API response is **not** failed if email fails.

## Provider
Resend HTTPS API.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Required | Purpose |
|----------|----------|--------|
| `RESEND_API_KEY` | Yes, to send | Resend API key |
| `RESEND_FROM_EMAIL` | Recommended | Verified sender |
| `ISEYC_NOTIFY_TO` | Optional | Comma-separated list; default uses iseycglobal@gmail.com |
| `FOUNDER_NOTIFY_EMAIL` | Optional | Extra founder inbox |

Never commit secret values.

## Content rules
- Reference ID, UTC timestamp, state, LGA, duty, office, short summary
- Status: New — Pending Human Review
- No device fingerprint, age, gender, or secrets
