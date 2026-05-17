# Orryx Group Developer Portal

This is the canonical entry point for developers joining or extending the Orryx Group. Public-facing surface: eventually `dev.orryx.dev` (or `orryx.dev/dev`).

## What you can do here

| Goal | Path |
|---|---|
| Install the foundation plugins for your project | [Install foundation plugins](#install-foundation-plugins) |
| Scaffold a new product / vertical / domain MCP / plugin | [Use `@orryx/create`](#use-orryxcreate) |
| Understand the architecture | `D:\orryx-audit\10-target-architecture.md` |
| Follow conventions | `D:\orryx-standards\AGENTS.base.md` + `CLAUDE.base.md` |
| Find an existing plugin | `D:\orryx-knowledge\.claude-plugin\marketplace.json` |
| Contribute a new plugin | `D:\orryx-knowledge\CONTRIBUTING.md` |

## Install foundation plugins

```bash
# Register the Orryx Group marketplace once
claude /plugin marketplace add orryx-group https://github.com/alexmclaren/orryx-knowledge

# Install foundation plugins (recommended for every product)
claude /plugin install foundation/safety-hooks-base@orryx-group
claude /plugin install foundation/asset-index@orryx-group
claude /plugin install foundation/plan-mode-first@orryx-group
claude /plugin install foundation/model-tiering-convention@orryx-group

# Recommended methodology
claude /plugin install methodology/plan-and-execute@orryx-group
claude /plugin install methodology/code-review@orryx-group
claude /plugin install methodology/tdd-discipline@orryx-group

# Recommended orchestration (if doing parallel work / Sprint-shaped work)
claude /plugin install orchestration/agent-swarming@orryx-group
claude /plugin install orchestration/cpd-protocol@orryx-group

# Operational primitives
claude /plugin install delivery/credential-audit@orryx-group
claude /plugin install delivery/security-audit@orryx-group
claude /plugin install delivery/quality-check@orryx-group
claude /plugin install delivery/deploy-check@orryx-group
```

Or use a project's `.claude/plugins.json` to declare required plugins:

```json
{
  "marketplaces": ["orryx-group"],
  "plugins": [
    "foundation/safety-hooks-base",
    "foundation/plan-mode-first",
    "methodology/plan-and-execute",
    "methodology/code-review",
    "methodology/tdd-discipline",
    "orchestration/agent-swarming",
    "delivery/credential-audit",
    "delivery/security-audit",
    "delivery/quality-check"
  ]
}
```

## Use `@orryx/create`

```bash
# Install once
npm install -g @orryx/core@latest

# Scaffold new product
npx @orryx/create product trial-match

# Scaffold new vertical from _template
npx @orryx/create vertical medical-imaging

# Scaffold new service-domain MCP
npx @orryx/create domain-mcp legal

# Scaffold new plugin
npx @orryx/create plugin methodology/red-team-review
```

## Architecture in one paragraph

The Orryx Group is **5+ products** (Triora clinical trials, Pillarworks BOQ construction, Orryx Brain orchestrator, Orryx Flow clinical workflow OS, Directors Portal, plus the parent Orryx Consulting brand) **coordinated** via `orryx-mcp-gateway` at `mcp.orryx.dev`, **standardised** through `orryx-standards` (AGENTS.base.md + CLAUDE.base.md + gitignore-snippets), and **enriched** by `orryx-knowledge` (the plugin marketplace + ADRs + onboarding + lessons-learned + vertical-templates). Service-domain MCPs (HR, sales, product, customer, strategy, accounting, UI-design, data-analytics, AI-automation, risk-compliance, security) provide cross-product capability via the gateway.

Read `D:\orryx-audit\10-target-architecture.md` for the full picture.

## Maturity by entity (as of 2026-05-12 audit)

| Entity | Status | Production |
|---|---|---|
| Triora (Clinical_trials) | Sprint 181, Phase 4 | ✅ `triora.io` |
| Pillarworks (build-mvp) | Pre-launch MVP | 🟡 `build.orryx.dev` |
| Orryx Brain | Sprint 28 MVP launch | 🟡 `orryx.dev` + `directors.orryx.dev` |
| Orryx Flow | Pre-MVP | ⏳ |
| Directors Portal | Extracted Wave 0 | 🟡 (post-extraction) |
| crash-repair-template | Vertical template (first instance) | n/a — template |
| Orryx parent (consulting) | Active | ✅ `orryx.dev` |

## Compliance per entity

| Entity | Compliance frameworks | Data residency |
|---|---|---|
| Triora | AU Privacy Act 1988, TGA Guidance, HIPAA-adjacent | ap-southeast-2 |
| Orryx Flow | AU Privacy Act 1988, healthcare-adjacent | ap-southeast-2 |
| Pillarworks | Australian Consumer Law, 7-year tax retention | us-east-1 |
| crash-repair-template | AU Privacy Act, ACL, state-level repair regs | ap-southeast-2 |
| Orryx Brain (internal) | SOC2 (planned) | us-east-1 |

Details in `D:\orryx-governance\compliance\<entity>.md` (per-entity profiles to be authored).

## Getting help

- **Issues** with a plugin: open an issue on `github.com/alexmclaren/orryx-knowledge/issues`
- **Questions** about a product: see the product's README + CLAUDE.md
- **General**: `engineering@orryx.dev`

## What's coming

- `@orryx/create` full implementation (Wave 8 follow-up)
- Public marketplace publish event (after public-posture decision per `D:\orryx-audit\07-decisions-needed.md` D3)
- Additional vertical-templates (medical-imaging, legal-services, etc.)
- `orryx-mcp-gateway` revival + 5 reference domain MCPs going live (Wave 6 in progress)

## See also

- `D:\orryx-audit\00-EXECUTIVE-SUMMARY.md` — the architecture audit headline
- `D:\orryx-audit\10-target-architecture.md` — end-state architecture
- `D:\orryx-audit\11-success-metrics.md` — measurable outcomes
- `D:\orryx-knowledge\CONTRIBUTING.md` — plugin authoring guidance
- `D:\orryx-standards\README.md` — single-sourced standards
