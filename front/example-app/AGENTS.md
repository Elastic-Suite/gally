---
applyTo: '**'
---

# Gally Example App — Agent Rules

React 19 + TypeScript + CRA 5 + react-router-dom v6 showcase for `@elastic-suite/gally-sdk`.

## Authoritative docs

Single source of truth — read the relevant one before you code, and don't restate them here or
anywhere else; duplicated rules drift.

- `docs/sdk-reference.md` — SDK/API facts and gotchas. **Wins over every other file, this one included.**
- `docs/design-system.md` — tokens, palette, typography, component patterns.
- `specs/feature-*.md` / `specs/bugfix-*.md` — the feature you're touching.
- `docs/architecture.md` — code map (regenerate-able, lower trust).

## Golden rules

1. Never change a component's props without checking **every** call site in `src/pages` and `src/components`.
2. The gotchas in `docs/sdk-reference.md` were found the hard way — never "simplify" them away.
3. Reuse the primitives in `src/components`. Reaching for a second card or chip idiom is the signal to stop.
4. Page view / search / product view / add-to-cart / order **must stay tracked** via the SDK. Dropping a tracking call is a regression even if the UI is identical.
5. A new user-visible string needs all three locales (`src/locales/{en,fr,de}/`) — a missing key renders as the raw key. Language follows the catalog selector, so check a non-English one.
6. More than 3 files, or shared UI, or `src/styles.css` → **stop and post a plan before editing**.
7. Every non-trivial change gets a spec in `specs/`, written as part of the change (`specs/_template.md`).

## Definition of done

Verify **inside the Docker stack** — never `npm run build` on the host, package resolution only
works in the `example` container:

```bash
make logs s=example                       # confirm `webpack compiled successfully`
docker compose exec example yarn build    # or a real build in the container
```

No new errors or warnings · tracking preserved · no new hardcoded hex/px/font-size · no new visual
primitive · call sites of any changed prop checked · facets still responsive.

> Claude Code: the directory-scoped **`gally-storefront`** skill (`.claude/skills/gally-storefront/`,
> beside this file) adds a task router and an SDK-trap shortlist. It defers to this file and `docs/`.
