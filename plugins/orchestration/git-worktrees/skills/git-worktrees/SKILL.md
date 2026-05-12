---
name: git-worktrees
description: Parallel isolated workspaces via git worktrees. Triggers on "multi-terminal", "parallel work", "worktree", "I need a clean branch without losing my current state", or coordinating multiple Claude Code sessions on the same repo. Merges Brain active-worktrees pattern + Pillarworks .claude/worktrees workflow.
version: 0.1.0
license: MIT
---

# git-worktrees

## TL;DR

`git worktree` lets one repo have multiple checked-out branches simultaneously, each in its own directory. For parallel Claude Code sessions or coordinating swarming agents per `orchestration/agent-swarming`'s Branch Isolation Rule, worktrees are the right primitive.

## When to use

- Running 2+ Claude Code sessions against the same repo, each on a different branch
- Spawning parallel agents per Branch Isolation Rule (`orchestration/agent-swarming`)
- Investigating a bug on a different branch while keeping your current work in flight
- Long-running background work (CPD research stream per `orchestration/cpd-protocol`) without blocking your primary checkout

## Basic workflow

```bash
# From the main checkout (e.g., D:\pillarworks-build-mvp)
cd D:\pillarworks-build-mvp

# Create a worktree on a new branch
git worktree add ../pillarworks-build-mvp-feat-boq-export -b feat/boq-export

# OR on an existing branch
git worktree add ../pillarworks-build-mvp-hotfix-auth hotfix/auth

# List worktrees
git worktree list

# Remove when done (after merge / cleanup)
git worktree remove ../pillarworks-build-mvp-feat-boq-export
```

## Orryx Group conventions

### Worktree naming

`<repo-name>-<purpose>` or use `.claude/worktrees/<random-name>/` (Pillarworks / Brain pattern):

| Repo | Worktree pattern | Reason |
|---|---|---|
| `D:\pillarworks-build-mvp` | `D:\pillarworks-build-mvp\.claude\worktrees\<random>` | Pillarworks's pattern; keeps worktrees under `.claude/` so they're git-ignored by default |
| `D:\orryx-brain` | `D:\orryx-brain\.claude\worktrees\<random>` | Brain's pattern (2 active at audit time) |
| Triora | Not currently used | Triora hasn't adopted the pattern yet |

The `.claude/worktrees/` pattern keeps them adjacent to the main checkout, easy to find, and out of git tracking.

### One agent per worktree

Per `orchestration/agent-swarming` Branch Isolation Rule: each parallel agent gets its own branch + worktree. Never two agents in the same worktree.

### Worktree cleanup discipline

Worktrees accumulate. After merging a branch:

```bash
git worktree remove .claude/worktrees/hungry-noyce-dd3451
git branch -d feat/the-branch-that-was-merged
```

Worktrees holding stale branches eat disk + confuse the next session.

## Common operations

### Run Claude Code in a worktree

```bash
cd .claude/worktrees/feat-boq-export
claude  # opens a session with this worktree as cwd
```

The session is fully isolated — its own `.claude/settings.local.json` if you want, its own MCP configs.

### Pull main branch into a worktree

```bash
cd .claude/worktrees/feat-boq-export
git pull origin main  # merge main into the feature branch
# OR
git rebase main       # rebase the feature branch onto main
```

### Find which worktrees are active

```bash
git worktree list
# /D/pillarworks-build-mvp                   abc123 [main]
# /D/pillarworks-build-mvp/.claude/worktrees/hungry-noyce-dd3451   def456 [feat/boq-export]
```

## Anti-patterns

- **Worktree-and-forget.** Worktrees accumulate cruft. Remove after merge.
- **Two agents in the same worktree.** Violates Branch Isolation Rule. Use separate worktrees.
- **Worktrees as long-term branches.** A worktree is for short-lived parallel work. Long-running branches should just be branches with regular checkout switches.
- **Forgetting `.gitignore` for worktree paths.** If you don't use the `.claude/worktrees/` convention, ensure your worktree directories are git-ignored to prevent accidental commits across worktrees.

## See also

- `git worktree --help` — official docs
- `orchestration/agent-swarming` — Branch Isolation Rule (the reason worktrees matter)
- `orchestration/cpd-protocol` — parallel streams that benefit from worktree isolation
- Pillarworks's worktree pattern: `D:\pillarworks-build-mvp\.claude\worktrees\hungry-noyce-dd3451`
- Brain's worktree pattern: `D:\orryx-brain\.claude\worktrees\gracious-elbakyan-f84cff` and `zen-gauss-fae575`
