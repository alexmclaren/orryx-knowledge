---
name: 3-lane-parallel
description: Three-lane parallel execution pattern for the Orryx Group (Brain + Triora + Pillarworks lanes coordinated by SYNC_STATE + CONTROL_STATE). Triggers on cross-product Sprint planning, "what should each product team do this sprint", "coordinate the lanes", or "/3-lane-parallel". Originally Brain Sprint 28 pattern; promoted to cross-cutting.
version: 0.1.0
license: MIT
---

# 3-lane-parallel

## TL;DR

The Orryx Group runs three product lanes in parallel — **Brain**, **Triora**, **Pillarworks** — each with its own sprint cadence but coordinated via shared state. This skill defines the coordination model: state files, sync cadence, blockers protocol, sprint boundary alignment.

Originated in Brain Sprint 28 (active at audit time); promoted to cross-cutting in Wave 3.

## The lanes

| Lane | Product | Status (2026-05-12) |
|---|---|---|
| 1 | Brain | Sprint 28 MVP launch |
| 2 | Triora | Sprint 181, Phase 4 production |
| 3 | Pillarworks | Pre-launch MVP |

Future lanes (not yet 3-lane-parallel):

- Flow (pre-MVP)
- crash-repair-template (research / template)

## Coordination state

### `orchestration/SYNC_STATE.md` (read by all lanes at session start)

Format:

```markdown
# SYNC_STATE — Sprint <N>, <YYYY-MM-DD>

## Lane 1 — Brain
- Sprint: 28
- Phase: MVP launch
- Active streams: Bold-Hero-Section integration, Directors Backend
- Blocked-on: <none / specific dependency>
- Next checkpoint: <date>

## Lane 2 — Triora
- Sprint: 181
- Phase: 4 production
- Active streams: <whatever>
- Blocked-on: <none / specific dependency>
- Next checkpoint: <date>

## Lane 3 — Pillarworks
- Sprint: 38 (example)
- Phase: pre-launch MVP
- Active streams: <whatever>
- Blocked-on: <none / specific dependency>
- Next checkpoint: <date>

## Cross-lane dependencies
- <dep>: <which lane needs from which lane>
```

Updated daily by each lane's primary agent. Read by every product session at startup (per Pillarworks's current pattern).

### `orchestration/CONTROL_STATE.md` (operational reality)

Format:

```markdown
# CONTROL_STATE — <YYYY-MM-DD HH:MM>

## Production health
- Brain (orryx.dev / directors.orryx.dev / api.orryx.dev / mcp.orryx.dev): <green/yellow/red>
- Triora (triora.io / api.triora.io): <green/yellow/red>
- Pillarworks (build.orryx.dev): <green/yellow/red>

## Active deploys
- <lane>: <deploy status>

## Active incidents
- <none / list with owner + severity>

## MCP gateway state
- mcp.orryx.dev: <green/yellow/red>
- Registered MCPs: <count> (target: 11+)
```

Updated by automation (reality-check + gateway health probes). Read at the start of any cross-lane decision.

## Sprint boundary alignment

Lanes have different sprint lengths (Brain: 2-week; Triora: 2-week; Pillarworks: 1-week historically). 3-lane-parallel **doesn't require aligned sprints**. It requires:

1. **Every lane updates SYNC_STATE.md daily** (no matter where in their sprint cycle they are)
2. **Cross-lane dependencies are explicit** — if Lane B needs something from Lane A, it's named in SYNC_STATE.md with a deadline
3. **Weekly cross-lane sync** — 30 min or less. Lead from each lane confirms / updates.

## Cross-lane dependencies

Common patterns:

| Dependency | Resolution |
|---|---|
| Pillarworks needs orryx-mcp-gateway endpoint X | Brain's Lane 1 work to revive + extend gateway |
| Triora needs healthcare-context to be promoted to cross-cutting | Lane 2 doesn't block — promotion happens in Wave 5 |
| Brain needs Directors Portal extracted to its own repo | Wave 0 task — already in human runbook |
| Any lane needs a new service-domain MCP | Lane 1 (Brain) prioritises the gateway + per-domain MCP build per Wave 6 |

## Brain Sprint 28 pattern (the original)

Brain's CLAUDE.md framed Sprint 28 as "3-Lane Parallel (Brain + Triora + Pillarworks)" with:

- Bold-Hero-Section Landing integration (Lane 1)
- Directors Backend integration (Lane 1)
- Cross-lane coordination via `orchestration/{SYNC_STATE,CONTROL_STATE}.md`

This skill captures that pattern as a reusable cross-cutting orchestration primitive.

## When to add a lane

Add a 4th, 5th lane when:

- A new product reaches MVP (e.g., Flow → Lane 4)
- A vertical template gets its first instance deployment (e.g., crash-repair → Lane 5)
- An existing lane bifurcates (rare; consider sub-lanes within the existing lane first)

Don't add a lane for:

- Internal infrastructure work (that's not product delivery; lives in orryx-mcp-gateway / orryx-knowledge / etc.)
- Spike / research work (CPD-protocol research streams instead)

## Anti-patterns

- **SYNC_STATE drift.** If only one lane updates it daily, the file becomes lies. Each lane must update or remove their section.
- **Synchronous everything.** Don't force lanes to align sprint boundaries — coordination is via state, not via clock.
- **Cross-lane direct file reads.** Lane B should not read Lane A's source files. Cross-lane communication via SYNC_STATE.md, the gateway, or explicit MCP calls.
- **Lane manager bloat.** This skill describes a coordination protocol, not an org structure. Don't create a "Lane Manager" role; the primary agent in each lane self-coordinates via SYNC_STATE.

## See also

- `orchestration/service-domain-map` — which MCPs serve which lanes
- `orchestration/cpd-protocol` — for parallel streams within a single lane
- `orchestration/agent-swarming` — for multi-agent work within a single lane
- `orryx-brain/orchestration/SYNC_STATE.md` — current operational state
- `orryx-brain/orchestration/CONTROL_STATE.md` — current production health
