---
name: persistent-memory-template
description: Persistent-agent template using the file-as-memory sextet (SOUL.md, IDENTITY.md, MEMORY.md, HEARTBEAT.md, USER.md, TOOLS.md). Triggers on "set up a persistent agent", "give this agent memory", "make this agent stateful", or any agent that needs to remember across sessions. Lifted from claw-memory; promoted in Wave 7.
version: 0.1.0
license: MIT
---

# persistent-memory-template

## TL;DR

Six markdown files at the agent's repo root encode the agent's persistent identity + memory:

- **SOUL.md** — what this agent is for (mission, values, immutable identity)
- **IDENTITY.md** — who this agent is (name, voice, persona, capabilities)
- **MEMORY.md** — what this agent remembers (facts, events, accumulated context)
- **HEARTBEAT.md** — when this agent last ran + what state it was in
- **USER.md** — what this agent knows about its primary user (you)
- **TOOLS.md** — what tools this agent has + how it uses them

Each is plain markdown. The agent reads all six at session start and updates the relevant ones as work proceeds.

Originally claw-memory's pattern; the canonical persistent-agent design in the Orryx Group.

## When to use

- A scheduled-execution agent that runs daily and needs continuity (e.g., reality-check)
- A long-running automation that needs to remember "where it left off" (e.g., inbox triage)
- A personal assistant agent that develops a relationship over time
- Any agent that crosses session boundaries

When NOT to use:
- Single-session tasks (no memory continuity needed)
- Pure functions (no state)
- Stateless MCP servers (use the domain-mcp-base instead)

## File templates

### SOUL.md

```markdown
# SOUL

The unchangeable core. This agent's reason to exist.

## Mission

(2-3 sentences. What this agent does for the user, fundamentally.)

## Values

- (immutable principle 1 — e.g., "never delete user data without explicit confirmation")
- (immutable principle 2)
- (immutable principle 3)

## What I am NOT

- (anti-mission 1 — what this agent should never become)
- (anti-mission 2)

---

> This file is read-only after initial setup. Edits are deliberate identity changes, not routine updates.
```

### IDENTITY.md

```markdown
# IDENTITY

How this agent presents to the user.

## Name

(agent's name)

## Voice

(tone, register, vocabulary preferences)

## Capabilities (current)

- (capability 1)
- (capability 2)

## Capabilities (planned)

- (capability 3)
```

### MEMORY.md

```markdown
# MEMORY

What this agent remembers. Updated by the agent over time.

## Long-term facts

- (fact that persists indefinitely — e.g., user's preferred timezone)

## Recent events

- YYYY-MM-DD: (event)
- YYYY-MM-DD: (event)

## Open threads

- (in-progress work, decisions awaiting input, etc.)

---

> Pruned periodically. See `agent` instructions for what gets kept vs archived.
```

### HEARTBEAT.md

```markdown
# HEARTBEAT

Last seen state. Updated at every session end.

## Last run

- Timestamp: YYYY-MM-DD HH:MM:SS TZ
- Status: completed / blocked / partial
- Duration: ~X minutes
- What was done: (1-2 sentences)
- Next checkpoint: (when this agent expects to run next)

## Pending work for next run

- (item 1)
- (item 2)
```

### USER.md

```markdown
# USER

What this agent knows about the primary user. Treat as confidential.

## Identity

- Name: (user's name)
- Preferred contact: (email / channel)
- Working hours / timezone: (context)

## Preferences

- (preference 1 — e.g., "prefers terse responses; no preamble")
- (preference 2)

## What NOT to do (per user's explicit instruction)

- (anti-pattern 1)
- (anti-pattern 2)

---

> Updates require explicit user signal. Do not infer preferences silently.
```

### TOOLS.md

```markdown
# TOOLS

What tools this agent has + how it uses them.

## Connected MCPs

- (MCP name) — (purpose) — (when to use)

## Available commands

- /(slash command) — (purpose)

## Local capabilities

- (Read/Write/Edit/Glob/Grep file operations)
- (Bash / PowerShell with safety hooks installed)
```

## Workflow

### Setting up a new persistent agent

1. Create the 6 files in the agent's repo root using the templates above
2. Fill in SOUL.md + IDENTITY.md (these are mostly immutable)
3. Initialise MEMORY.md, HEARTBEAT.md, USER.md, TOOLS.md as empty (the agent fills them on first run)
4. Add the agent's CLAUDE.md (or use thin-reference to `orryx-standards/CLAUDE.base.md`) with one section directing the agent to read all 6 files at session start

### At session start (agent's responsibility)

```
1. Read SOUL.md — confirm I know my mission
2. Read IDENTITY.md — confirm I know who I am
3. Read USER.md — confirm I know who I'm working with
4. Read TOOLS.md — confirm my capabilities
5. Read HEARTBEAT.md — figure out where I left off
6. Read MEMORY.md — load relevant context
7. Now I'm ready
```

### At session end (agent's responsibility)

```
1. Update HEARTBEAT.md with current state
2. Update MEMORY.md with any new facts, events, decisions
3. Update USER.md only if the user explicitly signalled a preference change
4. Never update SOUL.md or IDENTITY.md without explicit user permission
```

## Anti-patterns

- **Conflating MEMORY with USER.** Memory is facts/events; USER is preferences. Different update cadences.
- **Letting MEMORY grow unbounded.** Prune monthly. Archive old entries to a separate `MEMORY-ARCHIVE/` directory.
- **Updating SOUL casually.** SOUL is the agent's identity. Changes are deliberate.
- **Skipping HEARTBEAT.** Without it, the agent re-investigates "where am I" every session. Wasteful + inconsistent.

## Why the sextet works

Each file has a single concern. Reading all six gives the agent full self-awareness in <2 KB of markdown. Cheap to load, easy to inspect, easy to back up. Compared to alternatives:

- Database — heavier setup; harder to inspect; harder to back up
- Single file — concerns conflate; updates become risky
- Vector DB — overkill for the scope; loses interpretability

For more sophisticated agents (multi-month projects, large memory): graduate to a vector DB + RAG over the markdown files. But start with the sextet.

## See also

- claw-memory canonical implementation — the original pattern in the Orryx Group
- `persistent-agent/cross-entity-protocol` — for agents that work across multiple Orryx entities
- `orchestration/scheduled-execution` — for agents that run periodically and need this pattern
- `D:\Orryx\reality-check\` — a daily-run agent that could adopt this pattern in a future revision
