---
name: vercel-composition-patterns
description: Vercel composition patterns. Triggers on architecture questions for Vercel-hosted apps. Lifted from Directors Portal extract; entity-agnostic.
version: 0.1.0
license: MIT
---

# vercel-composition-patterns

## TL;DR

Patterns for Vercel-hosted apps: multi-tenant routing, env scoping per branch, edge function placement, RSC vs client component boundary. Reference for Orryx Group websites and dashboards.

## Workflow

1. Identify what you are building: marketing site / dashboard / multi-tenant SaaS
2. Routing: app router (preferred for new work); per-tenant via dynamic segments or rewrites
3. Env scoping: production / preview / development; secrets in Vercel + AWS Secrets Manager
4. RSC vs client: default to RSC; opt into client only for interactivity
5. Edge vs serverless: edge for latency-sensitive reads; serverless for writes / DB calls
6. Compose: thin pages, thick components, thinnest API routes

## See also

- delivery/deploy-to-vercel
- delivery/vercel-react-best-practices
