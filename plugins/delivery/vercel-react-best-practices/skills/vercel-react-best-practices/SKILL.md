---
name: vercel-react-best-practices
description: React best practices in Vercel context (RSC, app router, suspense). Lifted from Directors Portal extract.
version: 0.1.0
license: MIT
---

# vercel-react-best-practices

## TL;DR

React best practices for Vercel-hosted apps: prefer RSC, use app router, suspense boundaries for async, error boundaries for resilience, avoid client-state for static data.

## Workflow

1. RSC by default; opt into client components only when needed (state, effects, browser APIs)
2. Use app router (not pages router) for new work
3. Wrap async UI in Suspense fallback boundaries
4. Wrap risky boundaries in ErrorBoundary
5. Avoid useState / useEffect for data that should be in URL or server state
6. Server actions for mutations; do not over-engineer with separate API routes

## See also

- delivery/vercel-composition-patterns
- delivery/web-design-guidelines
