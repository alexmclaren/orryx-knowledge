---
name: mcp-builder
description: Authors new MCP servers for the Orryx Group using @orryx/core's DomainMcpBase. Triggers on requests to build an MCP server, add an MCP integration, scaffold a service-domain MCP, or "how do I make an MCP server". Enforces the verb-noun endpoint convention and audit-event schema lifted from orryx-risk-compliance design.
version: 0.1.0
license: MIT
---

# mcp-builder

## TL;DR

Wraps Anthropic's mcp-builder with the Orryx pattern: every service-domain MCP extends `DomainMcpServer` from `@orryx/core`'s `domain-mcp-base`, registers with `orryx-mcp-gateway` automatically, follows the `/<verb>-<noun>` endpoint naming convention, and emits standard audit events. Domain-specific 20% is the only code you write — the base handles bootstrap, auth, audit, gateway registration, health checks.

## Workflow

### 1. Decide if you're building a service-domain MCP or something else

| Building… | Use… |
|---|---|
| One of the 11 Orryx service-domain MCPs (HR / sales / product / etc.) | `DomainMcpServer` base, this skill |
| A client-specific MCP for an engagement | `DomainMcpServer` base + per-client config |
| A third-party-integration wrapper MCP | Standalone, no base (no value from registration / audit) |
| A test/exploration MCP | Anthropic's mcp-builder unmodified |

### 2. Pick the domain + port

Existing convention:

| Domain | Port |
|---|---|
| risk-compliance | 9001 |
| security | 9002 |
| product | 9003 |
| customer | 9004 |
| strategy | 9005 |
| hr | 9006 |
| accounting | 9007 |
| ui-design | 9008 |
| ai-automation | 9009 |
| data-analytics | 9010 |
| sales | 9011 |
| engineering | 9012 |

New domains: pick the next free port, document in `D:\orryx-core\src\domain-mcp-base\README.md`.

### 3. Scaffold the repo

```
orryx-<domain>/
├── package.json                  # depends on @orryx/core ^1.1.0 + zod
├── tsconfig.json
├── src/
│   ├── index.ts                  # bootstrap + server start
│   ├── server.ts                 # extends DomainMcpServer
│   ├── schemas.ts                # domain-specific zod schemas
│   └── endpoints/                # one file per /<verb>-<noun>
│       ├── get-employee-record.ts
│       └── ...
├── .env.example
├── README.md
└── CLAUDE.md                     # thin reference to orryx-standards
```

### 4. Subclass `DomainMcpServer`

```typescript
import { z } from 'zod';
import {
  DomainMcpServer,
  DomainMcpConfig,
  defineEndpoint,
} from '@orryx/core/dist/domain-mcp-base';

const EmployeeSchema = z.object({ employee_id: z.string(), name: z.string() });

export class HrMcpServer extends DomainMcpServer {
  constructor(config: DomainMcpConfig) {
    super(config, '0.1.0');

    this.registerEndpoint(
      defineEndpoint({
        name: '/get-employee-record',
        description: 'Fetch an employee record by ID',
        input_schema: z.object({ employee_id: z.string() }),
        output_schema: EmployeeSchema,
      }),
      async (input) => this.fetchEmployee(input.employee_id)
    );
  }

  private async fetchEmployee(id: string) {
    return { employee_id: id, name: 'Jane Doe' };
  }
}
```

### 5. Endpoint naming: `/<verb>-<noun>`

Valid verbs: `get`, `list`, `create`, `update`, `delete`, `check`, `compute`, `log`, `sync`, `route`.

`defineEndpoint()` enforces this — it'll throw at startup if the name doesn't match.

### 6. Audit events are automatic

The base emits an `AuditEvent` on every endpoint call. To customise severity per endpoint:

```typescript
defineEndpoint({
  name: '/delete-employee-record',
  description: '...',
  input_schema: z.object({ employee_id: z.string() }),
  output_schema: z.object({ deleted: z.boolean() }),
  audit: { log: true, severity: 'high' },   // override default 'medium' for delete
})
```

### 7. Test locally

```bash
# Start the MCP
ORRYX_HR_TOKEN=dev-token npm run dev

# Test endpoint
curl -X POST http://localhost:9006/get-employee-record \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer dev-token' \
  -d '{"employee_id":"emp-001"}'

# Test health
curl http://localhost:9006/health
```

### 8. Register with gateway

The base auto-registers on startup if `config.gateway_register === true`. Set `gateway_url` to `https://mcp.orryx.dev` in production, `http://localhost:9000` for local gateway.

### 9. Production checklist

- [ ] Tokens in AWS Secrets Manager (not `.env`)
- [ ] Auth mode `bearer` (not `none`) in production config
- [ ] Audit sink set to `cloudwatch` or `gateway` (not `noop`)
- [ ] Health check responds 200 OK
- [ ] Gateway registration succeeds
- [ ] All endpoint output_schemas tested (output validation catches handler bugs)

## Gotchas

- **Optional peer deps.** If `auth.mode === 'bearer'` and `auth.secret_name` is set, install `@aws-sdk/client-secrets-manager`. If using workflow YAML loader, install `js-yaml` + `@types/js-yaml`. Otherwise these dynamic imports gracefully fail.
- **Port collisions on dev.** The 9001-9012 range is for the 11+ canonical domain MCPs. Use 9100+ for experiments to avoid collision.
- **Domain naming.** `DomainName` is a TypeScript literal union — adding a new domain requires a base package update.

## See also

- `@orryx/core/dist/domain-mcp-base/README.md` — full base package API
- `D:\orryx-audit\06-migration-sequence.md` — Wave 6 (MCP buildout) plan
- Anthropic's official mcp-builder — generic MCP server authoring
