/**
 * Risk + compliance service-domain MCP server.
 *
 * Reference implementation for the @orryx/core/domain-mcp-base contract.
 * Other domain MCPs (security, ai-automation, hr, accounting, etc.) follow
 * this shape with their own schemas + endpoints.
 */

import { z } from 'zod';
import {
  DomainMcpServer,
  DomainMcpConfig,
  defineEndpoint,
} from '@orryx/core/dist/domain-mcp-base';

import {
  ComplianceControlSchema,
  RiskScoreSchema,
  VendorStatusSchema,
  IncidentSchema,
  ComplianceControl,
  RiskScore,
  VendorStatus,
  Incident,
} from './schemas';

/**
 * In-memory store for the reference implementation.
 * Production MCPs back this with a real database (Postgres per orryx-standards).
 */
class InMemoryStore {
  controls = new Map<string, ComplianceControl>();
  vendors = new Map<string, VendorStatus>();
  incidents = new Map<string, Incident>();

  seed() {
    // Seed with a few example records for local-dev convenience
    this.controls.set('SOC2-CC1.1', {
      control_id: 'SOC2-CC1.1',
      framework: 'SOC2',
      description: 'Control environment — integrity and ethical values',
      owner: 'security-team',
      status: 'active',
      last_assessed: '2026-04-01T00:00:00Z',
      next_assessment_due: '2026-07-01T00:00:00Z',
    });
  }
}

export class RiskComplianceMcpServer extends DomainMcpServer {
  private store = new InMemoryStore();

  constructor(config: DomainMcpConfig) {
    super(config, '0.1.0');
    this.store.seed();
    this.registerEndpoints();
  }

  private registerEndpoints() {
    // /get-compliance-control
    this.registerEndpoint(
      defineEndpoint({
        name: '/get-compliance-control',
        description: 'Fetch a compliance control by ID',
        input_schema: z.object({ control_id: z.string() }),
        output_schema: ComplianceControlSchema,
        audit: { log: true, severity: 'info' },
      }),
      async (input) => {
        const control = this.store.controls.get(input.control_id);
        if (!control) throw new Error(`Control not found: ${input.control_id}`);
        return control;
      }
    );

    // /list-active-controls
    this.registerEndpoint(
      defineEndpoint({
        name: '/list-active-controls',
        description: 'List active compliance controls, optionally filtered by framework',
        input_schema: z.object({
          framework: z.string().optional(),
          limit: z.number().int().min(1).max(1000).default(100),
        }),
        output_schema: z.object({
          controls: z.array(ComplianceControlSchema),
          total: z.number().int(),
        }),
        audit: { log: true, severity: 'info' },
      }),
      async (input) => {
        const all = Array.from(this.store.controls.values()).filter(
          (c) => c.status === 'active' && (!input.framework || c.framework === input.framework)
        );
        return { controls: all.slice(0, input.limit), total: all.length };
      }
    );

    // /check-compliance-control
    this.registerEndpoint(
      defineEndpoint({
        name: '/check-compliance-control',
        description: 'Verify a compliance control is in active state and recently assessed',
        input_schema: z.object({ control_id: z.string() }),
        output_schema: z.object({
          control_id: z.string(),
          compliant: z.boolean(),
          rationale: z.string(),
        }),
        audit: { log: true, severity: 'low' },
      }),
      async (input) => {
        const control = this.store.controls.get(input.control_id);
        if (!control) return { control_id: input.control_id, compliant: false, rationale: 'Control not found' };
        const isActive = control.status === 'active';
        const daysSinceAssessed = control.last_assessed
          ? (Date.now() - new Date(control.last_assessed).getTime()) / (1000 * 60 * 60 * 24)
          : Infinity;
        const recentlyAssessed = daysSinceAssessed < 365;
        return {
          control_id: input.control_id,
          compliant: isActive && recentlyAssessed,
          rationale: !isActive
            ? `Control status is "${control.status}"`
            : !recentlyAssessed
            ? `Last assessed ${Math.round(daysSinceAssessed)} days ago (threshold: 365)`
            : 'Active and within assessment window',
        };
      }
    );

    // /compute-risk-score
    this.registerEndpoint(
      defineEndpoint({
        name: '/compute-risk-score',
        description: 'Compute risk score from likelihood × impact',
        input_schema: z.object({
          likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']),
          impact: z.enum(['negligible', 'minor', 'moderate', 'major', 'catastrophic']),
          rationale: z.string(),
        }),
        output_schema: RiskScoreSchema,
        audit: { log: true, severity: 'low' },
      }),
      async (input) => {
        const lMap = { rare: 1, unlikely: 2, possible: 3, likely: 4, 'almost-certain': 5 };
        const iMap = { negligible: 1, minor: 2, moderate: 3, major: 4, catastrophic: 5 };
        const raw = lMap[input.likelihood] * iMap[input.impact]; // 1..25
        const score = Math.round((raw / 25) * 100);              // 0..100
        return {
          score,
          likelihood: input.likelihood,
          impact: input.impact,
          rationale: input.rationale,
          computed_at: new Date().toISOString(),
        };
      }
    );

    // /sync-vendor-status
    this.registerEndpoint(
      defineEndpoint({
        name: '/sync-vendor-status',
        description: 'Upsert vendor compliance status (e.g., after a re-certification audit)',
        input_schema: VendorStatusSchema,
        output_schema: z.object({ vendor_id: z.string(), synced: z.boolean() }),
        audit: { log: true, severity: 'medium' },
      }),
      async (input) => {
        this.store.vendors.set(input.vendor_id, input as VendorStatus);
        return { vendor_id: input.vendor_id, synced: true };
      }
    );

    // /log-audit-event — explicit audit-trail endpoint
    this.registerEndpoint(
      defineEndpoint({
        name: '/log-audit-event',
        description: 'Append an explicit audit event (in addition to the automatic per-endpoint audit). Use for cross-domain workflow checkpoints.',
        input_schema: z.object({
          action: z.string(),
          actor: z.string(),
          resource_type: z.string().optional(),
          resource_id: z.string().optional(),
          severity: z.enum(['info', 'low', 'medium', 'high', 'critical']).default('info'),
          details: z.record(z.unknown()).optional(),
          correlation_id: z.string().uuid().optional(),
        }),
        output_schema: z.object({ event_id: z.string().uuid(), logged: z.boolean() }),
        audit: { log: true, severity: 'info' },
      }),
      async (input) => {
        // The base server already audits this endpoint call; we return a synthetic event_id
        // for the caller's correlation use. Production might persist explicitly here.
        return { event_id: crypto.randomUUID(), logged: true };
      }
    );

    // /create-incident
    this.registerEndpoint(
      defineEndpoint({
        name: '/create-incident',
        description: 'Open a new security/compliance incident',
        input_schema: IncidentSchema.omit({ opened_at: true, current_phase: true }),
        output_schema: IncidentSchema,
        audit: { log: true, severity: 'high' },
      }),
      async (input) => {
        const incident: Incident = {
          ...input,
          opened_at: new Date().toISOString(),
          current_phase: 'identification',
        };
        this.store.incidents.set(incident.incident_id, incident);
        return incident;
      }
    );

    // /update-incident
    this.registerEndpoint(
      defineEndpoint({
        name: '/update-incident',
        description: 'Move an incident to its next phase or update its current owner / next action',
        input_schema: z.object({
          incident_id: z.string(),
          current_phase: z
            .enum(['preparation', 'identification', 'containment', 'eradication', 'recovery', 'lessons-learned', 'closed'])
            .optional(),
          current_owner: z.string().optional(),
          next_action: z.string().optional(),
        }),
        output_schema: IncidentSchema,
        audit: { log: true, severity: 'high' },
      }),
      async (input) => {
        const incident = this.store.incidents.get(input.incident_id);
        if (!incident) throw new Error(`Incident not found: ${input.incident_id}`);
        const updated: Incident = {
          ...incident,
          ...(input.current_phase ? { current_phase: input.current_phase } : {}),
          ...(input.current_owner ? { current_owner: input.current_owner } : {}),
          ...(input.next_action ? { next_action: input.next_action } : {}),
          ...(input.current_phase === 'closed' ? { closed_at: new Date().toISOString() } : {}),
        };
        this.store.incidents.set(input.incident_id, updated);
        return updated;
      }
    );
  }
}
