---
name: deploy-check
description: Pre-deploy verification. Triggers on /deploy-check, "ready to ship", "verify before deploy". Merges Brain + Triora + Pillarworks ops-auto patterns.
version: 0.1.0
license: MIT
---

# deploy-check

## TL;DR

Pre-deploy gate: tests green, no leaked secrets in the diff, no skipped migrations, env vars set, CI passing. Output: ship / hold + checklist.

## Workflow

1. Run delivery/quality-check (lint + typecheck + tests + coverage)
2. Run delivery/credential-audit on the diff
3. Run delivery/security-audit on the diff
4. Verify CI status (gh pr checks)
5. Verify migrations: all listed in CHANGELOG, none skipped
6. Verify env vars: any new vars documented in .env.example
7. Output: SHIP / HOLD + reason

## See also

- delivery/quality-check
- delivery/credential-audit
- delivery/security-audit
