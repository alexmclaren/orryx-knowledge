/**
 * orryx-accounting service-domain MCP server.
 *
 * Scaffolded by Wave 6 of the architecture migration. Implements the
 * @orryx/core/domain-mcp-base contract. Endpoints currently throw
 * "not implemented" — fill in domain logic per the risk-compliance
 * reference implementation pattern.
 *
 * See: D:\orryx-knowledge\plugins\mcp-servers\orryx-risk-compliance\src\server.ts
 */

import { z } from 'zod';
import { DomainMcpServer, DomainMcpConfig, defineEndpoint } from '@orryx/core/dist/domain-mcp-base';

const InvoiceLineItemSchema = z.object({
  description: z.string(),
  amount_usd: z.number().min(0),
});

export class AccountingMcpServer extends DomainMcpServer {
  constructor(config: DomainMcpConfig) {
    super(config, '0.1.0');
    this.registerEndpoints();
  }

  private registerEndpoints() {
    this.registerEndpoint(
      defineEndpoint({
        name: '/create-invoice',
        description: 'Create a new invoice for a client',
        input_schema: z.object({
          client_id: z.string(),
          line_items: z.array(InvoiceLineItemSchema),
          due_date: z.string(),
        }),
        output_schema: z.object({
          invoice_id: z.string().uuid(),
          total_usd: z.number().min(0),
        }),
        audit: { log: true, severity: 'low' },
      }),
      async () => {
        throw new Error('/create-invoice: not yet implemented — Wave 6 scaffold');
      }
    );

    this.registerEndpoint(
      defineEndpoint({
        name: '/log-time-entry',
        description: 'Log a time entry for billing purposes',
        input_schema: z.object({
          employee_id: z.string(),
          client_id: z.string(),
          hours: z.number().min(0).max(24),
          date: z.string(),
        }),
        output_schema: z.object({ entry_id: z.string().uuid(), logged: z.boolean() }),
        audit: { log: true, severity: 'info' },
      }),
      async () => {
        throw new Error('/log-time-entry: not yet implemented — Wave 6 scaffold');
      }
    );

    this.registerEndpoint(
      defineEndpoint({
        name: '/compute-revenue',
        description: 'Compute revenue for a billing period',
        input_schema: z.object({ period: z.string() }),
        output_schema: z.object({
          period: z.string(),
          revenue_usd: z.number().min(0),
          computed_at: z.string().datetime(),
        }),
        audit: { log: true, severity: 'low' },
      }),
      async () => {
        throw new Error('/compute-revenue: not yet implemented — Wave 6 scaffold');
      }
    );

    this.registerEndpoint(
      defineEndpoint({
        name: '/list-outstanding-receivables',
        description: 'List unpaid invoices, optionally filtered by minimum days overdue',
        input_schema: z.object({
          days_overdue_min: z.number().int().min(0).default(0),
        }),
        output_schema: z.object({
          receivables: z.array(z.unknown()),
          total: z.number().int(),
        }),
        audit: { log: true, severity: 'info' },
      }),
      async () => {
        throw new Error('/list-outstanding-receivables: not yet implemented — Wave 6 scaffold');
      }
    );

    this.registerEndpoint(
      defineEndpoint({
        name: '/sync-stripe-state',
        description: 'Sync payment state from Stripe (webhook handler)',
        input_schema: z.object({ session_id: z.string() }),
        output_schema: z.object({ session_id: z.string(), synced: z.boolean() }),
        audit: { log: true, severity: 'medium' },
      }),
      async () => {
        throw new Error('/sync-stripe-state: not yet implemented — Wave 6 scaffold');
      }
    );
  }
}
