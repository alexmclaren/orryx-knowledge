# Legal Services regulatory landscape

Authoritative reference for the regulations that apply to legal services work in the Orryx Group.

## Regulators

| Body | Jurisdiction | Authority over |
|---|---|---|
| Law Society of NSW | NSW | Attorney licensing, conduct, client trust accounts, professional standards |
| Law Society of Victoria | VIC | Attorney licensing, conduct, professional indemnity insurance |
| Law Society of Queensland | QLD | Attorney licensing, conduct, client matter handling |
| Queensland Legal Services Board | QLD | Complaints handling, discipline (Queensland-specific) |
| Bar Association (each state) | AU | Barrister licensing and conduct (where applicable) |
| Australian Consumer Law (ACCC) | AU | Consumer protection for legal services consumers |

## Compliance frameworks applicable

1. **Legal Professional Privilege (LPP)** — Common law doctrine protecting confidential communications between attorney and client. Core to legal practice; data handling must preserve privilege boundaries.
2. **Privacy Act 1988 (APP)** — Australian Privacy Principles. Applies to collection, use, disclosure, storage of personal information (client identities, contact details, case information).
3. **State Legal Practice Rules** — Varies by state (NSW Legal Profession Uniform Law, VIC Legal Profession Regulation, etc.). Covers client trust accounts, money laundering, confidentiality, competence.
4. **GDPR** — EU General Data Protection Regulation. Applicable if law firm has EU clients or collects data on EU residents (increasingly common for international law firms).
5. **Money Laundering and Terrorism Financing Prevention** — AUSTRAC oversight; applies to law firm trust accounts.

## Data residency

- **Required:** ap-southeast-2 (Australia)
- **Rationale:** Privacy Act 1988 (APP) and state Legal Practice Rules require client matter data to remain within Australian jurisdiction unless client explicitly consents. LPP privilege is jurisdiction-specific; moving data offshore risks privilege waiver in AU courts.

## Key regulations

### Legal Professional Privilege (LPP)

- **Authority:** Common law (AU courts)
- **Scope:** Protects confidential communications between attorney and client for purposes of obtaining or giving legal advice. Extends to work product (case strategy, legal analysis).
- **Our obligations:** 
  - NEVER disclose client communications without explicit written consent
  - Architect systems to prevent inadvertent privilege waiver (e.g., no discovery during e-discovery, no AI model training on unredacted client data)
  - Document retention: LPP applies indefinitely until client relationship ends + dispute period (typically 6-12 months post-matter closure)
- **Penalties:** Privilege waiver allows opposing party access to all confidential communications; can destroy case; potential disciplinary action against law firm
- **Canonical source:** Australian courts (Wigmore test); each state has codified versions in Evidence Acts

### Privacy Act 1988 (APP)

- **Authority:** Federal regulator: Office of the Australian Information Commissioner (OAIC)
- **Scope:** Governs collection, use, disclosure, data security of personal information. Client names, contact details, case summaries are personal information; staff contact details are personal information.
- **Our obligations:**
  - Privacy Policy: law firm must have one; AI tools must comply with firm's stated privacy practices
  - Data breach notification: report breaches affecting more than 1,000 individuals to OAIC within 30 days
  - Data retention: only keep personal information as long as needed for original purpose + legal/business needs
  - Individual access rights: client can request copy of personal information held (subject to LPP exception)
- **Penalties:** OAIC enforcement notices; fines up to $2.5M; reputational damage
- **Canonical source:** https://www.oaic.gov.au/privacy/the-privacy-act/ (OAIC website)

### State Legal Practice Rules (Example: NSW)

- **Authority:** Law Society of NSW; NSW Legal Profession Uniform Law
- **Scope:** Attorney conduct, client money handling, confidentiality, competence, conflict of interest management
- **Our obligations:**
  - Conflict checking: AI tools must support conflict-of-interest checking (cannot work on matters where firm has adverse interest)
  - Client communications: AI must not represent legal advice; must be clearly labeled as AI-generated research/analysis
  - Competence: attorney remains responsible for accuracy of AI outputs (no blind reliance)
  - File retention: law firm must retain client files per practice rules (typically 7-10 years post-matter closure)
- **Penalties:** Disciplinary action (suspension/disbarment), fines, civil liability
- **Canonical source:** https://www.lawsociety.com.au/ (Law Society of NSW website)

### GDPR (for international firms with EU clients)

- **Authority:** EU Data Protection Authority
- **Scope:** Processing of personal data of EU residents, regardless of law firm location
- **Our obligations:**
  - Data Processing Agreement (DPA): establish DPA with any AI vendor/cloud provider handling EU client data
  - Data transfer mechanisms: Standard Contractual Clauses (SCCs) if data transferred to non-EU jurisdiction (e.g., AWS US)
  - Right to erasure: EU clients can request deletion of personal data (within LPP exceptions)
- **Penalties:** Fines up to 4% of global revenue or €20M (whichever higher)
- **Canonical source:** https://gdpr-info.eu/ (GDPR full text)

## When to escalate to legal counsel

- Any data breach involving client matter information
- Uncertainty about whether proposed AI use preserves Legal Professional Privilege
- Any request to disclose client communications outside law firm (even to Orryx for support)
- Regulatory changes affecting state Legal Practice Rules
- Integration with third-party vendors (e.g., cloud storage) where privilege/confidentiality at risk

## Audit log retention

- **Required retention:** 7-10 years for client matter files (per state Legal Practice Rules) + indefinite for LPP-protected communications
- **Storage:** AWS S3 with server-side encryption (KMS key); MFA Delete enabled; CloudTrail enabled for audit access logs
- **Compliance:** Annual review of data retention practices; deletion protocols for files past retention period

## Annual review

This document is reviewed annually + on any regulatory change. Last reviewed: 2026-06-10.

## See also

- `D:\orryx-governance\compliance\legal-services.md` — entity-level compliance profile
- `architecture/decisions/ADR-001-vertical-positioning.md` — positioning ADR
- canonical sources linked above
