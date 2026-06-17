# CLAUDE.md — orryx-knowledge

Guidance for Claude Code (and other coding agents) working in this repository.

## What this is

`orryx-knowledge` is **not an application or a library**. It serves two distinct
purposes (both confirmed against disk, not just the README):

1. **The Orryx Group's Claude Code plugin marketplace** — the single discovery
   surface at `.claude-plugin/marketplace.json` (`name: "orryx-group"`,
   `version 0.2.0`, MIT). Every cross-cutting plugin used by Triora, Pillarworks,
   Orryx Brain, Orryx Flow, and the crash-repair template is discovered through
   here.
2. **A knowledge base** — domain expertise, reusable patterns, ADRs,
   anti-patterns, lessons-learned, and onboarding guides, read by humans and
   agents for context.

The repository is **overwhelmingly documentation + JSON config**: on `main`,
~81 Markdown files and ~72 JSON files versus only 11 small TypeScript files.
There is **no root `package.json`, no root build, and no root test target** —
do not assume one exists or try to run `npm run build` / `npm test` at the root.

## Repository layout (tracked on `main`)

| Path | Role |
|---|---|
| `.claude-plugin/marketplace.json` | **Primary discovery surface** — the marketplace manifest. Edit deliberately; this is what Claude Code reads to list/install plugins. |
| `.claude-plugin/staged-plugins.json` | Domain/MCP plugins not yet packaged (were `staged:true`). Promote into `marketplace.json` `plugins[]` only when the SKILL.md/server is real, not a `MIGRATION-TARGET.md` placeholder. |
| `plugins/` | Cross-cutting plugins, the canonical home. Layered: `foundation/`, `methodology/`, `orchestration/`, `delivery/`, `persistent-agent/`, `mcp-servers/`. |
| `plugins/mcp-servers/<name>/` | The only real code in the repo — small TypeScript MCP servers (see below). |
| `vertical-templates/` | Industry-specific reusable scaffolds (`_template/`, `crash-repair/`). |
| `domain/` `patterns/` `anti-patterns/` `lessons-learned/` `onboarding/` | The knowledge base — Markdown context, no build. |
| `CONTRIBUTING.md` | Plugin authoring guidance + the quality bar — read it before adding a plugin or skill. |
| `README.md` `TODO.md` | Repo overview + a Reality-Check TODO stub. |

Domain-specific plugins (e.g. `triora-healthcare-context`) live in their
**owning entity's repo** (e.g. `Clinical_trials/.claude-plugin/`) and are
referenced from this marketplace via `source.url` — the deliberate **hybrid
topology** (single discovery surface, federated source-of-truth). Do not copy a
domain plugin's body into this repo; reference it.

## The TypeScript surface (the only build/test target — and it's per-plugin)

The 11 `.ts` files are **not** a top-level `src/`. They are five independent
MCP-server mini-packages, each with its own `package.json`:

```
plugins/mcp-servers/orryx-accounting/      (src/index.ts, src/server.ts)
plugins/mcp-servers/orryx-ai-automation/   (src/index.ts, src/server.ts)
plugins/mcp-servers/orryx-hr/              (src/index.ts, src/server.ts)
plugins/mcp-servers/orryx-risk-compliance/ (src/index.ts, src/schemas.ts, src/server.ts)
plugins/mcp-servers/orryx-security/        (src/index.ts, src/server.ts)
```

Each one:
- depends on **`@orryx/core` `^1.1.0`** and `zod ^3.22.4`; builds with
  `typescript ^5.3.3` via `tsc`; dev-runs with `tsx`; tests with `vitest`;
  `engines.node >= 18`.
- is built on `@orryx/core`'s **`DomainMcpBase`** — e.g.
  `import { DomainMcpConfig } from '@orryx/core/dist/domain-mcp-base'`. This is
  why orryx-knowledge is a **consumer of `@orryx/core`** in the internal
  dependency graph; the `^1.1.0` pin is the matching-version side of that graph.

To build/test one of these, work **inside that plugin's directory**, not at the
repo root:

```bash
cd plugins/mcp-servers/orryx-security
npm install
npm run build        # tsc → dist/
npm run type-check   # tsc --noEmit
npm test             # vitest
```

If you change `@orryx/core`'s exported surface, expect these five packages to be
the consumers that feel it — but **do not "fix" the `@orryx/core` version from
inside this repo**; version drift is tracked by the dependency-graph routine.

## ⚠️ Trust disk, not the headline docs

- The README frames this as a "marketplace + knowledge base" — that part is
  accurate. But it does **not** advertise that there is no root build/test; the
  only buildable code is the five per-plugin MCP servers above. Don't run root
  `npm` scripts.
- `vertical-templates/` and `staged-plugins.json` describe plugins that are
  **scaffolds/placeholders, not shipped** — confirm a plugin has a real
  `SKILL.md`/server before treating it as live (`staged-plugins.json` exists
  precisely to keep placeholders out of the discovered marketplace).
- A Windows reserved-name `NUL` file exists in the working tree (untracked, not
  in git). Leave it — it is an artifact, not a deliverable; do not try to `rm`
  it via normal tooling.

## Conventions (authoring plugins / skills)

`CONTRIBUTING.md` is the source of truth. Highlights:

- A plugin lives at `plugins/<layer>/<plugin-name>/` with a
  `.claude-plugin/plugin.json` (`name`, `description`, `version`) plus optional
  `skills/`, `agents/`, `commands/`, `hooks/`, a `README.md`, and a `CHANGELOG.md`.
- A `SKILL.md` needs frontmatter (`name`, `description`, `version`,
  `license: MIT`). The **`description` is the routing rule** — write it third
  person, no first-person, no marketing, no emoji, and paste-testable against
  likely user prompts. A weak description means the skill never triggers.
- When you add a plugin to the marketplace, add its entry to
  `.claude-plugin/marketplace.json` `plugins[]` (or `staged-plugins.json` if it
  is still a placeholder). Keep the JSON valid — it is the discovery manifest.
- Knowledge-base edits (`domain/`, `patterns/`, `decisions`, `anti-patterns/`,
  `lessons-learned/`, `onboarding/`) are Markdown-only context; there is no gate
  beyond keeping them coherent.

## Platform constraint

Orryx infrastructure is **AWS + Cloudflare only**. Do not introduce tooling,
deploy targets, or plugin sources for other hosts.
