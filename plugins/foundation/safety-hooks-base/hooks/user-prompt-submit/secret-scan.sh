#!/usr/bin/env bash
# Orryx safety-hooks-base — UserPromptSubmit secret pattern scan
# Warns (but does NOT block) if user prompt contains live secret patterns.
# Rationale: user may be discussing remediation; auto-blocking would be hostile.

set -euo pipefail

INPUT=$(cat -)
PROMPT=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('user_prompt', '') or data.get('prompt', ''))
except Exception:
    pass
" 2>/dev/null || true)

if [ -z "$PROMPT" ]; then
    exit 0
fi

WARNINGS=()

# AWS access keys (AKIA prefix + 16 alphanumeric)
if printf '%s' "$PROMPT" | grep -qE 'AKIA[A-Z0-9]{16}'; then
    WARNINGS+=("AWS access key (AKIA...)")
fi

# Magic Patterns live keys
if printf '%s' "$PROMPT" | grep -qE 'mp_live_[A-Za-z0-9_-]{8,}'; then
    WARNINGS+=("Magic Patterns live key (mp_live_...)")
fi

# Stripe live keys
if printf '%s' "$PROMPT" | grep -qE 'sk_live_[A-Za-z0-9]{16,}'; then
    WARNINGS+=("Stripe live secret key (sk_live_...)")
fi

# Slack bot tokens
if printf '%s' "$PROMPT" | grep -qE 'xoxb-[0-9]+-[0-9]+-[A-Za-z0-9]+'; then
    WARNINGS+=("Slack bot token (xoxb-...)")
fi

# JWT pattern (header.payload — payload starts with eyJ)
if printf '%s' "$PROMPT" | grep -qE 'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+'; then
    WARNINGS+=("JWT token")
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo "⚠️  orryx safety-hooks-base: potential live secrets detected in prompt:" >&2
    for w in "${WARNINGS[@]}"; do
        echo "   - $w" >&2
    done
    echo "" >&2
    echo "If you're discussing remediation: proceed but rotate the secret immediately." >&2
    echo "If you accidentally pasted a live secret: rotate now, do not continue." >&2
    echo "See: D:\\orryx-audit\\WAVE-0-HUMAN-RUNBOOK.md" >&2
fi

# Always exit 0 — warn, don't block
exit 0
