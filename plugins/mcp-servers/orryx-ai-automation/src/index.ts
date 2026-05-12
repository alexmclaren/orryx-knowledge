import { DomainMcpConfig } from '@orryx/core/dist/domain-mcp-base';
import { AiAutomationMcpServer } from './server';

const config: DomainMcpConfig = {
  domain: 'ai-automation',
  port: Number(process.env.ORRYX_PORT ?? 9009),
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
  const server = new AiAutomationMcpServer(config);
  await server.start();
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});