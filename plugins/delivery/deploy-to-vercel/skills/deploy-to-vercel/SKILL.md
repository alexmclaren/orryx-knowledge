---
name: deploy-to-vercel
description: Vercel deployment workflow. Triggers on "deploy to Vercel", "preview deploy", "promote to production". Lifted from Directors Portal extract; entity-agnostic.
version: 0.1.0
license: MIT
---

# deploy-to-vercel

## TL;DR

Deploy a Next.js / Vite project to Vercel. Preview deploys per branch; production on main merge. Env vars + secrets through Vercel dashboard + AWS Secrets Manager (per D:\Secrets\README.md).

## Workflow

1. Pre-flight: run delivery/deploy-check (tests green, no secrets in diff)
2. Verify Vercel project exists: vercel link
3. Verify env vars are configured: vercel env ls
4. Preview: vercel (deploys to preview URL)
5. Production: merge to main; Vercel auto-deploys (if configured) or vercel --prod
6. Post-deploy: hit /health, run smoke test

## See also

- delivery/deploy-check
- delivery/vercel-composition-patterns
