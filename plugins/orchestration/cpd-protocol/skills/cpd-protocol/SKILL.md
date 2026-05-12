---
name: cpd-protocol
description: Continuous Parallel Development (CPD) protocol with 5 parallel work streams (Research, Discovery, Planning, Development, Review). Triggers on Sprint planning, "run in parallel", "parallelise the work", or "what should each lane do". Defines mandatory parallel agents per sprint start, execution patterns, and research queue management. Lifted from Triora.
version: 0.1.0
license: MIT
---

# Continuous Parallel Development (CPD) Protocol

**Principle:** Always maintain parallel streams of work — never wait idle when background tasks can advance the project.

Originally Triora's; promoted to cross-cutting in Wave 3 of the architecture migration.

## Parallel Stream Categories

| Stream | Purpose | Trigger |
|---|---|---|
| Research | Deep dive into upcoming requirements | Start of each sprint |
| Discovery | Explore unknowns, edge cases, risks | When blockers identified |
| Planning | Plan future sprints (N+1, N+2) | Mid-sprint checkpoint |
| Development | Core implementation work | Primary focus |
| Review | Automated QA and compliance checks | After implementation |

## Mandatory Parallel Agents

At **sprint start**, launch background agents for:

1. Sprint N+1 research
2. Regulatory / compliance updates (per the entity's compliance profile in `orryx-governance/`)
3. Edge case discovery

These run independently of the primary delivery stream. They feed inputs into the next sprint's planning.

## CPD Execution Pattern

**Session Start:**

1. Review `SESSION_STATE.md` (or equivalent — the persistent state for the workspace)
2. Launch parallel agents (research / discovery / planning)
3. Execute primary tasks (development stream)
4. Synthesise research outputs into actionable items

**Session End:**

1. Update `SESSION_STATE.md`
2. Queue pending research items for the next session
3. Mark active stream status (continuing / blocked / shipped)

## Research Queue

Maintain backlog in `docs/research/Research_Queue.md` (or `research/queue.md` — pick a convention per repo) with:

- **Active** — currently being investigated by a background agent
- **Queued** — pending, with priority
- **Completed** — synthesised output linked

## Sprint Planning Integration

At sprint N midpoint, auto-plan sprint N+1 using:

- Research stream outputs from the parallel-Research agent
- Current sprint learnings (what's working / not)
- Stakeholder feedback gathered during sprint N
- Tech debt accumulated

Use `methodology/spec-driven-delivery` to convert these inputs into specs for sprint N+1.

## Discovery & Synthesis

Launch discovery agents for:

- External APIs (changes, deprecations)
- Compliance changes (regulatory updates)
- Performance issues (production observability)
- Security vulnerabilities (CVE feed, dependency audits)
- User feedback

Synthesise outputs into actionable sprint backlog items via `delivery/sprint-plan` (Wave 4).

## CPD in cross-product context

For the Orryx Group's 3-Lane Parallel pattern (Brain + Triora + Pillarworks), CPD applies per-lane:

- Each lane has its own Research / Discovery / Planning / Development / Review streams
- `orchestration/3-lane-parallel` coordinates across lanes via `orchestration/SYNC_STATE.md`
- Cross-lane dependencies surfaced via `orchestration/service-domain-map`

## Anti-patterns

- **CPD without a research queue.** Background agents produce output; if nothing reads it, that's wasted compute.
- **CPD without session-state persistence.** Without SESSION_STATE, each session re-investigates what the last one already learned.
- **Parallel streams stomping each other.** Per `orchestration/agent-swarming` Branch Isolation Rule, parallel agents on separate branches only.

## See also

- `orchestration/agent-swarming` — multi-agent collaboration patterns (this is where the parallel agents come from)
- `orchestration/3-lane-parallel` — cross-product CPD coordination
- `methodology/spec-driven-delivery` — where research outputs become specs
- `methodology/bmad-planning` — for greenfield where CPD doesn't yet have a sprint shape
- Triora original: `D:\Clinical.Trials\.claude\skills\cpd-protocol\SKILL.md`
