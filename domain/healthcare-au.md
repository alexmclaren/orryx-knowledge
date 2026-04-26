# Australian Healthcare System

Essential knowledge for building healthcare software in Australia.

## Overview

Australia has a universal healthcare system with:
- **Medicare**: Public health insurance scheme
- **PBS**: Pharmaceutical Benefits Scheme
- **Private health insurance**: Optional additional coverage

## Key Players

### General Practitioners (GPs)
- Primary care physicians
- First point of contact
- Gatekeepers to specialist care
- Our primary users (Pillarworks)

### Specialists
- Require GP referral (most cases)
- Specific medical domains

### Practice Managers
- Run medical practices
- Handle billing, scheduling, compliance

## Regulatory Bodies

### RACGP (Royal Australian College of General Practitioners)
- Sets standards for GP training
- Publishes clinical guidelines
- **"Red Book"**: Preventive care guidelines
- All Pillarworks recommendations must cite RACGP

### TGA (Therapeutic Goods Administration)
- Regulates medical devices
- CDSS systems may require registration

### OAIC (Office of the Australian Information Commissioner)
- Enforces Privacy Act
- Handles data breach notifications

## Privacy & Compliance

### Privacy Act 1988
- Governs personal information handling
- Australian Privacy Principles (APPs)
- See: orryx-governance/compliance/au-privacy-act.md

### My Health Record
- National electronic health record system
- Patients control access
- Integration may be required

## Data Residency

**Requirement**: Patient data must remain in Australia

**Implementation**: AWS ap-southeast-2 only

## Medical Terminology

### Common Abbreviations
- **HPI**: History of Presenting Illness
- **PMHx**: Past Medical History
- **SHx**: Social History
- **Dx**: Diagnosis
- **Rx**: Treatment/Prescription
- **Sx**: Symptoms

### Important Concepts
- **Informed consent**: Patient understands and agrees to treatment
- **Duty of care**: Legal obligation to avoid harm
- **Mandatory reporting**: Required reporting of certain conditions
- **Notifiable diseases**: Must report to health department

## Security Considerations

### Patient Identification
- Careful matching critical
- False positives dangerous (wrong patient records)
- High threshold for matching (0.9+ similarity)

### Consent
- Explicit consent required
- Granular options (GP access, specialist access, research)
- Revocable at any time

### Audit Logging
- Who accessed what patient data, when
- 10-year retention
- Immutable

## References

- [RACGP](https://www.racgp.org.au/)
- [Privacy Act 1988](https://www.legislation.gov.au/Series/C2004A03712)
- [My Health Record](https://www.myhealthrecord.gov.au/)
- [Medicare](https://www.servicesaustralia.gov.au/medicare)
