---
name: ralph-loop
description: Ralph loop pattern for autonomous development with context engineering. Triggers on "use ralph", "/ralph-loop", "loop until done", "autonomous-run this", or any large autonomous delivery. Geoffrey-Huntley pattern — fresh context each iteration, spec drives convergence, quality gates control exit. Used in Triora for greenfield features and complex refactors.
version: 0.1.0
license: MIT
---

# The Ralph Loop — Autonomous Dev with Context Engineering

The Ralph Loop is a self-referential autonomous development pattern coined by [Geoffrey Huntley](https://ghuntley.com). Promoted to Orryx cross-cutting in Wave 3 of the architecture migration.

Instead of building feature-by-feature in a single expanding context window, structure work as an iterative loop where each pass starts fresh.

## Core insight: context engineering

LLMs have a **smart window** — a context size where they perform optimally. As context grows (long conversations, accumulated code, error logs), performance degrades:

- Attention dilutes across irrelevant tokens
- Earlier instructions get "forgotten" (lost-in-the-middle)
- Compounding errors: each fix introduces new issues

**The fix:** reset context each iteration. Give the agent only:

1. The spec (what to build)
2. Current codebase state (git diff, not the full history)
3. Specific failure data from the last iteration (not a wall of logs)

This keeps the agent in its smart window every time.

## The pattern

```
SPEC / GOAL (testable acceptance criteria)
   ↓
ITERATION N (fresh context):
   inputs: spec + current codebase + failure data from N-1
   work:   reads spec, implements, commits
   ↓
QUALITY GATES (ruff, mypy, pytest, bandit — or per-repo equivalents)
   ↓
   pass → DONE
   fail → extract failures → loop to N+1
```

## When to use

✅ **Good fit:**
- Greenfield features with clear specs
- Complex refactors where quality gates catch regressions
- Multi-file changes hard to get right in one pass
- Spec-driven work where success is measurable
- Unfamiliar domains needing multiple convergence attempts

❌ **Poor fit:**
- Trivial changes (loop overhead exceeds value)
- Exploratory work with no clear spec
- UI/UX where "correctness" is subjective
- Research tasks (need expanding context, not resetting)
- Production incident debugging (use `methodology/systematic-debugging` + `delivery/pr-investigate`)

**Decision rule:** if you can write quality gates that verify success, use Ralph Loop. If success requires human judgment, use regular development.

## Context engineering principles

### 1. Spec quality determines loop quality

A vague spec produces vague implementations that fail gates unpredictably.

Bad: "Make the API better"

Good: "Add `GET /api/v1/trials/{id}/eligibility` returning JSON with fields `eligible` (bool), `criteria_met` (list[str]), `criteria_unmet` (list[str]). Return 404 if trial not found. Add OpenAPI schema. Add unit tests covering happy path, not-found, and malformed ID."

### 2. Failure context must be surgical

Don't dump 500 lines of test output into the next iteration. Extract:

- Specific error type
- File and line number
- Expected vs actual
- One sentence of context

The agent can re-read source files — it doesn't need them in the failure report.

### 3. Each iteration gets a clean slate

No "remember what we discussed." No "as I mentioned earlier." Each iteration is a new agent that only knows:

- The spec
- The codebase (via file reads)
- What failed last time (structured data)

### 4. Commit per iteration

Every iteration commits its work:

- Progress never lost if loop interrupted
- Git diff gives next iteration accurate state
- `git log` shows convergence pattern
- `git revert` if an iteration made things worse

### 5. Diminishing-returns detection

If iteration N and N+1 produce the same failure with the same approach, iteration N+2 must try something different. The loop log tracks this. If the loop oscillates (fix A breaks B, fix B breaks A), it needs human intervention.

## Mapping to Orryx sub-agent pattern

| Ralph Loop concept | Orryx implementation |
|---|---|
| "Fresh context" | Spawn a new sub-task / new Claude Code session |
| "Spec injection" | Task description with structured context |
| "Quality gates" | `delivery/quality-check` (ruff, mypy, pytest, bandit, vitest) |
| "Failure extraction" | Parse gate output → structured markdown |
| "Loop controller" | Main agent orchestrating sub-tasks |
| "Loop log" | `docs/ralph-loops/loop-<timestamp>.md` |

The main agent acts as the **loop controller** — it doesn't do implementation. It:

1. Prepares the context package
2. Delegates to a sub-task (fresh context worker)
3. Runs quality gates
4. Decides: done, loop, or escalate

This keeps the controller's context clean (sees only summaries) while each worker gets fresh, focused context.

## Anti-patterns

### Infinite Loop
- **Symptom:** 5 iterations, no progress
- **Cause:** Ambiguous spec or misconfigured gates
- **Fix:** Stop. Refine spec. Verify gates test what matters.

### Scope Creep
- **Symptom:** Each iteration adds features beyond spec
- **Cause:** Vague spec or agent "being helpful"
- **Fix:** Pin spec. Iteration instructions: "implement ONLY what's in the spec."

### Context Leakage
- **Symptom:** Iteration 4 references something from iteration 1's conversation
- **Cause:** Not actually resetting; carrying history forward
- **Fix:** Each iteration genuinely new sub-task. Only carry-forward is structured failure data.

### Retry-Same-Thing
- **Symptom:** Iterations 2 and 3 try the same fix, get same failure
- **Cause:** Failure context missing "approaches already attempted"
- **Fix:** Include "Approaches already attempted" in failure context.

### Ignoring Test Failures
- **Symptom:** Agent comments out failing tests or weakens assertions to pass gates
- **Cause:** Optimising for gate pass over correctness
- **Fix:** Iteration instructions: "Do NOT delete, skip, or weaken existing tests."

## Loop log format

Each Ralph Loop produces a log in `docs/ralph-loops/` for traceability:

```markdown
# Ralph Loop: <task-id> (<timestamp>)

**Spec:** link to spec
**Quality gates:** list

## Iteration 1
- Approach: <one sentence>
- Result: PASS / FAIL
- If FAIL: <surgical failure summary>

## Iteration 2
- Approach (different from 1): <one sentence>
- ...

## Outcome
- Converged at iteration N
- OR escalated to human at iteration N: <reason>
```

## See also

- `methodology/spec-driven-delivery` — produces the spec that drives the loop
- `delivery/quality-check` (Wave 4) — runs the quality gates
- `orchestration/agent-swarming` — the sub-task delegation pattern
- `orchestration/cpd-protocol` — for Ralph Loops running in parallel streams
- Triora canonical: `D:\Clinical.Trials\.claude\skills\ralph-methodology\SKILL.md` — full 184-line reference including .ralph/ directory structure
- Geoffrey Huntley's writing: https://ghuntley.com
- Community plugin: `ralph-wiggum@claude-code-plugins` (verify alignment before composing)
