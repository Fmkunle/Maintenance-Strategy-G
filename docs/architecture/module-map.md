# Module Map

## Current migration status
- `apps/web`
  - Vite entrypoints for home and maintenance screens
  - legacy runtime bridge for the maintenance workspace
- `apps/api`
  - typed service scaffold
  - workspace CRUD boundary
  - risk evaluation endpoint
- `packages/domain`
  - reusable risk engine
  - hierarchy utility seed modules
- `packages/contracts`
  - shared types and zod request schemas
- `packages/shared`
  - shared constants and numeric helpers

## Planned next extractions
1. Move more hierarchy utilities out of `maintenance-strategy.js`
2. Move failure-mode DB JSON mapping into `packages/domain`
3. Split decision workspace rendering from the legacy runtime
4. Replace legacy multi-page adapters with a routed product shell
