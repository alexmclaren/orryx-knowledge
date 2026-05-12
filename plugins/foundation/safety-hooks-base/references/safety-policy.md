# Orryx Safety Policy (canonical reference)

This policy informs the three hooks in `safety-hooks-base`. Originally drafted by Pillarworks as `safety-policy.md`; promoted to cross-cutting in Wave 1 of the architecture migration.

## Principles

1. **Default to caution.** It is better to block a legitimate action than to permit a destructive one. The user can always override with explicit acknowledgement.
2. **Block ≠ refuse.** Blocking a tool call returns control to the human with context. The human decides whether to retry, override, or change tack.
3. **Audit trail by default.** Every block produces a log line. Repeated blocks of the same pattern indicate either a missing workflow or a missing exception — both worth documenting.
4. **Warn vs block depends on intent risk.**
   - **Block** when the destructive intent is unambiguous (`rm -rf /`)
   - **Warn** when intent is ambiguous (secret in a prompt — may be remediation)

## What gets blocked

### Bash (PreToolUse)

| Pattern | Why |
|---|---|
| `rm -rf /` / `rm -rf ~` / `rm -rf $HOME` | Destructive against root or home |
| `sudo rm` | Too broad; sudo + rm is rarely the right answer |
| `chmod 777 /` | Blanket permission relaxation on system root |
| `curl ... \| sh` / `wget ... \| sh` | Execute untrusted code from network |
| `git push --force` to `main`/`master` | Overwrites shared history |
| `dd if=/dev/... of=/dev/...` | Raw disk operations; high risk |
| `> /dev/sd*` / `> /dev/nvme*` | Direct block-device writes |
| `mkfs ... /dev/...` | Formatting a disk |
| Fork bombs (`:(){ :\|:&};:`) | DoS the local machine |

### File writes (PostToolUse)

| Pattern | Why |
|---|---|
| `**/.env*` (except `.env.example`, `.env.template`) | Secrets-bearing files belong in Secrets Manager |
| `**/*.pem`, `**/*.key`, `**/*.pfx`, `**/*.p12` | Private keys and certs |
| `**/terraform.tfstate*` | Often contains plaintext credentials |
| `**/*-accessKeys.csv`, `**/*-credentials.csv` | Cloud access key exports |
| `**/secrets-*.json` | Secret-pattern filenames |
| `**/pilot_users.json` | PII (real precedent: Wave 0 audit found one) |

### Prompt content (UserPromptSubmit)

| Pattern | Action |
|---|---|
| `AKIA[A-Z0-9]{16}` (AWS keys) | Warn |
| `mp_live_*` (Magic Patterns) | Warn |
| `sk_live_*` (Stripe) | Warn |
| `xoxb-*` (Slack) | Warn |
| JWT pattern | Warn |

## Why these patterns specifically

The Wave 0 audit (2026-05-12) found three P0 security incidents:

1. Live `mp_live_*` MCP key in Triora's committed `.mcp.json`
2. AWS Bedrock access keys CSV at `D:\Secrets\pillarworks-bedrock_accessKeys.csv`
3. Triora root: `secrets-329.json`, `secrets-330.json`, `.env.backup-2026-04-14`, `pilot_users.json`, `terraform-state-backup-*.json`

Each pattern in this hook bundle prevents one of those specific recurrences. Future patterns added only when a new class of incident is identified.

## What does NOT get blocked

- **Reading** secrets files (the postToolUse hook only blocks writes)
- **Discussing** secrets in prompts (the userPromptSubmit hook only warns)
- **Tool calls** that happen entirely in the model's context (no tool actually invoked)
- **Tests** that touch fixture files matching the patterns (allowed if file is under `tests/`, `__tests__/`, `__fixtures__/` — opt-in exception)

## Override pattern

When a block is wrong for your workflow:

1. Document the exception in `.claude/HOOKS-DECISIONS.md`:
   ```markdown
   ## 2026-05-12 — Exception: write to `tests/fixtures/.env.example`
   
   The `safety-hooks-base/post-tool-use/file-blocklist.sh` blocks all `.env*` writes,
   but our test fixtures need a `.env.example` to exist for the integration tests.
   
   Mitigation: enabled exception via `.claude/settings.json`
   `hooks.safety-hooks-base.postToolUse.exceptions: ["tests/fixtures/.env.example"]`
   ```
2. Update `.claude/settings.json` with the exception.
3. Re-run.

The audit trail is the point — exceptions are fine, undocumented exceptions are not.
