---
name: plan-and-execute
description: Plan + execute discipline with explicit checkpoints. Triggers on multi-step delivery work, any task estimated at >30 minutes, or when the user says "implement X" / "build Y" / "ship Z". Produces a short plan first, executes with checkpoint after each step, ends with end-of-task reflection. Lifted from Pillarworks SKILL; promoted to cross-cutting.
version: 0.1.0
license: MIT
---

# plan-and-execute

## TL;DR

For multi-step work: plan first, execute one step at a time, checkpoint after each, reflect at the end. Don't bash through. Don't skip the plan because you're sure. Don't skip the reflection because you finished.

## Workflow

### 1. PLAN (always, for >1 step)

Use TodoWrite to capture the plan. Each step is:
- **What** (one sentence)
- **Why** (so a future reader understands intent)
- **Done-when** (acceptance criterion)

Plan covers the whole task before any step starts. If you can't write the plan, you don't understand the task yet — go investigate first.

### 2. EXECUTE one step at a time

- Mark step `in_progress` before starting.
- Do the work.
- Mark `completed` immediately when done.
- **Don't batch completions.** Marking 3 steps done at once = lost context for the user.

### 3. CHECKPOINT between steps

After each step:
- Did the step's done-when criterion pass?
- Did this step reveal something that changes the plan? (file doesn't exist, test reveals a wrong assumption, etc.)
- If yes: STOP, re-plan, then continue.

The mid-task re-plan is the point. Not asking each step what to do next.

### 4. REFLECT at the end

After the last step, briefly note:
- What changed? (files touched, deploys made, decisions taken)
- Anything for next time? (gotcha noticed, pattern worth promoting)
- Any followup tasks the user should know about?

## Triggers

This skill activates when the user says:
- "implement X" / "build Y" / "ship Z"
- "let's do X" / "go ahead with X"
- Anything with multiple steps clearly inferred (e.g., "fix this bug and add a regression test")

Doesn't trigger for:
- Single-file reads
- Direct questions
- "How does X work?" (explanatory, not execution)

## Anti-patterns to avoid

- **Plan-then-stash.** Writing the plan but then ignoring it once you start coding.
- **Mid-task scope creep.** Adding "while we're here" steps without updating the plan.
- **Silent re-planning.** Discovering something that changes scope but not telling the user.
- **End-of-task radio silence.** Finishing without a 1-sentence "what changed" summary.

## Cost-benefit

For ~30-minute tasks: plan-and-execute adds ~5 minutes of plan time, saves ~30 minutes of rework. Net: faster.

For <10-minute tasks: skip this skill; the overhead exceeds the value.

## See also

- TodoWrite tool — the persistence layer for plans
- `foundation/plan-mode-first` — the broader plan-mode discipline this builds on
- Pillarworks's original `plan-and-execute` SKILL — canonical implementation
