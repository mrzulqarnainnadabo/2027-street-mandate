# Admin email on new mandate (Resend)

After a citizen successfully creates a **New** mandate, the API may send a best-effort email to the founder/operator.

## Env (Vercel)

- `RESEND_API_KEY` — required for send
- `RESEND_FROM_EMAIL` — verified sender in Resend
- `FOUNDER_NOTIFY_EMAIL` — optional; defaults to iseycglobal@gmail.com in code if unset

## Behaviour

- Email failure **must not** fail the citizen submit (HTTP still 200 with mandate id).
- Subject/body stay non-partisan; include duty, state, and a short demand excerpt only.
- Never put private demographics in the email body beyond what operators already see in Notion.
