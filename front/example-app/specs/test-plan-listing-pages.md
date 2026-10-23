# Test plan: the listing pages (search and listing, part 3)

## Status: implemented - 47 tests in `src/test/listing-pages.test.tsx` and `src/test/listing-components.test.tsx`, all passing

Part 3 of the search-and-listing aspect: what `SearchPage` and `CategoryPage` do beyond tracking
(tracking is covered by `page-tracking.test.tsx`), and the components they show - `Pagination`,
`SortSelect`, `QuickAdd`, `ProductCard`, `ProductImage`. Pages are rendered in jsdom with the fake
search manager and stubbed children of `page-tracking.test.tsx`; components are rendered on their
own and driven like a visitor.

About 40 tests in 2 files (`listing-pages.test.tsx`, `listing-components.test.tsx`). The ticked spec
lines match the code (checked 2026-10-23). No accessibility gap found in these components.

Sources: `feature-search-result-type-switch.md`, `feature-category-hero-banner.md`,
`feature-category-trail-nav-and-breadcrumb.md`, `bugfix-acp-attribute-drops-query.md`,
`bugfix-ssr-product-list-behind-suspense.md`, `bugfix-pagination-window-fixed-to-first-pages.md`,
`feature-dynamic-sort-options.md`, `feature-quick-add-overlay.md`, `feature-add-to-cart-feedback-everywhere.md`,
`feature-product-picture-badges.md`, `feature-product-image-placeholder.md`.

## Decision

1. **`/search` with no query shows the previous query's articles.** Both segments of the
   products / articles switch always render (`SearchPage.tsx:228-265`, by design). With no query the
   blog search is skipped, and `useCmsSearch` keeps its previous result when skipped
   (`useCms.ts`, pinned in `test-plan-search-engine.md`). So after a search, reaching `/search`
   without `q` in the same visit - browser back, an edited URL, an autocomplete attribute without a
   query - shows the old query's article count on the Articles tab, and its articles when opened.
    - (a) Pin it.
    - (b) Fix it: a skipped `useCmsSearch` empties its result (no articles, count 0), with a bugfix
      spec; the part 1 test that pins today's behaviour changes on purpose.
    - Recommended: (b).
    - **Decided 2026-10-23: (b), done** - `bugfix-search-stale-articles-without-query.md`.

## A - `/search` and its URL

-   `?q=` is the query; `f_<field>` params arrive as facets and reach the request
    (`bugfix-acp-attribute-drops-query`).
-   A URL change resets the page, the article page, the result type and the facets (re-seeded from the
    new URL).
-   A sort change goes back to page 1; a facet change goes back to page 1, scrolls to the top and keeps
    the other facets; pagination scrolls to the top.
-   The server's results are used only while the view matches them (page 1, no sort, no facet); an
    `f_` param makes the page fetch in the browser.

## B - The products / articles switch (feature-search-result-type-switch)

-   Both tabs always show, with their counts - "…" while loading, 0 included; `tablist` / `tab` roles,
    `aria-selected` on the active one.
-   Opening Articles shows the articles; a new query goes back to Products.
-   Without a query the Articles tab shows 0, not the previous query (decision 1, fixed).

## C - Loading and empty states

-   Products: a skeleton while loading, the "no results" text once settled empty, never both.
-   Articles: six skeleton cards while loading, then the articles or the empty text.
-   Category: the skeleton or the empty text, never both.

## D - The category page

-   The breadcrumb trail from the category tree, with its fallback for an unknown code
    (feature-category-trail-nav-and-breadcrumb).
-   The hero picks its photos from the current products, the same for the same `heroSeed`; the
    sub-category chips come from the tree (feature-category-hero-banner).
-   A new category code resets the page and the facets; the sort is kept (pinned as today, noted
    below).

## E - The listing components

-   `Pagination` (bugfix-pagination-window-fixed-to-first-pages): nothing for one page; the window
    of pages around the current one, clamped at both ends, with the first and last page and "…" when
    they are not adjacent; previous / next disabled at the ends; real buttons, `aria-current` on the
    current page.
-   `SortSelect` (feature-dynamic-sort-options): the API's sort options, relevance first, the category
    position option only on a category; the placeholder when the current sort is not offered; the
    direction button hidden for relevance and position; a pick sends its natural direction
    (relevance descending, others ascending), the button flips it.
-   `QuickAdd` (feature-quick-add-overlay, feature-add-to-cart-feedback-everywhere): the variant
    choice only for an available configurable; "add" disabled until every axis is chosen; the cart
    gets the SKU, name, price, image and the chosen labels joined with " / ", no child SKU; then the
    "added" flash, `onAdded`, and the selection cleared; an unavailable product cannot be added.
-   `ProductCard` (feature-product-picture-badges): one badge, the highest priority; the original
    price struck only when discounted; the SKU line; links to `/product/<sku>`.
-   `ProductImage` (feature-product-image-placeholder): the placeholder for an empty source or a load
    error, named by its alt text; a new source tries again.

## Outcome

-   Twelve deliberate breaks, each made a test fail: `f_` params ignored, a URL change keeping the
    result type, a category change keeping the facets, one-product sub-categories hidden, two hero
    photos, no breadcrumb fallback, an uncentred pagination window, relevance picked ascending,
    quick-add enabled before every axis is chosen, the variant labels joined differently, two badges
    on a card, a new image never retried.
-   The category page's filter builder has the same one-sided-range fragility as the search page's
    (`CategoryPage.tsx`, `filterArray`: a range is recognised only with a minimum). Still open, as on
    `/search`; nothing produces such a range today.

## Out of scope here

-   The slide animation, the grid layout, the unfold of the hero - visual or browser only.
-   The search bar and autocomplete (part 4).

## Noted, pinned as today

-   A new category code keeps the sort the visitor picked on the previous category
    (`CategoryPage.tsx:81-86` resets page and facets only). Possibly intended - a shopper sorting by
    price keeps it while browsing - and not stated by a spec.
