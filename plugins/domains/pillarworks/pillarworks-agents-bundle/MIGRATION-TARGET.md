# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/pillarworks/ for review and packaging.

**Production target:** `D:\pillarworks-build-mvp\.claude-plugin\pillarworks-agents-bundle\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/pillarworks/pillarworks-agents-bundle/`

Entity: **pillarworks**
Owning repo: **D:\pillarworks-build-mvp**
Plugin: **pillarworks-agents-bundle**