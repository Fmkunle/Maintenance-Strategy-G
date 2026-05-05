# ADR 001 — Productize the Maintenance Strategy App as a Typed Monorepo

## Status
Accepted

## Context
- The current maintenance strategy experience is implemented as a plain HTML/CSS/JS demo.
- `maintenance-strategy.js` and `styles.css` are both very large and mix multiple responsibilities.
- The product is intended to become a sellable application, so maintainability, testability, and service boundaries now matter.

## Decision
- Adopt a monorepo with:
  - `apps/web` for the browser product
  - `apps/api` for the backend service
  - `packages/domain` for business rules
  - `packages/contracts` for shared DTOs and schemas
  - `packages/shared` for utilities and constants
- Use TypeScript and Vite for the web app.
- Keep the migration incremental by bridging the legacy maintenance workspace into the new web app while extracting domain logic first.

## Consequences
- The current demo continues to work while product architecture is introduced around it.
- Business logic can be tested without the DOM.
- The backend and frontend can share contracts instead of re-implementing risk models independently.
