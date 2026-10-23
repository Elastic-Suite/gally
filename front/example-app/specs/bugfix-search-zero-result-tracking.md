# Bugfix: zero-result searches never reach Gally from /search

## Status: implemented

## Page/Component: src/views/SearchPage.tsx, src/views/VectorSearchPage.tsx, src/hooks/useTrackSearch.ts, src/hooks/useSearch.ts

## Problem

A search with no result is the signal merchandisers look for first, and the SDK accepts it: a
SEARCH event carries `product_list.item_count`, a required integer with no minimum and no product
array (`TrackingEventValidator.ts:74-85`, `:201-209` in the SDK). Only DISPLAY needs a non-empty
list, because it means "these products were shown".

`/search` never sent it. Its tracking effect fired only when `total > 0` (`SearchPage.tsx:156`).
The guard most likely kept a false "0 results" out while results were loading, since `total` is 0
then - but it also dropped every real zero.

Two more faults sat behind the same effect, on both search pages:

-   **A stale count.** When the query changes, there is one render where the loading flag is still
    false and the result still belongs to the previous query: `useSearch` sets `loading: true`
    inside its own effect (`useSearch.ts:104`), and the vector page's fetch effect does the same
    with `kwLoading`. A tracking effect in that commit sees the new query with the old total.
-   **An error counted as zero results.** On the vector page a failed keyword request returned the
    same empty panel as a real zero (`VectorSearchPage.tsx:270-273`), so the tracking sent
    `item_count: 0` for a search that never ran.

The wrong belief: "not loading" means "the result on screen belongs to the query on screen".

## Behaviour (testable)

-   [x] One shared hook, `useTrackSearch`, sends SEARCH for both pages once the result is settled:
        not loading, not failed, and produced for the query on screen.
-   [x] A settled zero-result search is sent with `item_count: 0`.
-   [x] A failed request sends nothing.
-   [x] A result left over from the previous query sends nothing.
-   [x] The caller decides when a search counts as new, with its own key:
    -   `/search`: query, page and total, as before - decided 2026-10-22 to keep one SEARCH per page
        and per total.
    -   `/vector-search`: catalog and query - paging is not a new search, as before.
-   [x] `useSearch` reports which query its result belongs to (`resultQuery`).

Checked by `src/test/track-search.test.tsx` and the full suite.
The page wiring is covered by `src/test/page-tracking.test.tsx`, which renders `SearchPage` and
`CategoryPage` with a fake search manager and tracker and acts as a visitor. Not checked in a browser: the
events in the expert-mode event panel and in the network log.

## Tracking (required)

-   SEARCH: same payload as before. New: also sent when `item_count` is 0. No longer sent for a
    failed request or a stale result.

## MUST NOT change

-   `/search` keeps one SEARCH per (query, page, total); `/vector-search` one per (catalog, query).
    Changing either changes the counts Gally reports.
-   A zero-result search is tracked. Do not reintroduce a `total > 0` guard: the settled check is
    what keeps a loading state from being reported as zero.
-   DISPLAY still needs at least one product; the callers keep their `products.length > 0` checks.
