---
name: safety-hooks-base
description: Universal Claude Code safety hooks for the Orryx Group. Triggers when setting up a new repo's .claude/settings.json, when reviewing existing hook configurations, or when secret leakage / dangerous bash patterns need to be blocked at the tool-call boundary. Installs PreToolUse bash blocklist, PostToolUse file blocklist (.env / .pem / terraform.tfstate / *-accessKeys.csv), and UserPromptSubmit safety-policy check.
version: 0.1.0
license: MIT
---

# safety-hooks-base

## TL;DR

Every Orryx repo installs this hook bundle. Three hooks fire at three boundaries: **PreToolUse** blocks dangerous bash patterns; **PostToolUse** blocks writes to secret-bearing files (`.env`, `.pem`, `terraform.tfstate`, `*-accessKeys.csv`); **UserPromptSubmit** scans for risky patterns in the user's prompt before the session begins. Merged from Triora's `.claude/settings.json` and Pillarworks's `bash-safety-check.sh` + `post-edit-lint.sh` + `safety-policy.md` patterns (Wave 0 audit).

## Workflow

### 1. Install in your repo

```bash
# From the repo root:
claude /plugin install foundation/safety-hooks-base@orryx-group
```

This adds the hooks to `.claude/settings.json` (creates the file if absent).

### 2. What the hooks do

**PreToolUse (bash blocklist):**
- Blocks `rm -rf /`, `rm -rf ~`, `rm -rf $HOME`, `sudo rm`
- Blocks `chmod 777 /`, blanket chmod on system dirs
- Blocks `curl ... | sh`, `wget ... | sh` (untrusted execution)
- Blocks `git push --force` to `main` or `master`
- Blocks `dd if=/dev/...` (disk wipes)
- Blocks `> /dev/sda*`, `> /dev/nvme*` (direct disk writes)

**PostToolUse (Edit/Write file blocklist):**
- Blocks writes to: `**/.env*` (except `.env.example`, `.env.template`)
- Blocks writes to: `**/*.pem`, `**/*.key`, `**/*.pfx`, `**/*.p12`
- Blocks writes to: `**/terraform.tfstate*`, `**/*.tfstate.backup`
- Blocks writes to: `**/*-accessKeys.csv`, `**/*-credentials.csv`
- Blocks writes to: `**/secrets-*.json`, `**/pilot_users.json`
- Suggests adding to `.gitignore` if you got here on purpose

**UserPromptSubmit (safety policy check):**
- Scans user prompt for: literal `AKIA[A-Z0-9]{16}` (AWS access keys), `mp_live_*` (Magic Patterns), `sk_live_*` (Stripe), `xoxb-*` (Slack), `eyJ[A-Za-z0-9_-]+\.eyJ` (JWT)
- If any found: warns user, suggests rotation, does NOT auto-block (user might be discussing remediation)

### 3. Opt-out per hook

If a specific hook conflicts with your workflow:

```json
// .claude/settings.json
{
  "hooks": {
    "safety-hooks-base": {
      "preToolUse": "enabled",
      "postToolUse": "enabled",
      "userPromptSubmit": "disabled"
    }
  }
}
```

Document the opt-out reason in `.claude/HOOKS-DECISIONS.md` (audit trail).

### 4. Customise per repo

Need an additional pattern blocked? Add to `.claude/hooks/post-edit-lint.sh` locally — the base hooks check existence of repo-local overrides and call them after the base checks.

## Patterns this bundle merges

| Source | Pattern |
|---|---|
| Triora `.claude/settings.json` | PreToolUse bash blocklist + PostToolUse `.env`/`.pem`/`terraform.tfstate` blocklist + auto-test-suggest |
| Pillarworks `bash-safety-check.sh` | More extensive bash pattern list + colourised error output |
| Pillarworks `post-edit-lint.sh` | Lint-after-edit suggestion |
| Pillarworks `safety-policy.md` | The policy doc reference (now lives in `references/safety-policy.md` here) |
| Wave 0 audit | New patterns: `*-accessKeys.csv`, `*-credentials.csv`, `secrets-*.json`, `pilot_users.json` |

## Gotchas

- **False positives.** If `chmod 777 ./scripts/install.sh` is legitimate, the PreToolUse hook will block it. Override per-hook or add an exception comment.
- **Initial setup.** First install requires `.claude/settings.json` not be empty — if absent, the plugin creates it with sensible defaults. If present but no `hooks` block, the plugin appends.
- **Secret-pattern false positives.** Discussing a leaked key in a remediation session legitimately mentions the key. The UserPromptSubmit hook warns but doesn't block — by design.

## See also

- `D:\orryx-standards\gitignore-snippets\secrets.gitignore` — the file patterns this hook reinforces
- `D:\orryx-audit\WAVE-0-HUMAN-RUNBOOK.md` — context: the 3 P0 secret incidents that motivated this hook bundle
- `references/safety-policy.md` — Pillarworks's safety policy doc (canonical reference)
- `references/triora-hook-bundle.md` — Triora's `.claude/settings.json` hook block (the original)
