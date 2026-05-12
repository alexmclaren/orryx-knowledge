import { DomainMcpConfig } from '@orryx/core/dist/domain-mcp-base';
import { SecurityMcpServer } from './server';

const config: DomainMcpConfig = {
  domain: 'security',
  port: Number(process.env.ORRYX_PORT ?? 9002),
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
  const server = new SecurityMcpServer(config);
  await server.start();
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});