---
name: refactor
description: Structured refactor workflow (test-first, smaller-steps, no behaviour change). Triggers on /refactor, "refactor this", "clean up X". Promoted from Triora SKILL.
version: 0.1.0
license: MIT
---

# refactor

## TL;DR

Refactor without behaviour change: characterise existing behaviour with tests first, refactor in small commits each kept green, no scope creep into "while we are here" features.

## Workflow

1. Identify scope: which module / function / class
2. Confirm existing test coverage; if gaps, add characterisation tests first (test-current-behaviour)
3. Run tests; all green
4. Refactor in the smallest possible steps. After each: tests green, commit
5. DO NOT add new features. DO NOT change observable behaviour. Just internal structure.
6. Final: run full test suite, run delivery/code-review, ship

## See also

- methodology/tdd-discipline
- methodology/code-review
- methodology/spec-driven-delivery
