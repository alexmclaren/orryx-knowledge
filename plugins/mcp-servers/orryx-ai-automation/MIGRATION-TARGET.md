# Migration target

This service-domain MCP is currently staged in orryx-knowledge/plugins/mcp-servers/orryx-ai-automation/ for review.

**Production target:** `D:\orryx-ai-automation`

The target repo currently exists on GitHub as a stub (Sep 2025 scaffold). Wave 6 migration:

1. Replace the target repo's contents with this staged scaffold
2. `npm install`
3. `npm run build`
4. `npm test`
5. Deploy per D:\orryx-knowledge\plugins\delivery\deploy-check
6. Register with `orryx-mcp-gateway` (automatic on startup if config.gateway_register = true)
7. Add a `source.url` entry to `orryx-knowledge/.claude-plugin/marketplace.json` pointing to the target repo

**Status:** STAGED. Domain: ai-automation. Port: 9009.