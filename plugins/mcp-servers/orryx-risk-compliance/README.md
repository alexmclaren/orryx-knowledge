# orryx-risk-compliance MCP

Risk + compliance service-domain MCP server for the Orryx Group. **Reference implementation** for the `@orryx/core/domain-mcp-base` contract.

## Why this is the reference

The 2026-05-12 audit found this domain stub was the **most documented** of the 11 service-domain scaffolds (9960-byte README + 9250-byte CLAUDE.md + `.governance/` dir + design specs for SOC2/ISO27001/GDPR/HIPAA/PCI/NIST/CIS + blockchain-anchored audit). Other domain MCPs (security, ai-automation, hr, accounting) extend this same shape with their own schemas + endpoints.

## Endpoints

| Endpoint | Verb | Purpose |
|---|---|---|
| `/get-compliance-control` | get | Fetch a control by ID |
| `/list-active-controls` | list | List active controls, filtered by framework |
| `/check-compliance-control` | check | Verify control is active + recently assessed |
| `/compute-risk-score` | compute | Risk score from likelihood × impact |
| `/sync-vendor-status` | sync | Upsert vendor compliance status |
| `/log-audit-event` | log | Explicit cross-domain audit event |
| `/create-incident` | create | Open a security/compliance incident |
| `/update-incident` | update | Move incident to next phase / update owner |

All endpoints follow the `/<verb>-<noun>` convention enforced by `defineEndpoint()` in `@orryx/core/domain-mcp-base`.

## Frameworks supported

SOC2 / ISO27001 / GDPR / HIPAA / PCI-DSS / NIST-SP-800-53 / CIS-Controls / APRA-CPS-234 / APRA-CPS-230 / AU-Privacy-Act-1988

## Quick start (local)

```bash
npm install
cp .env.example .env
# Edit .env: set ORRYX_AUTH_MODE=none for local dev
npm run dev

# Test endpoint
curl -X POST http://localhost:9001/get-compliance-control \
  -H 'Content-Type: application/json' \
  -d '{"control_id": "SOC2-CC1.1"}'

# Health
curl http://localhost:9001/health
```

## Production deploy

See `D:\orryx-knowledge\plugins\delivery\deploy-check\skills\deploy-check\SKILL.md` for the pre-deploy gate.

1. AWS Secrets Manager: store `orryx/risk-compliance/api-token`
2. AWS CloudWatch Logs: create `/aws/orryx/risk-compliance/audit` log group
3. ECS Fargate task definition: per `D:\orryx-standards\terraform\modules\aws-ecs-service`
4. Health-check ALB target: `/health`
5. Register with `orryx-mcp-gateway`: automatic on startup

## Data model

In-memory store for the reference implementation. Production MCP backs this with Postgres per `D:\orryx-standards\README.md` tech stack standards.

Schemas in `src/schemas.ts`:
- `ComplianceControl` — a single compliance control with framework + status + assessment dates
- `RiskScore` — derived from likelihood × impact (0–100 scale)
- `VendorStatus` — third-party risk; data-access-level + certifications + DPA-signed
- `Incident` — 7-phase incident response (preparation → identification → containment → eradication → recovery → lessons-learned → closed)

## See also

- `@orryx/core/domain-mcp-base/README.md` — base class API
- `foundation/mcp-builder@orryx-group` — for authoring new domain MCPs
- `orchestration/service-domain-map@orryx-group` — where this fits in the cross-product map
- `delivery/security-audit@orryx-group` — consumes this MCP for compliance verification
