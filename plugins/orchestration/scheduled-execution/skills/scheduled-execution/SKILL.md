---
name: scheduled-execution
description: Three-tier scheduled execution model for Claude Code (cloud Routines, local persistent Desktop tasks, session-scoped /loop). Triggers on "run this every day", "schedule X", "automate the audit", "make this recurring", or any periodic-execution need. Built from reality-check Spec ST-001 framing + the architecture brief's three-tier model.
version: 0.1.0
license: MIT
---

# scheduled-execution

## TL;DR

Three tiers, picked by cadence and trust requirements:

| Tier | Mechanism | Use when… |
|---|---|---|
| **Cloud** | Claude Code Routines (April 2026+) | Daily / hourly recurring work; runs on Anthropic infrastructure; no local machine needed |
| **Local persistent** | Desktop tasks (local Claude Code) | Daily / hourly recurring work; needs filesystem or local-only resource access |
| **Session-scoped** | `/loop` slash command in a session | Short-lived polling within an active session ("check the build every 5 minutes") |

Reality-check (the daily Orryx Group audit at `D:\Orryx\reality-check\`) is the canonical example of tier 2 / Local Persistent. The architecture brief's Wave 4 reality-check plugin formalises this pattern.

## Tier 1 — Cloud (Routines)

Best when:
- Work doesn't need local filesystem (or filesystem access via MCP is sufficient)
- You want it to run regardless of whether your machine is on
- The work is well-bounded (no human input needed)

Example use: daily audit of public-facing endpoints; daily Slack summary; weekly competitor analysis.

How to set up: Use the `/schedule` skill (Claude Code plugin) or Anthropic Console Routines panel.

Cost: per-run API cost. Tracks in usage dashboard.

## Tier 2 — Local persistent (Desktop tasks)

Best when:
- Work needs local filesystem (e.g., scanning D:\ for changes)
- Work needs local-only secrets (e.g., a local SSH key)
- You're OK with it skipping when your machine is off
- You want full visibility into what ran

Example use: reality-check daily audit (scans D:\ project dirs); local backup verification; nightly local lint pass.

How to set up:

```powershell
# Windows Task Scheduler — example for reality-check
$action = New-ScheduledTaskAction -Execute "claude" -Argument "code /reality-check"
$trigger = New-ScheduledTaskTrigger -Daily -At 06:00
Register-ScheduledTask -TaskName "Orryx-RealityCheck" -Action $action -Trigger $trigger
```

For macOS/Linux: `launchd` or `cron` respectively.

Cost: free except the API cost per run.

## Tier 3 — Session-scoped (`/loop`)

Best when:
- Polling for a state change ("wait for the build to finish")
- Short-lived investigation that needs periodic check-ins
- You're actively in a session and want to stay engaged

Example use: "every 5 minutes check the deploy status until it's green or failed", "poll the PR for review comments", "wait for the test suite to complete then summarise".

How to use:

```
/loop 5m /deploy-status
```

Slash command runs every 5 minutes within the current session. `/loop` without an interval lets the model self-pace.

Cost: per-invocation API cost. Session ends → loop ends.

## Decision flow

```
Is this a one-time task? → Just do it.
Does it need to run when my machine is off? → Tier 1 (Cloud Routines)
Does it need local filesystem / local secrets? → Tier 2 (Desktop tasks)
Is this just polling within a session? → Tier 3 (/loop)
```

## Reality-check as worked example

`D:\Orryx\reality-check\` runs daily at 0913 (per the audit's Phase 1 finding). It:

1. Scans 7 active Orryx repos for changes since last baseline
2. Updates `baselines/<repo>.json` (fingerprint-keyed)
3. Writes `reports/daily-reality-check.md` (rolling summary)
4. Archives previous runs to `reports/archive/<run-id>.md`

Tier 2 (Desktop tasks) is correct because:
- Needs filesystem access to D:\
- OK to skip when machine is off
- Has a defined work unit (one run per day)

Once `delivery/reality-check` (Wave 4 plugin) ships, this should consume the audit's `_entity-map.json` for per-entity rollups.

## Production cadences (per repo)

| Cadence | Use cases |
|---|---|
| Daily | Reality-check; security scan; dependency audit; backlog grooming |
| Hourly | Health checks; cost-spike detection; lint of in-flight branches |
| Weekly | Sprint planning prep (per `methodology/spec-driven-delivery`); cross-repo drift audit |
| Per-PR | Code review; cross-model verification; quality gates |

## Anti-patterns

- **Tier-mismatch.** Running a daily filesystem audit via cloud Routines that can't see your D:\ — won't work. Tier 1 for cloud-accessible data only.
- **Long-running `/loop` in unattended session.** Tier 3 is for active sessions. For unattended, use Tier 2.
- **Cron-style without timezone awareness.** Australian timezone matters for Triora's regulatory reporting. Document the timezone with the schedule.
- **No monitoring on tier 2 tasks.** If a Desktop task silently stops running, you may not notice for weeks. Add a "last successful run" heartbeat (reality-check does this).

## See also

- `delivery/reality-check` (Wave 4) — the canonical Tier 2 example
- `delivery/credential-audit` (Wave 4) — could run at any tier
- `delivery/security-audit` (Wave 4) — typically daily Tier 2
- Anthropic Routines docs (April 2026+)
- Windows Task Scheduler / launchd / cron docs
- `D:\Orryx\reality-check\` — local reference implementation
