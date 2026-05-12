---
name: code-review
description: Two-stage code review (sonnet then opus for high-risk) with skill + subagent + slash-command surfaces. Triggers on review requests, pre-merge checks, "review this PR / diff / branch", or as the final step of plan-and-execute. Merges Triora code-reviewer + merge-review, Pillarworks review SKILL + reviewer + quality-gate agents, and Brain /review command.
version: 0.1.0
license: MIT
---

# code-review

## TL;DR

Two-stage review: sonnet `code-reviewer` subagent scans for the common 80% (bugs, missing tests, style); opus `security-reviewer` subagent escalates for high-risk code (auth, crypto, regex, async, migrations). The user can invoke either explicitly via `/review`, or this skill triggers automatically after `plan-and-execute` finishes.

## Workflow

### Stage 1 — sonnet code-reviewer (always)

Invoke for every PR / diff / branch. Sonnet-tier subagent reads the diff, looks for:

- **Bugs:** wrong condition, off-by-one, missing null/undefined handling
- **Tests:** missing happy-path tests, missing edge-case tests, broken tests
- **Style:** inconsistent with existing patterns in the repo
- **Documentation:** public API changes without doc updates
- **Performance:** obvious O(n²) where O(n) is possible, N+1 query patterns
- **Compliance with `AGENTS.md` overrides** in the repo

Output: findings list with severity (info / low / medium / high).

### Stage 2 — opus security-reviewer (conditional)

Triggered when the diff touches:

- `auth/`, `crypto/`, `security/` directories
- Files with `migration` in the path
- Regex literals in committed code
- Async / Promise / concurrency primitives
- Input validation / sanitisation code

Opus-tier subagent goes deeper:

- Threat-model the change ("what could an attacker do?")
- Cross-model verification triggered? (per `foundation/cross-model-verification`)
- Compliance impact? (PHI, GDPR, SOX, PCI per repo's compliance profile)
- Rollback story?

Output: structured security findings + recommend "merge / merge-with-followup / block".

### Surfaces

| Surface | When to use |
|---|---|
| Skill (this file) | Triggers automatically after plan-and-execute or on review-shaped prompts |
| `/review` slash command | Explicit "review the current diff" request from user |
| `code-reviewer` subagent | Composable by other skills / agents |
| `security-reviewer` subagent | Stage 2; opus-tier; high-stakes |

## Output format

```markdown
## Review summary

**Verdict:** merge / merge-with-followup / block

### High
- (none) / 1+ findings

### Medium
- 1+ findings

### Low / info
- 1+ findings

### Tests
- Coverage delta: +N / -N tests
- Missing: <specific test the reviewer thinks is missing>

### Security (if Stage 2 ran)
- Threat model summary
- Cross-model verification: pass / fail
- Compliance impact: <PHI / GDPR / SOX / PCI / none>
```

## How findings turn into action

- **High** → block merge. Author addresses, re-review.
- **Medium** → author acknowledges in PR description. Address or document why not.
- **Low / info** → optional. Worth doing if cheap; otherwise let it land.
- **Tests missing** → author writes them, re-review.

## Anti-patterns

- **Sonnet-only review of high-risk code.** Sonnet misses subtle security issues; that's why Stage 2 exists.
- **Opus review of trivial diffs.** Cost runs away; sonnet is enough for routine work.
- **Findings without context.** "Bug on line 42" is useless. "Bug on line 42: condition `x === null` should be `x == null` to also catch undefined" is actionable.
- **Reviewing your own code with no plan.** Self-reviews are valuable but should explicitly use the subagent (which has fresh context) rather than the original author's brain.

## Triora pattern reference

Triora's mature pattern:
- `code-reviewer` subagent (sonnet, `permissionMode: plan`)
- `security-reviewer` subagent (opus, `permissionMode: plan`)
- `merge-review` SKILL (slash-command style; triggered explicitly)
- Hooks: PostToolUse on Edit suggests running `/review` for affected files

## See also

- `foundation/model-tiering-convention` — for the sonnet vs opus decision
- `foundation/cross-model-verification` — for the non-Claude verifier step
- `delivery/pr-investigate` — for cross-PR investigations (Wave 4)
- `delivery/quality-check` — for the test/lint/typecheck batch (Wave 4)
- `references/triora-reviewer-prompts.md` — Triora's reviewer subagent system prompts (canonical)
