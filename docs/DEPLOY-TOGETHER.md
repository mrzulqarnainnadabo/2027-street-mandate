# Deploy Civic Mandate + Civic Brain together

Mirrored playbook: Civic Brain `docs/DEPLOY-TOGETHER.md`.

## This repo

- PR: https://github.com/mrzulqarnainnadabo/2027-street-mandate/pull/62
- Branch: `feat/pilot-trust-framing` → `main`
- Production: https://2027-street-mandate.vercel.app

## Companion

- PR: https://github.com/mrzulqarnainnadabo/iseyc-civic-brain/pull/6
- Branch: `feat/secure-evidence-grounded-brain` → `main`

## Merge order

1. Merge Mandate PR #62
2. Merge Brain PR #6
3. Deploy both from `main` when Vercel quota allows
4. Phone QA (pilot language + routing “not sent”)

## Do not

- Change production Notion secrets as part of this release
- Enable auto-messaging officials
- Claim national coverage beyond pilot published records
