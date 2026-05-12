#!/usr/bin/env bash
# Orryx safety-hooks-base — PreToolUse bash safety check
# Reads the proposed bash command on stdin, exits non-zero to block if a dangerous pattern matches.

set -euo pipefail

# Read tool-call input
INPUT=$(cat -)

# Extract the bash command (json input has tool_input.command for Bash tool)
COMMAND=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('tool_name') == 'Bash':
        print(data.get('tool_input', {}).get('command', ''))
except Exception:
    pass
" 2>/dev/null || true)

# If not a Bash call, allow
if [ -z "$COMMAND" ]; then
    exit 0
fi

# Pattern checks
deny() {
    echo "BLOCKED by orryx safety-hooks-base: $1" >&2
    echo "Command: $COMMAND" >&2
    echo "If you intended this, document an override in .claude/HOOKS-DECISIONS.md" >&2
    exit 2
}

case "$COMMAND" in
    *"rm -rf /"*|*"rm -rf ~"*|*"rm -rf \$HOME"*|*"rm -rf $HOME"*)
        deny "destructive rm against home or root" ;;
    *"sudo rm"*)
        deny "sudo rm — too broad; specify the file precisely without sudo where possible" ;;
    *"chmod 777 /"*)
        deny "blanket chmod 777 against system root" ;;
    *"curl"*"|"*"sh"*|*"wget"*"|"*"sh"*)
        deny "curl/wget piped to shell — execute untrusted code; review before running" ;;
    *"git push --force"*"main"*|*"git push --force"*"master"*|*"git push -f"*"main"*|*"git push -f"*"master"*)
        deny "force push to main/master — coordinate explicitly" ;;
    *"dd if=/dev/"*"of=/dev/"*)
        deny "raw disk dd — high risk; use safer copy commands" ;;
    *"> /dev/sda"*|*"> /dev/nvme"*|*"> /dev/hd"*)
        deny "direct block-device write" ;;
    *"mkfs"*"/dev/"*)
        deny "mkfs against /dev — formatting a disk" ;;
    *":(){"*":|:&};:"*)
        deny "fork bomb" ;;
esac

# Allow
exit 0
