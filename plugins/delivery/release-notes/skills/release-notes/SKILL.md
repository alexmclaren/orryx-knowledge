---
name: release-notes
description: Generate user-facing release notes from a git range or PR list. Triggers on /release-notes, "what shipped this week", "draft a changelog". Promoted from Triora SKILL.
version: 0.1.0
license: MIT
---

# release-notes

## TL;DR

From a git range or PR list, generate user-facing release notes. Categorises into Added / Changed / Fixed / Deprecated / Security. Suitable for CHANGELOG.md or customer-facing email.

## Workflow

1. Identify range: git log <from>..<to> or list of PR numbers
2. Parse each commit / PR title + body for category + user-facing summary
3. Filter: skip internal refactors, chore-only commits (unless user-impact)
4. Group by category
5. Output: markdown ready for CHANGELOG.md + an email-friendly summary

## See also

- delivery/docs-pack
