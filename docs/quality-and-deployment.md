# ISEYC 2027 Civic Mandate — Quality and Deployment Note

## Audit summary

The product’s strongest qualities are its non-partisan civic framing, published-only public wall, server-side Notion integration, mobile-first form, private demographic fields, and honest unavailable-state handling in the current source branch. The most important quality risk was data-state integrity: a malformed or stale pulse response could be interpreted by the browser as a valid zero-demand result. A second risk was option drift between the form constants and the verified live Notion schema.

## Implemented hardening

This branch aligns age bands and gender values with the live Notion schema, validates optional age, gender, LGA, and device-reference inputs on the server, rejects malformed pulse payloads in both home-page and Civic Pulse clients, and disables route caching for the pulse endpoint so temporary service failures are not cached as empty civic data. It also carries the separately reviewed first-action, documentation, and official-logo asset improvements.

The changes do not alter moderation status, response-tracking fields, public/private boundaries, or the Notion write surface.

## Deployment options

| Option | Fit | Assessment |
|---|---|---|
| Vercel | Native Next.js fit | Currently blocked by the observed 403 permission issue and exhausted deployment capacity. Do not repeatedly retry. |
| Netlify | Strong fit | Official Netlify documentation states that its OpenNext adapter supports Next.js App Router, SSR, route handlers/API routes, and environment variables. Connecting this GitHub repository in the Netlify dashboard is the lowest-friction persistent alternative. |
| Cloudflare Workers | Possible | Cloudflare’s current recommended path is vinext, which is beta and requires a compatibility check and migration configuration. Not the lowest-risk immediate deployment for this existing app. |
| GitHub Pages | Not suitable | Static hosting cannot safely run the Next.js route handlers that submit to Notion, and it must not receive private Notion credentials. |
| Temporary sandbox URL | Useful for review only | Fast for visual QA, but not persistent production hosting and must not be treated as the public civic service. |

## Recommended deployment path

Use **Netlify connected to the existing GitHub repository**. Set `NOTION_TOKEN` and `NOTION_DATABASE_ID` as server-side production environment variables in Netlify, use the repository’s standard build command (`npm run build`), and verify `/api/pulse` returns either a real published dataset or an explicit 503 unavailable response. Do not put either Notion value in `NEXT_PUBLIC_*` variables or in browser code.

The current session has no Netlify connector or authenticated Netlify CLI, so the persistent external deployment cannot be completed from this session without a Netlify account connection. The repository remains deployment-ready and the deployment path is documented here.

## Exactly one next step

Connect the repository to Netlify, add the two server-side Notion environment variables, deploy the review branch, and test `/`, `/api/pulse`, `/api/submit`, `/about`, `/brief`, and `/status/:id` before assigning a public domain.
