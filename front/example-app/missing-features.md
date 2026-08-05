# Feature Audit — `main` vs `feat-new-example`

> Compares `main` (@725dd3e) `front/example-app` against this branch (`feat-new-example`).
> Audited 2026-07-30 by diffing the full file tree, then reading each `main`-only module to check whether its
> capability exists anywhere in the new tree (possibly renamed/merged, not just same filename).

Legend: **fully missing** = no trace in the new app · **partial** = some capability remains but reduced/changed

---

## 1. Access control

### Authentication / login
**Status: fully missing**
Email+password login gating routes via a `withAuth` HOC, JWT against `/authentication_token`, redirect back to
the originally-requested path after login.
- `src/pages/Login/Login.tsx`
- `src/hocs/withAuth.tsx`
- `src/components/Providers/UserProvider/UserProvider.tsx`
- `src/hooks/useUser.ts`
- `src/contexts/user.ts`
- `src/components/Providers/RequestedPathProvider/RequestedPathProvider.tsx`

### Feature-flag system
**Status: fully missing**
Fetched `/public_configurations` and `/extra_bundles` to gate optional features/entitlements — e.g. the old
vector-search page was gated behind a `Bundle.VECTOR_SEARCH` flag.
- `src/components/Providers/ConfigurationsProvider/ConfigurationsProvider.tsx`
- `src/components/Providers/ExtraBundlesProvider/ExtraBundlesProvider.tsx`
- `src/contexts/configurations.ts`
- `src/contexts/extraBundles.ts`

### Geolocation-aware search
**Status: fully missing**
Settings popup to set latitude/longitude, sent as a `reference-location` header to bias/rank product results
by distance.
- `src/components/Settings/Settings.tsx`
- `src/components/Providers/SettingsProvider/SettingsProvider.tsx`
- `src/contexts/settings.ts`

---

## 2. Search & discovery

### CMS/document search
**Status: fully missing**
A second search surface indexing CMS pages (title/heading/tags) with its own facets, sort, and pagination,
driven by a generic entity-search hook. The new `src/pages/CmsPage.tsx` only renders a handful of hardcoded
static pages by slug — no search, facets, or pagination.
- `src/hooks/useDocuments.ts`
- `src/services/document.ts`
- `src/pages/Search/CmsSearch.tsx`
- `src/components/Cms/Pages.tsx`

### Semantic/vector search over CMS documents
**Status: fully missing**
`vectorSearchDocuments` GraphQL query rendering embeddings-based document search results as a product-like
grid. **Do not confuse with `VectorSearchPage.tsx` on this branch** — that's a different feature (see §6).
- `src/hooks/useVectorSearchDocuments.ts`
- `src/services/vectorSearchDocuments.ts`

### Tabbed search UI
**Status: fully missing**
Reusable `Tabs`/`TabPanel` abstraction used to switch between Products/CMS results with lazy-mounted panels.
Only needed if CMS search above is restored.
- `src/components/Tabs/Tabs.tsx`, `TabPanel.tsx`, `a11yProps.tsx`

### Original vector-vs-fulltext comparison
**Status: fully missing**
A query fed into two parallel result panels — one full-text (`ProductRequestType.SEARCH`), one via
`useVectorSearchDocuments` — gated behind the `VECTOR_SEARCH` bundle flag. The new `VectorSearchPage.tsx`
reuses the route/name but does something else entirely (a relevance "explain" visualizer) — this is a real
gap, not a rename.
- `src/pages/VectorSearch/VectorSearch.tsx`
- `src/components/VectorSearch/ProductList.tsx`

### Dynamic sort options + per-category default sort
**Status: partial**
Sort dropdown options were fetched from the API (`getProductSortingOptionsQuery`); category pages had a
default sort from `category_configuration.defaultSorting`. The new app hardcodes sort `<option>`s and has no
per-category default.
- `src/hooks/useProductSort.ts`
- `src/services/product.ts`

---

## 3. Faceted navigation

### Category facet
**Status: ✅ implemented (2026-07-30)**
Was fully missing. Now a `CategoryFacet` in `src/components/Facets.tsx`, dispatched whenever
`aggregation.type === 'category'` (confirmed as a real backend aggregation type via live API + the SDK's
`ResponseFilterType.CATEGORY`). Single-select, `eq` filter on `category__id` — reuses the existing
checkbox-row styling, no new CSS. See `specs/feature-facet-category.md`.
- `src/components/Facets/FacetCategory.tsx` (old, for reference)

### Server-side "load more" / search-within-facet
**Status: ✅ implemented (2026-07-30)**
Was partial. `useSearch.ts` now exposes `viewMoreOptions(field)`, calling the SDK's previously-unused
`SearchManager.viewMoreProductFilterOption()`. When `aggregation.hasMore` is true, "Show more" fetches the
full option list from the server once; the existing client-side search box then filters over that fuller
set (not a per-keystroke server round trip). See `specs/feature-facet-load-more.md`.
- `src/components/Facets/FacetLoadMore.tsx` (old, for reference)

### Active-filter chip row
**Status: ✅ implemented (2026-07-30)**
Was fully missing. New `ActiveFilterChips` in `src/components/Facets.tsx`, rendered above the facet list —
removable pills per active filter (checkbox/slider/boolean/category) + "Clear all". New CSS classes
`.active-filters`/`.filter-chip`/`.filter-chip-clear` in `styles.css`, built only from existing tokens.
See `specs/feature-facet-active-filters.md`.
- `src/components/Facets/Facets.tsx` (old, for reference)

### Facet/attribute-value autocomplete
**Status: partial**
Search bar typeahead included an "Attributs" group (e.g. "Color: Red") that applied a facet filter directly
on selection. The new `SearchOverlay.tsx` (see `specs/feature-search-header-redesign.md`) has 3 groups —
Popular search terms, Products, Category — still no attribute-value group.
- `src/components/SearchBar/SearchBar.tsx`

---

## 4. Navigation & layout

### Root/default category link dropped from the nav bar
**Status: ✅ implemented (2026-07-30)** — found during this session, not in the original audit.
`main`'s `categoryContext` used the raw `getCategoryTree` response as-is — a single root "Default Category"
node with everything else nested under it as children, rendered via one collapsible sidebar menu item. This
branch's `fetchCategoryTree()` discarded that root node entirely and returned only its children, so there
was never a way to browse "everything" from the nav bar. Fixed by keeping the root as its own childless
leading entry ahead of its former children — see `specs/feature-category-nav-root.md`. That spec also covers
a second, unrelated bug found in the same component: the hover submenu was invisible due to an
`overflow-x`/`overflow-y` CSS clipping issue (not a z-index/stacking problem, despite how it looked).
- `src/contexts/category.ts`, `src/components/Providers/CategoryProvider/CategoryProvider.tsx` (old, for reference)

### Mobile off-canvas navigation drawer
**Status: partial**
Hamburger-triggered drawer listing the full nested category tree with expand/collapse. The new
`CategoryNav.tsx` is a desktop hover flyout only, one submenu level, with no mobile drawer.
- `src/components/Menu/Menu.tsx`, `MenuItem.tsx`, `MenuList.tsx`

---

## 5. Quality & tooling

### Unit test suite + test infra
**Status: fully missing**
Jest setup, RTL provider wrapper, `__mocks__` for the shared package, and every `*.test.ts(x)` file.
Confirmed: `find src -name "*.test.ts*"` returns 0 files on this branch.
- `src/setupTests.ts`, `src/utils/TestProvider.tsx`, `src/utils/tests.tsx`
- `src/mocks/*`, `src/__mocks__/@elastic-suite/gally-admin-shared.ts`
- All `useApi`/`useDocuments`/`useDocumentSort`/`useGraphql`/`useLog`/`useProductSort`/`useProducts`/
  `useResource`/`useUser`/`useVectorSearchDocuments` test files, `Header.test.tsx`

### CRA PWA/analytics boilerplate
**Status: fully missing**
App manifest, icons, robots.txt, web-vitals reporting. Likely intentional cleanup — flagged for completeness.
- `public/manifest.json`, `favicon.ico`, `logo192.png`, `logo512.png`, `robots.txt`
- `src/reportWebVitals.ts`

---

## 6. Superseded — intentional rewrite, no porting needed

Listed so these aren't mistakenly re-flagged as regressions later.

| Old (`main`) | New (`feat-new-example`) |
|---|---|
| `SchemaProvider`, `useApi`, `useResource`, `useGraphql`, `useLog` | `@elastic-suite/gally-sdk` `Client`/`SearchManager` (`src/sdk/index.ts`) |
| `CatalogProvider`, `CategoryProvider` | `src/contexts/CatalogContext.tsx` + `src/sdk/catalogs.ts` |
| `useProducts`, `useProductSort` | `src/hooks/useSearch.ts` (gaps noted in §2) |
| Category/facet/product autocomplete type discriminators | Folded into `useAutocomplete()` in `useSearch.ts` (product-only now) |
| `components/App/App.tsx`, `Header`/`HeaderFormControl`, `PageLayout`/`TwoColsLayout`/`Layout`, `Products`/`ProductCard` | `src/App.tsx`, `src/components/Header.tsx`, per-page CSS grid layouts, `src/components/ProductCard.tsx` |
| Styled-components (`*.styled.tsx`) + SCSS (`style.scss`) | Single plain-CSS `src/styles.css` |

---

## 7. Gally releases (v1.2.0 → v2.3.0) — features absent from *both* app versions

Cross-checked the [GitHub release notes](https://github.com/Elastic-Suite/gally/releases) against every doc in
this app (`AGENTS.md`, `docs/*`, `storytelling.md`) and against the `main`-vs-branch audit above. Doc-only
comparison, no code read for this section.

### Worth a second look — plausibly storefront-facing, undocumented in either version
- **Facet Sorting Options** (descending/natural ordering, v2.2.0) — no facet sort-order control is mentioned
  in `docs/design-system.md`'s facet patterns or anywhere else for either app version. If this is meant to be
  demonstrable in a showcase, neither version shows it.
- **Thesaurus / synonym expansion** (v1.2.0) — affects search results transparently; no doc for either version
  calls out a way to demo it (e.g. a "search 'jumper' and see 'sweater' results" callout). Low priority since
  it needs no dedicated UI to function, only to be *shown*.

### Ambiguous — can't confirm from docs alone
- **Product Category Count Request** (v2.1.0) — `docs/architecture.md`/`AGENTS.md` confirm the new app's
  category tree already carries a `count` field, so this looks covered on this branch. There's no equivalent
  doc for the old `main` app to check against (its docs didn't exist), so old-app status is unverified without
  reading code.

---

## 8. Only on the new branch — do NOT lose these

- **`VectorSearchPage`** (`src/pages/VectorSearchPage.tsx`, `src/components/SearchExplain.tsx`) — search-relevance
  "explain" visualizer: calls the GraphQL `explain` query directly and renders per-product ranking cards with
  boost badges and a per-field score-contribution breakdown. Not a keyword-vs-vector comparison (see §2).
- **`ClosingPage`** (`src/pages/ClosingPage.tsx`) — sales-demo "bilan" page with a sequenced reveal (delay →
  cost → pricing plans) that closes the storytelling scenario; see `storytelling.md` Act 5.
- **Storytelling/demo layer** (`DemoContext`, `StoryCompanion`, `IntroScreen`, `useStoryActions`) — the full
  5-act guided scenario, audience-mode toggle, and right-side story companion panel. Net new, no `main`
  equivalent at all.
- **`CheckoutPage`** — multi-step checkout tunnel (shipping → payment → confirmation) with `ORDER` tracking.
  Net new.
- **Cart AOV boosters** (`CartPage`) — bundle upsell, free-shipping progress bar, frequently-bought-together,
  animated total. Net new, see `storytelling.md` Act 4.
- **Live tracking panel** (`EventLogContext`, `EventLog`, `TrackingInsights`) — floating panel showing SDK
  tracking events in real time, for demo/debug purposes. Net new.
- **Color swatch facet type** in `Facets.tsx` — not present in the old app's facet set.
