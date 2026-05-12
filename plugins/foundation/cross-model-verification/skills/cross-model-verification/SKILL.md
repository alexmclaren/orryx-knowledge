---
name: cross-model-verification
description: Cross-model verification protocol for high-risk code. Triggers when authoring or reviewing code in categories prone to subtle errors (regex, async / concurrency, security-sensitive code, database migrations, edge-case-heavy parsing). Defines when to verify Claude output with a non-Claude model (ChatGPT, Gemini), the handoff-protocol YAML schema, and how to interpret verification results. Lifted from Pillarworks's 2-verifier pattern.
version: 0.1.0
license: MIT
---

# cross-model-verification

## TL;DR

For code where Claude is likely to miss subtle errors (regex / async / security / migrations / heavy parsing), have a non-Claude model review the output before commit. Pillarworks formalised this with 2 ChatGPT verifier agents + a YAML handoff protocol; promoting to cross-cutting in Wave 1.

The verifier doesn't fix — it flags. Claude (or the human) acts on the flags.

## When to verify

| Code type | Verify? | Why |
|---|---|---|
| Regex | YES | Backreferences, anchors, escape handling — easy to get wrong subtly |
| Async / concurrency | YES | Race conditions are nearly invisible to single-model review |
| Security-sensitive (auth, crypto, input validation) | YES | High blast radius if wrong |
| Database migrations | YES | Irreversible if shipped |
| Heavy parsing (CSV, EDI, complex JSON) | YES | Edge cases dominate |
| Routine CRUD | NO | Verification overhead > value |
| UI / styling | NO | Visual review catches errors |
| Logging / observability | NO | Low-stakes |
| Doc generation | NO | Low-stakes |

## The handoff protocol

```yaml
# handoff-protocol.yaml — declared once per repo
verification_required:
  - file_pattern: "**/*.test.ts"            # for test code? sometimes
    when: pre-merge
    verifier: gpt-4-turbo
  - file_pattern: "**/migrations/**"
    when: pre-commit
    verifier: gpt-4-turbo
  - file_pattern: "**/auth/**"
    when: pre-merge
    verifier: gpt-4-turbo
    severity: high

verifier_prompts:
  gpt-4-turbo: |
    You are reviewing Claude-generated code for the kinds of errors Claude reliably misses:
    - Off-by-one in array/string boundaries
    - Regex edge cases (unicode, multiline, escape sequences)
    - Async race conditions (parallel writes to shared state)
    - SQL injection / XSS in user-input handling
    - Missing error handling for the unhappy path
    - Type coercion bugs (== vs ===, JS automatic conversions)

    Flag each issue with: severity (low/med/high), location (file:line), explanation.
    Do NOT fix; only flag.
```

## Workflow

### 1. Generate code with Claude

Standard Claude session, plan-mode-first, code generated.

### 2. Check the handoff protocol

Does any modified file match a `verification_required.file_pattern`?

```bash
# Pre-commit hook (suggested):
grep -E "(migrations|auth|.test.ts)" $(git diff --cached --name-only)
```

### 3. Invoke the verifier

Pillarworks's pattern: 2 ChatGPT subagents (one general, one security-focused) read the diff and return structured findings.

Implementation options:
- **Pre-commit hook** that calls ChatGPT API with the diff
- **CI workflow** that gates merges on verification
- **Manual** — paste diff into ChatGPT with the verifier prompt; copy findings back

### 4. Act on findings

| Finding severity | Action |
|---|---|
| high | Stop. Address before commit/merge. |
| medium | Investigate. Acknowledge in PR description if intentional. |
| low | Optional. Worth addressing as low-hanging fruit. |

### 5. Record verification result

If verification passes, add to commit message:

```
verified-by: gpt-4-turbo (handoff-protocol@orryx 0.1.0)
verification: pass / 0 high / 2 medium addressed / 1 low acknowledged
```

If verification fails: don't commit until addressed.

## Why this works

Claude (or any single model) has consistent blind spots — regex anchors, async ordering, type coercion. A different model architecture trained differently has different blind spots. Two-model verification catches what either alone misses. This is well-documented in the prompt-engineering literature.

The cost is small (one extra API call per high-risk diff). The save is large (avoided production incidents).

## Gotchas

- **Don't verify everything.** Verification overhead on routine code costs more than it saves.
- **Don't trust the verifier blindly.** Verifiers also have false-positives. The verifier's findings inform a human decision; they don't replace it.
- **Verifier prompt drifts.** Review the verifier prompt quarterly; new error categories emerge.
- **Verification is not testing.** Verifiers find conceptual bugs; tests find regression. Both needed.

## See also

- Pillarworks's actual `handoff-protocol.yaml` — reference implementation
- Pillarworks's 2 ChatGPT verifier agent configs — `D:\pillarworks-build-mvp\agents\chatgpt-*`
- `references/verifier-prompts.md` — proven verifier prompts (Wave 1)
- `references/example-findings.md` — what verifier output looks like in practice
