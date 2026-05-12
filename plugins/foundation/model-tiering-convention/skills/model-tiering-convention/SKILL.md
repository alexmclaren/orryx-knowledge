---
name: model-tiering-convention
description: Model tiering convention for Orryx Group agents and subagents. Triggers when authoring a new subagent, configuring an agent's model, or deciding which model tier to use for a task. Defines haiku (explorer with permissionMode plan, doc-writer), sonnet (code-reviewer, test-writer, migration-writer, default delivery), and opus (security-reviewer, pr-investigator, deep-research, high-stakes review). Canonical Orryx convention; lifted from Triora.
version: 0.1.0
license: MIT
---

# model-tiering-convention

## TL;DR

Three tiers, picked by agent role:

- **haiku** — fast + cheap, used for `explorer` (with `permissionMode: plan`), `doc-writer`, anything that reads/lists/summarises
- **sonnet** — workhorse, used for `code-reviewer`, `test-writer`, `migration-writer`, default for delivery agents
- **opus** — high-quality, used for `security-reviewer`, `pr-investigator`, deep-research, high-stakes architectural decisions

Picked from Triora's mature convention; promoted to cross-cutting in Wave 1.

## Decision table

| Agent role | Tier | Why |
|---|---|---|
| `explorer` | haiku | Read-only with `permissionMode: plan`; speed > sophistication |
| `doc-writer` | haiku | Format-heavy work where consistency > insight |
| `summariser` | haiku | Lossy compression; sonnet is overkill |
| `code-reviewer` | sonnet | Catches most issues; cost-efficient at scale |
| `test-writer` | sonnet | Pattern-matching test generation |
| `migration-writer` | sonnet | Mechanical transformation work |
| `qa-runner` | sonnet | Executing test suites + interpreting results |
| `ops-auto` | sonnet | Routine deploy / sync / status operations |
| `security-reviewer` | opus | Stakes are high; misses are expensive |
| `pr-investigator` | opus | Synthesises across many files |
| `deep-researcher` | opus | Open-ended exploration |
| `architect` | opus | Design decisions with long-term impact |
| `takeoff-estimator` (Pillarworks BOQ) | sonnet | Domain-specific, well-structured |
| `handoff-protocol` mediator | sonnet | Coordinates between agents |
| Default if unsure | sonnet | Workhorse default |

## How to declare in a subagent file

```yaml
---
name: code-reviewer
description: Reviews code changes for security, performance, and correctness.
tools: [Read, Grep, Glob]
model: sonnet
permissionMode: plan
color: yellow
---
```

## Permission modes by tier

| Tier | Default permissionMode | Why |
|---|---|---|
| haiku | `plan` (read-only) | Speed agents shouldn't be allowed to write |
| sonnet | `acceptEdits` (writes OK, no bash without confirm) | Workhorse delivery default |
| opus | `acceptEdits` (or `default`) | High-stakes; trust the more capable model |

The `explorer` agent uniquely has `model: haiku` + `permissionMode: plan` — combining speed-tier model with read-only mode. This is the smart pattern Triora pioneered.

## Cost considerations

| Tier | ~ Cost relative to opus | When NOT worth it |
|---|---|---|
| haiku | 1/15× | Anything requiring multi-file synthesis |
| sonnet | 1/5× | Open-ended exploration; ambiguous decisions |
| opus | 1× | High-volume routine work (deploy checks, lint suggestions) |

A typical Orryx Group session: 1 opus orchestrator + 3-5 sonnet workers + 1-2 haiku explorers. Cost dominated by opus, but its calls are sparse.

## Gotchas

- **Don't default everything to opus.** Cost runs away fast. Opus is for synthesis + high-stakes calls.
- **Don't default everything to haiku.** Haiku misses subtle issues; using it for code review is false economy.
- **Match tier to permissionMode.** Haiku with full write access is a footgun; opus with plan-only loses value.
- **Triora's specific roles aren't the only legal set.** Add new roles as needed; pick tier by the decision table.

## See also

- Anthropic model documentation — for capability/cost details
- `D:\Clinical.Trials\.claude\agents\` — Triora's mature tier assignments (the canonical reference)
- `references/triora-agent-inventory.md` — full Triora agent → tier map
