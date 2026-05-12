# Triora SKILL.md exemplars

Triora has the most mature `.claude/skills/` directory in the Orryx Group (19 SKILL.md files at the time of the 2026-05-12 audit). Study these patterns:

## Canonical user-invocable: false skills (triggered by Claude based on description)

Located at `D:\Clinical.Trials\.claude\skills\`:

- **`agent-swarming`** — multi-agent collaboration patterns, agent roles, swarming protocols. **Note:** entity-agnostic — being promoted to `orryx-knowledge/plugins/orchestration/agent-swarming` in Wave 3.
- **`cpd-protocol`** — Continuous Parallel Development protocol (5-stream pattern). Also promoted to `orchestration/` layer.
- **`ralph-methodology`** — autonomous development with context engineering. Promoted to `orchestration/ralph-loop`.
- **`document-library`** — complete document library index for the product.
- **`healthcare-context`** — Australian healthcare regulations, PHI handling rules. **Domain-specific** — stays in Triora.
- **`orryx-integration`** — Orryx ecosystem integration (MCP Gateway, Auth0, cross-repo protocol).
- **`production-testing`** — autonomous production testing via GitHub Actions WAF bypass. **Novel pattern**, promoted.
- **`research-integration`** — rules for integrating research outputs into operational docs.
- **`task-workflows`** — task-based document workflows.

## Slash-command-style skills (`disable-model-invocation: true`)

These have a description that says "When invoked as /command…" — they execute on explicit invocation rather than Claude's autonomous choice:

- `deploy`, `fix-issue`, `quality-check`, `merge-review`, `onboard`, `pr-investigate`, `ralph-loop`, `refactor`, `release-notes`, `sprint-plan`

## Key conventions Triora demonstrates

1. **Description acts as a routing rule.** Triora's descriptions are 1-2 sentences, third person, paste-testable.
2. **Model declared explicitly.** Most Triora skills are sonnet-tier; explorer is haiku; security-reviewer is opus.
3. **`when_to_use:` is concrete.** Lists explicit trigger phrases, not abstract conditions.
4. **`paths:` scoped.** Skills that touch specific file types declare paths to avoid spurious activation.
5. **`references/` subdirectories.** Long supporting docs (>200 lines) live in `references/` rather than the SKILL.md body.

## Patterns to copy

When writing a new skill for the Orryx Group, follow these Triora patterns:

- Description format: "Verb-leading sentence + trigger phrases + key capabilities"
- Body structure: TL;DR (2-3 sentences) → Workflow (numbered) → Gotchas → Examples → See also
- Less is more: under 200 lines healthy; longer content in `references/`
