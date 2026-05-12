# Migration target

This plugin is currently staged in orryx-knowledge/plugins/domains/triora/ for review and packaging.

**Production target:** `D:\Clinical.Trials\.claude-plugin\triora-production-testing\`

When ready to ship per-entity:
1. `Copy-Item` this directory to the target repo's `.claude-plugin\` directory
2. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo
3. Remove the local copy from `orryx-knowledge/plugins/domains/triora/triora-production-testing/`

Entity: **triora**
Owning repo: **D:\Clinical.Trials**
Plugin: **triora-production-testing**