# Contributing to orryx-group plugins

This is the primary discovery marketplace for the Orryx Group. Every plugin shipped here must meet the quality bar below.

---

## Plugin layers

| Layer | Purpose | Examples |
|---|---|---|
| **foundation** | Bootstrap, base templates, hooks, conventions | safety-hooks-base, asset-index, plan-mode-first |
| **methodology** | How we plan, build, review, test | plan-and-execute, bmad-planning, code-review, tdd-discipline |
| **orchestration** | How Claude works alone and together | agent-swarming, cpd-protocol, ralph-loop, git-worktrees |
| **delivery** | Day-to-day operational primitives | credential-audit, security-audit, docs-pack, sprint-plan |
| **persistent-agent** | Long-lived agent patterns + memory | persistent-memory-template, cross-entity-protocol |
| **vertical-templates** | Industry-specific reusable scaffolds | crash-repair (more to come) |
| **mcp-servers** | Plugins that wrap or coordinate MCP servers | orryx-mcp-gateway, magic-patterns |

Domain-specific plugins (e.g., triora-healthcare-context) live in their **owning entity's repo** and are referenced from this marketplace via `source.url`.

---

## Plugin directory layout

```
orryx-knowledge/plugins/<layer>/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json              # required: name, description, version
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md             # frontmatter + body
│       └── references/          # optional supporting docs
├── agents/
│   └── <agent-name>.md          # optional subagents
├── commands/
│   └── <command-name>.md        # optional slash commands
├── hooks/                       # optional hooks
├── README.md
└── CHANGELOG.md
```

---

## SKILL.md requirements

### Required frontmatter

```yaml
---
name: <skill-name>
description: <what + when + how — third person, triggers reliably>
version: <semver>
license: MIT
---
```

### Description writing (the most important field)

The `description` is the routing rule. Claude reads it to decide whether to activate the skill. Bad descriptions → skill never triggers. Good descriptions follow this shape:

> **What it does + when to use it + key capabilities.** Third person, no first-person ("I" or "you"), no marketing language, no emoji. Triggers should be paste-testable against likely user prompts.

**Good:**

```
description: Authors new Claude Code skills following Orryx Group conventions. Triggers on 'create a new skill', 'add a SKILL.md', or 'how do I make a skill'. Covers frontmatter, when_to_use phrasing, model-tiering, and ASSET_INDEX registration.
```

**Bad:**

```
description: A great skill for making skills! You'll love it.
```

Test: paste 3 different user prompts that should trigger this. If Claude reliably picks this skill, the description is good.

---

## Body requirements

- Under **500 lines** healthy; longer content goes in `references/`, `scripts/`, `assets/` subdirectories.
- Lead with a **TL;DR** (2-3 sentences) — what triggers this skill and what it produces.
- Followed by **detailed workflow** (numbered steps).
- Then **gotchas + edge cases**.
- Optional **examples** at the bottom.

---

## Quality gates

Every plugin must pass before being added to `marketplace.json`:

### Mandatory

- [ ] `plugin.json` has valid `name`, `description`, `version`
- [ ] SKILL.md (or equivalent) has valid frontmatter
- [ ] Description triggers correctly on 3+ realistic user prompts (paste test)
- [ ] Plugin installable via `/plugin install <name>@orryx-group`
- [ ] Tested in at least 1 real project (not just dev)
- [ ] README documents: what, why, when, how
- [ ] If hooks/env vars/config: documented

### Recommended

- [ ] `references/` with worked examples
- [ ] Cross-references to related plugins (so they're discovered together)
- [ ] Versioned via semver
- [ ] Listed in CHANGELOG.md

---

## Single-maintainer governance (current state)

- Issues accepted from external contributors
- PRs by invitation only initially
- Quarterly review: stability, deprecation candidates

This will evolve as the marketplace matures. Anyone wanting to contribute: open an issue first to discuss before opening a PR.

---

## Cross-cutting design principles

Every plugin should reflect these principles (drawn from the 2026-05-12 audit):

### P1. Single-source the foundation, federate the domain

Shared patterns live here (`orryx-knowledge`). Domain-specific patterns stay in their owning product repo.

### P2. Plan-mode first, autonomous within plan

Plugins that modify code should default to plan mode for the first decision, then operate autonomously within the approved plan.

### P3. Model tiering by role

- `haiku` for: explorer (with `permissionMode: plan`), doc-writer, simple lookups
- `sonnet` for: code-reviewer, test-writer, migration-writer, default delivery work
- `opus` for: security-reviewer, pr-investigator, deep-research, high-stakes review

### P4. Cross-model verification

For high-risk code (regex, async, security-sensitive, migrations), generate with Claude → verify with a non-Claude model.

### P5. Safety hooks are universal

Every product installs `foundation/safety-hooks-base`. No per-product variation needed.

### P6. Asset-index check before create

Before authoring a new skill/agent/prompt, check `ASSET_INDEX.md` to see if it already exists.

### P7. Reality-check runs separately

Operational health monitoring is a different cadence than architectural audits. Don't fold them together.

---

## Installing this marketplace

```
claude /plugin marketplace add orryx-group https://github.com/alexmclaren/orryx-knowledge
claude /plugin install foundation/safety-hooks-base@orryx-group
claude /plugin install methodology/plan-and-execute@orryx-group
# ... etc.
```

A `.claude/plugins.json` in each project repo declares required plugins for that repo.

---

## See also

- `D:\orryx-audit\` — the 2026-05-12 audit that produced this marketplace plan
- `D:\orryx-standards\` — canonical AGENTS.base.md + CLAUDE.base.md + gitignore-snippets
