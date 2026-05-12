---
name: plan-mode-first
description: Plan-mode-first discipline for non-trivial work. Triggers at the start of any task that modifies code, infrastructure, or shared docs. Defines when plan mode is mandatory, what counts as exempt (trivial reads, doc fixes, emergency hotfixes), and how autonomous-within-plan operation works. Harmonised from Triora, Pillarworks, and Orryx Brain Section 0 patterns.
version: 0.1.0
license: MIT
---

# plan-mode-first

## TL;DR

Plan first for non-trivial work. Once a plan is approved (or autonomous-mode allows continuation), operate autonomously within that plan. Re-enter plan mode at the next decision point. Pattern lifted from Triora CLAUDE.md Section 0 + Pillarworks claude.md Section 0 "Perpetual Improvement System" + Brain CLAUDE.md Section 0, harmonised in Wave 1 of the architecture migration.

## When plan mode is MANDATORY

- Modifying source code beyond a single-line fix
- Changing infrastructure (Terraform, Kubernetes, AWS resources)
- Modifying shared docs (AGENTS.md, CLAUDE.md, ASSET_INDEX.md, marketplace.json)
- Touching database schemas or migrations
- Deleting files
- Cross-product changes (touches more than one entity's code)
- Anything labeled "production"

## When plan mode is EXEMPT

- Single-file reads
- Documentation updates under 50 lines
- Direct answers to questions ("what does this function do?")
- Generating examples / code snippets that won't be committed
- Emergency hotfixes **with explicit user approval to skip plan**

## The plan-mode contract

A plan must answer 4 questions:

1. **What is the user trying to accomplish?** (the goal, not the literal request)
2. **What's the current state?** (verified, not assumed — "production reality > assumptions")
3. **What will change?** (files, infrastructure, behaviour)
4. **What does success look like?** (acceptance criteria; how we verify)

Optionally:
5. **What could go wrong?** (risks + mitigations)
6. **What's the rollback?** (if shipped + needs revert)

## Plan format

Use TodoWrite for multi-step plans (3+ tasks). For shorter plans, a numbered list in chat is fine.

## Autonomous-within-plan

Once the plan is approved (explicitly by user OR autonomously per repo's `.claude/settings.json` autonomy level):

- Execute steps in order
- Don't ask permission for each step (defeats the point)
- DO ask if you hit a decision the plan didn't cover
- DO stop and re-plan if reality diverges (e.g., file doesn't exist, test fails unexpectedly)

## The 3 Section-0 patterns harmonised

| Source | Key contribution |
|---|---|
| Triora CLAUDE.md | "Production reality > assumptions" — verify against running system |
| Pillarworks claude.md | "Perpetual Improvement System" framing — every task improves the system |
| Brain CLAUDE.md | "Autonomous delivery default" — operate until blocked or done |

The harmonised pattern: **plan mode first to gain context + alignment; autonomous within plan; production reality as the source of truth.**

## Gotchas

- **Plan ≠ guess.** If you don't know enough to plan, the plan is "investigate X, Y, Z then plan". Investigation isn't optional.
- **Don't skip plan to look productive.** Jumping straight to code shows speed but produces rework. Slowing down at plan-time saves time at exec-time.
- **Re-plan when reality diverges.** If step 3 fails or returns unexpected data, return to plan mode. Don't bash through.

## See also

- TodoWrite tool — for multi-step plan tracking
- `references/triora-section-0.md` — Triora's original framing
- `references/pillarworks-section-0.md` — Pillarworks's framing
- `references/brain-section-0.md` — Brain's framing
- `D:\orryx-standards\CLAUDE.base.md` — references this skill for plan-mode contract
