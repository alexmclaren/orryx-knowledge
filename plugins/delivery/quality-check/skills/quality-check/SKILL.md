---
name: quality-check
description: Run lint + type-check + test suite + coverage report. Triggers on /quality-check, "run quality gates", "ready for review". Merges Triora quality-check + Pillarworks quality-gate agent.
version: 0.1.0
license: MIT
---

# quality-check

## TL;DR

Run the full quality gate stack: lint, type-check, tests, coverage. Output: pass/fail per gate + actionable issues. Used by Ralph Loop, pre-commit hooks, deploy-check.

## Workflow

1. Detect stack: package.json (Node), pyproject.toml (Python), Cargo.toml (Rust), go.mod (Go)
2. Run lint: eslint / ruff / clippy / golangci-lint
3. Run type-check: tsc / mypy / cargo check / go vet
4. Run tests: vitest / pytest / cargo test / go test (with coverage)
5. Check coverage against repo standard (>80% per D:\orryx-standards\README.md)
6. Output: per-gate pass/fail + summary

## See also

- methodology/code-review
- methodology/tdd-discipline
- delivery/deploy-check
- orchestration/ralph-loop
