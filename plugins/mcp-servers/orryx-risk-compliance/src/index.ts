/**
 * orryx-risk-compliance MCP — entry point.
 *
 * Bootstraps the RiskComplianceMcpServer with config sourced from env vars.
 * Local dev: ORRYX_AUTH_MODE=none ORRYX_RISK_COMPLIANCE_TOKEN=dev npm run dev
 * Production: bearer auth via AWS Secrets Manager.
 */

import { DomainMcpConfig } from '@orryx/core/dist/domain-mcp-base';
import { RiskComplianceMcpServer } from './server';

const config: DomainMcpConfig = {
  domain: 'risk-compliance',
  port: Number(process.env.ORRYX_PORT ?? 9001),
  gateway_url: process.env.ORRYX_MCP_GATEWAY_URL ?? 'http://localhost:9000',
  gateway_register: process.env.ORRYX_GATEWAY_REGISTER !== 'false',
  auth: {
    mode: (process.env.ORRYX_AUTH_MODE as 'bearer' | 'mtls' | 'none') ?? 'bearer',
    secret_name: process.env.ORRYX_AUTH_SECRET_NAME,
  },
  audit: {
    sink: (process.env.ORRYX_AUDIT_SINK as 'gateway' | 'local-jsonl' | 'cloudwatch' | 'noop') ?? 'noop',
    sink_target: process.env.ORRYX_AUDIT_SINK_TARGET,
  },
  log_level: (process.env.ORRYX_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') ?? 'info',
};

async function main() {
  const server = new RiskComplianceMcpServer(config);
  await server.start();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
