---
name: vercel-react-native-skills
description: Vercel + React Native cross-platform patterns. Lifted from Directors Portal extract.
version: 0.1.0
license: MIT
---

# vercel-react-native-skills

## TL;DR

When the same brand has a Vercel web app + React Native mobile app: shared component patterns, shared data layer, navigation differences, deployment coordination.

## Workflow

1. Identify shared: tokens (colours, spacing), domain logic, API client
2. Identify diverged: navigation (web router vs RN navigation), platform-specific UI
3. Use a monorepo with shared packages if scope justifies
4. Deploy web (Vercel) and mobile (EAS / TestFlight / Play Console) on independent cadences
5. Coordinate version bumps via shared API contract version

## See also

- delivery/deploy-to-vercel
- delivery/web-design-guidelines
