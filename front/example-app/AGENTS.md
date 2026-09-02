---
applyTo: '**'
---

# Gally Example App — Agent Rules

React 19 + TypeScript + **Next.js 16 App Router** showcase for `@elastic-suite/gally-sdk`.

Routes live in `app/[locale]/**/page.tsx` as thin re-exports; the components they render live in
`src/views/` (named `views`, not `pages`, because Next would claim `src/pages` as the Pages Router).
`product/[sku]`, `blog/[id]` and `category/[code]` are **Server Components** that fetch, emit
metadata and JSON-LD, and hand the data down as `initialData` — see
`specs/feature-rsc-shells-phase3.md`. Everything else still renders client-side behind the
`'use client'` boundary in `app/providers.tsx`. Phase history:
`specs/feature-nextjs-migration-phase1.md`, `specs/feature-locale-segment-phase2.md`,
`specs/feature-rsc-shells-phase3.md`, plan in `specs/plan-ssr-seo.md`.

**A Server Component cannot import from a module that imports React hooks** — it fails at request
time, not at build. Data mappers shared by server shells and client hooks live in `src/sdk/`
(`fields.ts`, `productFields.ts`, `cmsFields.ts`); never reach into `src/hooks/` or `src/components/`
from `app/**`. Server fetchers in `src/sdk/server.ts` must mirror the matching hook's request shape
exactly, or the server-rendered page and the hydrated one disagree.

**The URL's first segment is the localized-catalog code** (`com_fr`, `com_en`, `fr_fr`, `fr_en`,
`en_fr`, `en_en`) and it is resolved on the server in `app/[locale]/layout.tsx`. Two rules follow:
- Link with `src/components/LocaleLink.tsx` (import it as `Link`), never `next/link` directly, and
  use `useLocaleHref()` for `router.push`. A raw link drops the segment and resets the visitor to
  the default catalog.
- `src/sdk/index.ts` picks its base URI by environment. The browser uses `https://gally.localhost/api`;
  Node uses `http://router/api`, because `gally.localhost` is 127.0.0.1 inside the container and a
  server-side fetch to it dies with `ECONNREFUSED`.

## Where to read what

This is the only routing table for the app. `CLAUDE.md` and `.agent.md` beside this file are
redirects here and carry no rules — don't copy anything back into them.

| You need | Read |
|---|---|
| SDK/API facts and gotchas, product data shape, demo catalogs | `docs/sdk-reference.md` |
| Palette, typography, component patterns, tokens | `docs/design-system.md` |
| Routes, source layout, feature → file | `docs/architecture.md` (regenerate-able, lower trust) |
| The feature or bug you are touching | `specs/feature-*.md` / `specs/bugfix-*.md` |
| What is deliberately not built yet | `missing-features.md` |
| Running or scripting the guided demo | `DEMO.md` |
| Installing and starting the app | `README.md` |
| The wider monorepo — five git repos, Docker topology, backend | `../../AGENTS.md` |
| Rules for the directory you are editing | `src/{components,views,sdk}/AGENTS.md` |

**Precedence: `docs/sdk-reference.md` wins over every other file, this one included.** Its gotchas
were found the hard way. Read the relevant doc before you code, and don't restate it here or
anywhere else — duplicated rules drift.

## Golden rules

1. Never change a component's props without checking **every** call site in `src/views` and `src/components`.
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
make logs s=example                       # confirm `✓ Ready` / `✓ Compiled`, no ⨯ lines
docker compose exec example sh -c "cd /usr/src/front/example-app && npx tsc --noEmit"
```

`docker compose logs` prints UTC while `--since=<n>s` is computed against local time, so a short
window can pull in log lines far older than it claims. Use `--timestamps` before believing an error
is current — stale CRA webpack errors sat in that buffer for the whole migration.

New-file rule: a client component reached from a route must carry `'use client'` **itself**. An
`app/**/page.tsx` re-export does not pass client-ness down the import, and the failure is a 500 at
request time, not a build error.

No new errors or warnings · tracking preserved · no new hardcoded hex/px/font-size · no new visual
primitive · call sites of any changed prop checked · facets still responsive.
