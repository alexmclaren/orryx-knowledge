# Orryx Knowledge

**Primary discovery marketplace for the Orryx Group + collaborative knowledge base.**

This repo serves two purposes:

1. **Claude Code plugin marketplace** at `.claude-plugin/marketplace.json` — the discovery surface for every cross-cutting plugin used by Triora, Pillarworks, Orryx Brain, Orryx Flow, and the crash-repair-template.
2. **Knowledge base** for domain expertise, patterns, ADRs, and lessons learned.

---

## Quick start

```
# Register the marketplace
claude /plugin marketplace add orryx-group https://github.com/alexmclaren/orryx-knowledge

# Install a foundation plugin
claude /plugin install foundation/safety-hooks-base@orryx-group

# List installed
claude /plugin list
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for plugin authoring guidance.

---

## Repository structure

```
orryx-knowledge/
├── .claude-plugin/
│   └── marketplace.json          # primary discovery surface
├── CONTRIBUTING.md               # plugin authoring guidance
├── plugins/                      # cross-cutting plugins (canonical home)
│   ├── foundation/               # bootstrap, hooks, conventions, templates
│   ├── methodology/              # plan-execute, BMAD, code-review, TDD, debug, spec-driven
│   ├── orchestration/            # agent-swarming, CPD, ralph, worktrees, scheduled-execution
│   ├── delivery/                 # credential-audit, security-audit, docs-pack, sprint-plan, etc.
│   ├── persistent-agent/         # claw-memory pattern + cross-entity-protocol
│   └── mcp-servers/              # plugins wrapping or coordinating MCP servers
├── vertical-templates/           # industry-specific scaffolds
│   ├── _template/                # meta-template
│   └── crash-repair/             # first instance (from orryx-repair-intelligence)
├── domain/                       # healthcare, construction, other domain knowledge
├── patterns/                     # reusable implementation patterns
├── decisions/                    # ADRs
├── anti-patterns/                # common mistakes to avoid
├── lessons-learned/              # what we learned from tasks
└── onboarding/                   # new-team-member guides
```

Domain-specific plugins (e.g., `triora-healthcare-context`) live in their **owning entity's repo** (`Clinical_trials/.claude-plugin/`) and are referenced from this marketplace via `source.url`.

---

## Marketplace topology

This is the **hybrid topology** recommended by the 2026-05-12 architecture audit:

- **Single discovery surface:** this marketplace.json
- **Federated source-of-truth:** plugins live in the most appropriate repo (cross-cutting plugins here; domain plugins in their product repo)
- **External MCPs** (magic-patterns, Sentry, Playwright, VisionCraft): stay direct, not routed through the gateway

See `D:\orryx-audit\04-cross-entity-analysis.md` for the topology decision rationale.

---

## Knowledge base usage (separate from plugins)

For domain expertise + ADRs + lessons learned, the `domain/`, `patterns/`, `decisions/`, `anti-patterns/`, `lessons-learned/`, `onboarding/` directories serve their original purpose.

Plugins and the knowledge base coexist — the marketplace is what Claude Code discovers; the knowledge base is what humans + agents read for context.

---

## See also

- `CONTRIBUTING.md` — plugin authoring guidance + quality gates
- `D:\orryx-standards\` — canonical AGENTS.base.md + CLAUDE.base.md + gitignore-snippets
- `D:\orryx-audit\` — the 2026-05-12 architecture audit + migration plan
