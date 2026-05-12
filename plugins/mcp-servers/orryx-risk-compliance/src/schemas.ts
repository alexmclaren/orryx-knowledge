/**
 * Domain-specific schemas for orryx-risk-compliance MCP.
 *
 * Lifted from the risk-compliance design (the most documented domain stub
 * from the 2026-05-12 audit). Compatible with SOC2 / ISO27001 / GDPR / HIPAA /
 * PCI / NIST SP 800-53 / CIS control families.
 */

import { z } from 'zod';

/**
 * Control framework identifier — which compliance framework a control belongs to.
 */
export const ControlFrameworkSchema = z.enum([
  'SOC2',
  'ISO27001',
  'GDPR',
  'HIPAA',
  'PCI-DSS',
  'NIST-SP-800-53',
  'CIS-Controls',
  'APRA-CPS-234',
  'APRA-CPS-230',
  'AU-Privacy-Act-1988',
]);

/**
 * Control status — operational state of a compliance control.
 */
export const ControlStatusSchema = z.enum(['active', 'in-review', 'remediation-required', 'deprecated']);

/**
 * A single compliance control.
 */
export const ComplianceControlSchema = z.object({
  control_id: z.string(),                  // e.g., 'SOC2-CC1.1', 'GDPR-Art-32'
  framework: ControlFrameworkSchema,
  description: z.string(),
  owner: z.string(),                       // team or person responsible
  status: ControlStatusSchema,
  last_assessed: z.string().datetime().optional(),
  next_assessment_due: z.string().datetime().optional(),
  evidence_paths: z.array(z.string()).optional(),
});
export type ComplianceControl = z.infer<typeof ComplianceControlSchema>;

/**
 * Risk score — derived from likelihood × impact, clamped to [0, 100].
 */
export const RiskScoreSchema = z.object({
  score: z.number().min(0).max(100),
  likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']),
  impact: z.enum(['negligible', 'minor', 'moderate', 'major', 'catastrophic']),
  rationale: z.string(),
  computed_at: z.string().datetime(),
});
export type RiskScore = z.infer<typeof RiskScoreSchema>;

/**
 * Vendor compliance status — for third-party risk management.
 */
export const VendorStatusSchema = z.object({
  vendor_id: z.string(),
  vendor_name: z.string(),
  data_access_level: z.enum(['none', 'metadata', 'aggregated', 'pii', 'phi', 'financial', 'full']),
  certifications: z.array(z.string()),     // e.g., ['SOC2-Type-II', 'ISO27001']
  dpa_signed: z.boolean(),                 // Data Processing Agreement
  next_review_due: z.string().datetime(),
  status: z.enum(['active', 'under-review', 'remediation-required', 'deprecated']),
});
export type VendorStatus = z.infer<typeof VendorStatusSchema>;

/**
 * Incident response — 7-phase pattern from risk-compliance design.
 */
export const IncidentPhaseSchema = z.enum([
  'preparation',
  'identification',
  'containment',
  'eradication',
  'recovery',
  'lessons-learned',
  'closed',
]);
export const IncidentSchema = z.object({
  incident_id: z.string(),
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  current_phase: IncidentPhaseSchema,
  opened_at: z.string().datetime(),
  affected_systems: z.array(z.string()),
  affected_data_categories: z.array(z.enum(['pii', 'phi', 'financial', 'internal', 'public'])),
  current_owner: z.string(),
  next_action: z.string(),
  closed_at: z.string().datetime().optional(),
});
export type Incident = z.infer<typeof IncidentSchema>;
