---
name: credential-audit
description: Scans repos for committed secrets, expired API keys, hardcoded credentials. Triggers on /credential-audit, "audit my secrets", "check for leaked keys". Promoted from Brain slash command.
version: 0.1.0
license: MIT
---

# credential-audit

## TL;DR

Scan the working tree + git history for secret patterns. Output: list of findings with severity. Does NOT auto-rotate or commit changes — surfaces findings for human action.

## Workflow

1. Run truffleHog or gitleaks against working tree + last 100 commits
2. Cross-reference findings against D:\orryx-standards\gitignore-snippets\secrets.gitignore patterns
3. Report findings: file:line + pattern matched + severity (low/medium/high/critical)
4. For each high/critical: recommend rotation source (Magic Patterns dashboard / AWS IAM / etc.)
5. Suggest .gitignore additions if patterns are not covered yet
6. Do NOT commit changes — output a runbook for the human

## See also

- foundation/safety-hooks-base
- D:\orryx-audit\WAVE-0-HUMAN-RUNBOOK.md
- delivery/security-audit
