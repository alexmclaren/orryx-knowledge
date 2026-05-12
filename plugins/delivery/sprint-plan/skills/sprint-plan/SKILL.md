---
name: sprint-plan
description: Generate a sprint plan. Triggers on /sprint-plan, "plan next sprint", "what should we work on". Merges Triora sprint-plan + Pillarworks SPRINT pattern.
version: 0.1.0
license: MIT
---

# sprint-plan

## TL;DR

Generate the next sprint task list from: research-queue inputs (CPD protocol), tech-debt backlog, stakeholder requests, prior-sprint carryovers. Output: structured sprint doc with capacity check.

## Workflow

1. Inputs: research-queue (docs/research/Research_Queue.md), tech-debt log, stakeholder requests, last-sprint retro
2. Estimate team capacity for the sprint (account for PTO, meetings, on-call)
3. Pick a P0 set that fits within capacity
4. Add P1 stretch (only if P0 is well-sized)
5. Output: SPRINT_<N>.md with acceptance criteria per item

## See also

- methodology/spec-driven-delivery
- orchestration/cpd-protocol
- delivery/release-notes
