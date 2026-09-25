# Feature: server-rendered shells + metadata + JSON-LD — Phase 3

## Status: implemented (interactive + build checks pending — see Not done)
## Page/Component: `app/[locale]/{product/[sku],blog/[id],category/[code]}/page.tsx`, `src/sdk/server.ts`

Phase 3 of `plan-ssr-seo.md`. This is the phase that actually delivers the SEO story: the three
crawlable routes now render real content, real metadata and JSON-LD **on the server**, and the
interactive components below them are seeded with that same data instead of refetching on mount.

## Behaviour (testable) — all verified with plain `curl`, no JavaScript
- [x] `/com_en/product/VD10` → `<title>Claudia Crochet Dress</title>`, meta description (tags
      stripped), canonical, `og:title`/`description`/`url`/`image`, `<h1>Claudia Crochet Dress</h1>`
- [x] JSON-LD: **Product + Offer** (price, currency from the localized catalog, availability from
      stock) and **BreadcrumbList**
- [x] `/com_en/blog/13` → **BlogPosting + Person + BreadcrumbList**, title, description, `og:article`
- [x] `/com_fr/blog/13` → *"Les tendances printemps-été qui comptent vraiment"* — server-rendered in
      French. Localized metadata falls out of Phase 2's segment for free.
- [x] `/com_en/category/cat_14` → `<title>Dresses</title>`, BreadcrumbList, first page of products
      in the HTML
- [x] Unknown entities are **hard 404s**: `/product/NOPE`, `/blog/99999`
- [x] Demo scaffolding is **absent from the server HTML and present after JS** on all three routes
- [x] No hydration mismatches; all 11 routes still 200; `npx tsc --noEmit` clean

## SDK contract used
`src/sdk/server.ts` — `fetchProductBySku`, `fetchCategoryProducts`, `fetchCmsPageById`, plus a
cached `resolveLocale`. Each **mirrors the corresponding client hook's request exactly** (same
metadata, same `selectedFields`, same filter syntax). That is not tidiness: if they drift, the page
the server renders and the page the hook would refetch disagree, and content changes under the user.
`PRODUCT_FIELDS` / `CMS_FIELDS` therefore moved to `src/sdk/fields.ts` so both sides read one
definition — the empty-`selectedFields` trap in `docs/sdk-reference.md` now has a single place to go
wrong instead of two.

All fetchers are wrapped in React `cache()`, so `generateMetadata()` and the page body share one
request per render pass instead of doubling every fetch. They swallow errors to `null`/empty: a
failed fetch degrades to the pre-Phase-3 client path rather than 500-ing the route.

## Tracking (required) — STILL NOT VERIFIED
Unchanged again — `useTracking` is untouched and still fires after hydration. The gap from Phases 1
and 2 stands and is now three phases old. Worth checking that seeding `initialData` did not stop
`ProductPage`'s `VIEW` effect firing: that effect keys off `sku` and `selectedLocalizedCatalog`, not
off the fetch completing, so it should be unaffected — **but that reasoning is not a test.**

## The trap this phase hit twice
**A Server Component cannot import anything out of a module that imports React hooks.** It fails at
request time with *"You're importing a module that depends on `useEffect` into a React Server
Component"*, not at build time. Hit once for `getProductFields` (in `ProductCard.tsx`, a
`'use client'` module) and again for `getCmsFields` (in `useCms.ts`, which imports hooks even though
it carries no directive).

Fix both times: move the plain data mapper into a React-free module — `src/sdk/productFields.ts` and
`src/sdk/cmsFields.ts` — and re-export from the original file so existing importers are untouched.
**Any future server shell needing a mapper must take it from `src/sdk/`, never from `src/hooks/` or
`src/components/`.**

## The `initialData` handoff
`useSearch` gained `initialData` and `useCmsSearch` gained `initialPages`. Both seed `useState` via
a lazy initializer and set a `skipMountFetch` ref, so the mount fetch is skipped exactly once; every
later option change refetches normally.

`CategoryPage` is the subtle one. The server pre-fetches only **page 1, unsorted, unfiltered** — the
URL a crawler sees. The view passes `initialData` through only when the current view still matches
that (`page === 1 && !sortField && filterArray.length === 0`); sorting or filtering must hit the
API. Handing the seed over unconditionally would render stale results the moment a user touched a
facet.

## `force-dynamic` removed
Phase 1's `export const dynamic = 'force-dynamic'` is gone from `app/layout.tsx`. **This is the one
change here with unproven risk:** it re-enables static prerendering at build time, and this stack
only ever runs `next dev`, so the `useSearchParams`-needs-Suspense errors that switch was papering
over have not been re-tested under a real `next build`. See below.

## Not done in this phase, deliberately
- **`gally_pwa_int` is still broken** (`mv example-app/build`, `docker/front/Dockerfile:117-118`).
  Phase 1 deferred it here on the assumption Phase 3 would resolve it, but the answer got *harder*,
  not easier: with server components and per-request fetches the example app can no longer be
  statically exported into `pwa/public/example` at all. The int image has to run it as a server, or
  stop shipping it. That is a docker/compose design decision, not a frontend one.
- **The SDK still imports its full entry in the browser** (the console warns on every load).
  Splitting it needs `src/sdk/index.ts` to resolve `@elastic-suite/gally-sdk` on the server and
  `/browser` on the client, which static imports cannot express in one module — it needs a real
  module split, not a ternary like the base-URI one.
- **`next build` has never been run.** Do it before trusting the `force-dynamic` removal.
- Pushing `'use client'` further down inside `Header`/`Facets`/`SearchBar` — the three routes already
  deliver the whole SEO story without it.

## MUST NOT change
- **Server fetchers must keep mirroring the client hooks' request shape.** Divergence is invisible
  in review and shows up as content flickering after hydration.
- **`selectedFields` must never be emptied** in `src/sdk/fields.ts` — the SDK silently drops the
  `collection` block and returns zero rows. Now a single edit can break both sides at once.
- **Keep `notFound()` for missing entities.** Rendering the client "not found" state under a 200 is
  a soft-404, exactly what an SEO demo must not ship.
- **Do not pass `CategoryPage`'s `initialData` unconditionally** — see above.
- **Keep the demo scaffolding behind `ssr: false`** in `AppShell`. It is what keeps the crawlable
  HTML free of demo chrome and lets the scaffolding stay browser-only.
- `JsonLd`'s `dangerouslySetInnerHTML` with the `<` escape is deliberate: React would entity-escape
  a normal text child and structured-data parsers would fail to read it.
