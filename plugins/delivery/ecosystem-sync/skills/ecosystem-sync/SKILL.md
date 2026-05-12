---
name: ecosystem-sync
description: Sync cross-product state. Triggers on /ecosystem-sync, "what is everyone working on", "cross-product status".
version: 0.1.0
license: MIT
---

# ecosystem-sync

## TL;DR

Snapshot the cross-product state: read SYNC_STATE.md from each lane, summarise blockers + cross-lane dependencies + production health. Output: 1-page summary for the daily standup or weekly cross-lane sync.

## Workflow

1. Read D:\orryx-brain\orchestration\SYNC_STATE.md
2. Read D:\orryx-brain\orchestration\CONTROL_STATE.md
3. Read each lane session-state file (Triora SESSION_STATE.md, Pillarworks ACTIVE_WORK.md, etc.)
4. Summarise: each lane current sprint + phase + active streams + blockers
5. Surface cross-lane dependencies + their status
6. Output: cross-product status doc

## See also

- orchestration/3-lane-parallel
- orchestration/service-domain-map
