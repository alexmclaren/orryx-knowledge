---
name: pr-investigate
description: Cross-PR root-cause investigation (opus tier). Triggers on /pr-investigate, "why did X break", "find when Y was introduced". Promoted from Triora SKILL.
version: 0.1.0
license: MIT
---

# pr-investigate

## TL;DR

Investigate a regression across multiple PRs / commits. Opus-tier subagent reads git history, bisects, identifies the introducing commit, suggests fix scope.

## Workflow

1. Identify the regression: when did it last work, when did it first fail
2. Bisect: git bisect start <bad-commit> <good-commit> if commits are sequential
3. Read each suspect commit + its PR description
4. Identify the introducing commit + the line/function/decision that introduced the regression
5. Recommend fix: revert / patch / restructure
6. Output: structured investigation doc

## See also

- methodology/systematic-debugging
- methodology/code-review
- foundation/model-tiering-convention
