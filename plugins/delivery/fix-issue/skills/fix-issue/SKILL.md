---
name: fix-issue
description: Issue-to-PR workflow. Triggers on /fix-issue, "fix bug #N", "address this Sentry alert". Promoted from Triora SKILL.
version: 0.1.0
license: MIT
---

# fix-issue

## TL;DR

Take an issue (GitHub issue, Sentry alert, support ticket) all the way to a merged PR. Reproduce, write regression test, fix, verify, PR with linked issue.

## Workflow

1. Read the issue: reproduce the bug locally using methodology/systematic-debugging
2. Write a failing test (regression guard) - red
3. Fix the bug with minimum code change - green
4. Run full test suite, run delivery/quality-check
5. Open PR with: clear title, link to issue, repro steps, what changed, verification done
6. Run delivery/deploy-check before merge

## See also

- methodology/systematic-debugging
- methodology/tdd-discipline
- delivery/deploy-check
