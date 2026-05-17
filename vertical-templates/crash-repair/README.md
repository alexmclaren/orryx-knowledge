# crash-repair vertical template

First instance of the `vertical-templates/` framework. Setup template for working with Australian crash-repair companies. Originally `orryx-repair-intelligence`; generalised in Wave 8.

## What this vertical is

The Australian crash-repair industry: **~$9B market**, **~4,500 repairers**, **~1.5M repairs/year**. Our positioning: **AI-augmented estimating + OEM-compliance + ADAS-calibration detection + dispute-support tooling** for **repairers**, **NOT** for insurers.

We compete against: Audatex AI, Tractable, Estimage AI.

## Filled-in placeholder values

| Placeholder | Value |
|---|---|
| `{{INDUSTRY}}` | `crash-repair` |
| `{{INDUSTRY_TITLE}}` | `Australian Crash Repair` |
| `{{TARGET_CUSTOMER}}` | Crash repairers (~4,500 in AU) |
| `{{NOT_TARGET}}` | Insurers (Suncorp, Allianz, IAG, NRMA, etc.) |
| `{{MARKET_SIZE}}` | ~$9B AUD annual (~1.5M repairs × $6k avg) |
| `{{KEY_COMPETITORS}}` | Audatex AI, Tractable, Estimage AI |
| `{{REGULATORY_BODIES}}` | ACCC (consumer law), ASIC (vehicle data privacy if applicable), state-level repair regulators |
| `{{OEM_PARTNERS}}` | Toyota, Ford, BMW, Mercedes-Benz, Tesla, etc. — OEM repair specifications |
| `{{KEY_METRICS}}` | Cycle time, gross margin per repair, OEM compliance rate, ADAS calibration completion, dispute rate |
| `{{COMPLIANCE_FRAMEWORK}}` | AU Privacy Act 1988, Australian Consumer Law (ACL), state-level repairer licensing |
| `{{DATA_RESIDENCY}}` | ap-southeast-2 (Sydney) |

## Source material

The original `orryx-repair-intelligence` repo (currently dormant since Jan 2026) contains:

- `agents/claude/` — agent configs to migrate here
- `agents/shared/` — shared cross-agent configs
- `prompts/{damage-assessment,oem-compliance,estimate-generation,evidence-packaging}/` — primary-task prompts
- `standards/{australian,oem}/` — regulatory + OEM standards docs
- `architecture/{decisions,schemas}/` — ADRs + data schemas
- `context.md` (252 KB) — research dump (NOT migrated; stays in original repo for IP reasons)
- `Executive Summary.pdf` — strategy doc (NOT migrated; stays in original repo)
- `research/{market,regulatory,repairers}/` — market research (NOT migrated)

The template captures the **reusable scaffold**. Market research + strategy stays in the source repo as IP.

## Migration plan (post-Wave-8)

1. Copy reusable directories from `D:\orryx-repair-intelligence\` (clone first if not local) to this directory
2. Replace placeholders with the filled-in values above
3. Strip subsidiary-specific content (context.md, Executive Summary.pdf, research/)
4. Run via the `@orryx/create vertical` CLI (Wave 8 tool) to verify the template works
5. Document in `D:\orryx-knowledge\domain\verticals\crash-repair.md` for the knowledge base

## Status

**Scaffolded (Wave 8).** Awaiting migration of canonical content from `orryx-repair-intelligence`. Once content lands here, the source repo's reusable portions can be deleted; the source repo keeps strategy/research/exec-summary.

## See also

- `_template/README.md` — the meta-template + placeholder reference
- `D:\orryx-audit\10-target-architecture.md` — where vertical-templates fit
- `D:\orryx-audit\08-recommendations.md` R5 — why we're doing this
- `D:\orryx-repair-intelligence\` — source material (currently dormant Jan 2026)
