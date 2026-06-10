# SuperClaude v1.0 Archive

SuperClaude v1.0 config (core/mcp/personas/rules/todos) + routing test. Archived 2026-06-10 per audit decisions D4/D6 (SuperClaude sunset — the group converged on skills+agents+commands instead). Kept for reference; not in active use.

## Files

| File | Description |
|------|-------------|
| `superclaude-core.yml` | Core SuperClaude configuration |
| `superclaude-mcp.yml` | MCP integration configuration |
| `superclaude-personas.yml` | Persona definitions |
| `superclaude-rules.yml` | Routing and behaviour rules |
| `todos.yml` | Todo/task configuration |
| `test_superclaude_routing.py` | Routing test harness |

## Origin

Source: `orryx-brain/orryx-brain/claude/` (nested clone, WA.4 cleanup target)

## Audit Reference

WA.4 — monorepo cleanup (June 2026 audit). The nested `orryx-brain/orryx-brain/` clone contains the active orchestrator build source (Makefile-referenced); only the SuperClaude configs were sunset and archived here. The rest of the nested clone is subject to a separate migration task.
