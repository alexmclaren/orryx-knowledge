#!/usr/bin/env bash
# Orryx safety-hooks-base — PostToolUse file blocklist
# Runs after Edit/Write tool calls. Blocks writes to known secret-bearing file patterns.
# Exit code 2 = block; 0 = allow.

set -euo pipefail

INPUT=$(cat -)
TOOL=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null || true)

# Only act on Write/Edit tools
case "$TOOL" in
    Write|Edit|NotebookEdit) ;;
    *) exit 0 ;;
esac

FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    ti = data.get('tool_input', {})
    print(ti.get('file_path', '') or ti.get('notebook_path', ''))
except Exception:
    pass
" 2>/dev/null || true)

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

deny() {
    echo "BLOCKED by orryx safety-hooks-base: $1" >&2
    echo "File: $FILE_PATH" >&2
    echo "If you must write here, document an override in .claude/HOOKS-DECISIONS.md" >&2
    exit 2
}

# Match filename only for portability
basename=$(basename -- "$FILE_PATH")

case "$basename" in
    .env|.env.local|.env.production|.env.staging|.env.development|.env.bak|.env.backup*|.env.old)
        deny "writing to .env-style file — use Secrets Manager or env vars" ;;
    *.pem|*.key|*.pfx|*.p12|*.privatekey)
        deny "writing to private key/cert" ;;
    terraform.tfstate|terraform.tfstate.backup|*.tfstate|*.tfstate.backup)
        deny "writing to terraform state (often contains plaintext secrets)" ;;
    *-accessKeys.csv|*_accessKeys.csv|*-credentials.csv|*_credentials.csv|aws-credentials*|bedrock-*-keys*)
        deny "writing to access-keys/credentials file" ;;
    secrets-*.json|*-secrets.json|.secrets-staged.json|pilot_users.json|pilot-users.json)
        deny "writing to secrets-pattern or PII-pattern file" ;;
esac

# Exceptions
case "$basename" in
    .env.example|.env.sample|.env.template) exit 0 ;;
esac

exit 0
