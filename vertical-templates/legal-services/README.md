# Legal Services Vertical

Vertical instance for legal services industry targeting small-to-mid law firms in Australia.

## What this vertical is

Small-to-mid Australian law firms: **~$50B market**, **2,500+ firms**, **1-50 attorneys per firm**. Our positioning: **AI-augmented legal research + matter intake automation + document template generation + compliance support** for **small-to-mid law firms**, **NOT** for solo practitioners, corporate legal departments, or government agencies.

We compete against: Thomson Reuters Westlaw, LexisNexis, Practical Law, Automatic, Rocket Lawyer.

## Filled-in placeholder values

| Placeholder | Value |
|---|---|
| `INDUSTRY` | `legal-services` |
| `INDUSTRY_TITLE` | `Legal Services` |
| `TARGET_CUSTOMER` | Small-to-mid law firms (1-50 attorneys) |
| `NOT_TARGET` | Solo practitioners, corporate legal departments (>500 attorneys), government agencies |
| `MARKET_SIZE` | ~$50B AUD (~2,500+ law firms × $20M avg revenue) |
| `KEY_COMPETITORS` | Thomson Reuters Westlaw, LexisNexis, Practical Law, Automatic, Rocket Lawyer |
| `REGULATORY_BODIES` | Law Society of each state (NSW, VIC, QLD, etc.), Legal Services Board (QLD), State Bar Councils |
| `OEM_PARTNERS` | Legal tech integrators (Actionstep, Clio, Leap, PracticePanther) |
| `KEY_METRICS` | Billable hours per attorney, matter cycle time, client satisfaction (NPS), regulatory compliance certifications, document error rate |
| `COMPLIANCE_FRAMEWORK` | Legal Professional Privilege (LPP), Privacy Act 1988 (APP), State Legal Practice Rules, GDPR (if EU clients) |
| `DATA_RESIDENCY` | ap-southeast-2 (Australia) |

## Directory structure

```
legal-services/
├── README.md                                      # this file
├── agents/                                        # Claude agent configs per role
│   ├── industry-expert.yaml                       # Legal Services domain expert
│   ├── compliance-reviewer.yaml                   # Regulatory compliance reviewer
│   └── customer-success.yaml                      # Customer success & onboarding
├── prompts/                                       # reusable prompts for this vertical
│   ├── matter-intake-automation/
│   │   └── system.md                              # Matter intake structured extraction
│   ├── legal-research-augmentation/
│   │   └── system.md                              # AI-augmented legal research
│   └── document-automation/
│       └── system.md                              # Template-based document generation
├── standards/                                     # industry standards
│   ├── regulatory.md                              # Regulatory landscape + compliance frameworks
│   └── domain-glossary.md                         # Legal services terminology
└── architecture/
    ├── decisions/                                 # ADRs for this vertical
    │   └── ADR-001-vertical-positioning.md        # Positioning & target customer
    └── schemas/                                   # shared data schemas
        └── domain-entity.schema.json              # Matter, Client, Attorney, TimeEntry, Document schemas
```

## Files to edit / review

1. **agents/industry-expert.yaml** — Domain knowledge + responsibilities; verify model tier (sonnet)
2. **agents/compliance-reviewer.yaml** — Opus-tier compliance reviewer
3. **agents/customer-success.yaml** — Onboarding, training, success metrics
4. **prompts/matter-intake-automation/system.md** — Extract structured data from intake forms
5. **prompts/legal-research-augmentation/system.md** — AI legal research assistance (research only, not advice)
6. **prompts/document-automation/system.md** — Template-based document generation
7. **standards/regulatory.md** — Regulatory landscape, compliance frameworks, data residency
8. **standards/domain-glossary.md** — Legal terminology, definitions, context

## Next steps post-instantiation

1. **Verify schema:** Validate domain-entity.schema.json against actual practice management platform APIs (Actionstep, Clio, Leap)
2. **Extend ADRs:** Add ADR-002 (LPP data handling), ADR-003 (PMP integration strategy)
3. **Populate prompts:** Extend matter-intake-automation, legal-research-augmentation, and document-automation prompts with worked examples
4. **Add integrations:** Define API contracts for Actionstep, Clio, Leap integration
5. **Create customer playbook:** Onboarding checklist, training scripts, success metrics tracking

## Status

**Instantiated (2026-06-10).** Structure and baseline content complete. Ready for:
- Product engineering review (schema, PMP integration)
- Compliance review (LPP handling, data residency)
- Customer success review (onboarding flow, success metrics)

## See also

- `_template/README.md` — the meta-template + placeholder reference
- `D:\orryx-audit\10-target-architecture.md` — where vertical-templates fit in target architecture
- `D:\orryx-audit\08-recommendations.md` — R5 (why we're doing this)
