# orryx-accounting MCP

accounting service-domain MCP for the Orryx Group. Built on `@orryx/core/domain-mcp-base`.

## Status

**Scaffolded (Wave 6).** Endpoint handlers throw "not implemented" — fill in domain logic per the risk-compliance reference (`D:\orryx-knowledge\plugins\mcp-servers\orryx-risk-compliance\src\server.ts`).

## Endpoints (declared, awaiting implementation)

- ``/create-invoice`` (create)
- ``/log-time-entry`` (log)
- ``/compute-revenue`` (compute)
- ``/list-outstanding-receivables`` (list)
- ``/sync-stripe-state`` (sync)

## Domain → port

`accounting` = `9007` (per the canonical port map in `@orryx/core/domain-mcp-base/README.md`).

## Quick start

\\\ash
npm install
cp .env.example .env
# Edit .env: set ORRYX_AUTH_MODE=none for local dev
npm run dev

curl http://localhost:9007/health
\\\

## See also

- `orryx-risk-compliance` (sibling) — reference implementation
- `@orryx/core/domain-mcp-base/README.md`
- `foundation/mcp-builder@orryx-group`
- `orchestration/service-domain-map@orryx-group`