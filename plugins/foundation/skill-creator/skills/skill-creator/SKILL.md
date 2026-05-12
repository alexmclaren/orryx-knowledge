---
name: skill-creator
description: Authors new Claude Code skills following Orryx Group conventions. Triggers on requests to create a new skill, add a SKILL.md, build a skill for X, or "how do I make a skill". Covers frontmatter structure, when_to_use phrasing, model tier declaration, ASSET_INDEX.md registration, and the references/ subdirectory pattern.
version: 0.1.0
license: MIT
---

# skill-creator

## TL;DR

When a user asks to create a new Claude Code skill, this skill walks through the Orryx Group authoring checklist: frontmatter conventions, description writing (the routing rule), body structure (TL;DR → workflow → gotchas → examples), `references/` subdirectory placement, and `ASSET_INDEX.md` registration. The skill builds on Anthropic's official `skill-creator` and adds the Orryx-specific quality bar.

## Workflow

### 1. Check ASSET_INDEX.md first (P6 — check before create)

Before writing a new skill, consult the repo-local `ASSET_INDEX.md`:

```bash
cat ASSET_INDEX.md | grep -i "<concept>"
```

If something close already exists: extend it. Skills are easier to add capabilities to than to deduplicate later.

### 2. Pick the right layer

| Layer | Use when… |
|---|---|
| `foundation/` | Bootstrap, base templates, hooks, conventions (cross-cutting) |
| `methodology/` | How we plan, build, review, test (cross-cutting) |
| `orchestration/` | How Claude works alone and together (cross-cutting) |
| `delivery/` | Day-to-day operational primitives (cross-cutting) |
| `domain/` | Entity-specific (lives in product repo, not orryx-knowledge) |
| `persistent-agent/` | Long-lived agent patterns + memory |
| `vertical-templates/` | Industry-specific reusable scaffolds |

### 3. Write the frontmatter

Required:

```yaml
---
name: <kebab-case-name>
description: <what + when + how — third person, paste-testable triggers>
version: <semver>
license: MIT
---
```

Optional:

```yaml
allowed-tools: [Read, Edit, Bash]
model: opus | sonnet | haiku
when_to_use: |
  - trigger phrase 1
  - trigger phrase 2
paths:
  - src/**/*.ts
```

### 4. Write the description (the routing rule)

The `description` is what Claude reads to decide whether to activate this skill. **Bad descriptions → skill never triggers.**

Shape:

> **What it does + when to use it + key capabilities.** Third person ("authors", "checks", "produces"). No first person ("I will…"). No marketing language. No emoji.

Paste-test: take 3 realistic user prompts that *should* trigger this skill. If Claude reliably picks it, the description is good. If not, rewrite.

**Good:**

```
description: Authors new Claude Code skills following Orryx Group conventions. Triggers on requests to create a new skill, add a SKILL.md, or build a skill for X.
```

**Bad:**

```
description: A great skill for making skills! You'll love it.
```

### 5. Write the body (the actual instruction)

Lead with **TL;DR** (2-3 sentences). Follow with **numbered workflow steps**. Then **gotchas + edge cases**. End with **examples**.

Keep the body under **500 lines** healthy; longer content goes in `references/`, `scripts/`, `assets/` subdirectories.

### 6. Add references/

```
plugins/<layer>/<name>/skills/<name>/
├── SKILL.md              # body
└── references/
    ├── examples.md       # worked examples
    └── api-spec.md       # if relevant
```

Reference subfiles from SKILL.md body using markdown links. Claude reads them on demand.

### 7. Register in ASSET_INDEX.md

Add a one-line entry:

```markdown
- `<plugin-name>` — <one-line description> — <path>
```

### 8. Test before publishing

Paste 3 realistic user prompts in a Claude Code session. Verify the skill triggers. Run through the workflow. Fix the description if triggering is unreliable.

### 9. Register in marketplace.json

Add an entry to `D:\orryx-knowledge\.claude-plugin\marketplace.json`:

```json
{
  "name": "<plugin-name>",
  "description": "<from plugin.json>",
  "source": {
    "type": "local",
    "path": "./plugins/<layer>/<name>"
  },
  "version": "<semver>"
}
```

## Quality gates (must pass before publishing)

- [ ] `plugin.json` has valid `name`, `description`, `version`
- [ ] SKILL.md has valid frontmatter
- [ ] Description triggers correctly on 3+ realistic user prompts (paste test)
- [ ] Tested in at least 1 real project (not just dev)
- [ ] README documents what / why / when / how
- [ ] If hooks/env vars/config: documented
- [ ] Cross-references to related plugins added
- [ ] Versioned semver

## Gotchas

- **Description length.** Aim for 1-2 sentences. Too short → unreliable triggering. Too long → token waste.
- **First-person.** Never write "I will help you create…". Always "Authors new skills…".
- **Marketing copy.** "Powerful", "amazing", "comprehensive" → Claude treats this as noise; bad triggering.
- **Multiple SKILL.md files in one plugin.** Allowed (each in its own subdirectory) but rare. Most plugins have one canonical SKILL.md.

## See also

- Anthropic's official `skill-creator` skill — covers the mechanics in detail
- `D:\orryx-knowledge\CONTRIBUTING.md` — the quality bar
- `D:\orryx-standards\` — canonical AGENTS.base.md and CLAUDE.base.md
- `references/triora-examples.md` — Triora's mature SKILLs
- `references/pillarworks-examples.md` — Pillarworks's BMAD pattern
