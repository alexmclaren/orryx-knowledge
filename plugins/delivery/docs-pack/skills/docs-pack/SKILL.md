---
name: docs-pack
description: Creates a documentation outline with concise summary, ready for team sharing. Triggers on /docs-pack, "package this for the team", "make a brief for X". Lifted from Pillarworks SKILL.
version: 0.1.0
license: MIT
---

# docs-pack

## TL;DR

Generate a concise team-shareable doc outline from a feature, PR, decision, or investigation. Output: structured markdown ready to paste into Notion / wiki / Slack thread / email.

## Workflow

1. Identify the scope: feature / PR / decision / investigation / sprint
2. Pull context: relevant files, commits, spec docs, ADRs
3. Draft outline: TL;DR (2-3 sentences) -> Why / What / How / Risks / Next steps
4. Format for the audience (Slack: terse; Notion: structured; email: prose)
5. Output as markdown to stdout; do not commit

## See also

- delivery/release-notes
- methodology/spec-driven-delivery
