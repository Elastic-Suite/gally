# Feature Audit — `main` vs `feat-1379782-newExampleApp`

> Compares `main` (@725dd3e) `front/example-app` against this branch (`feat-1379782-newExampleApp`,
> first audited as `feat-new-example`).
> Audited 2026-07-30 by diffing the full file tree, then reading each `main`-only module to check whether its
> capability exists anywhere in the new tree (possibly renamed/merged, not just same filename).
> Statuses rechecked against the code on 2026-10-12. Since the audit the app moved from Create React App to
> Next.js 16 App Router (`specs/feature-nextjs-migration-phase1.md`): routes live in `app/`, views in `src/views/`.

Legend: **fully missing** = no trace in the new app · **partial** = some capability remains but reduced/changed

---

## 1. Access control

### Authentication / login

**Status: fully missing**
Email+password login gating routes via a `withAuth` HOC, JWT against `/authentication_token`, redirect back to
the originally-requested path after login.

-   `src/pages/Login/Login.tsx`
-   `src/hocs/withAuth.tsx`
-   `src/components/Providers/UserProvider/UserProvider.tsx`
-   `src/hooks/useUser.ts`
-   `src/contexts/user.ts`
-   `src/components/Providers/RequestedPathProvider/RequestedPathProvider.tsx`

### Feature-flag system

**Status: partial** (was fully missing)
Fetched `/public_configurations` and `/extra_bundles` to gate optional features/entitlements — e.g. the old
vector-search page was gated behind a `Bundle.VECTOR_SEARCH` flag.

Both are fetched again now, but nothing is shown or hidden based on them:

-   `/public_configurations` is read in SSR for the media host (`src/sdk/server.ts`, `src/contexts/ConfigContext.tsx`,
    `specs/feature-public-configuration.md`).
-   `{ extraBundles { name } }` is passed to the SDK's `SearchManager` (`src/sdk/bundles.ts`,
    `specs/feature-sdk-bundles.md`).
-   Still missing: hiding a page or block when its bundle is absent. The vector search page is not gated.

Old files, for reference:

-   `src/components/Providers/ConfigurationsProvider/ConfigurationsProvider.tsx`
-   `src/components/Providers/ExtraBundlesProvider/ExtraBundlesProvider.tsx`
-   `src/contexts/configurations.ts`
-   `src/contexts/extraBundles.ts`

### Geolocation-aware search

**Status: fully missing**
Settings popup to set latitude/longitude, sent as a `reference-location` header to bias/rank product results
by distance.

-   `src/components/Settings/Settings.tsx`
-   `src/components/Providers/SettingsProvider/SettingsProvider.tsx`
-   `src/contexts/settings.ts`

---

## 2. Search & discovery

### CMS/document search

**Status: ✅ implemented**
Was fully missing. A query now hits both indices: the search page shows product results or `cms_page`
results ("Articles"), and `/blog` lists the indexed posts with content-type and topic filters taken from the
API's aggregations, a sort, and pagination. Data comes from `src/hooks/useCms.ts`; the views are
`src/views/SearchPage.tsx`, `src/views/BlogPage.tsx`, `src/views/BlogPostPage.tsx` and `src/views/CmsPage.tsx`.
See `specs/feature-blog-cms.md` and `specs/feature-search-result-type-switch.md`.

Old files, for reference:

-   `src/hooks/useDocuments.ts`
-   `src/services/document.ts`
-   `src/pages/Search/CmsSearch.tsx`
-   `src/components/Cms/Pages.tsx`

### Semantic/vector search over CMS documents

**Status: fully missing**
`vectorSearchDocuments` GraphQL query rendering embeddings-based document search results as a product-like
grid. **Do not confuse with `VectorSearchPage.tsx` on this branch** — that's a different feature (see §6).

-   `src/hooks/useVectorSearchDocuments.ts`
-   `src/services/vectorSearchDocuments.ts`

### Tabbed search UI

**Status: ✅ implemented**
Was fully missing. Reusable `Tabs`/`TabPanel` abstraction used to switch between Products/CMS results with
lazy-mounted panels. Replaced by a centered "Products / Articles" segmented switch on the search page
(`src/views/SearchPage.tsx`, still a tablist for assistive tech). See
`specs/feature-search-result-type-switch.md`. No generic `Tabs` component was ported.

-   `src/components/Tabs/Tabs.tsx`, `TabPanel.tsx`, `a11yProps.tsx`

### Original vector-vs-fulltext comparison

**Status: ✅ implemented (2026-08-17)**
Was fully missing. Now `/[locale]/vector-search` → `src/views/VectorSearchPage.tsx`: one query, two
symmetric panels, both rendering the same `ResultRow` from the same `COMPARE_ROW_FIELDS`
(`sku name image url_key score`). A row is one line — rank, thumbnail, name, score — not a
`ProductCard`: cards showed €0.00 on every hit, because the SDK appends `price` and `stock` to the
queries it builds and a hand-built vector query gets no such favour. 25 rows a side, each panel
paginated independently. The vector side calls the premium `vectorSearchProducts` GraphQL query
through a local raw fetcher (`src/sdk/vectorSearch.ts`) — the SDK has no vector support, and
`VectorProduct` carries the same fields as `Product`, so the old app's
`transformVectorSearchDocumentsIntoProducts` mapping layer is no longer needed. See
`specs/feature-vector-search-comparison.md`.

The name collision noted here is also resolved: the explain visualiser is now `src/views/ExplainPage.tsx`,
matching its `/explain` route, and `VectorSearchPage.tsx` is the comparison. Not gated behind a bundle
flag — the feature-flag system is still missing (§1) — the panel degrades to an "unavailable" message if
the query fails.

-   `src/pages/VectorSearch/VectorSearch.tsx` (old, for reference)
-   `src/components/VectorSearch/ProductList.tsx` (old, for reference)

### Dynamic sort options + per-category default sort

**Status: ✅ implemented (2026-10-12)**
Was partial. Sort dropdown options were fetched from the API (`getProductSortingOptionsQuery`); category
pages had a default sort from `category_configuration.defaultSorting`. Both listings now build their sort
select from `productSortingOptions`, with labels in the catalog's language, through the shared
`src/components/SortSelect.tsx`. The category page's "Default" entry sends no sort, so the API applies the
category's configured default, and the entry names the field it used. See
`specs/feature-dynamic-sort-options.md`.

-   `src/hooks/useProductSort.ts`
-   `src/services/product.ts`

### Sort labels the API cannot translate - storefront override

**Status: workaround (2026-10-12)** - we cheat a little on the data here.
The API returns four sort labels in fixed English, whatever the catalog. The storefront replaces them
with its own translations (`src/hooks/useSortOptions.ts`, `common.json` `sort.fields.*`):

| Sort code            | API label    | Hardcoded in (`api/packages/gally-standard/src/Search/`)                    |
| -------------------- | ------------ | --------------------------------------------------------------------------- |
| `_score`             | Relevance    | `Service/SortingOptionsProvider.php:98`                                     |
| `category__position` | Position     | `GraphQl/Type/Definition/SortOrder/CategoryDefaultSortOrderProvider.php:48` |
| `price__price`       | Price        | `GraphQl/Type/Definition/SortOrder/PriceDefaultSortOrderProvider.php:48`    |
| `stock__status`      | Stock status | `GraphQl/Type/Definition/SortOrder/StockDefaultSortOrderProvider.php:48`    |

So a merchant's own label for price or stock never reaches the sort list, here or in any other
storefront. The real fix is in the API:

-   The three providers' `getSimplifiedLabel()` should return
    `$sourceField->getLabel($localizedCatalog->getId())`, as `ScalarSortOrderProvider` does, and keep
    the English string only as a fallback.
-   "Relevance" should be translated by the catalog's locale.
-   Once done, delete the override list in `useSortOptions.ts`.

Second shortcut, same file: **other shops' fields are hidden by prefix.** Sortable is a plain
setting on the field (`api/packages/gally-standard/src/Metadata/Entity/SourceField.php:266`), with
no catalog, and sortable fields are loaded per entity only
(`Metadata/Service/MetadataSourceFieldProviderCache.php:86`). No catalog setting narrows the list:
the only scoped sort setting is `gally.search_settings.sort.default_desc_sort_field`. The demo loads
three unrelated shops into one instance, so each would list the others' sortable fields ("Pipe
diameter" on the paper shop). `useSortOptions.ts` drops any field carrying another shop's prefix
(`SHOP_FIELD_PREFIXES`: toolbox `tbx_`, fashion `fio_`, paper shop `llv_`); unprefixed fields are
shared and kept. A new demo shop needs its prefix added there.

-   Real fix, if wanted: a per-catalog sortable setting in the API, or hiding fields that have no
    value in the catalog. Then delete `SHOP_FIELD_PREFIXES`.
-   A real install usually shares one product model across its catalogs, so this mostly matters for
    the demo.

See `specs/feature-dynamic-sort-options.md`.

---

## 3. Faceted navigation

### Category facet

**Status: ✅ implemented (2026-07-30)**
Was fully missing. Now a `CategoryFacet` in `src/components/Facets.tsx`, dispatched whenever
`aggregation.type === 'category'` (confirmed as a real backend aggregation type via live API + the SDK's
`ResponseFilterType.CATEGORY`). Single-select, `eq` filter on `category__id` — reuses the existing
checkbox-row styling, no new CSS. See `specs/feature-facet-category.md`.

-   `src/components/Facets/FacetCategory.tsx` (old, for reference)

### Server-side "load more" / search-within-facet

**Status: ✅ implemented (2026-07-30)**
Was partial. `useSearch.ts` now exposes `viewMoreOptions(field)`, calling the SDK's previously-unused
`SearchManager.viewMoreProductFilterOption()`. When `aggregation.hasMore` is true, "Show more" fetches the
full option list from the server once; the existing client-side search box then filters over that fuller
set (not a per-keystroke server round trip). Before that full list is loaded, the search box queries the
server with the API's `optionSearch` argument (debounced), so values outside the first batch are found
too. See `specs/feature-facet-load-more.md`.

-   `src/components/Facets/FacetLoadMore.tsx` (old, for reference)

### Active-filter chip row

**Status: ✅ implemented (2026-07-30)**
Was fully missing. New `ActiveFilterChips` in `src/components/Facets.tsx`, rendered above the facet list —
removable pills per active filter (checkbox/slider/boolean/category) + "Clear all". New CSS classes
`.active-filters`/`.filter-chip`/`.filter-chip-clear` in `styles.css`, built only from existing tokens.
See `specs/feature-facet-active-filters.md`.

-   `src/components/Facets/Facets.tsx` (old, for reference)

### Facet/attribute-value autocomplete

**Status: ✅ implemented**
Was partial. Search bar typeahead included an "Attributs" group (e.g. "Color: Red") that applied a facet
filter directly on selection. `src/components/SearchOverlay.tsx` now shows attribute values again
(`AcpAttribute`, `getAutocompleteAttributes()`). The backend decides which attributes appear. Clicking a
value opens the search page filtered by that value, without the typed text (`specs/bugfix-acp-attribute-drops-query.md`).
The "Popular search terms" group now comes from the engine's `termSuggestions`, not a hardcoded list
(`specs/feature-acp-real-term-suggestions.md`).

-   `src/components/SearchBar/SearchBar.tsx`

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

-   `src/contexts/category.ts`, `src/components/Providers/CategoryProvider/CategoryProvider.tsx` (old, for reference)

### Product count of virtual categories

**Status: workaround (2026-10-12)**
The category tree's `count` is always 0 for a virtual category: it is one aggregation on `category.id`
(`api/packages/gally-standard/src/Category/Service/CategoryTreeBuilder.php:172-193`), which only sees
products assigned to the category, while a virtual category picks its products by rule. Measured:
`cat_llv_54` 0 instead of 104, `cat_tbx_85` 0 instead of 45.

The storefront works around it:

-   the hero of a virtual category shows the listing's own unfiltered total (`src/views/CategoryPage.tsx`);
-   the subcategory chips keep virtual categories and show no count for them;
-   the nav flyout shows no count for them (`src/components/CategoryNav.tsx`).

Real fix in the API: count a virtual category with its rule when building the tree. Then remove the
workaround. See `specs/bugfix-virtual-category-count.md`.

### Mobile off-canvas navigation drawer

**Status: partial**
Hamburger-triggered drawer listing the full nested category tree with expand/collapse. The new app has
no drawer:

-   Desktop: `src/components/CategoryNav.tsx` shows the top level, with a hover flyout one level deep.
-   768px and below: the category menu is one row that scrolls sideways. It has no flyouts, so a tap
    opens the top-level category page (`specs/feature-mobile-header-and-acp-tabs.md`).
-   Still missing: reaching a subcategory from the nav on a phone, and any level below the second.

-   `src/components/Menu/Menu.tsx`, `MenuItem.tsx`, `MenuList.tsx`

---

## 5. Quality & tooling

### Unit test suite + test infra

**Status: fully missing**
Jest setup, RTL provider wrapper, `__mocks__` for the shared package, and every `*.test.ts(x)` file.
Confirmed: `find src -name "*.test.ts*"` returns 0 files on this branch.

-   `src/setupTests.ts`, `src/utils/TestProvider.tsx`, `src/utils/tests.tsx`
-   `src/mocks/*`, `src/__mocks__/@elastic-suite/gally-admin-shared.ts`
-   All `useApi`/`useDocuments`/`useDocumentSort`/`useGraphql`/`useLog`/`useProductSort`/`useProducts`/
    `useResource`/`useUser`/`useVectorSearchDocuments` test files, `Header.test.tsx`

### CRA PWA/analytics boilerplate

**Status: fully missing**
App manifest, icons, robots.txt, web-vitals reporting. Likely intentional cleanup — flagged for completeness.

-   `public/manifest.json`, `favicon.ico`, `logo192.png`, `logo512.png`, `robots.txt`
-   `src/reportWebVitals.ts`

---

## 6. Superseded — intentional rewrite, no porting needed

Listed so these aren't mistakenly re-flagged as regressions later.

| Old (`main`)                                                                                                            | New (`feat-new-example`)                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `SchemaProvider`, `useApi`, `useResource`, `useGraphql`, `useLog`                                                       | `@elastic-suite/gally-sdk` `Client`/`SearchManager` (`src/sdk/index.ts`)                                                                |
| `CatalogProvider`, `CategoryProvider`                                                                                   | `src/contexts/CatalogContext.tsx` + `src/sdk/catalogs.ts`                                                                               |
| `useProducts`, `useProductSort`                                                                                         | `src/hooks/useSearch.ts` (gaps noted in §2)                                                                                             |
| Category/facet/product autocomplete type discriminators                                                                 | `useAutocomplete()` in `useSearch.ts` + `src/components/SearchOverlay.tsx` (products, categories, attribute values, terms, blog posts)  |
| `components/App/App.tsx`, `Header`/`HeaderFormControl`, `PageLayout`/`TwoColsLayout`/`Layout`, `Products`/`ProductCard` | `app/` routes + `src/components/AppShell.tsx`, `src/components/Header.tsx`, per-page CSS grid layouts, `src/components/ProductCard.tsx` |
| Styled-components (`*.styled.tsx`) + SCSS (`style.scss`)                                                                | Single plain-CSS `src/styles.css`                                                                                                       |

---

## 7. Gally releases (v1.2.0 → v2.3.0) — features absent from _both_ app versions

Cross-checked the [GitHub release notes](https://github.com/Elastic-Suite/gally/releases) against every doc in
this app (`AGENTS.md`, `docs/*`, `storytelling.md`) and against the `main`-vs-branch audit above. Doc-only
comparison, no code read for this section.

### Worth a second look — plausibly storefront-facing, undocumented in either version

-   **Facet Sorting Options** (descending/natural ordering, v2.2.0) — no facet sort-order control is mentioned
    in `docs/design-system.md`'s facet patterns or anywhere else for either app version. If this is meant to be
    demonstrable in a showcase, neither version shows it.
-   **Thesaurus / synonym expansion** (v1.2.0) — affects search results transparently; no doc for either version
    calls out a way to demo it (e.g. a "search 'jumper' and see 'sweater' results" callout). Low priority since
    it needs no dedicated UI to function, only to be _shown_.

### Ambiguous — can't confirm from docs alone

-   **Product Category Count Request** (v2.1.0) — covered on this branch: the category tree carries a
    `count` field (`src/sdk/catalogs.ts`), shown next to each subcategory in the nav flyout
    (`src/components/CategoryNav.tsx`). Old-app status is unverified without reading `main`'s code.

---

## 8. Only on the new branch — do NOT lose these

-   **`ExplainPage`** (`src/views/ExplainPage.tsx`, `src/components/SearchExplain.tsx`) — search-relevance
    "explain" visualizer: calls the GraphQL `explain` query directly and renders per-product ranking cards with
    boost badges and a per-field score-contribution breakdown. Renamed from `VectorSearchPage.tsx` on
    2026-08-17 to match its `/explain` route; it is not, and never was, a keyword-vs-vector comparison (see §2).
-   **`ClosingPage`** (`src/views/ClosingPage.tsx`) — sales-demo "bilan" page with a sequenced reveal (delay →
    cost → pricing plans) that closes the storytelling scenario; see `storytelling.md` Act 5.
-   **Storytelling/demo layer** (`DemoContext`, `StoryCompanion`, `IntroScreen`, `useStoryActions`) — the full
    5-act guided scenario, audience-mode toggle, and right-side story companion panel. Net new, no `main`
    equivalent at all. **Paused and currently unreachable** - see `specs/feature-guided-demo-rebuild.md`.
    A rebuild with one tour per sample catalog is planned in `specs/feature-guided-tour-per-catalog.md`.
-   **`CheckoutPage`** — checkout tunnel (delivery and payment on one prefilled step → confirmation) with `ORDER` tracking.
    Net new.
-   **Cart AOV boosters** (`CartPage`) — free-shipping progress bar, real cross-sell recommendations,
    animated total. Net new.
-   **Live tracking panel** (`EventLogContext`, `EventLog`, `TrackingInsights`) — floating panel showing SDK
    tracking events in real time, for demo/debug purposes. Net new.
-   **Color swatch facet type** in `Facets.tsx` — not present in the old app's facet set.
-   **Blog** (`src/views/BlogPage.tsx`, `src/views/BlogPostPage.tsx`) - browsable `cms_page` index with type and
    topic filters. See `specs/feature-blog-cms.md`.
-   **Eco badge** on product cards and the product page (`src/components/EcoMark.tsx`). See `specs/feature-eco-badge.md`.
-   **Category hero banner** on category pages. See `specs/feature-category-hero-banner.md`.
-   **Real recommendations** from the API. See `specs/feature-real-recommendations.md`.
-   **Vector search block** on the home page. See `specs/feature-home-vector-block.md`.
