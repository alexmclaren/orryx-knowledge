# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/flow/ for review and packaging.

**Production target:** `D:\orryx-flow\.claude-plugin\flow-phi-exposure\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/flow/flow-phi-exposure/`

Entity: **flow**
Owning repo: **D:\orryx-flow**
Plugin: **flow-phi-exposure**