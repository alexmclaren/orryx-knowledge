# Common Anti-Patterns

Mistakes to avoid when building Orryx products.

## 1. Patient Data Handling

### ❌ Storing Patient Data in localStorage

```typescript
// WRONG
localStorage.setItem('currentPatient', JSON.stringify(patient));
```

**Why wrong**:
- Accessible to JavaScript (XSS vulnerability)
- No encryption
- Persists across sessions
- Privacy Act violation

**✅ Correct approach**:

```typescript
// Store only non-sensitive identifiers in memory
const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);

// Fetch patient data on demand from secure API
const { data: patient } = useQuery(['patient', currentPatientId],
  () => fetchPatient(currentPatientId)
);
```

---

### ❌ Logging Patient Data

```typescript
// WRONG
console.log('Patient data:', patient);
logger.info(`Updating patient ${patient.name} with email ${patient.email}`);
```

**Why wrong**:
- Logs may be stored insecurely
- PII exposure in log files
- Compliance violation

**✅ Correct approach**:

```typescript
// Log only non-sensitive identifiers
console.log('Patient data:', { id: patient.id });
logger.info(`Updating patient ${patient.id}`);
```

---

### ❌ Low Patient Matching Threshold

```typescript
// WRONG
if (similarityScore > 0.6) {
  return existingPatient; // Might be wrong patient!
}
```

**Why wrong**:
- False positives extremely dangerous
- Could merge different patients' records
- Clinical safety issue

**✅ Correct approach**:

```typescript
// High threshold for patient matching
if (similarityScore >= 0.9) {
  return existingPatient;
} else {
  // Require human review for scores 0.7-0.89
  return { status: 'review_required', candidates: [existingPatient] };
}
```

---

## 2. Authentication & Authorization

### ❌ JWT in localStorage

```typescript
// WRONG
localStorage.setItem('accessToken', token);
```

**Why wrong**:
- Vulnerable to XSS attacks
- Token accessible to JavaScript
- Security best practice violation

**✅ Correct approach**:

```typescript
// Use httpOnly secure cookies
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 30 * 60 * 1000, // 30 minutes
});
```

---

### ❌ Long-Lived Access Tokens

```typescript
// WRONG
const token = jwt.sign(payload, secret, { expiresIn: '7d' });
```

**Why wrong**:
- Increased window for token theft
- Compliance requirement: 30-minute sessions
- Security risk

**✅ Correct approach**:

```typescript
// Short-lived access tokens
const token = jwt.sign(payload, secret, { expiresIn: '30m' });
```

---

### ❌ Missing Audit Logging for Auth Events

```typescript
// WRONG
async function login(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }
  return generateToken(user);
}
```

**Why wrong**:
- No record of failed login attempts
- Can't detect brute force attacks
- Compliance violation (audit trail required)

**✅ Correct approach**:

```typescript
async function login(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    await AuditLog.create({
      userId: user?.id || 'unknown',
      action: 'login_failed',
      details: { email },
    });
    throw new UnauthorizedError('Invalid credentials');
  }

  await AuditLog.create({
    userId: user.id,
    action: 'login_success',
  });

  return generateToken(user);
}
```

---

## 3. Clinical Decision Support

### ❌ Claiming to Diagnose

```typescript
// WRONG
return {
  diagnosis: 'Type 2 Diabetes',
  confidence: 0.95,
};
```

**Why wrong**:
- Orryx products are CDSS, not diagnostic tools
- Legal/regulatory issue (TGA)
- Misleading to clinicians

**✅ Correct approach**:

```typescript
return {
  recommendation: 'Consider screening for Type 2 Diabetes',
  rationale: 'Patient has risk factors: BMI >30, age >45, family history',
  source: 'RACGP Red Book 2022, Section 4.3',
  clinicianDecision: null, // GP makes final decision
};
```

---

### ❌ Unsourced Recommendations

```typescript
// WRONG
return {
  recommendation: 'Prescribe metformin 500mg',
};
```

**Why wrong**:
- No evidence-based source
- Can't be verified
- Not compliant with CDSS requirements

**✅ Correct approach**:

```typescript
return {
  recommendation: 'Consider metformin 500mg as first-line therapy',
  source: 'RACGP Guidelines for Type 2 Diabetes Management (2020)',
  sourceUrl: 'https://www.racgp.org.au/...',
  evidenceLevel: 'Grade A',
};
```

---

## 4. Database & Performance

### ❌ N+1 Queries

```typescript
// WRONG
const patients = await Patient.findAll();
for (const patient of patients) {
  const visits = await Visit.findAll({ where: { patientId: patient.id } });
  patient.visits = visits;
}
```

**Why wrong**:
- 1 query for patients + N queries for visits
- Slow performance
- Database overload

**✅ Correct approach**:

```typescript
const patients = await Patient.findAll({
  include: [{ model: Visit }],
});
```

---

### ❌ Missing Indexes

```typescript
// WRONG
@Entity()
class Patient {
  @Column()
  email: string; // No index, frequent queries by email
}
```

**Why wrong**:
- Slow queries
- Full table scans
- Poor scalability

**✅ Correct approach**:

```typescript
@Entity()
class Patient {
  @Column()
  @Index() // Add index for frequently queried fields
  email: string;
}
```

---

## 5. Testing

### ❌ Not Testing the Happy Path

```typescript
// WRONG - Only testing edge cases
describe('calculateBMI', () => {
  it('should throw error for negative weight', () => {
    expect(() => calculateBMI(-10, 1.75)).toThrow();
  });
});
```

**Why wrong**:
- Main functionality not verified
- Might break without tests catching it

**✅ Correct approach**:

```typescript
describe('calculateBMI', () => {
  it('should calculate BMI correctly for valid inputs', () => {
    expect(calculateBMI(70, 1.75)).toBeCloseTo(22.86, 2);
  });

  it('should throw error for negative weight', () => {
    expect(() => calculateBMI(-10, 1.75)).toThrow();
  });
});
```

---

### ❌ Low Test Coverage

```typescript
// WRONG - Only testing 30% of code
```

**Why wrong**:
- Bugs slip through
- Refactoring risky
- Below quality gate (80% minimum)

**✅ Correct approach**:
- Aim for 80%+ coverage
- Test critical paths thoroughly
- Include integration tests

---

## 6. Security

### ❌ SQL Injection Vulnerability

```typescript
// WRONG
const query = `SELECT * FROM patients WHERE email = '${email}'`;
await db.query(query);
```

**Why wrong**:
- SQL injection attack possible
- Email could be: `' OR '1'='1`
- Critical security vulnerability

**✅ Correct approach**:

```typescript
const query = 'SELECT * FROM patients WHERE email = ?';
await db.query(query, [email]);
```

---

### ❌ Hardcoded Secrets

```typescript
// WRONG
const JWT_SECRET = 'my-secret-key-123';
const DB_PASSWORD = 'admin123';
```

**Why wrong**:
- Secrets in source control
- Can't rotate without code change
- Security breach if repo leaked

**✅ Correct approach**:

```typescript
const JWT_SECRET = process.env.JWT_SECRET!;
const DB_PASSWORD = process.env.DB_PASSWORD!;

// In production: use AWS Secrets Manager
const secret = await secretsManager.getSecretValue({ SecretId: 'jwt-secret' });
```

---

### ❌ Missing Input Validation

```typescript
// WRONG
async function createPatient(data: any) {
  return await Patient.create(data); // Accepts anything
}
```

**Why wrong**:
- Can insert invalid data
- Potential injection attacks
- Data integrity issues

**✅ Correct approach**:

```typescript
interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
}

async function createPatient(data: CreatePatientDTO) {
  // Validate input
  if (!isValidEmail(data.email)) {
    throw new ValidationError('Invalid email');
  }
  if (data.dateOfBirth > new Date()) {
    throw new ValidationError('Date of birth cannot be in future');
  }

  return await Patient.create(data);
}
```

---

## 7. Frontend

### ❌ Not Handling Loading States

```typescript
// WRONG
function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  return patients.map(p => <PatientCard patient={p} />);
}
```

**Why wrong**:
- No loading indicator
- Blank screen while fetching
- Poor UX

**✅ Correct approach**:

```typescript
function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return patients.map(p => <PatientCard patient={p} />);
}
```

---

### ❌ Missing Error Handling

```typescript
// WRONG
async function savePatient() {
  await api.updatePatient(patient);
  showSuccess('Patient saved');
}
```

**Why wrong**:
- No error handling
- User sees success even if failed
- Confusing UX

**✅ Correct approach**:

```typescript
async function savePatient() {
  try {
    await api.updatePatient(patient);
    showSuccess('Patient saved');
  } catch (error) {
    console.error('Failed to save patient:', error);
    showError('Failed to save patient. Please try again.');
  }
}
```

---

## 8. Deployment

### ❌ Deploying Without Tests

```bash
# WRONG
git push origin main # Auto-deploys to production
```

**Why wrong**:
- Broken code reaches production
- No safety net
- Violates quality gates

**✅ Correct approach**:

```bash
# Run all checks before deploy
npm run lint
npm run type-check
npm run test
npm run security-scan

# Only deploy if all pass
if [ $? -eq 0 ]; then
  git push origin main
fi
```

---

### ❌ No Rollback Plan

**Why wrong**:
- Can't recover from bad deploy
- Extended downtime
- Production incidents

**✅ Correct approach**:
- Always document rollback procedure
- Keep previous version available
- Test rollback in staging first

---

## Summary

**Golden Rules**:

1. **Never store patient data in frontend storage**
2. **Always use httpOnly cookies for auth tokens**
3. **High threshold (0.9+) for patient matching**
4. **Every auth event must be logged**
5. **CDSS recommendations must cite sources**
6. **80%+ test coverage, always**
7. **Parameterized queries only (prevent SQL injection)**
8. **Never hardcode secrets**
9. **Handle loading and error states in UI**
10. **All tests pass before deploying**

---

## References

- orryx-governance/security/security-policy.md
- orryx-governance/compliance/au-privacy-act.md
- orryx-standards/CLAUDE.md
- OWASP Top 10
- RACGP Standards
