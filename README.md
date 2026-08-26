# The 2027 Street Mandate — by ISEYC

Single-page non-partisan civic survey + live voice wall.

> Don't tell us who you'll vote for. Tell them what they must deliver.

## Environment

```
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=d46f6a3d47294c718519952b8497b911
```

Share the Notion database with your integration.

## Deploy

```bash
npx vercel
```

Add the two env vars, then `npx vercel --prod`.

## Moderation

All new voices land as Status = "New".  
Only change Status to "Published" in Notion for them to appear on the public wall.
