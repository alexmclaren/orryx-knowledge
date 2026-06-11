# ADR-001: Legal Services vertical positioning

**Status:** accepted
**Date:** 2026-06-10
**Owner:** Product team

## Context

We are entering the legal services vertical. The market is ~$50B AUD (2,500+ law firms in Australia).

## Decision

Our target customer is **small-to-mid law firms (1-50 attorneys)**.

Explicitly **NOT** our customer: **solo practitioners, corporate legal departments (>500 attorneys), government agencies**.

We position against **Thomson Reuters Westlaw, LexisNexis, Practical Law, Automatic, Rocket Lawyer**.

## Rationale

Small-to-mid law firms represent a sweet spot: they have enough volume and complexity to justify AI investment in matter management, document automation, and legal research augmentation, but lack the in-house tech resources of corporate departments. They typically use integrated practice management platforms (Actionstep, Clio, Leap) and are eager for AI enhancements that increase billable hours per attorney and reduce document error rates.

Solo practitioners have lower technology budgets and adoption barriers. Corporate departments have legacy systems and strict procurement policies. Government agencies face regulatory constraints and do not represent our beachhead.

## Consequences

### Positive

- Clear focus: messaging and product design align with firm size (1-50 attorneys)
- Ecosystem alignment: vendors like Actionstep, Clio already serve this segment
- Regulatory simplicity: avoid EU-only GDPR complexities (focus AU market first)
- Revenue potential: SMB legal sector demonstrated willingness to pay for efficiency tools

### Negative

- Market fragmentation: 2,500+ potential customers but each smaller deal size than corporate
- Compliance burden: manage relationships with 8+ state Law Societies (not centralized)
- Integration complexity: support multiple practice management platforms

### Neutral / unknown

- Vendor conflict: some LawTech vendors may view us as competitive; partnership potential unclear
- Geographic expansion: expansion into US (different bar structures) or EU (GDPR, different regulations) would require vertical repositioning

## Alternatives considered

1. Corporate legal departments — rejected because they have in-house tech teams and rigid procurement cycles; too slow to iterate
2. Solo practitioners — rejected because unit economics poor (low billable hours per attorney, minimal tech budget)
3. Government agencies — rejected because strict procurement, political constraints, and regulatory requirements (SOC 2, FedRAMP for US work)

## Compliance implications

See `standards/regulatory.md` for the regulatory landscape. Key obligations our chosen positioning imposes:

- Legal Professional Privilege (LPP): client data confidentiality and privilege protection at all layers
- Privacy Act 1988 (APP): handling of personal information of clients and firm staff
- State-level Legal Practice Rules: variation by jurisdiction (NSW, VIC, QLD, etc.)
- GDPR (if EU clients): optional but increasing EU client base may require GDPR readiness

## See also

- `ADR-002-legal-privilege-data-handling.md` (next ADR)
- `D:\orryx-audit\10-target-architecture.md` — where this vertical fits in the Orryx Group
