---
name: reality-check
description: Operational health audit (deps, CVEs, README staleness, secret leakage, dead-code heuristics). Triggers on /reality-check, "audit the repos", "check group health". Promoted from D:\Orryx\reality-check.
version: 0.1.0
license: MIT
---

# reality-check

## TL;DR

Daily/weekly operational health snapshot across the Orryx Group. Scans dependency CVEs, README staleness, OpenAPI schema drift, secret-pattern leakage, dead-code heuristics. Produces fingerprinted baselines + per-entity rollups.

## Workflow

1. Read D:\orryx-audit\raw\_entity-map.json for the scope (which repos to audit)
2. For each in-scope repo: produce a fingerprint per D:\Orryx\reality-check\baselines\<repo>.json schema
3. Diff against last baseline; flag what changed (regressions, new CVEs, stale READMEs)
4. Score per-repo: max(0, 100 - 10*critical - 5*high - 2*medium - 1*low)
5. Write reports/daily-reality-check.md (rolling) + archive previous to reports/archive/
6. If findings.sqlite is wired up: append; if GH-issue automation is wired: create issues

## See also

- D:\Orryx\reality-check
- orchestration/scheduled-execution
- delivery/security-audit
