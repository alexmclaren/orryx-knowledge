---
name: spec-driven-delivery
description: Spec-driven delivery pipeline (brainstorming -> spec -> plan -> exec -> review). Triggers on substantial features, refactors, or anything that needs alignment before code. Merges Triora sprint workflows, Pillarworks SPRINT pattern, crash-repair-template architecture/decisions, and reality-check Spec ST-001 (acceptance-criteria-first). Distinct from bmad-planning (which is for greenfield).
version: 0.1.0
license: MIT
---

# spec-driven-delivery

## TL;DR

Five phases: BRAINSTORM (explore the problem), SPEC (write down the contract), PLAN (decompose into steps), EXEC (build per plan), REVIEW (verify against spec). The spec is the source of truth — every later phase references it.

Use this for substantive work that isn't greenfield (greenfield → use `bmad-planning` instead).

## Phase 1 — BRAINSTORM

Goal: explore the solution space before locking in.

Activities:
- What is the actual user problem? (often different from the literal ask)
- What approaches could solve it?
- What are the tradeoffs of each?
- Which approach are we committing to + why?

Output: a brainstorm doc (`brainstorm.md` or in chat). Short — under 1 page. Decision recorded.

## Phase 2 — SPEC

Goal: write down the contract before building.

Spec template:

```markdown
# Spec: <feature name>

**ID:** <project>-<NNN>  (e.g., TRI-181, PW-S38, BRAIN-S28)
**Owner:** <person>
**Status:** draft | active | shipped | sunset
**Version:** 0.1.0

## Problem

(2-3 sentences in the user's words)

## Acceptance criteria

1. (testable assertion)
2. (testable assertion)
3. (testable assertion)

## Out of scope

(explicit non-goals)

## Constraints

- Compliance: PHI / GDPR / SOC2 / none
- Performance: <if any>
- Compatibility: <if any>

## Implementation notes

(short — link to the plan in TodoWrite or sprint doc for detail)

## Verification

(how we verify each acceptance criterion — manual / automated test / production check)
```

This is the contract. Subsequent phases reference it.

## Phase 3 — PLAN

Goal: decompose the spec into ordered, sized steps.

Use TodoWrite. Each step:
- **What** (one sentence)
- **Acceptance** (which spec criterion does this cover)
- **Done-when** (concrete verification)

Plan covers the whole spec before any step starts. Use `methodology/plan-and-execute` for the discipline.

## Phase 4 — EXEC

Goal: build per plan.

- Follow `methodology/plan-and-execute` cadence (plan → execute → checkpoint → reflect)
- For new functionality: `methodology/tdd-discipline` (red-green-refactor)
- For bugs surfaced during exec: `methodology/systematic-debugging`

## Phase 5 — REVIEW

Goal: verify against spec.

- Walk each acceptance criterion from phase 2; confirm pass/fail
- Run `methodology/code-review` for the diff
- For high-risk code: trigger Stage 2 (opus security-reviewer)
- Optional: `foundation/cross-model-verification` for regex / async / migrations

Output: spec marked `shipped`, optionally with a reflections section ("what we learned, what we'd do differently").

## When to use this vs bmad-planning

| Situation | Use |
|---|---|
| Greenfield feature, no existing code | `bmad-planning` (4-phase Brief/Model/Architect/Develop) |
| Substantial feature in existing code | `spec-driven-delivery` (this skill) |
| Refactor of existing module | `spec-driven-delivery` |
| Production bug fix | `methodology/systematic-debugging` |
| Tactical single-step task | None — just do it |

## Cross-product spec coordination

For specs that touch multiple Orryx Group entities (Triora + Pillarworks + Brain): the spec lives in `orryx-knowledge/specs/cross-product/<spec-id>.md`. Each affected entity's repo has a link back to the canonical spec, not a copy.

For single-entity specs: lives in the entity's repo under `docs/specs/` or `prompts/`.

## Why spec-driven works

Spec is the single source of truth. Phase 3 (plan) references phase 2 (spec). Phase 4 (exec) references phase 3 (plan). Phase 5 (review) references phase 2 (spec). A spec change requires re-running phases 3-5 for affected scope; that's the cost of mid-flight scope change made visible.

Without a written spec: "what we're building" drifts during exec, review can't verify ("verify against what?"), and "done" becomes subjective.

## Sources merged

| Source | Contribution |
|---|---|
| Triora sprint workflows (Sprint 181 active) | Sprint-shaped 5-phase cadence |
| Pillarworks SPRINT_*.md pattern | Per-sprint spec docs |
| crash-repair-template `architecture/{decisions,schemas}/` | ADR + schema-as-spec pattern |
| reality-check Spec ST-001 v0.1 | Acceptance-criteria-first framing |

## See also

- `methodology/bmad-planning` — for greenfield work (use that instead)
- `methodology/plan-and-execute` — used inside Phase 3+4 for execution discipline
- `methodology/tdd-discipline` — used inside Phase 4 for new functionality
- `methodology/code-review` — used inside Phase 5
- `delivery/sprint-plan` (Wave 4) — for the sprint-shaped wrapper around specs
