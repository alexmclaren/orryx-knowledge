---
name: bmad-planning
description: BMAD planning workflow (Brief, Model, Architect, Develop). Triggers on greenfield feature work, product discovery, or "let's design X". Produces a PRD and Tech Spec before any implementation. Pattern adopted by Pillarworks from bmad-code-org; promoted to Orryx cross-cutting.
version: 0.1.0
license: MIT
---

# bmad-planning

## TL;DR

Four-phase planning before code: **Brief** (problem + audience + outcome), **Model** (data + flows + integrations), **Architect** (components + deployment + tradeoffs), **Develop** (sprint plan + acceptance criteria). Output: a PRD + Tech Spec the team aligns on before anyone writes a line of code. Reduces "we built the wrong thing" rework.

## When to use

- Greenfield feature (no existing implementation)
- Feature touching multiple repos or entities
- Feature with non-trivial data model changes
- Anything pitched to stakeholders before build

When NOT to use:
- Bug fixes
- Refactors of existing code (use spec-driven-delivery instead)
- Single-file changes
- Routine operational work

## Phases

### 1. BRIEF (the problem)

Answers:
- **Problem statement** — one paragraph, in the user's words if possible
- **Audience** — who experiences this problem? Personas with concrete examples
- **Outcome** — what's different after we ship this? Behavioural change, business metric, etc.
- **Out of scope** — what we're explicitly NOT solving (set expectation early)

Output: 1-page PRD section.

### 2. MODEL (the data and flow)

Answers:
- **Data model** — entities + relationships (ERD-shaped)
- **User flow** — happy path step by step
- **Integration points** — external systems touched (MCP servers, APIs, databases)
- **Edge cases** — known ambiguities; how each is resolved

Output: ERD + flow diagram + integration list.

### 3. ARCHITECT (the structure)

Answers:
- **Components** — services / modules / agents involved
- **Deployment** — where each component lives (which AWS account, which region, which repo)
- **Tradeoffs** — alternatives considered + why we chose this one
- **Risks** — what could go wrong + mitigation

Output: architecture diagram + ADR (Architecture Decision Record).

### 4. DEVELOP (the plan)

Answers:
- **Sprint plan** — phased delivery, what ships in each sprint
- **Acceptance criteria** — testable definitions of "done"
- **Dependencies** — which Wave / which other plugin / which external team
- **Estimated effort** — per phase

Output: TodoWrite task list + sprint markdown.

## Outputs

By end of BMAD planning:

| File | Lives in |
|---|---|
| `<feature>-prd.md` | `docs/specs/` or `prompts/` |
| `<feature>-tech-spec.md` | `docs/architecture/` |
| `<feature>-adr-NNN.md` | `decisions/` |
| `<feature>-sprint-plan.md` | repo root or `docs/sprints/` |

## Why this works

BMAD is a forcing function for "alignment before code." Cheap to align on a 1-page Brief; expensive to realign after 2 sprints of code. Pillarworks adopted it from bmad-code-org and reports significant rework reduction.

## Anti-patterns

- **Skipping Brief** because "the problem is obvious." It's not, until you write it down.
- **Skipping Architect** because "we'll figure it out as we go." Tradeoffs unexplored become regrets.
- **BMAD for everything.** Bug fixes don't need this. Refactors don't either.
- **Single-author BMAD.** The point is alignment. If you draft + ship without anyone else reading, you've done expensive solo work.

## See also

- bmad-code-org — the original methodology
- Pillarworks's `bmad-planning` SKILL — the Orryx Group adaptation
- `methodology/spec-driven-delivery` — for refactors / non-greenfield work
- `methodology/plan-and-execute` — for tactical execution within BMAD's Develop phase
