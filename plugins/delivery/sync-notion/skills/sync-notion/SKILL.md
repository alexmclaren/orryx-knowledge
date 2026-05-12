---
name: sync-notion
description: Bidirectional sync of project state to Notion (sprint docs, ADRs, decisions). Triggers on /sync-notion, "push to Notion", "sync my docs". Promoted from Brain slash command.
version: 0.1.0
license: MIT
---

# sync-notion

## TL;DR

Push local docs (sprint plans, ADRs, decisions) to the corresponding Notion pages and pull updates back. Uses the Notion MCP. Audit trail in commit messages + Notion page history.

## Workflow

1. Identify mapping: which local docs -> which Notion pages (configured in .notion-sync.yaml)
2. Push: for each local doc, upsert the Notion page (preserves Notion-specific content like comments)
3. Pull: for each Notion page, write back to local doc if Notion has newer changes
4. Surface conflicts (both sides changed); human resolves
5. Log to .notion-sync.log

## See also

- delivery/sync-docs
- delivery/docs-pack
