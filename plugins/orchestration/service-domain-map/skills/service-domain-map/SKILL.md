---
name: service-domain-map
description: Cross-product orchestration map for the Orryx Group. Triggers on "what does X depend on", "which MCP should I call for Y", "/SERVICE_DOMAIN_MAP", or any question about which service-domain MCP serves which capability across products. Materialises the implicit cross-repo map from Brain into a single maintained doc.
version: 0.1.0
license: MIT
---

# service-domain-map

## TL;DR

The Orryx Group's 11+ service-domain MCPs (HR, sales, product, customer, strategy, accounting, UI-design, data-analytics, AI-automation, risk-compliance, security, engineering) serve cross-cutting capabilities to the products (Triora, Pillarworks, Flow, Brain, etc.). This skill provides the **canonical map**: which MCP serves which capability, which product currently consumes it, and what data flows where.

Originally an implicit map maintained in Brain's `/SERVICE_DOMAIN_MAP` slash command; materialised here in Wave 3.

## The map (current state)

### orryx-mcp-gateway (mcp.orryx.dev)

| Capability | Routes to | Consumed by |
|---|---|---|
| boq-generation | orryx-data-analytics + orryx-ai-automation | Pillarworks |
| material-pricing | orryx-data-analytics | Pillarworks |
| project-estimation | orryx-ai-automation | Pillarworks |
| takeoff-detection | orryx-ai-automation + orryx-ui-design | Pillarworks |

### Per-domain MCP endpoints (planned post Wave 6)

| Domain | Port | Key endpoints | Consumed by |
|---|---|---|---|
| risk-compliance | 9001 | /log-audit-event, /check-compliance-control, /compute-risk-score | All products |
| security | 9002 | /check-vulnerability, /sync-incident-state, /log-security-event | All products |
| product | 9003 | (TBD) | (TBD) |
| customer | 9004 | (TBD) | (TBD) |
| strategy | 9005 | (TBD) | (TBD) |
| hr | 9006 | /get-employee-record, /list-active-projects | Brain, Pillarworks |
| accounting | 9007 | /create-invoice, /log-time-entry | Brain |
| ui-design | 9008 | /get-design-token, /sync-figma-update | All products |
| ai-automation | 9009 | /run-workflow, /list-active-jobs | Pillarworks |
| data-analytics | 9010 | /compute-metric, /sync-warehouse | Pillarworks, Brain |
| sales | 9011 | (TBD) | (TBD) |
| engineering | 9012 (proposed) | (TBD) | Brain |

## Adding to the map

When a product starts consuming a new MCP capability:

1. The MCP itself registers via `@orryx/core/domain-mcp-base` `GatewayRegistration`
2. Update this skill's map (this file) — add the row
3. Update Brain's `orchestration/SERVICE_DOMAIN_MAP.md` (the operational state file)
4. If the capability crosses entities, update `D:\orryx-governance\compliance/<entity>.md` for compliance implications

## When to consult the map

- **Before adding a new endpoint** — does an existing MCP already serve this?
- **Before adding a new MCP** — does an existing endpoint serve this capability?
- **Investigating cross-product issues** — which product talks to which MCP for what?
- **Compliance review** — what data flows where; which boundaries are crossed?
- **Migration planning** — if an MCP is being deprecated, which products break?

## Brain's `/SERVICE_DOMAIN_MAP` slash command

The original implicit map. In Wave 3, this becomes:

- This skill: the canonical written map (markdown)
- Brain's slash command: read this skill, present interactive view
- `orchestration/SYNC_STATE.md`: real-time state (which MCPs are healthy)

## Anti-patterns

- **Product → product file reads.** No product should read another product's files (e.g., Pillarworks reading `Clinical_trials/.claude/` directly). Cross-product communication goes through the gateway via documented MCP capabilities.
- **Capability sprawl.** If two MCPs claim the same capability, the map should declare which is canonical. The other one's endpoint becomes a proxy or gets deprecated.
- **Undocumented integrations.** Any new product → MCP consumer relationship MUST update this map before the integration ships.

## Gotchas

- **The map is the source of truth, not the code.** If an integration is in code but not in the map, the map gets updated, not the code reverted.
- **External MCPs (magic-patterns, Sentry, Playwright, VisionCraft) are NOT in this map.** They're consumed directly, not via the gateway. They go in each repo's `.mcp.json`.
- **mcp.orryx.dev is the production gateway URL.** Local dev: `http://localhost:9000`. Don't hardcode either; use `ORRYX_MCP_GATEWAY_URL` env var.

## See also

- `foundation/mcp-builder` — for authoring new domain MCPs
- `@orryx/core/domain-mcp-base` — the base class every domain MCP extends
- `orryx-mcp-gateway` repo — the routing layer
- `orryx-brain/orchestration/SERVICE_DOMAIN_MAP.md` — operational state
- `orchestration/3-lane-parallel` — for cross-product sprint coordination
- D:\orryx-audit\04-cross-entity-analysis.md — the dependency analysis informing this map
