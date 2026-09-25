# SSR + SEO metadata for the Gally example storefront

> **Status: saved plan, not scheduled.** Nothing here is implemented. Written 2026-08-07 against
> `feat-1379782-newExampleApp`. All findings below were measured against the repo and the running
> stack on that date — re-verify the version numbers and the `ProductFieldFilterInput` shape before
> starting, as those are the parts most likely to have moved.
>
> To version it with the code, copy to `front/example-app/specs/plan-ssr-seo.md`, which is where
> the project's specs ritual expects planning documents to live.

## Context

`front/example-app` is a **CRA 5 SPA**. It ships an empty `<div id="root">` and one static
`<title>`; there is no `document.title`, no helmet, no meta management anywhere
(`grep` over `src/` + `public/index.html` returns nothing). A crawler sees no content.

We want SEO metadata later. Metadata is worthless without server rendering, and **CRA cannot
do SSR or React Server Components at all** — so this is a framework migration, not a feature.

Decisions taken:

| Question | Answer |
|---|---|
| Purpose | **Showcase** Gally's SSR/SEO story — a credible, visible demonstration, not production ranking |
| Migration | **Rewrite `front/example-app` in place** on Next.js App Router |
| Locale | **In the URL path**, so the server can resolve the catalog before render |

Nothing is implemented now. This is the plan.

---

## What makes this tractable

**The SDK is already server-capable.** `@elastic-suite/gally-sdk` exposes a Node main entry and a
separate `./browser` subpath — its own header says *"For server-side usage, import from the main
entry point instead."* `SearchManager` runs fine in a Server Component. Tracking does not:
`TrackingEventManager` is built on `localStorage` / `sessionStorage` / cookie storages.

That gives a clean rule: **data fetching can move to the server; tracking stays on the client.**

Today the app imports the *full* SDK in the browser — the console warns about it on every load.
The migration fixes that as a side effect.

## What limits it — read this before promising "server components everywhere"

`useState` / `useEffect` / `createContext` / `onClick` appear in **31 of 35** source files:

| Directory | Needs client |
|---|---|
| `src/components` | 12 / 15 |
| `src/pages` | 10 / 11 |
| `src/contexts` | 5 / 5 |
| `src/hooks` | 4 / 4 |

This is a *demo* whose point is interactivity — autocomplete, facets, the event log, the story
companion. So the realistic split is **3 server route shells + metadata, with client islands
below**, not a wholesale conversion. That is enough to deliver the entire SEO story, because
what a crawler reads is exactly the shell.

---

## Which Next version — target **16.x** (latest), not `front/pwa`'s Next 13

Checked against the registry and this stack rather than assumed:

| Fact | Value |
|---|---|
| Latest `next` | **16.3.0** |
| Its peers | `react ^18.2.0 \|\| ^19.0.0`, `react-dom` same |
| Its `engines.node` | `>=20.9.0` |
| Node in the `example` container | **20.20.2** — clears it, no base-image change |
| React already in `example-app` | **19.2.4** (declared `^19.1.0`) |

Three reasons latest is the low-friction choice here, not the risky one:

1. **No React upgrade is needed.** `example-app` is already on React 19, which is what RSC wants.
   The migration is Next-only.
2. **The workspace already tolerates divergent React.** Root hoists `react@18.2.0` for `pwa` and
   `gally-admin`; `example-app` nests its own `19.2.4`. Yarn classic resolved that today, with no
   `resolutions` field. So putting Next 16 in `example-app` **does not force `pwa` off Next 13** —
   the two coexist exactly as the two Reacts already do.
3. Aligning with `pwa`'s Next 13 Pages Router was considered and rejected: Pages Router has **no
   React Server Components**, which is the thing being asked for.

Version-specific work to budget for:

- **`params` and `searchParams` are async** in Next 15+. Every dynamic route (`[locale]`,
  `[sku]`, `[code]`, `[id]`) must `await` them. Mechanical, but it touches every page.
- Caching defaults changed from the Next 14 era — fetch results are no longer cached by default;
  be explicit rather than relying on remembered behaviour.
- **`next-i18next` is Pages-Router only** — do not reach for it because `pwa` uses it. Keep
  `react-i18next` for the client islands and resolve server-side strings from the locale segment.

Conservative fallback if 16.x churn bites during Phase 1: **15.3.9**, same architecture, same
React 19, no plan changes.

## Target architecture

### Server Components (new)
Per-route shells that fetch with the SDK main entry and render crawlable HTML:

- `/[locale]/product/[sku]` — name, description, price, image, breadcrumb + `Product` +
  `BreadcrumbList` JSON-LD
- `/[locale]/category/[code]` — first page of products + facet aggregations, `BreadcrumbList`
- `/[locale]/blog/[id]` — the best candidate: `cms_page` content is editorial HTML, nearly
  static, ideal for RSC. `BlogPosting` JSON-LD

Each exports `generateMetadata()` → `title`, `description`, `canonical`, `openGraph`, `hreflang`.

### Client islands (unchanged behaviour)
`'use client'` on: all five contexts, `SearchBar` / `SearchOverlay`, `Facets`, the
Products/Articles switch, `ProductCard`'s add-to-cart, cart/checkout, `EventLog`,
`TrackingInsights`, `StoryCompanion`, `IntroScreen`.

### The pattern that preserves reactivity
Server component fetches initial data → passes it to the client island as `initialData` →
the existing hook seeds state from it and only refetches on interaction.

Concretely: `useSearch` / `useCms` gain an optional `initialData` param and skip the first
request when it is present. This also removes the first-paint loading flash by construction —
the same class of bug just fixed in `useSearch`'s initial `loading` state.

### Locale in the URL
Route group `app/[locale]/…` where the segment is the **localized catalog code** (`com_en`,
`com_fr`, `fr_fr`, …). One segment resolves both catalog and language server-side, which is
what `CatalogContext` currently does in a `useEffect` after mount.

`CatalogContext` stops owning selection: the selector becomes a `<Link>`/`router.push` that
navigates to the same route under a different locale segment. It keeps serving the catalog
*list* to the selector UI.

Bare `/` redirects to a default localized catalog.

---

## Docker / infra: **no changes required**

Verified, because the preference is not to touch it:

- The container's `CMD` is `yarn start:example` → `yarn --cwd example-app start`
  (`docker/front/Dockerfile:82`, `front/package.json`). **The run command lives in
  `package.json`, not in docker.** `react-scripts start` → `next dev -p 3001` is a one-line
  change inside the workspace; the Dockerfile keeps working untouched.
- Port stays 3001, so `EXAMPLE_UPSTREAM=example:3001` is unchanged.
- nginx `location ~ ^/(example|ws)` already matches everything Next serves under
  `basePath: '/example'`, including `/example/_next/*`. No router change for routing or assets.
- There is **no `gally_example_prod` target** — only `_ci` and `_dev`. The example app only ever
  runs in dev mode in this stack, and `next dev` performs real SSR, so the entire SEO
  verification below works without building a production image.
- `PUBLIC_URL` (compose) and `ENV WDS_SOCKET_PORT 443` (Dockerfile) become dead CRA leftovers.
  Harmless — leave them, clean up whenever docker is next touched for another reason.

**The one thing that could force a docker touch, and the fallback.** The `^/(example|ws)` block
sets no websocket upgrade headers (`proxy_set_header Upgrade / Connection`); CRA sidesteps that
with `WDS_SOCKET_PORT 443`. Next's HMR socket may therefore fail to connect through the proxy,
which costs a manual browser refresh on each edit — a dev-ergonomics annoyance, not a functional
break, and SSR/SEO are unaffected. If it bites, it is two `proxy_set_header` lines in
`default.conf.template`. Confirm at the start of Phase 1 before deciding.

## Phases

### Phase 1 — Framework swap, zero behaviour change
The de-risking step: get Next App Router running with **everything still a client component**
(a `'use client'` at the top of the existing tree). Mechanical and reviewable; no RSC yet.

- Replace `react-scripts` with `next@16`; delete `scripts/patch-fork-ts.js` (a CRA/fork-ts-checker
  hack, dead here) and its `prestart` hook. React stays at 19 — no change.
- `await` `params` / `searchParams` in every dynamic route (Next 15+ made them async).
- `public/index.html` → `app/layout.tsx`. Keep the Geist `<link>` (or move to `next/font`).
  Import `src/styles.css` in the root layout — one global stylesheet still works.
- `react-router-dom` → App Router file routes; `Link` from `next/link`;
  `useSearchParams`/`useParams`/`useRouter` from `next/navigation`. `App.tsx`'s `<Routes>` maps
  1:1 onto `app/**/page.tsx`.
- `PUBLIC_URL=/example` → `basePath: '/example'` + `assetPrefix` in `next.config.js`.
- `example-app`'s own `start` script: `react-scripts start` → `next dev -p 3001`.
  **This is the only place the run command needs to change** — see below.
- SVG imports: `src/assets/elasticsuite-solutions.svg` currently resolves to a URL string via
  CRA. Next static import yields `StaticImageData` — use `logo.src` or `next/image`.
- `example-app` is already a yarn workspace (`front/package.json`), so no workspace change.

**Exit criteria:** every route renders identically, tracking still fires, `docker compose logs
example` clean. No SEO yet.

#### Phase 1 — exact modifications

**Dependencies — React is already current, so this is a Next-only migration**

| | |
|---|---|
| `react` / `react-dom` | latest is **19.2.8**; app declares `^19.1.0`, has 19.2.4 → satisfied by the existing range, a `yarn up`. **No React migration work.** |
| add | `next@16`, `eslint-config-next` |
| remove | `react-scripts`, `react-router-dom`, `scripts/patch-fork-ts.js` + its `prestart` hook |

**Scripts** (`front/example-app/package.json`)
- `start`: `react-scripts start` → `next dev -p 3001` (port unchanged, so nginx/compose untouched)
- `build`: `next build`
- `test` / `test:ci`: **must keep existing** — root `front/package.json`'s `test:ci` calls
  `yarn --cwd example-app test:ci`, so removing it breaks CI. **There are no test files at all**
  (`find src -name '*.test.*'` → empty), so mirror `pwa`'s `jest --passWithNoTests`. No tests to port.
- keep `eslint` / `prettier` / `typescript` script names — the root aggregates them.

**Entry and shell**
- `src/index.tsx` (30 lines: `StrictMode` › `BrowserRouter basename="/example"` › `CatalogProvider`
  › `I18nBridge` › `CartProvider` › `DemoProvider` › `SearchBarProvider` › `App`) →
  `app/layout.tsx` plus a `'use client'` `<Providers>` wrapper holding the same tree.
  `basename` → `basePath: '/example'`.
- `public/index.html` → `app/layout.tsx` (Geist `<link>`, viewport, `noscript`, title).
- `src/react-app-env.d.ts` → `next-env.d.ts`; `.eslintrc.js` `extends: ['react-app']` →
  `['next/core-web-vitals']`.

**Routing — 18 files, a small and mechanical surface**

| From `react-router-dom` | To | Files |
|---|---|---|
| `Link` (`to=` → `href=`) | `next/link` | 7 |
| `useParams` | `next/navigation` | 4 |
| `useSearchParams` (read-only — already used read-only) | `next/navigation` | 3 |
| `useNavigate()` | `useRouter().push` | 3 |
| `useLocation()` | `usePathname()` | 3 |
| `BrowserRouter` / `Routes` / `Route` | deleted | 1 each |

The 11 `<Route>` entries in `App.tsx` map 1:1 onto `app/**/page.tsx`.

**`'use client'`** on the 31 interactive files. In Phase 1 the pragmatic move is a single client
boundary just below the layout, so behaviour is provably identical; Phase 3 pushes it downward.

**SSR-safety — the one certain breakage**
- `src/components/SearchOverlay.tsx:119,129` calls `createPortal(…, document.body)` **during
  render, unguarded**. That throws `document is not defined` as soon as the server renders it.
  Needs a mount guard. This will be the first thing that fails.
- `src/hooks/useStoryActions.ts` touches `document` in 6 places, but all inside callbacks — safe.
- No `localStorage` / `window` at module scope anywhere — checked. Good.

**Assets** — `src/assets/elasticsuite-solutions.svg` resolves to a URL string under CRA; a Next
static import yields `StaticImageData`, so use `logo.src` or `next/image`.

### Phase 2 — Locale segment + server-side catalog resolution
Introduce `app/[locale]/…`, resolve the localized catalog server-side, redirect `/`.
Rework the catalog selector to navigate. Wire `i18n` off the route segment instead of
`I18nBridge` reacting to `CatalogContext`.

### Phase 3 — Server-render the three shells
Convert product / category / blog-post pages to Server Components with the `initialData`
handoff above. Add `generateMetadata()` and JSON-LD.

### Phase 4 — SEO surface
`app/sitemap.ts` (generated from the index), `app/robots.ts`, canonical + `hreflang` across the
three locales, `noindex` on `/search`, `/cart`, `/checkout`. Keep the demo scaffolding
(`EventLog`, `StoryCompanion`, `TrackingInsights`) but exclude it from crawlable output.

---

## Effort and cost

Scale being migrated: **5,336 lines** of TS/TSX across 35 files, **11 routes**, 9 locale files
(1,395 lines). `styles.css` is 3,567 lines / 80K but is *imported*, not rewritten — high volume,
near-zero risk. Cost centres are the big interactive components: `Facets.tsx` (467),
`SearchOverlay.tsx` (422), `SearchPage.tsx` (328).

| Phase | Engineer-days | Agent sessions | Tokens (order of magnitude) |
|---|---|---|---|
| 1 — Framework swap, behaviour-identical | 1.5–3 | 1–2 | 300k–700k |
| 2 — Locale segment + server catalog resolution | 1–2 | ~1 | 200k–400k |
| 3 — RSC shells for 3 routes + metadata + JSON-LD | 1–2 | ~1 | 200k–400k |
| 4 — sitemap / robots / canonical / hreflang / noindex | 0.5–1 | ~0.5 | 100k–200k |
| Demo scaffolding: `ssr:false` wrapping only (no repair) | ~0.25 | — | 40k–80k |
| Docs, specs, skill update | 0.5 | ~0.3 | 60k–120k |
| **Total** | **4.75–9.25 days** | **4–6** | **~0.9–1.9M** |

Phase 1 carries nearly all the risk; Phases 2–4 are additive and individually shippable.

**Phase 1 is cheaper than a typical CRA→Next migration**, for five measured reasons: React needs
no upgrade (already 19), there are zero test files to port, no docker change is required, the
router surface is only 18 files across 6 API kinds, and `styles.css` moves as a single global
import. What is left is genuinely mechanical apart from the portal fix and the provider tree.

**The token figures are the least reliable number here** — they are dominated by iteration count,
not by lines written, and SSR migrations fail in ways that are hard to predict. Treat them as an
order of magnitude, not a budget.

### What would blow the estimate

- **Hydration mismatches.** The concrete one already in the code: `formatCmsDate()` in
  `src/hooks/useCms.ts` calls `toLocaleDateString(language)`, and Node's ICU can format
  differently from the browser's — a classic server/client mismatch. Same class of risk anywhere
  rendering depends on locale or time.
- **The demo scaffolding is deeply client-side and wraps everything.** `App.tsx` gates on
  `useDemo()`, and `useStoryActions.ts` (229 lines) drives guided flows that manipulate
  navigation. Getting `'use client'` boundaries right around this is fiddlier than around the
  storefront pages themselves.
- **Install-time resolution**: yarn classic, nested React 19 in `example-app` alongside hoisted
  React 18, plus Next 16. It should work — the React split already does — but a bad resolve here
  stalls Phase 1 before any code is written.

### What would shrink it

- Dropping Phase 2 (locale in URL) roughly halves the remaining work — but it is what makes the
  server able to resolve the catalog, so the SSR story gets much weaker.
- Doing Phase 3 on **one** route (blog post — nearly static content, fewest client islands)
  instead of three still demonstrates the whole story.

## Preserving the demo features under SSR

The demo *is* the product here, so this is a first-class requirement, not an afterthought.

### Most of it is free: `ssr: false`

`IntroScreen`, `StoryCompanion`, `EventLog`, `TrackingInsights`, `SearchExplain` have zero SEO
value and are pure client behaviour. Load them with `next/dynamic` + `ssr: false`. That single
mechanism satisfies both halves of the showcase brief — **the scaffolding keeps working
identically for users, and is absent from the HTML a crawler reads.** `/explain` and `/closing`
are demo pages: client-rendered, `noindex`.

Tracking is unchanged — a client provider, firing after hydration, exactly as now.

### One hydration trap

`DemoContext.audience` renders as a wrapper class (`app-layout mode-${audience}`) and drives the
`.expert-only` CSS. If the server renders one value and the client another, React reports a
hydration mismatch. Keep the server default authoritative and switch only after mount, or carry
`audience` in a cookie so both sides agree. Same reasoning for `introSeen` — it is currently
`useState(true)` with no persistence, which is *why* it is safe today; persisting it to
`localStorage` later would introduce exactly this mismatch.

### The guided story actions — carry them across, do NOT repair them

**Decision: the guided demo is preserved as-is and will be reconstructed later. Repairing or
hardening it is explicitly out of scope for this migration.**

So the only obligation is: *do not make it worse, and do not spend time on it.* Move
`useStoryActions.ts` and `src/scenarios/` across unchanged, wrap the demo components in
`ssr: false`, and stop there.

Recorded so whoever rebuilds it has the context — **not a work item**:

`useStoryActions.ts` drives flows by querying rendered markup:

```
querySelector('.product-detail-actions .btn-coral')   <- already stale
querySelector('.product-card')
querySelector('a[href*="/product/"]')
selector: '.facets-sidebar' / '.tracking-timeline' / '.explain-results-page'
childSelector: '.facet-group' / '.explain-rank-card' / '.timeline-item'
```

- **One step is already broken, before any SSR work.** The add-to-cart button moved from
  `.btn-coral` to `.btn-primary`, so `.product-detail-actions` contains no `.btn-coral`; that step
  retries 20 × 300ms and gives up in silence. Left as-is per the decision above.
- **SSR does not break the selectors** — the server emits the same markup. It adds two failure
  modes the rebuild should design for: *streaming* (a target may not exist yet — the existing
  retry-with-timeout already absorbs this) and *hydration* (clicking a button that is in the DOM
  but not yet hydrated does nothing).
- When it is rebuilt, coupling actions to stable `data-story-target="…"` attributes instead of CSS
  class names removes this entire failure class. Noted for that work, not for this.

Expect some guided steps to be broken after the migration. That is accepted, not a regression to
chase.

## Deferred — has a backend prerequisite

**Slug URLs (`/product/summer-linen-dress`) are not possible today.** GraphQL introspection of
`ProductFieldFilterInput` returns 44 fields including `id`, `sku`, `name` — **no `url_key`**.
Same class as the documented `cms_page` `url_key` trap in `docs/sdk-reference.md`, which is why
`/blog/:id` already keys off the id rather than the slug.

Making slugs work is a **source-field change, reindex, and cache flush**
(`make sf c="cache:pool:clear --all"` — the documented trap), not frontend work. Out of scope
for a showcase; `/product/[sku]` and `/blog/[id]` demo the SSR story perfectly well.

---

## Verification

The showcase *is* the verification — all of it must hold with JavaScript disabled:

1. `curl -sk https://gally.localhost/example/com_en/product/VD10 | grep -E '<title>|og:|application/ld\+json'`
   — real content in the HTML payload, not an empty `#root`.
2. Same for `/com_en/blog/13` and a category route; and `/com_fr/...` returning French.
3. Validate the JSON-LD blocks (Product / BreadcrumbList / BlogPosting) with a structured-data
   validator; confirm `hreflang` triplets are reciprocal.
4. Load with JS off: content visible. Load with JS on: autocomplete, facets, the
   Products/Articles switch and add-to-cart all still work — the reactive interface is the
   thing being preserved.
5. **Tracking is a golden rule** (`AGENTS.md`): confirm `VIEW` / `SEARCH` / `ADD_TO_CART` still
   fire after hydration, via the in-app EventLog panel.
6. Lighthouse SEO panel as the demo artifact.

## Docs to update — currently all assume CRA

- `front/example-app/AGENTS.md` — the Definition of done says *"never `npm run build` on the
  host"* and `docker compose exec example yarn build`; the commands change.
- `.claude/skills/gally-storefront/SKILL.md` — same verification section.
- `docs/architecture.md` — the `src/` map gains `app/` and a server/client split.
- `docs/sdk-reference.md` — record the main-vs-`./browser` entry rule, which becomes load-bearing.
- A spec per phase in `specs/`, per the existing ritual.
