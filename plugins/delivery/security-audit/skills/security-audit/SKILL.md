---
name: security-audit
description: Runs a security review of a branch / PR / diff. Triggers on /security-audit, "review for security", "is this safe to deploy". Combines opus security-reviewer subagent + Brain slash command pattern.
version: 0.1.0
license: MIT
---

# security-audit

## TL;DR

For a branch or diff: opus security-reviewer subagent threat-models the change, runs dependency vuln scan (npm audit / pip-audit / etc.), checks compliance profile per entity. Output: verdict (ship / ship-with-followup / block) + findings list.

## Workflow

1. Identify scope: branch name OR git diff range OR specific files
2. Run dependency vuln scan for the stack (npm audit, pip-audit, cargo audit)
3. Threat-model the diff (opus security-reviewer subagent invoked)
4. Cross-check against entity compliance profile in D:\orryx-governance\compliance\<entity>.md
5. Run delivery/credential-audit for any committed secrets in the diff
6. Output: verdict + structured findings

## See also

- methodology/code-review
- foundation/safety-hooks-base
- delivery/credential-audit
