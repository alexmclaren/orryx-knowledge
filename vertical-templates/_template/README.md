# `_template` — vertical-industry-setup meta-template

Cookiecutter-shape template for new industry verticals. Copy this directory + substitute placeholders to produce a new vertical (medical-imaging, legal-services, education, etc.).

The crash-repair vertical was the first instance (originally `orryx-repair-intelligence`). This `_template` is the generalised pattern, lifted from crash-repair in Wave 8.

## Placeholders

Substitute these throughout when scaffolding a new vertical:

| Placeholder | Replace with |
|---|---|
| `{{INDUSTRY}}` | The industry name (e.g., "medical-imaging") |
| `{{INDUSTRY_TITLE}}` | Title-case industry name (e.g., "Medical Imaging") |
| `{{TARGET_CUSTOMER}}` | Who in this industry buys (e.g., "radiology clinics", "imaging centres") |
| `{{NOT_TARGET}}` | Who explicitly doesn't (e.g., "hospitals" if you don't sell to hospitals) |
| `{{MARKET_SIZE}}` | Approximate market size + denomination |
| `{{KEY_COMPETITORS}}` | 3-5 known competitors |
| `{{REGULATORY_BODIES}}` | Industry-specific regulators (e.g., "TGA", "ACSQHC") |
| `{{OEM_PARTNERS}}` | Tech / equipment partners (e.g., "Philips", "GE Healthcare") |
| `{{KEY_METRICS}}` | 5-10 metrics this vertical's customers track |
| `{{COMPLIANCE_FRAMEWORK}}` | Applicable compliance frameworks (e.g., HIPAA, GDPR, ISO13485) |
| `{{DATA_RESIDENCY}}` | Required data residency (e.g., "ap-southeast-2", "us-east-1") |

## Structure

```
_template/
├── README.md                       # this file
├── agents/                         # Claude agent configs per role
│   ├── industry-expert.yaml.template
│   ├── compliance-reviewer.yaml.template
│   └── customer-success.yaml.template
├── prompts/                        # reusable prompts for this vertical
│   ├── {{primary-task-1}}/
│   ├── {{primary-task-2}}/
│   └── {{primary-task-3}}/
├── standards/                      # industry standards
│   ├── regulatory.md.template
│   └── domain-glossary.md.template
└── architecture/
    ├── decisions/                  # ADRs for this vertical
    │   └── ADR-001-vertical-positioning.md.template
    └── schemas/                    # shared data schemas
        └── domain-entity.schema.json.template
```

## Usage

### Manual

```bash
# 1. Copy the _template to your new vertical
cp -r D:/orryx-knowledge/vertical-templates/_template \
     D:/orryx-knowledge/vertical-templates/{{INDUSTRY}}

# 2. Find-replace all placeholders in the copied directory
cd D:/orryx-knowledge/vertical-templates/{{INDUSTRY}}
# Find every file with placeholders and replace per the table above

# 3. Add to marketplace.json
# (a vertical-template plugin entry)
```

### Via @orryx/create (Wave 8 CLI)

```bash
# Coming soon (Wave 8):
npx @orryx/create vertical medical-imaging
# Prompts for each placeholder; produces a ready-to-customise vertical scaffold
```

## What to fill in (per-vertical)

For each new vertical, expect to fill in:

1. **agents/industry-expert.yaml** — sonnet-tier domain knowledge agent for this vertical
2. **agents/compliance-reviewer.yaml** — opus-tier reviewer for industry compliance
3. **prompts/** — 3-7 primary-task prompts for the vertical's most common operations
4. **standards/regulatory.md** — applicable regulations, with links to canonical sources
5. **standards/domain-glossary.md** — industry-specific terminology
6. **architecture/decisions/ADR-001-vertical-positioning.md** — who we sell to, who we don't, why
7. **architecture/schemas/domain-entity.schema.json** — the central data model for this vertical

## Why this framework exists

The 2026-05-12 audit found `orryx-repair-intelligence` was acting as the template for crash-repair-vertical setups (not a product itself). Per-the-recommendation-doc R5: generalise the pattern. This framework is the result — one meta-template, one worked-example (crash-repair), and a path to scaffold future verticals cheaply.

## See also

- `crash-repair/` — first instance of this template
- `D:\orryx-audit\08-recommendations.md` — R5 explanation
- `D:\orryx-audit\10-target-architecture.md` — where vertical-templates fit in the target architecture
