# Feature: Next.js 16 App Router migration — Phase 1 (framework swap only)

## Status: implemented (one item unverified — see Tracking)
## Page/Component: whole app — `app/**`, `src/index.tsx` + `src/App.tsx` removed

Phase 1 of the four-phase plan in `plan-ssr-seo.md`. **This phase delivers no SEO.** It swaps
Create React App for Next.js 16 App Router with every component still client-rendered. A crawler
still sees a near-empty shell afterwards. Its value is that it isolates nearly all of the
migration's risk into one reviewable, behaviour-identical change.

## Why Next 16 and not `front/pwa`'s Next 13
Pages Router has no React Server Components, which is the entire point of Phases 2–4. Next 16.3.0's
peer range is `react ^18.2.0 || ^19.0.0` and this app already runs React 19.2.4, so **no React
upgrade was needed**. `engines.node >=20.9.0` against the container's 20.20.2. `example-app` nests
its own `react` and `typescript` alongside the workspace-hoisted React 18 / TS 4.8.3, so nothing
here forces `pwa` off its versions.

## Behaviour (testable)
- [x] All 11 routes return 200: `/`, `/category/:code`, `/search`, `/product/:sku`, `/cart`,
      `/checkout`, `/blog`, `/blog/:id`, `/cms/:slug`, `/explain`, `/closing`
- [x] Client JS hydrates and the SDK fetches: `/product/VD10` renders `<h1>Claudia Crochet Dress</h1>`
      and the `.btn-primary` add-to-cart after JS runs (headless Chrome `--dump-dom`)
- [x] `/search?q=dress` renders product cards after hydration
- [x] No hydration mismatch in the console (after the Facets fix below)
- [x] i18n still follows the catalog: console shows `languageChanged en` → `languageChanged fr`
- [x] `basePath` correct — assets at `/example/_next/static`, links at `/example/blog`, no doubling
- [x] `npx tsc --noEmit` clean under TypeScript 5.9
- [x] HMR works through the proxy — `[HMR] connected`, no nginx change needed
- [ ] **Autocomplete overlay** (the portal fix) — needs a real interactive browser; NOT verified
- [ ] **Facets / Products-Articles switch / add-to-cart / pagination** — NOT verified interactively
- [ ] **Demo scaffolding**: IntroScreen gate, StoryCompanion, TrackingInsights, EventLog — NOT verified
- [ ] **Tracking `VIEW` / `SEARCH` / `ADD_TO_CART`** — NOT verified, see below

## Second hydration bug found and fixed: `Facets.tsx` skeleton widths
Not predicted by `plan-ssr-seo.md` (which expected `formatCmsDate`'s locale formatting to be the
mismatch — that one did not fire). The real one: the loading skeleton used
`width: ${60 + Math.random() * 30}%`. The server rendered `62.6221%`, the client `70.56%`, and React
reported *"A tree hydrated but some attributes of the server rendered HTML didn't match"* and
abandoned patching that subtree. Replaced with a deterministic `((i * 7 + j * 13) % 31)`.
**Same class of bug, same fix, anywhere else a render reads `Math.random()`, `Date.now()` or a
locale.** `useStoryActions.ts:89` also calls `Math.random()` but inside a `setTimeout` callback, so
it never runs during render and is safe.

## SDK contract used
Unchanged. `src/sdk/index.ts` still imports from the `@elastic-suite/gally-sdk` main entry, and all
three singletons (`Client`, `SearchManager`, `TrackingEventManager`) stay lazily constructed, so
nothing touches browser storage at module scope. Switching to the `./browser` subpath — and the
server/client entry split the SDK actually offers — is Phase 3 work, not this phase's.

## Tracking (required) — NOT YET VERIFIED
No tracking code was touched: `useTracking.ts`, `src/sdk/index.ts` and the provider wiring are
byte-identical, and `TrackingEventManager` is still constructed lazily on the client. So the risk is
low — but low is not verified, and this is `AGENTS.md`'s golden rule.

What was attempted: a headless-Chrome network capture of `/product/VD10` shows `/api/graphql`,
`/api/catalogs` and the media images, but **no distinguishable tracking call**. That is not evidence
of a regression — the SDK may tunnel events through the same `/api/graphql` endpoint, and events may
batch or flush on interactions a headless page-load never performs.

**This must be checked in a real browser via the in-app EventLog panel before Phase 1 is called
done.** Load a product page, run a search, add to cart, and confirm `VIEW` / `SEARCH` /
`ADD_TO_CART` appear.

## UI constraints
No visual change whatsoever. `src/styles.css` (3,567 lines) moves as one global import in
`app/layout.tsx`; not a line of it was edited. The Geist `<link>` tags and their explanatory comment
are ported verbatim from the deleted `public/index.html`.

## What changed

**Entry / shell**
- `src/index.tsx` → `app/layout.tsx` (server: `<html>`, `<head>`, global CSS, static title) +
  `app/providers.tsx` (`'use client'`, the provider tree in the same order).
- `src/App.tsx` → `src/components/AppShell.tsx` — identical, minus its `<Routes>` block, which
  becomes `{children}`.
- `public/index.html`, `src/react-app-env.d.ts`, `scripts/patch-fork-ts.js` (+ its `prestart` hook)
  deleted. The patch script existed to work around a `fork-ts-checker-webpack-plugin` crash under
  TS 5 — a CRA-only concern that left with `react-scripts`.
- `basename="/example"` → `basePath: '/example'`. Port stays 3001, so compose and nginx are untouched.

**Routing** — 18 files across 6 API kinds, all mechanical:
`Link`→`next/link` with `to`→`href` · `useParams`/`useSearchParams`→`next/navigation` (note
`useSearchParams` returns the object directly, not react-router's `[params, setParams]` tuple) ·
`useNavigate()`→`useRouter().push` · `useLocation()`→`usePathname()`.

**`'use client'` boundary** — deliberately ONE boundary, at `app/providers.tsx`, just below the root
layout. Pushing it downward to enable server components is Phase 3. Doing it here would destroy the
"provably identical behaviour" property that makes this phase reviewable.

## Root cause of the one certain breakage
`SearchOverlay.tsx` called `createPortal(…, document.body)` **during render, unguarded** (two call
sites). The wrong belief this encodes: *"a client component only runs in the browser."* It does not
— Next pre-renders client components on the server too, where `document` is undefined. Fixed with a
`mounted` state gate, placed **above** the `if (!open) return null` early return so hook order stays
stable. Everything else in the app was already safe: no `window`/`document`/`localStorage` at module
scope, and every `sessionStorage` read and `window.scrollTo` sits inside a callback or effect.

## Known breakage, accepted and deferred
`compose.int.yml:23` builds target `gally_pwa_int`, which runs
`yarn build:example; mv example-app/build pwa/public/example` (`docker/front/Dockerfile:117-118`).
**Next emits `.next/`, never `build/`, so this target now fails.** Deliberately not fixed here: no
docker file is touched in Phase 1, and Phase 3 has to decide how the integration image serves a
server-rendered app anyway — fixing it now means doing it twice. This is a known regression, not a
mystery.

Two smaller consequences of dropping `react-scripts`, noted rather than expanded into scope:
- `"test": "react-scripts test"` → `echo "no tests"`. There are zero test files in this app.
- `.eslintrc.js` lost `extends: ['react-app']` with `eslint-config-react-app`. Its replacement
  `next/core-web-vitals` needs eslint ≥ 9 and flat config, but this monorepo runs eslint 8.23.1 —
  so the config keeps only its rule overrides. `eslint-config-next` is installed but **cannot
  currently be used**; nothing runs eslint in this workspace anyway.

## Pre-existing gap, explicitly left alone
Root `front/package.json` calls `yarn --cwd example-app` for `test:ci`, `eslint`, `eslint:ci`,
`prettier`, `prettier:ci`, `typescript` and `typescript:ci`. **None of those scripts has ever
existed here** — those aggregate commands already failed before this migration. Out of scope by
decision; do not go looking for scripts to preserve.

## MUST NOT change
- **Tracking.** `VIEW` / `SEARCH` / `ADD_TO_CART` firing after hydration is the golden rule.
- **The provider order** `CatalogProvider › I18nBridge › CartProvider › DemoProvider ›
  SearchBarProvider`. `I18nBridge` sits inside `CatalogProvider` because it reacts to the selected
  localized catalog's locale; reordering silently breaks UI language switching.
- **The `app-layout mode-${audience}` wrapper class**, which drives the `.expert-only` CSS.
- **No `/example` prefix in any `href`.** `basePath` adds it, exactly as `basename` did. Hard-coding
  it produces `/example/example/...`.
- **Zero visual change.** Any styling difference in this phase is a bug, not an improvement.
- Guided-story steps are NOT repaired here. `useStoryActions.ts` targets
  `.product-detail-actions .btn-coral`, which was **already stale before this migration** (the button
  moved to `.btn-primary`). Per `plan-ssr-seo.md` that is accepted, not a regression to chase.
