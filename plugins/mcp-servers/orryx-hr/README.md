# orryx-hr MCP

hr service-domain MCP for the Orryx Group. Built on `@orryx/core/domain-mcp-base`.

## Status

**Scaffolded (Wave 6).** Endpoint handlers throw "not implemented" — fill in domain logic per the risk-compliance reference (`D:\orryx-knowledge\plugins\mcp-servers\orryx-risk-compliance\src\server.ts`).

## Endpoints (declared, awaiting implementation)

- ``/get-employee-record`` (get)
- ``/list-active-projects`` (list)
- ``/log-time-entry`` (log)
- ``/compute-cost-allocation`` (compute)
- ``/sync-payroll-state`` (sync)

## Domain → port

`hr` = `9006` (per the canonical port map in `@orryx/core/domain-mcp-base/README.md`).

## Quick start

\\\ash
npm install
cp .env.example .env
# Edit .env: set ORRYX_AUTH_MODE=none for local dev
npm run dev

curl http://localhost:9006/health
\\\

## See also

- `orryx-risk-compliance` (sibling) — reference implementation
- `@orryx/core/domain-mcp-base/README.md`
- `foundation/mcp-builder@orryx-group`
- `orchestration/service-domain-map@orryx-group`