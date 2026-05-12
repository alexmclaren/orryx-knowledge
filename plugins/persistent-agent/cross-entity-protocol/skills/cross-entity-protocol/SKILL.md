---
name: cross-entity-protocol
description: Cross-entity business-setup protocol for the Orryx Group. Triggers on "set up X for the Orryx Group", "onboard a new entity", "what do I need to coordinate across Triora and Pillarworks", or any work that touches multiple entities at once. Defines the canonical setup checklist + state hand-off pattern. Lifted from claw-memory ORRYX_TRIORA_BUSINESS_SETUP.md.
version: 0.1.0
license: MIT
---

# cross-entity-protocol

## TL;DR

When setting up new business state that crosses entities (Triora + Pillarworks + Brain + Flow + repair-template + Orryx parent), follow a canonical checklist: identity, access, compliance, comms, billing, observability. Document the cross-entity state in `orryx-brain/orchestration/CROSS_ENTITY_STATE.md`. Lifted from claw-memory's ORRYX_TRIORA_BUSINESS_SETUP.md; generalised to all entities in Wave 7.

## When to use

- New employee / contractor joins (needs access across multiple products)
- New client engagement spans products (e.g., a healthcare client using both Triora + Flow)
- New vendor onboarding (needs compliance review across products)
- Compliance event (audit, certification renewal) requires coordinated response across entities
- Cross-entity integration project (e.g., wiring Pillarworks to consume `mcp.orryx.dev` BOQ endpoints)

## The 6-section checklist

### 1. Identity

- [ ] Who is this for? (person / role / org)
- [ ] What entities are involved? (list from: orryx, triora, pillarworks, brain, flow, repair-template, directors-portal)
- [ ] Is this a one-time setup or ongoing relationship?

### 2. Access

For each entity involved:

- [ ] GitHub team membership (if applicable)
- [ ] AWS IAM role (per `orryx-standards` compliance profile for the entity)
- [ ] MCP gateway token (per-entity, stored in AWS Secrets Manager: `orryx/<entity>/api-token`)
- [ ] Vercel team membership (for products with Vercel deployments)
- [ ] Notion workspace access (if applicable)

### 3. Compliance

For each entity:

- [ ] Read `D:\orryx-governance\compliance\<entity>.md` for entity-specific compliance profile
- [ ] Healthcare entities (Triora, Flow): PHI handling agreement signed?
- [ ] Construction entity (Pillarworks): AU consumer protection acknowledgement?
- [ ] Repair vertical: OEM compliance scope confirmed?
- [ ] Data residency requirement matched? (Triora + Flow = ap-southeast-2; others = us-east-1)

### 4. Comms

- [ ] Slack channel(s) joined per entity
- [ ] Email distribution lists added (if applicable)
- [ ] Notion page subscriptions
- [ ] On-call rotation if production access (Triora paging chain)

### 5. Billing

- [ ] If client engagement: orryx-accounting client record created via `/create-invoice` or manually
- [ ] If new tooling: cost centre attributed to correct entity
- [ ] If shared cost: cost-allocation rule documented

### 6. Observability

- [ ] Reality-check audit includes this new state? (if cross-entity)
- [ ] Sentry / CloudWatch monitoring includes new resources?
- [ ] PagerDuty (if production-impacting) configured?

## Document the resulting state

Append to `orryx-brain/orchestration/CROSS_ENTITY_STATE.md`:

```markdown
## 2026-MM-DD: <one-line summary of the setup>

- **Identity:** (who/what)
- **Entities involved:** (list)
- **Status:** setup-complete / in-progress / blocked
- **Compliance review:** (link to ADR in `decisions/` if needed)
- **Owner:** (person responsible for this state going forward)
- **Next checkpoint:** (when to re-verify)
```

## Cross-entity dependencies become MCP calls

Once `orryx-mcp-gateway` is revived (Wave 1 done) and the per-domain MCPs ship (Wave 6):

- HR setup → `orryx-hr-mcp / /create-employee-record`
- Accounting setup → `orryx-accounting-mcp / /create-invoice` (for client engagements)
- Risk-compliance review → `orryx-risk-compliance-mcp / /check-compliance-control`
- Security access → `orryx-security-mcp / /sync-incident-state` (for access-related incidents)

Don't manually duplicate state — route through the gateway.

## Patterns from claw-memory

claw-memory's ORRYX_TRIORA_BUSINESS_SETUP.md originally documented just the Orryx ↔ Triora coordination. The generalisation here:

1. Replace "Orryx + Triora" with the variable entity-list
2. Replace per-product checklists with entity-agnostic versions tied to compliance profiles
3. Add the resulting-state documentation pattern (`CROSS_ENTITY_STATE.md`)

The principle stays the same: cross-entity setup is checklist-driven, state-documented, and routed through canonical channels (gateway / compliance profiles / observability).

## Anti-patterns

- **Per-entity setup runs in isolation.** Each entity setup happens independently → drift, missing access, surprise compliance gaps. The 6-section checklist exists to prevent this.
- **Cross-entity state stored in chat.** "I think we set up X for Pillarworks last week" is not state. Document in `CROSS_ENTITY_STATE.md`.
- **MCP gateway bypassed.** Direct cross-entity file reads or DB writes — fragile and undocumented. Route through `mcp.orryx.dev`.

## See also

- claw-memory `ORRYX_TRIORA_BUSINESS_SETUP.md` — original pattern
- `orchestration/3-lane-parallel` — how state propagates across Brain, Triora, Pillarworks lanes
- `orchestration/service-domain-map` — which MCP serves which capability per entity
- `D:\orryx-governance\compliance\` — per-entity compliance profiles
- `delivery/sync-notion` — for pushing cross-entity state docs to Notion
