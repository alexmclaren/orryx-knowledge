---
name: verify-agent-claims
description: Ground-truth verification discipline for agent and subagent output. Triggers whenever integrating, acting on, or reporting a claim produced by an AI agent — a completion report, a state assessment, a justification for an action, or a "this is safe to delete/merge/deploy" assertion. Defines claim classes, the verification move for each, and the escalation rule when verification fails. Distilled from the 2026-06 product-factory programme, where this discipline caught 10+ confident-but-wrong agent claims before they caused damage.
version: 0.1.0
license: MIT
---

# verify-agent-claims

## TL;DR

Never integrate a load-bearing agent claim without checking it against ground truth. Agents (including this one) produce confident, plausible, well-formatted claims that are sometimes simply false. The work is the deliverable; verification is what makes the work trustworthy. Verification is cheap — usually one command — and the orchestrator who skips it inherits the hallucination.

## Why this exists (real catches, 2026-06 programme)

Every one of these was a confident claim from a competent agent, caught only by ground-truth checks:

- A "deleted in WA.4" justification for closing a PR — **fabricated**; the deletion never happened.
- An "EKS was decided" architecture claim — git + AWS showed an **undocumented accident**, not a decision.
- A "$50-100/mo idle environment" — live AWS showed it was **in use**.
- An "all criticals mergeable" Dependabot sweep — 3 of the PRs targeted **paths absent from main**.
- A directory declared "untracked by git" — it was **tracked and unmodified** (`git status` silence ≠ unknown); the agent never ran `git ls-files`.
- A "validation passed" report where the gate had only been run on a **stale provider version** — re-running with `-upgrade` failed.
- A lock file "not ignored by the rule" — `git check-ignore` showed the agent's own gitignore line **ignored it**.

## Claim classes and the verification move for each

| Claim class | Example | Verification move |
|---|---|---|
| **Completion** ("done, tests pass") | "pytest 8/8, build green" | Re-run the gate yourself (`pytest -q`, `npm run build`, `terraform validate`). Never trust a pasted result for a decision that matters. |
| **Repo state** ("X is untracked / absent / unchanged") | "dir not in git" | `git ls-files <path>`, `git ls-tree origin/main <path>`, `git log --all -- <path>`. `git status` silence means *unmodified*, not *unknown*. |
| **Live-system state** ("env is idle / service is healthy") | "$33/mo orphan VPC" | Query the live system (AWS CLI/MCP, health endpoint, CloudWatch) — never infer from docs or names. RDS instance names lie (see CLAUDE.md §16). |
| **Justification** ("closed because superseded / deleted in X") | "dup of merged #113" | Find the primary artifact: the commit SHA, the merged PR diff, the decision record. A justification without a citable artifact is unverified. |
| **Safety** ("safe to delete / merge / deploy") | "0-reference dir" | Independent reference sweep (grep, build-file reads) + the §7 human-review gate for deletions. `mergeable: UNKNOWN` means *not yet computed*, never "ready". |
| **File-content** ("the YAML parses / no placeholders remain") | "all valid" | Parse it yourself: `python -c "yaml.safe_load(...)"`, `python -m json.tool`, `grep -r "{{"`. |

## Workflow

1. **Identify load-bearing claims** in the agent's report — the ones your next action depends on. Ignore decorative detail.
2. **Verify each with the table above** before integrating. One command per claim is the norm; if verification is expensive, sample the riskiest claims plus one random one.
3. **On mismatch:** stop integration. Re-ground the agent with the evidence (SendMessage) or do the step yourself. A wrong load-bearing claim invalidates the agent's *other* unverified claims — widen the sample.
4. **Record the catch** where the next session will see it (handover doc, lessons-learned, this skill's examples if it's a new failure class).
5. **Report honestly upward:** your summary to the human must distinguish "verified" from "agent-reported". Never launder an unverified claim into a verified-sounding sentence.

## Verification budget rule

Scale rigor to blast radius, not to effort spent:

- **Irreversible or production-facing** (delete, merge, deploy, publish, spend): verify every load-bearing claim, no sampling.
- **Reversible scratch work**: verify the claims that survive into the next step.
- **Informational only**: verify before repeating to a human as fact.

## Anti-patterns

- **Trust-by-format:** a tidy table with ✅ marks is not evidence. The fabricated claims above all came beautifully formatted.
- **Verification theater:** re-reading the agent's transcript is not verification; ground truth lives in the repo, the live system, or the artifact — not in the agent's own words.
- **Sunk-cost integration:** "the agent spent 10 minutes on this" is not a reason to skip the 10-second check.
- **Single-claim myopia:** when one claim fails verification, do not keep the rest on faith.
- **Self-exemption:** your own conclusions are agent claims too. Before a destructive or outward-facing action, re-check that the evidence supports *that specific* action.

## See also

- `cross-model-verification` (foundation) — code-level verification with a non-Claude model; this skill covers factual/state claims.
- `plan-mode-first` (foundation) — verification points belong in the plan.
- CLAUDE.md §7 — human-review gates that verification feeds into.
