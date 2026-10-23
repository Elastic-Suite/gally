# Test plan: application routing and architecture

## Status: implemented - 92 tests in src/test/ (architecture, routing-helpers, routes), all passing

First aspect of the test suite (see `chore-vitest-setup.md` for the workflow). Big picture first: how
URLs map to routes, how the locale segment is resolved and kept, what each route returns when
something is missing, and the structural rules the specs say must never break.

About 60 tests in 4 files. Sources: `feature-nextjs-migration-phase1.md`,
`feature-locale-segment-phase2.md`, `feature-rsc-shells-phase3.md`, `feature-catalog-switch-missing-target.md`,
`feature-metadata-all-routes.md`, `bugfix-nav-active-locale-pathname.md`,
`bugfix-dynamic-ssr-false-bailout.md`, `bugfix-ssr-product-list-behind-suspense.md`, `AGENTS.md`.

## Decision needed before writing

1. **`SearchExplain.tsx:89-91` breaks a routing rule.** It compares the raw `usePathname()` with
   `'/search'` and `'/category/'`. The real pathname is `/com_fr/search`, so `isSearchPage` and
   `isCategoryPage` are always false. `bugfix-nav-active-locale-pathname.md` says never to do this.
   The explain screen was disabled recently (commit daeab237), so it may not be visible today.
   Options: fix it to use `useAppPathname()`, or have the test list it as a known exception.
2. **Route files called as functions.** Part C calls `page.tsx` / `layout.tsx` / `generateMetadata`
   directly with mocked fetchers and a `notFound()` / `redirect()` that throw. It checks what Next
   is asked to do, not the HTTP status. That is cheaper than Playwright, but it depends on those two
   functions throwing, which is how Next implements them today.

## A - Structural rules (static scan of the source)

File: `src/test/architecture.test.ts`. Reads files with `fs`; no rendering.

-   Under `app/`, only `app/providers.tsx` starts with `'use client'`. (AGENTS.md)
-   Every file in `src/views/` starts with `'use client'`. (AGENTS.md)
-   `Link` is imported from `next/link` only in `src/components/LocaleLink.tsx`. Named hooks
    (`useLinkStatus` in `NavigationContext.tsx`) are allowed. (phase 2 MUST NOT)
-   Raw `usePathname()` only in today's files: `LocaleContext.tsx`, `BlogPage.tsx`,
    `CatalogContext.tsx`, `NavigationContext.tsx`, `ScrollToTop.tsx`, plus `SearchExplain.tsx`
    depending on decision 1. A new file using it fails and has to justify itself.
-   `router.push` with a path built by hand only in `BlogPage.tsx`. (phase 2 MUST NOT)
-   No `loading.tsx` anywhere under `app/[locale]`. (bugfix-ssr-product-list-behind-suspense)
-   No `ssr: false` in code, comments excluded. (bugfix-dynamic-ssr-false-bailout)
-   `CatalogContext.tsx` has no `useState`. The URL is the catalog state. (phase 2)
-   No route file imports the client i18n (`src/i18n`); metadata uses `tServer`. (metadata spec)
-   `SITE` is declared only in `src/sdk/seo.ts`, and no source hard-codes `/example`. (metadata spec,
    phase 1)

All of these pass on today's code, except the `usePathname` rule, which depends on decision 1.

## B - Routing helpers (unit tests)

File: `src/test/routing-helpers.test.ts`.

-   `withLocale` (`LocaleContext.tsx:33`): prefixes `/x` to `/com_fr/x`, maps `/` to `/com_fr`, leaves
    `https://...`, `#a`, `mailto:` alone, and is idempotent.
-   `withoutLocale` (`LocaleContext.tsx:51`): strips the segment, `/com_fr` gives `/`, a path from
    another locale is returned unchanged. It is the exact inverse of `withLocale` on app paths.
-   `findLocalizedCatalog` (`catalogs.ts:50`): finds a code across catalogs, returns null for an unknown
    code.
-   `defaultLocalizedCatalog` (`catalogs.ts:66`): first catalog, its `isDefault` localized catalog,
    else its first one; null when there are no catalogs.
-   `canonical` (`seo.ts:13`) builds `SITE/<locale><path>`; `languageOf` (`seo.ts:17`) maps the
    locale to `fr` / `en` / `de` with `en` as the fallback.
-   `getBaseUri` (`sdk/index.ts:18`): `SSR_API_URL` on the server, falling back to the public URL;
    `NEXT_PUBLIC_API_URL` in the browser.
-   `missingInCatalog` (`catalogSwitch.ts:30`): with `?from=<another valid locale>`, redirects to the
    fallback path or the default listing; with no marker, an invalid marker or the same locale,
    calls `notFound()`.

## C - Route behaviour (route files called directly)

File: `src/test/routes.test.ts`. `src/sdk/server.ts`, `src/sdk/catalogs.ts`, `next/navigation` and
`next/server` are mocked, and view components are replaced by stubs, so the test inspects the
props the route passes down.

-   `/` (`app/page.tsx`): redirects to `/<default localized catalog code>`; throws when the API
    returns no catalogs.
-   `[locale]/layout.tsx`: unknown locale calls `notFound()`; a known one passes the resolved
    catalog, localized catalog, categories and config to `Providers`.
-   **Every page under `[locale]`** (13 routes, one table): an unknown locale calls `notFound()`.
-   Product, category and blog article: a missing entity goes through `missingInCatalog` - a 404
    without `?from=`, a redirect with it. The guard layouts never call `notFound()` themselves.
-   CMS: `about`, `shipping-returns` and `faq` render; any other slug calls `notFound()`.
-   Search: `initialData` is fetched only when `q` is set and no `f_*` filter is in the URL.
-   Product, category and blog pass their server data as `initialProduct` / `initialData` /
    `initialPost`.
-   `generateMetadata`, one table over all routes: search, cart, checkout, closing, explain and vector
    search are `noindex` with no canonical; home, blog, article, category, product and CMS have a
    canonical `SITE/<locale><path>` and a title.

## D - Out of scope here (needs Playwright in `front/e2e`)

-   Real HTTP status codes (404, 307), and the `/example` base path on redirects.
-   Hydration matching the server HTML, and no skeleton in the first HTML.
-   The catalog selector as a client navigation, and the 150 ms loading feedback timing.
-   Tracking firing after hydration.

## Outcome of the decisions

1.  `SearchExplain.tsx` was fixed to use `useAppPathname()` (see the follow-up in
    `bugfix-nav-active-locale-pathname.md`). It is not on the raw `usePathname()` list.
2.  Route files are called as functions, as described in part C.

## Pinned behaviour worth a second look

-   A catalog switch onto a catalog with no category redirects to `/<locale>/`, with a trailing slash,
    because `defaultListingPath()` returns `/` and `missingInCatalog` appends it. Next probably
    normalises it with one more redirect. The test pins it as it is today.

## Spec housekeeping (done 2026-10-22: both headers now say the files are deleted)

-   `feature-navigation-loading-feedback.md` and `feature-persist-shared-ui-across-navigation.md`
    still name deleted files (`loading.tsx`, `app/[locale]/category/layout.tsx`) in their header,
    and keep those lines ticked. Both carry a "superseded" note further down, so they are not wrong,
    only confusing to scan.
