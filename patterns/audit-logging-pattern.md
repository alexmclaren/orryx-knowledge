# Audit Logging Pattern

Standard pattern for implementing audit logging across Orryx products.

## Overview

All Orryx products must maintain immutable audit logs for:
- Patient data access (who, what, when)
- Authentication events (login, logout, failures)
- Clinical decisions (CDSS recommendations used)
- Data modifications (updates, deletions)
- Consent changes (granted, revoked)

## Requirements

- **Immutable**: Cannot be modified or deleted
- **Retention**: 10 years minimum
- **Encryption**: At rest (AES-256)
- **Data residency**: AU only (ap-southeast-2)
- **Performance**: Async writes, no blocking

## Schema

```typescript
// src/models/AuditLog.ts

export interface AuditLog {
  id: string;                    // UUID
  timestamp: Date;               // ISO 8601
  userId: string;                // Who performed the action
  action: string;                // What was done
  resourceType: string;          // patient|user|consent|recommendation
  resourceId: string;            // ID of the resource
  details: Record<string, any>;  // Additional context
  ipAddress: string;             // Source IP
  userAgent: string;             // Client info
  sessionId: string;             // Session identifier
}
```

## Implementation

```typescript
// src/services/audit.ts

import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient({
  region: 'ap-southeast-2',
});

export async function logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
  const auditEntry: AuditLog = {
    id: generateUUID(),
    timestamp: new Date(),
    ...entry,
  };

  // Write to DynamoDB (immutable table)
  await dynamodb.put({
    TableName: 'orryx-audit-logs',
    Item: auditEntry,
  }).promise();

  return auditEntry.id;
}
```

## Common Actions

### Patient Data Access

```typescript
await logAudit({
  userId: currentUser.id,
  action: 'patient_record_accessed',
  resourceType: 'patient',
  resourceId: patient.id,
  details: {
    fields: ['name', 'dateOfBirth', 'medicalHistory'],
    reason: 'clinical_review',
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: req.session.id,
});
```

### Authentication Events

```typescript
// Successful login
await logAudit({
  userId: user.id,
  action: 'login_success',
  resourceType: 'user',
  resourceId: user.id,
  details: {
    method: 'password',
    mfaUsed: true,
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: sessionId,
});

// Failed login
await logAudit({
  userId: user.id,
  action: 'login_failed',
  resourceType: 'user',
  resourceId: user.id,
  details: {
    reason: 'invalid_password',
    attemptNumber: 3,
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: null,
});
```

### Clinical Decisions

```typescript
await logAudit({
  userId: gp.id,
  action: 'cdss_recommendation_used',
  resourceType: 'recommendation',
  resourceId: recommendation.id,
  details: {
    patientId: patient.id,
    recommendationType: 'preventive_care',
    racgpGuideline: 'red-book-2022',
    accepted: true,
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: req.session.id,
});
```

### Data Modifications

```typescript
await logAudit({
  userId: currentUser.id,
  action: 'patient_record_updated',
  resourceType: 'patient',
  resourceId: patient.id,
  details: {
    fieldsChanged: ['address', 'phone'],
    previousValues: {
      address: '123 Old St',
      phone: '0400000000',
    },
    newValues: {
      address: '456 New St',
      phone: '0411111111',
    },
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: req.session.id,
});
```

### Consent Changes

```typescript
await logAudit({
  userId: patient.id,
  action: 'consent_updated',
  resourceType: 'consent',
  resourceId: consent.id,
  details: {
    consentType: 'data_sharing',
    previousStatus: 'granted',
    newStatus: 'revoked',
    scope: ['gp_access', 'specialist_access'],
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: req.session.id,
});
```

## Middleware

```typescript
// src/middleware/audit.ts

export function auditMiddleware(action: string, resourceType: string) {
  return async (req, res, next) => {
    // Capture request start
    const startTime = Date.now();

    // Override res.json to log after response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Log the audit entry (async, non-blocking)
      logAudit({
        userId: req.user?.id || 'anonymous',
        action,
        resourceType,
        resourceId: data.id || req.params.id,
        details: {
          method: req.method,
          path: req.path,
          duration: Date.now() - startTime,
          statusCode: res.statusCode,
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.session?.id,
      }).catch((error) => {
        console.error('Audit log failed:', error);
        // Don't block request on audit failure
      });

      return originalJson(data);
    };

    next();
  };
}
```

## Usage in Routes

```typescript
// src/routes/patients.ts

import { auditMiddleware } from '../middleware/audit';

router.get(
  '/patients/:id',
  requireAuth,
  auditMiddleware('patient_record_accessed', 'patient'),
  async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    res.json(patient);
  }
);
```

## DynamoDB Table Configuration

```yaml
# infrastructure/audit-logs-table.yaml

TableName: orryx-audit-logs
BillingMode: PAY_PER_REQUEST
PointInTimeRecoveryEnabled: true  # Immutability requirement
DeletionProtectionEnabled: true   # Prevent accidental deletion

AttributeDefinitions:
  - AttributeName: id
    AttributeType: S
  - AttributeName: timestamp
    AttributeType: S
  - AttributeName: userId
    AttributeType: S
  - AttributeName: resourceId
    AttributeType: S

KeySchema:
  - AttributeName: id
    KeyType: HASH

GlobalSecondaryIndexes:
  - IndexName: userId-timestamp-index
    KeySchema:
      - AttributeName: userId
        KeyType: HASH
      - AttributeName: timestamp
        KeyType: RANGE
    Projection:
      ProjectionType: ALL

  - IndexName: resourceId-timestamp-index
    KeySchema:
      - AttributeName: resourceId
        KeyType: HASH
      - AttributeName: timestamp
        KeyType: RANGE
    Projection:
      ProjectionType: ALL

StreamSpecification:
  StreamEnabled: true
  StreamViewType: NEW_IMAGE

SSESpecification:
  SSEEnabled: true
  SSEType: AES256

Tags:
  - Key: Retention
    Value: 10-years
  - Key: Compliance
    Value: au-privacy-act
  - Key: DataClassification
    Value: highly-sensitive
```

## Querying Audit Logs

```typescript
// src/services/audit-query.ts

export async function getAuditLogsForUser(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<AuditLog[]> {
  const result = await dynamodb.query({
    TableName: 'orryx-audit-logs',
    IndexName: 'userId-timestamp-index',
    KeyConditionExpression: 'userId = :userId AND #ts BETWEEN :start AND :end',
    ExpressionAttributeNames: {
      '#ts': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':start': startDate.toISOString(),
      ':end': endDate.toISOString(),
    },
  }).promise();

  return result.Items as AuditLog[];
}

export async function getAuditLogsForResource(
  resourceId: string,
  limit: number = 100
): Promise<AuditLog[]> {
  const result = await dynamodb.query({
    TableName: 'orryx-audit-logs',
    IndexName: 'resourceId-timestamp-index',
    KeyConditionExpression: 'resourceId = :resourceId',
    ExpressionAttributeValues: {
      ':resourceId': resourceId,
    },
    Limit: limit,
    ScanIndexForward: false, // Most recent first
  }).promise();

  return result.Items as AuditLog[];
}
```

## Security Checklist

- [ ] Audit logs stored in DynamoDB with encryption at rest
- [ ] Point-in-time recovery enabled (immutability)
- [ ] Deletion protection enabled
- [ ] Table in ap-southeast-2 region only
- [ ] Async writes (non-blocking)
- [ ] No sensitive data in details field (redact if needed)
- [ ] Access restricted to authorized personnel only
- [ ] 10-year retention policy configured
- [ ] Regular backups to S3 (encrypted)
- [ ] Monitoring alerts for audit log failures

## Common Mistakes (Anti-Patterns)

❌ **Blocking requests on audit writes**: Audit logs should be async
✅ **Fire-and-forget audit writes**: Log asynchronously, handle errors separately

❌ **Logging sensitive data in plaintext**: PII in audit logs
✅ **Redact sensitive fields**: Hash or encrypt sensitive details

❌ **Allowing audit log modifications**: Mutable logs
✅ **Immutable storage**: DynamoDB with point-in-time recovery

❌ **Short retention periods**: Deleting logs after 1 year
✅ **10-year retention**: Compliance requirement for healthcare

## References

- orryx-governance/security/security-policy.md (Section 5: Audit Logging)
- orryx-governance/compliance/au-privacy-act.md (APP 11: Security)
- OWASP Logging Cheat Sheet
- AWS DynamoDB Best Practices
