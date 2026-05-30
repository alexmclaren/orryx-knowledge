---
name: magic-patterns-design
description: Magic Patterns design pipeline. Triggers on "scaffold a new design", "use Magic Patterns to prototype X", or starting a new brand/landing variant.
version: 0.1.0
license: MIT
---

# magic-patterns-design

## TL;DR

Formalises the de facto Magic Patterns workflow used across 6+ Orryx Group brand repos: scaffold via mcp.magicpatterns.com -> iterate via Vite template -> integrate into product repo -> archive scaffold repo.

## Workflow

1. Confirm Magic Patterns MCP is configured (env var MAGIC_PATTERNS_API_KEY, NOT committed)
2. Generate scaffold: call Magic Patterns MCP with design brief
3. Pull scaffold into a Vite + React + TS + Tailwind starter (matches existing brand-repo template)
4. Iterate on the scaffold via the MCP until satisfied
5. When ready: extract components / pages into target product repo
6. Archive the standalone scaffold repo (D:\Archive\_brand-scaffolds-archived\<name>) — do not let it live indefinitely

## See also

- D:\Clinical.Trials\.mcp.json
- delivery/web-design-guidelines
