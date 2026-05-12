# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/crash-repair-template/ for review and packaging.

**Production target:** `D:\orryx-knowledge\vertical-templates\crash-repair\.claude-plugin\crash-repair-vertical-template\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/crash-repair-template/crash-repair-vertical-template/`

Entity: **crash-repair-template**
Owning repo: **D:\orryx-knowledge\vertical-templates\crash-repair**
Plugin: **crash-repair-vertical-template**