---
name: onboard
description: Onboarding workflow for new contributors. Triggers on /onboard, "new dev getting started", "show me the ropes". Promoted from Triora SKILL.
version: 0.1.0
license: MIT
---

# onboard

## TL;DR

Onboard a new contributor: explain repo structure, key conventions, install foundation plugins, pick a starter task. Walks through the assets in ASSET_INDEX.md + the entity-specific CLAUDE.md overrides.

## Workflow

1. Read the repo README + AGENTS.md (which points to canonical) + CLAUDE.md (which points to canonical) + ASSET_INDEX.md
2. Explain: which entity this repo serves, where it fits in the Orryx Group, what done looks like
3. Verify environment: required tooling installed (Node, Python, Docker if applicable), gh authenticated
4. Install foundation plugins: claude /plugin install foundation/* @orryx-group
5. Pick a starter task from the backlog (low-risk, well-documented, helps build context)
6. Walk through the first commit + PR cycle

## See also

- foundation/asset-index
- D:\orryx-knowledge\onboarding
