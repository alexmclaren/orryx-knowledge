---
name: agent-swarming
description: Multi-agent collaboration patterns + agent roles + swarming protocols + cross-model verification for Orryx Group development. Triggers on multi-agent task design, "spawn agents", "parallelise this work", or planning a complex delivery. Canonical Orryx pattern; lifted from Triora.
version: 0.1.0
license: MIT
---

# Multi-Agent Collaboration & Swarming

Cross-cutting pattern for Orryx Group development. Originally Triora's; promoted to cross-cutting in Wave 3 of the architecture migration.

Supports multi-agent swarming between Claude and ChatGPT for autonomous development.

## Collaboration Principles

- Assume other agents will consume outputs — use clear headings, lists, JSON/YAML
- Behave collaboratively and critically — acknowledge useful work, flag inconsistencies
- Cross-check critical logic — recommend independent re-derivation for high-stakes outputs (matching logic, financial calculations, security policies, etc.)
- Swarming for autonomy — agents work together with minimal human intervention

## Agent Roles in Development Swarm

| Agent | Model | Primary Role | Tier source |
|---|---|---|---|
| Engineer | Claude | Code implementation, testing | sonnet |
| Architect | Claude | Design, architecture decisions | opus |
| Tester | Claude | Test generation, coverage | sonnet |
| Researcher | Claude Opus | Deep research, knowledge gathering | opus |
| Designer | Claude | UI/UX design, accessibility | sonnet |
| Hygiene | Claude | Repo cleanliness, archival, consolidation | sonnet |
| Reviewer | GPT-4 | Code review, verification | n/a (external) |
| QA | GPT-4 | Integration testing, acceptance | n/a (external) |
| Explorer | Claude | Read-only investigation | haiku, `permissionMode: plan` |
| Doc-writer | Claude | Documentation generation | haiku |

Tier assignments are canonical via `foundation/model-tiering-convention`. Configs typically live in `agents/claude/<role>.yaml` and `agents/chatgpt/<role>.yaml` per repo.

## Parallel Research Agent

The Researcher Agent runs independently in parallel to:
- Conduct deep research on regulatory, technical, and domain topics
- Produce cited markdown reports in `research/outputs/`
- Inform architecture and compliance decisions
- Use Graph-of-Thoughts methodology for complex topics

Launch: select a prompt, refine, start a new Claude Code session with `/model opus`, execute research while main agent continues.

## Cross-Model Verification

For critical outputs (especially regex / async / security / matching logic):

```
Claude (generate) → GPT-4 (verify) → Compare
  Agreement → High confidence, proceed
  Minor disagreement → Iterate and refine
  Major disagreement → Escalate to human
```

See `foundation/cross-model-verification` for the formal protocol.

## Agent Handoff Protocol

```yaml
## Agent Handoff: [Task ID]
### Context
- Task: [Description]
- Phase: [Current phase]
- From: [Agent ID]  /  To: [Agent ID]
### Completed Work
- [x] What was done  /  Files changed
### Verification Requested
- [ ] Correctness  /  Security  /  Tests
### Confidence: [0.0-1.0]
```

## Swarming Patterns

| Pattern | Description | Use Case |
|---|---|---|
| Sequential | A → B → C | Standard feature development |
| Parallel | [A + B] → Merge | Independent components |
| Verification | A → B (verify) | Critical decisions |
| Debate | A + B → Arbitrate | Architecture choices |
| Refinement | A → B (review) → A (fix) → Loop | Complex logic |

## ⚠️ Branch Isolation Rule (ENFORCED)

**Parallel agents MUST work on separate branches.** This is non-negotiable.

### Why

Concurrent agents on the same branch cause commit collisions. This was learned the hard way in Triora when a compliance agent stepped on the engineer's commits, resulting in lost work and a messy force-push recovery.

### Rules

1. **One agent per branch** — before starting, check `git branch` and ensure no other agent targets your branch
2. **Branch naming must identify the agent** — use patterns like `feat/agent-name-task` or `fix/agent-name-issue`
3. **Never force-push a shared branch** — if conflicts arise, rebase locally and resolve
4. **Coordinate merges** — agents merge to main sequentially, not simultaneously
5. **Check before commit** — run `git status` and `git log --oneline -3` before committing

### Pre-Commit Check

```bash
current_branch=$(git branch --show-current)
echo "Committing to: $current_branch"
git status
```

### If Collision Detected

1. STOP immediately — do not force-push
2. Stash: `git stash`
3. Pull: `git pull --rebase`
4. Re-apply: `git stash pop`
5. Resolve conflicts manually
6. Report the collision to the coordinating agent/human

## See also

- `orchestration/cpd-protocol` — Continuous Parallel Development (5-stream pattern)
- `orchestration/ralph-loop` — autonomous-loop pattern
- `orchestration/git-worktrees` — workspace isolation pattern
- `foundation/model-tiering-convention` — which tier for which role
- `foundation/cross-model-verification` — the verifier handoff schema
- Triora original: `D:\Clinical.Trials\.claude\skills\agent-swarming\SKILL.md`
