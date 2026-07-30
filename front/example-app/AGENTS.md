---
applyTo: '**'
---

# Gally Example App — Agent Rules

React 19 + TypeScript + CRA 5 + react-router-dom v6 showcase for `@elastic-suite/gally-sdk`.

## Read before you code
- SDK / API facts & gotchas → `docs/sdk-reference.md` (authoritative, do NOT contradict)
- Visual rules → `docs/design-system.md`
- The feature you're touching → `specs/feature-*.md`

## Golden rules
1. NEVER edit a component's props without checking all call sites in `src/pages` and `src/components`.
2. The SDK gotchas in `docs/sdk-reference.md` were found the hard way. Never "simplify" them away.
3. Reuse existing components in `src/components`. Do not create new visual primitives.
4. Every page view / search / product view / add-to-cart / order MUST stay tracked via the SDK (see `docs/sdk-reference.md`).
5. If a change touches >3 files or alters shared UI/`styles.css`, STOP and post a plan first.

## Graphic stability (critical — one 58KB styles.css)
- Colors, spacing, fonts come ONLY from the CSS variables in `docs/design-system.md`.
- NEVER hardcode hex colors, px values, or font sizes in components or new CSS.
- Palette is fixed: indigo deep `#1a1a2e` + coral accent `#ff6b6b`. Changing it requires an approved spec.

## Definition of done
- Verify inside the Docker stack, never `npm run build` on the host (node_modules/package resolution only match inside the `example` container). Either:
  - Tail the dev server the stack already runs: `make logs s=example` (or `docker compose logs -f example`) after saving, and confirm CRA's webpack-dev-server reports `webpack compiled successfully` with no new errors/warnings — this proves HMR picked up the change; or
  - Run a real build inside the container: `docker compose exec example yarn build` (or `make sh s=example` then `npm run build`).
- Tracking preserved, no new hardcoded style values, no new UI primitives.