# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/directors-portal/ for review and packaging.

**Production target:** `D:\orryx-directors-portal (post-extraction)\.claude-plugin\directors-portal-ui-ux\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/directors-portal/directors-portal-ui-ux/`

Entity: **directors-portal**
Owning repo: **D:\orryx-directors-portal (post-extraction)**
Plugin: **directors-portal-ui-ux**