# prompts/ — vertical task prompts

Each subdirectory is one **primary task** for this vertical. Name the directory after the task in kebab-case (e.g. `matter-intake-automation`, `damage-assessment`, `patient-triage`).

## Convention

```
prompts/
├── <primary-task-1>/
│   └── system.md          # System prompt for this task
├── <primary-task-2>/
│   └── system.md
└── <primary-task-3>/
    └── system.md
```

Each `system.md` file contains:
- `## Context` — what role the AI plays for this task
- `## Constraints` — hard rules (compliance, privacy, guardrails)
- `## Task` — numbered steps
- `## Output format` — JSON or structured text expected from the AI
- `## Success criteria` — how you know the output is correct

## How many prompts?

Aim for **3-7 prompts** — one per primary task the vertical's customers care about most. More than 7 suggests the task decomposition is too fine-grained.

## Naming the prompt directories

Replace `{{PRIMARY_TASK_1}}`, `{{PRIMARY_TASK_2}}`, `{{PRIMARY_TASK_3}}` (from the README placeholder table) with kebab-case names reflecting the actual tasks. Examples:

| Vertical | Example task directories |
|---|---|
| legal-services | matter-intake-automation, legal-research-augmentation, document-automation |
| crash-repair | damage-assessment, oem-compliance-check, estimate-generation |
| medical-imaging | scan-triage, report-generation, referral-routing |

## See also

- `../README.md` — placeholder table and naming conventions
- `legal-services/prompts/` — worked example (see `vertical-templates/legal-services/`)
