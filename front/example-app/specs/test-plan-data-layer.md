# Test plan: data layer (`src/sdk`)

## Status: implemented - 88 tests in 6 files (`src/test/data-*.test.ts`), all passing

Second aspect of the test suite, below routing: what the app asks the Gally API for, and how it
turns the answer into what the views show. The traps that return zero results with no error all live
here (`docs/sdk-reference.md`), and every page depends on it.

About 95 tests in 6 files, all in the Node environment. Nothing calls a real API.

Sources: `docs/sdk-reference.md`, `bugfix-cms-selected-fields-projection.md`,
`bugfix-product-fields-assume-every-catalog-loaded.md`, `bugfix-product-sku-exact-filter.md`,
`bugfix-stock-count-zero-on-parents.md`, `feature-axis-labels-from-api.md`,
`feature-public-configuration.md`, `feature-sdk-bundles.md`, `feature-real-recommendations.md`,
`feature-configurable-option-selection.md`, `feature-blog-cms.md`.

## Decision needed before writing

1. **Where the test documents come from.**
    - (a) Hand-written, a few keys each, built per test. Small and readable, but only as close to
      the real API as the person writing them.
    - (b) Captured once from the local stack (one product per catalog, one blog article, one listing)
      and saved as JSON under `src/test/fixtures/`. Realistic, and they show what the API really
      returns, but they are long and tied to the current sample data.
    - Recommended: (a) for the rules, plus one captured product and one captured article that run
      through the mappers once, to catch a shape the hand-written ones missed.

## A - What we ask for: field selections (`fields.ts`)

-   `productFields(catalog)` always contains the common fields, for every known catalog and for an
    unknown one, so it can never be empty (the zero-results trap).
-   Each catalog adds its own extra fields and one `<axis> { label value }` per variant axis; an
    unknown catalog gets the common fields only.
-   `productDetailFields(catalog)` is `productFields(catalog)` plus `source`, and the listing selection
    never contains `source` (MUST NOT, configurable-option-selection).
-   `CMS_FIELDS` is not empty, contains `id`, and uses raw `_source` names - no GraphQL braces
    (bugfix-cms-selected-fields-projection).

## B - Turning a product document into a card (`productFields.ts`)

-   `isAvailable`: status false is unavailable; quantity 0 is unavailable; no quantity means "use
    the status alone" (bugfix-stock-count-zero-on-parents).
-   `parseAxisCodes`: the four shapes the API sends - an array, a JSON string, a plain string,
    empty - and bad JSON gives no axis.
-   `getProductFields`, one table:
    -   reads `source` when present, otherwise the document itself;
    -   name as an array or a string, `'Product'` when missing; SKU fallbacks down to `'unknown'`;
    -   price from the first price entry, `0` when missing; original price under both spellings;
    -   discounted, new (only a strict `true`), on sale (sale flag or discounted);
    -   single-material label, eco flag, type `'simple'` by default, description from an array or a
        string;
    -   stock defaults to "in stock, no quantity", and `available` follows `isAvailable`.
-   `getProductBadges`: always sale, then new, then material, so callers can cut the list without
    re-sorting.

## C - Articles and media URLs (`cmsFields.ts`, `config.ts`)

-   `mediaUrl`: one slash between base and path whatever each side has, first item of an array,
    absolute URLs kept, `''` for no image, the fallback host when the configuration has no base.
-   `getCmsFields`: every field has a default when the document is missing; the summary falls back
    from `content_heading` to `meta_description`; the image goes through `mediaUrl`.
-   `cmsPageUrl` encodes the id; `formatCmsDate` gives `''` for an empty or invalid date and accepts
    the API's `YYYY-MM-DD HH:MM:SS` form. The month name is not checked: it depends on the runtime's
    locale data.

## D - Category trail, axis labels, demo queries

-   `productCategoryTrail`: the deepest category wins, ties keep the first, ids missing from the tree
    are skipped, the root alone is only a fallback, no `source` gives `[]`.
-   `axisLabel`: the API label, or the code with a capital first letter when the label is missing.
-   `getVectorDemoQueries`: the queries of a known catalog, `[]` for an unknown one.

## E - Server fetchers (`server.ts`), with a fake search manager

The fake records the options each fetcher sends and returns a canned response.

-   Product: `searchQuery` is the SKU, an exact `sku` filter, page size 1, the detail selection
    (bugfix-product-sku-exact-filter).
-   Category: the category id, page size 20, the listing selection, no sort.
-   Search: the query, sorted by `_score` descending.
-   Article: `cms_page`, an `id` equality filter, `CMS_FIELDS`, `isAutocomplete: false`.
-   On an API error: `null` for product and article, an empty result for listings - never a throw.
-   `fetchPublicConfiguration`: one GET with `localizedCatalogCode`; `{}` when the endpoint fails
    (feature-public-configuration).

## F - Other network helpers, with a fake `fetch`

-   `fetchAxisLabels`: no request when the catalog has no axis; `{}` on any failure.
-   `fetchBundles`: one request per process; a failed request is not remembered, so the next call
    retries (feature-sdk-bundles).
-   `fetchProductRecommendations`: duplicate seed SKUs sent once; no seed means no request; price and
    stock added to the selection; `[]` on error (feature-real-recommendations).
-   `fetchVectorSearchProducts`: a blank query sends nothing; an error or a bad response body gives
    the empty result; the page count is capped by the 100-result limit.

## Outcome

-   Decision 1: hand-written documents for the rules, plus documents captured from the local stack
    in `src/test/fixtures/api/` (loaded by `src/test/fixtures/api.ts`): an in-stock configurable
    (VA02, `com`), an out-of-stock configurable (VT10, `com`) and a discounted simple book
    (`papershop`), each as a listing row and as a detail document, and the non-product data - a blog
    article, the public configuration and the axis labels.
-   Recapture with `yarn test:capture-fixtures` in the pwa container, with `SSR_API_URL` pointing at
    the API. The script (`src/test/fixtures/capture-api.test.ts`) names each product by SKU and
    fails if its type or stock status changed; it is skipped in a normal test run.
-   Six deliberate breaks, one per group, each made a test fail.

## Pinned behaviour worth a second look

-   **Every listing row maps to `typeId: 'simple'`.** The listing selection has no `type_id`, so the
    mapper falls back. The quick-add reads `configurable_attributes` instead, so nothing visible
    depends on it today.
-   **An empty name list gives `name: undefined`**, not the `'Product'` fallback a missing name gets.

## Out of scope here

-   Whether the real API returns these shapes - only a live call shows that (decision 1 (b) gets
    part of the way).
-   Comparing each server fetcher with its client hook call. The hooks need rendering; that belongs
    to the search and listing aspect.
-   Components that use this data: `ProductImage` placeholder, `VariantSelector` sorting, the blog
    list filters.

## Spec and comment housekeeping (done 2026-10-22: specs reworded, nine comments renamed, server.ts comment rewritten)

-   `feature-axis-labels-from-api.md:54` names `AXIS_CODES` and `feature-configurable-option-selection.md:92`
    names `PRODUCT_DETAIL_FIELDS`. Both became functions, `axisCodes()` and `productDetailFields()`
    (`fields.ts:81`, `:134`). Five code comments still use the old names
    (`vectorSearch.ts:14,21`, `ProductPage.tsx:112`, `VectorSearchPage.tsx:249`, `useSearch.ts:23`).
-   `feature-public-configuration.md:55` says "no hardcoded media host", while the same spec asks
    for the fallback host that `config.ts:10` hardcodes.
-   `server.ts:122-124` says an empty search sends `'*'`. The search route no longer calls the
    server fetcher without a query (`app/[locale]/search/page.tsx:38-42`), so that branch is unused.
    This is in line with `docs/sdk-reference.md:15`, which allows `'*'` only as a fallback.
