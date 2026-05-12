---
name: systematic-debugging
description: Four-phase systematic debugging (reproduce, isolate, hypothesise, fix). Triggers on bug reports, test failures, error messages, "X is broken / not working / failing", "why is X happening", or production incident triage. Production-reality-first; verifies hypotheses against the running system before changing code. Replaces "guess and check" debugging.
version: 0.1.0
license: MIT
---

# systematic-debugging

## TL;DR

Four phases: REPRODUCE (make the bug happen consistently), ISOLATE (narrow it to the smallest scope), HYPOTHESISE (predict what's wrong + how to verify), FIX (smallest change that addresses the root cause + a regression test).

"Production reality > assumptions" — verify hypotheses against the running system, not by reading code.

## Phase 1 — REPRODUCE

Goal: make the bug happen on demand, locally.

1. **Get the reproduction recipe.** What exactly was the user doing? Browser? Logged in? What clicked? What URL?
2. **Confirm versions.** Branch, commit, env (production vs staging vs local), database state.
3. **Try to reproduce locally.** If you can't, the bug isn't ready to fix — environment matters.
4. **If you can't reproduce:** widen the scope. Check production logs / Sentry / CloudWatch. Look for the timestamp.

**Don't proceed to phase 2 until you can reproduce on demand** (or have evidence of where it happens otherwise).

## Phase 2 — ISOLATE

Goal: narrow the bug to the smallest possible scope.

1. **Bisect.** Disable half the code path. Does it still happen?
2. **Minimize the input.** Smallest input that still triggers the bug.
3. **Disable surrounding context.** Does it happen without auth? Without the user's specific data? In a fresh DB?
4. **Identify the boundary.** Where does data go from correct to wrong?

End state: you can say "the bug is in <specific function / endpoint / query>, triggered by <minimal input>."

## Phase 3 — HYPOTHESISE

Goal: predict the root cause + define how to verify.

1. **Generate hypotheses** — what could cause this?
   - Recent change: `git log -p --since="1 week ago" <file>`
   - Data: was the data malformed at ingest?
   - Concurrency: is there a race condition?
   - Env: dev vs prod config difference?
   - Dependency: upstream lib changed?
2. **Rank by likelihood + cost-to-verify.** Cheap-to-check hypotheses first.
3. **Verify against production reality** — query the live system, read live logs, inspect live state. Don't just read code and hope.
4. **Confirm or reject each hypothesis.**

Output: one hypothesis you're confident is the root cause + evidence supporting it.

## Phase 4 — FIX

Goal: smallest change that addresses the root cause, with a regression guard.

1. **Write a failing test** that reproduces the bug at the unit level (red — per `methodology/tdd-discipline`)
2. **Write the fix.** Smallest change possible.
3. **Test goes green.** Confirm the regression guard catches the bug.
4. **Full test suite green.** No regressions.
5. **Document** — commit message names the root cause + how the bug surfaced.

## Production-reality > assumptions

Triora's CLAUDE.md framing: **never trust docs, frontend assumptions, or old schemas.** Always verify against:

- Running system (curl the endpoint, check the response)
- Logs (CloudWatch, Sentry, application logs)
- Live database state (SELECT, not migration files)
- Running infrastructure (terraform plan to see drift)

Most debugging mistakes come from skipping this step. The code says X; the running system does Y. The running system wins.

## When to escalate to security-review

If the bug involves:
- Authentication / authorisation
- Data leakage (one user's data shown to another)
- Race conditions in financial / regulated systems

Stop at phase 3, escalate via `methodology/code-review` Stage 2 (opus security-reviewer) before fixing. Security bugs need a threat-model pass.

## Anti-patterns

- **"Try this random change and see if it helps."** Phase 3 first.
- **Reading code to find bugs.** Code lies. Run the system.
- **Fixing symptoms.** The bug is where the symptom surfaces; the root cause may be elsewhere.
- **No regression test.** Same bug will return. Always phase 4 step 1.
- **Multiple bugs at once.** Fix the first; the second may resolve or change shape after the first is fixed.

## Triora reference patterns

- Triora's `pr-investigator` (opus) subagent — for cross-PR root-cause investigation
- Triora's `production-testing` SKILL — WAF-bypass-via-Actions-in-VPC for AU-locked production testing
- Triora's reality-check baselines — for "what was the state when this last worked"

## See also

- `methodology/tdd-discipline` — phase 4 starts with a failing test
- `methodology/code-review` — for security-sensitive fixes
- `delivery/pr-investigate` (Wave 4) — opus tier; for cross-file root-cause analysis
- `delivery/fix-issue` (Wave 4) — for the issue-to-PR shape
