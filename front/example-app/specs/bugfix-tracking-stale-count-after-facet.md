# Bugfix: a facet change sent the listing event twice, the first with the old count

## Status: implemented

## Page/Component: src/hooks/useSearch.ts, src/hooks/useTrackSearch.ts, src/views/CategoryPage.tsx, src/views/SearchPage.tsx, src/views/VectorSearchPage.tsx

## Problem

Ticking a facet on a category page sent two VIEW events. Browser trace, `cat_8`, ticking "Sweaters":

| Event           | `item_count`                    | `filters`               |
| --------------- | ------------------------------- | ----------------------- |
| VIEW category   | 24 - the count before the facet | `category__id = cat_10` |
| VIEW category   | 12                              | `category__id = cat_10` |
| DISPLAY product | 12 items                        |                         |

Root cause: the "settled" checks of `bugfix-category-view-stale-count.md` and
`bugfix-search-zero-result-tracking.md` only asked whether the result belonged to the same category
(`resultCategory === code`) or query (`resultQuery === query`). After a facet change the result still
does - it is just the result for the old facets - so for one render the page paired the new facets
with the old count, then sent the right event once the results arrived. The same gap existed for a
sort or page change, hidden only because the count usually does not change with them. The SDK queue
was not involved: it sent exactly what the app gave it.

The page tests (`page-tracking.test.tsx`) missed it because their fake API returned the same count
whatever the facets, so the stale event and the right one were identical and the second was deduplicated.

The wrong belief: "same query or category" means "the result for these options".

## Behaviour (testable)

-   [x] `useSearch` records, for each result, the key of the request it answers (query, category,
        page, sort, page size, facets) and exposes `settled`: not loading, no error, and that key equals
        the current options' key.
-   [x] The category VIEW and the `/search` SEARCH are sent only when `settled`. A facet, sort or page
        change sends one event, with the new count.
-   [x] `useTrackSearch` takes `settled` instead of its own loading / failed / result-query check;
        `/vector-search` computes it from its keyword panel.
-   [x] The page tests' fake API returns a different count once facets apply, and expect a single event
        per change.

## Tracking (required)

-   SEARCH and VIEW (category): no longer sent with the previous options' count. Payload unchanged.

## MUST NOT change

-   "Settled" means the result answers the current options exactly - never only the same query or
    category.
-   One event per facet, sort or page change.
