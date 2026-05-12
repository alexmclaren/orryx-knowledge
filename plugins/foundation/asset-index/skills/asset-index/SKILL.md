---
name: asset-index
description: Check-before-create discipline. Triggers before authoring a new skill, agent, prompt, slash command, hook, or shared schema. Consults the repo-local ASSET_INDEX.md to prevent duplication; lifted from Pillarworks's mature pattern. Reduces "we already have one of these" rework and keeps cross-product coordination cheaper.
version: 0.1.0
license: MIT
---

# asset-index

## TL;DR

Before creating a new shared asset (skill, agent, prompt, slash command, hook, schema, shared util), check `ASSET_INDEX.md` at repo root. If something close exists, extend it. If it doesn't, register your new asset there after creating it. This is the same discipline Pillarworks uses; promoting to cross-cutting in Wave 1.

## Workflow

### 1. Before creating

```bash
# Quick check
grep -i "<concept>" ASSET_INDEX.md

# Broader scan
grep -iE "<concept>|<synonym1>|<synonym2>" ASSET_INDEX.md
```

If a similar asset exists: **extend it**, don't create a parallel one.

### 2. Where ASSET_INDEX.md lives

| Repo type | Path |
|---|---|
| Product repo (Triora, Pillarworks, etc.) | `ASSET_INDEX.md` at repo root |
| Cross-cutting (orryx-knowledge, orryx-standards) | `ASSET_INDEX.md` at repo root |
| Domain MCP repo | `ASSET_INDEX.md` at repo root |

### 3. ASSET_INDEX.md structure (template)

```markdown
# Asset Index

> Single source of truth for shared assets in this repo. Check here before creating anything new.

## Skills (.claude/skills/)

- `<skill-name>` — <one-line purpose> — `.claude/skills/<name>/SKILL.md`

## Agents (.claude/agents/)

- `<agent-name>` — <role> — `.claude/agents/<name>.md`

## Slash commands (.claude/commands/)

- `/<name>` — <what it does> — `.claude/commands/<name>.md`

## Hooks (.claude/hooks/)

- `<hook-event>/<name>.sh` — <what it does>

## Prompts (prompts/)

- `<prompt-name>` — <purpose> — `prompts/<name>.md`

## Shared schemas (src/schemas/ or schemas/)

- `<schema-name>` — <what it models> — `src/schemas/<name>.ts`
```

### 4. After creating

Add a one-line entry. Keep entries scannable — one line each, no nesting.

### 5. Cross-product

For assets in `orryx-knowledge` (cross-cutting), the ASSET_INDEX is the marketplace.json itself — plugins listed there ARE the index. No separate file needed.

For domain assets in product repos: each product has its own ASSET_INDEX.md. Don't try to globally index across repos — the marketplace handles cross-product discovery.

## Why this matters

The 2026-05-12 audit found **14 cross-cutting patterns trapped in product repos**, often because the authors didn't know a similar pattern existed elsewhere. Pillarworks's ASSET_INDEX.md was the only repo with this discipline; results showed in lower duplication and faster onboarding.

The "north-star metric" for the Wave 0-8 migration is reducing this 14 → 0. ASSET_INDEX is the local-loop discipline that prevents the count climbing back up.

## Gotchas

- **Stale entries.** When you delete a skill, delete its line from ASSET_INDEX.md. Otherwise next-author sees a phantom and either re-creates it or wastes time looking.
- **Over-categorisation.** One-line-per-asset, six top-level categories. Don't build a tree.
- **Pre-commit hook.** Worth wiring as a `.git/hooks/pre-commit` to check that any new file under `.claude/skills/` etc. has a corresponding ASSET_INDEX line. (Not packaged here — opt-in.)

## See also

- `references/template.md` — copy-paste ASSET_INDEX.md template
- Pillarworks's actual ASSET_INDEX.md — the original; reference implementation
