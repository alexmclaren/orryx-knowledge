---
name: sync-docs
description: Sync local repo docs (README, CHANGELOG, ADRs) with canonical sources in orryx-knowledge / orryx-standards. Triggers on /sync-docs, "fix doc drift", "is my README current".
version: 0.1.0
license: MIT
---

# sync-docs

## TL;DR

Check that this repos thin-reference AGENTS.md / CLAUDE.md still match the canonical orryx-standards versions. Flag drift; suggest re-sync; do not auto-overwrite (per-repo overrides are intentional).

## Workflow

1. Read D:\orryx-standards\AGENTS.base.md + CLAUDE.base.md (canonical)
2. Read local repo AGENTS.md + CLAUDE.md
3. Diff: surface any non-pointer content (i.e., per-repo overrides)
4. Verify overrides are still intentional (not stale from a prior repo state)
5. Output: clean / drift-detected / overrides-confirmed

## See also

- D:\orryx-standards
- foundation/asset-index
