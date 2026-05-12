# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/brain/ for review and packaging.

**Production target:** `D:\orryx-brain\.claude-plugin\brain-3-lane-orchestration\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/brain/brain-3-lane-orchestration/`

Entity: **brain**
Owning repo: **D:\orryx-brain**
Plugin: **brain-3-lane-orchestration**