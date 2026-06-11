# `_template` — vertical-industry-setup meta-template

Cookiecutter-shape template for new industry verticals. Copy this directory and substitute placeholders to produce a new vertical (medical-imaging, legal-services, education, etc.).

The `legal-services/` directory is the verified worked example (instantiated 2026-06-10).

## Placeholders

Substitute these throughout when scaffolding a new vertical:

| Placeholder | Replace with |
|---|---|
| `{{INDUSTRY}}` | The industry name in kebab-case (e.g., "medical-imaging") |
| `{{INDUSTRY_TITLE}}` | Title-case industry name (e.g., "Medical Imaging") |
| `{{TARGET_CUSTOMER}}` | Who in this industry buys (e.g., "radiology clinics", "imaging centres") |
| `{{NOT_TARGET}}` | Who explicitly doesn't buy (e.g., "hospitals" if you don't sell to hospitals) |
| `{{MARKET_SIZE}}` | Approximate market size + denomination |
| `{{KEY_COMPETITORS}}` | 3-5 known competitors |
| `{{REGULATORY_BODIES}}` | Industry-specific regulators (e.g., "TGA", "ACSQHC") |
| `{{OEM_PARTNERS}}` | Tech / equipment partners (e.g., "Philips", "GE Healthcare") |
| `{{KEY_METRICS}}` | 5-10 metrics this vertical's customers track |
| `{{COMPLIANCE_FRAMEWORK}}` | Applicable compliance frameworks (e.g., HIPAA, GDPR, ISO13485) |
| `{{DATA_RESIDENCY}}` | Required data residency (e.g., "ap-southeast-2", "us-east-1") |
| `{{PRIMARY_TASK_1}}` | Kebab-case name of first primary task (e.g., "scan-triage") |
| `{{PRIMARY_TASK_1_TITLE}}` | Title-case name of first primary task (e.g., "Scan Triage") |
| `{{PRIMARY_TASK_2}}` | Kebab-case name of second primary task |
| `{{PRIMARY_TASK_2_TITLE}}` | Title-case name of second primary task |
| `{{PRIMARY_TASK_3}}` | Kebab-case name of third primary task |
| `{{PRIMARY_TASK_3_TITLE}}` | Title-case name of third primary task |

## File naming convention

Every file ending in `.template` is a scaffold. On instantiation:
1. Strip the `.template` suffix — the result is the final filename (e.g., `agents/industry-expert.yaml.template` becomes `agents/industry-expert.yaml`).
2. Replace all `{{PLACEHOLDER}}` strings inside the file with the values from the table above.
3. Files without a `.template` suffix (e.g., `prompts/README.md`) are copied as-is with no renaming required.

## Structure

```
_template/
├── README.md                              # this file (copied as-is)
├── agents/                                # Claude agent configs per role
│   ├── industry-expert.yaml.template      # MANDATORY — sonnet-tier domain knowledge agent
│   ├── compliance-reviewer.yaml.template  # MANDATORY — opus-tier compliance reviewer
│   └── customer-success.yaml.template     # OPTIONAL — customer success & onboarding agent
├── prompts/                               # reusable prompts for primary tasks
│   ├── README.md                          # prompt structure convention (copied as-is)
│   ├── primary-task-1/
│   │   └── system.md.template             # scaffold for first primary task
│   ├── primary-task-2/
│   │   └── system.md.template             # scaffold for second primary task
│   └── primary-task-3/
│       └── system.md.template             # scaffold for third primary task
├── standards/                             # industry standards
│   ├── regulatory.md.template             # regulators, compliance frameworks, data residency
│   └── domain-glossary.md.template        # industry-specific terminology
└── architecture/
    ├── decisions/                         # ADRs for this vertical
    │   └── ADR-001-vertical-positioning.md.template
    └── schemas/                           # shared data schemas
        └── domain-entity.schema.json.template  # JSON Schema draft-07 — central data model
```

## What to fill in (per-vertical)

For each new vertical, fill in all 7 items below. Items marked **MANDATORY** must exist; **OPTIONAL** items can be omitted if not applicable.

1. **agents/industry-expert.yaml** [MANDATORY] — sonnet-tier domain knowledge agent; knows regulators, OEM partners, key metrics
2. **agents/compliance-reviewer.yaml** [MANDATORY] — opus-tier reviewer for industry-specific compliance frameworks
3. **agents/customer-success.yaml** [OPTIONAL] — sonnet-tier onboarding and success agent; omit if vertical has no customer-facing CS function
4. **prompts/** [MANDATORY] — 3-7 primary-task prompts; rename prompt directories from `primary-task-N` to kebab-case task names
5. **standards/regulatory.md** [MANDATORY] — applicable regulations, regulator table, data residency rationale, audit retention, annual review date
6. **standards/domain-glossary.md** [MANDATORY] — industry-specific terminology (aim for 15-30 terms grouped by category)
7. **architecture/decisions/ADR-001-vertical-positioning.md** [MANDATORY] — who we sell to, who we don't, why; 3-5 alternatives considered
8. **architecture/schemas/domain-entity.schema.json** [MANDATORY] — JSON Schema draft-07; rename generic entities (PrimaryEntity, Customer, Practitioner) to match vertical terminology

## Usage — Manual (Windows / bash)

These steps work on Windows (bash or PowerShell). All paths use forward slashes.

### Step 1 — Copy the template

```bash
# Bash
cp -r D:/orryx-knowledge/vertical-templates/_template \
      D:/orryx-knowledge/vertical-templates/medical-imaging
```

```powershell
# PowerShell
Copy-Item -Recurse D:/orryx-knowledge/vertical-templates/_template `
          D:/orryx-knowledge/vertical-templates/medical-imaging
```

### Step 2 — Rename prompt directories

Rename the three `primary-task-N` directories to kebab-case task names before substitution:

```bash
# Bash example for medical-imaging
mv D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/primary-task-1 \
   D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/scan-triage
mv D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/primary-task-2 \
   D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/report-generation
mv D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/primary-task-3 \
   D:/orryx-knowledge/vertical-templates/medical-imaging/prompts/referral-routing
```

### Step 3 — Substitute all placeholders

Use `sed` (bash) or `(Get-Content | ForEach-Object)` (PowerShell). Run one command per placeholder:

```bash
# Bash — substitute all placeholders recursively
NEW_DIR="D:/orryx-knowledge/vertical-templates/medical-imaging"

declare -A REPLACEMENTS=(
  ["{{INDUSTRY}}"]="medical-imaging"
  ["{{INDUSTRY_TITLE}}"]="Medical Imaging"
  ["{{TARGET_CUSTOMER}}"]="radiology clinics and imaging centres"
  ["{{NOT_TARGET}}"]="hospital radiology departments"
  ["{{MARKET_SIZE}}"]="~$2B AUD"
  ["{{KEY_COMPETITORS}}"]="Nuance, Intelerad, Sectra"
  ["{{REGULATORY_BODIES}}"]="TGA, ACSQHC"
  ["{{OEM_PARTNERS}}"]="Philips, GE Healthcare, Siemens"
  ["{{KEY_METRICS}}"]="scan turnaround time, report accuracy rate, radiologist utilisation"
  ["{{COMPLIANCE_FRAMEWORK}}"]="My Health Records Act, Privacy Act 1988, TGA regulations"
  ["{{DATA_RESIDENCY}}"]="ap-southeast-2"
  ["{{PRIMARY_TASK_1}}"]="scan-triage"
  ["{{PRIMARY_TASK_1_TITLE}}"]="Scan Triage"
  ["{{PRIMARY_TASK_2}}"]="report-generation"
  ["{{PRIMARY_TASK_2_TITLE}}"]="Report Generation"
  ["{{PRIMARY_TASK_3}}"]="referral-routing"
  ["{{PRIMARY_TASK_3_TITLE}}"]="Referral Routing"
)

for KEY in "${!REPLACEMENTS[@]}"; do
  VALUE="${REPLACEMENTS[$KEY]}"
  find "$NEW_DIR" -type f | xargs sed -i "s|${KEY}|${VALUE}|g"
done
```

### Step 4 — Strip `.template` suffixes

```bash
# Bash — rename all .template files by removing the suffix
find "$NEW_DIR" -name "*.template" | while read f; do
  mv "$f" "${f%.template}"
done
```

```powershell
# PowerShell equivalent
Get-ChildItem -Path "D:/orryx-knowledge/vertical-templates/medical-imaging" -Recurse -Filter "*.template" |
  ForEach-Object { Rename-Item $_.FullName ($_.FullName -replace '\.template$','') }
```

### Step 5 — Validate

```bash
# Bash — check no unintentional placeholders remain
grep -r "{{" D:/orryx-knowledge/vertical-templates/medical-imaging

# Expected: empty output (or only intentional {{PLACEHOLDER}} content inside prompt output-format examples)
# If any template-level placeholders remain, fix them before proceeding.

# Validate YAML files parse
python3 -c "
import yaml, glob, sys
files = glob.glob('D:/orryx-knowledge/vertical-templates/medical-imaging/agents/*.yaml')
for f in files:
    yaml.safe_load(open(f))
    print('OK:', f)
"

# Validate JSON schema parses
python3 -m json.tool \
  D:/orryx-knowledge/vertical-templates/medical-imaging/architecture/schemas/domain-entity.schema.json \
  > /dev/null && echo "JSON OK"
```

## Via @orryx/create (Wave 8 CLI — coming soon)

```bash
npx @orryx/create vertical medical-imaging
# Prompts for each placeholder; produces a ready-to-customise vertical scaffold
```

## Why this framework exists

The 2026-05-12 audit found `orryx-repair-intelligence` was acting as the template for crash-repair-vertical setups (not a product itself). Per recommendation R5: generalise the pattern. This framework is the result — one meta-template, one verified worked example (`legal-services/`), and a path to scaffold future verticals cheaply.

## See also

- `legal-services/` — verified worked example (instantiated 2026-06-10, all 7 checklist items complete)
- `crash-repair/` — stub pending backfill from `orryx-repair-intelligence` source repo; not yet a complete instantiation
- `D:\orryx-audit\08-recommendations.md` — R5 explanation
- `D:\orryx-audit\10-target-architecture.md` — where vertical-templates fit in the target architecture
