---
name: inbox-automation
description: Gmail + Outlook365 inbox automation patterns (cleanup, sort, archive, financial-account protection). Triggers on "clean up my inbox", "process emails", "automate email triage", or any inbox-management ask. Lifted from claw-memory PowerShell + Node scripts. Sensitive — install only after confirming personal-automation posture and OAuth scopes.
version: 0.1.0
license: MIT
---

# inbox-automation

## TL;DR

Automated inbox triage patterns for Gmail (via Gmail API + Node) and Outlook365 (via MS Graph + PowerShell). Original patterns in `claw-memory` (~35 PowerShell scripts + 4 Node inbox checkers). Promoted to a reusable plugin in Wave 7 with the caveat: **this plugin handles personal communication** — install only with deliberate posture.

## When to use

- Routine inbox cleanup (move newsletters to a folder, archive read promo, delete spam)
- Financial-account protection (flag any email mentioning a bank, broker, or crypto exchange; never auto-delete; surface for review)
- Travel-itinerary collection (forward confirmations to a calendar inbox or attach to events)
- Receipt collection (forward to accounting@... for expense tracking)
- Newsletter consolidation (route to a single "Newsletters" folder for weekly batch reading)

When NOT to use:
- Time-sensitive personal communication (let humans handle in real-time)
- Anything involving an admin / family member's inbox without their consent
- Legal/regulated communication (medical, legal, government) — humans must read these

## Posture decisions

Before installing, confirm:

1. **OAuth scopes minimised.** Gmail API: `gmail.modify` (read + label + move) instead of `gmail.full`. Outlook MS Graph: `Mail.ReadWrite` not `Mail.ReadWriteAll`.
2. **Service account or personal account?** Personal account = uses your tokens; service account = isolated tokens with limited scope. Prefer service account for shared automation.
3. **Audit trail.** Every action this agent takes logs to `inbox-actions-YYYY-MM.jsonl` (timestamp, message-id, action). You can replay or reverse.
4. **Soft delete only.** This agent moves to Trash/Archive, never `permanent_delete`. Recoverable within 30 days.
5. **Financial-keyword block-list.** Hard-coded patterns: bank names, brokers, crypto exchanges, "wire transfer", "account verification". Anything matching → human review only.

## Workflow

### Setup

```bash
# Gmail
# 1. Create a GCP project, enable Gmail API, create OAuth credentials
# 2. Set scopes: gmail.modify
# 3. Run interactive OAuth flow once; store refresh token in AWS Secrets Manager
# 4. Configure: `claude /plugin install persistent-agent/inbox-automation@orryx-group`

# Outlook365
# 1. Register app in Azure AD, grant Mail.ReadWrite scope
# 2. Set up service-principal / managed identity
# 3. Store credentials per `D:\Secrets\README.md`
```

### Daily run (scheduled via `orchestration/scheduled-execution` tier 2)

```
1. Connect to Gmail + Outlook365
2. Read unread messages from the last 24 hours
3. For each message:
   a. Classify (newsletter / receipt / personal / financial / spam / unknown)
   b. If financial: surface for human review, do nothing
   c. If newsletter: move to "Newsletters/" label/folder
   d. If receipt: forward to receipts inbox + label "Receipts/"
   e. If spam (high-confidence): move to Spam folder
   f. If unknown: leave for human triage
4. Log every action to inbox-actions-YYYY-MM.jsonl
5. Update HEARTBEAT.md (per persistent-memory-template) with daily run state
```

### Classification model

Start with rule-based (sender domain, subject keywords). Upgrade to an LLM classifier later if rule-based misses too much. Track precision/recall in the action log.

## Anti-patterns

- **Auto-deleting anything irreversibly.** Always soft-delete (Trash / Archive) with 30-day recovery.
- **Bulk operations without dry-run.** Run dry-run first; show me what you'd do; then confirm.
- **OAuth scope creep.** Never request "full mailbox" scopes unless absolutely necessary.
- **Cross-account leakage.** Inbox automation for your account doesn't reach into shared / family / work accounts.
- **Ignoring financial-keyword block-list.** The block-list is non-overridable. Tampering = exposure.

## Security considerations

- Tokens stored in AWS Secrets Manager only (per `D:\Secrets\README.md`)
- Service account preferred over personal account where possible
- Annual scope review — are these scopes still minimal?
- Annual token rotation
- Action log retained for 1 year for audit

## Future work

- Calendar integration: automatically pull travel itineraries → calendar events
- Receipt → expense extraction: parse receipt emails into accounting via `orryx-accounting-mcp / /log-time-entry` equivalent
- Cross-inbox dedup: same conversation across Gmail and Outlook → don't double-process

## See also

- `persistent-agent/persistent-memory-template` — required: this agent NEEDS the file-as-memory sextet to track state across runs
- `orchestration/scheduled-execution` — for daily-cadence tier 2 setup
- `D:\Secrets\README.md` — for token storage
- claw-memory canonical scripts — 35 PowerShell + 4 Node implementations to reference / port
