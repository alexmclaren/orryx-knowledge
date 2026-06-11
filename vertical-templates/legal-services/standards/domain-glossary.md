# Legal Services Domain Glossary

Authoritative terminology for the legal services vertical. Use these definitions consistently across agents, prompts, and documentation.

## General Legal Terms

### Legal Professional Privilege (LPP)
**Definition:** Common law doctrine protecting confidential communications between attorney and client for purposes of obtaining or giving legal advice. Also called "attorney-client privilege" (US term).

**Context in Orryx:** Must be preserved in all data flows. Client communications, legal strategy, case plans are privileged. Disclosing privileged material without explicit consent risks waiver in litigation.

**Reference:** Evidence Act 1995 (NSW) ss 118-119; varies by state.

---

### Retainer
**Definition:** Written agreement between law firm and client governing scope of representation, fees, billing terms, and conditions.

**Context in Orryx:** Matter intake automation must generate retainer letters. Retainer establishes scope; work outside scope = separate engagement.

---

### Matter
**Definition:** Single client engagement (e.g., representation in a dispute, provision of advice, transaction support). Identified by matter number or matter ID.

**Context in Orryx:** Core unit of practice management. Every piece of client work is assigned to a matter. Billing, time tracking, document storage organized by matter.

---

### Conflict of Interest
**Definition:** Situation where attorney's interests or other client's interests conflict with current client's interests, or where attorney has adverse interest.

**Context in Orryx:** Must be checked at matter intake. Cannot represent both plaintiff and defendant. Must check if client is opposing party in other matters. Violations = disciplinary action.

---

### Billable Hours
**Definition:** Time spent by attorney on client work, typically recorded in minimum increments (0.1 hour = 6 minutes) and billed to client at agreed hourly rate.

**Context in Orryx:** Key metric for SMB law firms. Matter profitability = (billable hours × rate) - (overhead + non-billable time). Increasing billable hours per attorney is primary business driver.

---

## Regulatory & Compliance Terms

### Legal Practice Rules
**Definition:** State-level regulations governing attorney conduct, client money handling, confidentiality, competence, and professional indemnity insurance.

**Context in Orryx:** Vary by state (NSW, VIC, QLD, etc.). Each state has its own Law Society enforcement. Examples: NSW Legal Profession Uniform Law, VIC Legal Profession Regulation.

**Reference:** Law Society of each state; typically codified in state legislation + professional conduct rules.

---

### Privacy Act 1988 (APP)
**Definition:** Australian federal privacy law governing collection, use, and disclosure of personal information. Enforced by Office of the Australian Information Commissioner (OAIC).

**Context in Orryx:** Client names, contact details, matter summaries are personal information. Must be stored securely, retained only as needed, and protected from unauthorized disclosure. Breaches affecting >1,000 individuals must be reported to OAIC within 30 days.

**Reference:** https://www.oaic.gov.au/privacy/the-privacy-act/

---

### GDPR (General Data Protection Regulation)
**Definition:** EU data protection regulation. Applies to processing of personal data of EU residents, regardless of processor location.

**Context in Orryx:** If law firm has EU clients, any data processing (including AI analysis) of EU resident data requires Data Processing Agreement (DPA) + Standard Contractual Clauses (SCCs) for data transfers to non-EU jurisdictions.

**Reference:** https://gdpr-info.eu/

---

### Money Laundering and Terrorism Financing (AMLCFT)
**Definition:** Regime administered by AUSTRAC (Australian Transaction Reports and Analysis Centre) requiring law firms to identify clients, maintain records, and report suspicious transactions.

**Context in Orryx:** Law firms are "reporting entities" under AML/CTF Act. Trust account activity (especially international transfers) must be monitored. Compliance failure = criminal penalties. AI systems must not obscure transaction visibility.

**Reference:** https://www.austrac.gov.au/

---

## Practice Management Terms

### Matter Intake
**Definition:** Initial process of capturing client information, retainer terms, and conflict checks when new matter is opened.

**Context in Orryx:** Opportunity for automation: extract data from intake form/email/consultation, populate PMP, flag conflicts. Reduces manual data entry.

---

### Practice Management Platform (PMP)
**Definition:** Software system used by law firm to manage matters, time tracking, billing, document storage, and client communication. Examples: Actionstep, Clio, Leap, PracticePanther.

**Context in Orryx:** Integration point. Orryx must be able to read/write matter data, time entries, and documents via PMP APIs. Seamless integration = faster adoption.

---

### Time Entry / Timekeeping
**Definition:** Record of attorney time spent on specific matter, typically in minimum increments (6 min = 0.1 hour). Used for billing and profitability analysis.

**Context in Orryx:** Automated time capture (e.g., logging research time to matter automatically) increases accuracy and reduces administrative burden.

---

### Engagement Letter
**Definition:** Written agreement between firm and client governing scope, fees, and terms. Synonym: Retainer.

**Context in Orryx:** Must be generated per matter. Document automation prompt generates engagement letter templates; attorney customizes per client.

---

## Dispute & Litigation Terms

### Plaintiff / Applicant
**Definition:** Party initiating legal proceedings (brings claim or application).

**Context in Orryx:** Conflict checking must identify whether firm represents plaintiff or defendant (not both).

---

### Defendant / Respondent
**Definition:** Party defending against legal proceedings (responds to claim or application).

**Context in Orryx:** Conflict checking must identify whether firm represents defendant or plaintiff.

---

### Jurisdiction
**Definition:** Geographic area where legal matter falls (NSW, VIC, QLD, Federal Court, etc.). Different jurisdictions = different courts, different law, different procedural rules.

**Context in Orryx:** Legal research automation must be jurisdiction-aware. A legal principle in NSW may not apply in VIC. Document automation must include jurisdiction-specific clauses.

---

### Evidence Act
**Definition:** Legislation governing admissibility of evidence in court proceedings. E.g., Evidence Act 1995 (NSW).

**Context in Orryx:** LPP protection is codified in Evidence Acts (e.g., Evidence Act 1995 (NSW) ss 118-119). Relevant to assessing whether communications are privileged.

---

## Firm Structure Terms

### Principal / Partner
**Definition:** Senior attorney with ownership stake in law firm. Responsible for firm management, business development, and regulatory compliance.

**Context in Orryx:** Decision-maker for Orryx adoption. Cares about ROI, risk management, regulatory compliance. Target persona for compliance-reviewer agent.

---

### Associate / Solicitor
**Definition:** Attorney employed by firm (typically without ownership stake). Performs client work under supervision of principal.

**Context in Orryx:** Daily user of AI research, automation, conflict checking. Target persona for customer-success agent.

---

### Paralegal / Legal Assistant
**Definition:** Non-attorney staff member assisting attorneys with administrative, research, and case management tasks.

**Context in Orryx:** Candidate for matter intake automation, document management, time entry automation. Lower-skill tasks = higher ROI from automation.

---

### Small-to-Mid Law Firm (SMB)
**Definition:** Law firm with 1-50 attorneys. Typically 5-30 active matters per month per attorney.

**Context in Orryx:** Target customer segment. Larger than solo practitioners (economies of scale for tech adoption) but smaller than corporate departments (agile, willing to try AI).

---

## See Also

- `regulatory.md` — regulatory landscape with links to canonical sources
- `architecture/decisions/ADR-001-vertical-positioning.md` — positioning and target customer definition
