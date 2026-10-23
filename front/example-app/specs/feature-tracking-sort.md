# Feature: real sort in the tracking events

## Status: implemented

## Page/Component: src/hooks/useTracking.ts, src/hooks/useTrackSearch.ts, src/views/SearchPage.tsx, src/views/CategoryPage.tsx, src/views/VectorSearchPage.tsx

## Problem

The SEARCH event and the category VIEW event both carry `product_list.sort_order` and
`product_list.sort_direction`, but the storefront always sent fixed values - `relevance` / `desc` for
a search, `position` / `asc` for a category - whatever the visitor picked. A sort chosen in the
dropdown never reached Gally. Changing the sort also sent no event at all, because the tracking key
was query (or category), page and total, and a sort change keeps all three.

Gally does not define a vocabulary for `sort_order`: the API only checks it is a string and stores it
as a keyword (`gally-standard/src/Tracker/Validator/AbstractEventValidator.php`,
`Migrations/Version20260107143005_Add_Tracker_Event_Source_Field.php`). The sample tracking data uses
`relevance` and `position` only.

## Behaviour (testable)

-   [x] `sort_order` names the sort actually used. The two defaults keep the words already in Gally
        and in the sample data - `_score` is sent as `relevance`, `category__position` as `position` -
        and every other sort is sent as its field code (`price__price`, `name`, ...). Decided
        2026-10-23.
-   [x] `sort_direction` is the direction actually used.
-   [x] Search: the sort is the one the page requests - the visitor's pick, or `_score` descending.
-   [x] Category: the visitor's pick; with no pick, the sort the API reports it applied
        (`appliedSort`), since a category can have its own default; `position` ascending when the
        API reports none.
-   [x] Vector search: its keyword side always searches `_score` descending, and says so.
-   [x] Changing the sort sends a new event on `/search` and on a category page. Decided 2026-10-23.
-   [x] `trackingSortOrder()` in `src/hooks/useTracking.ts` does the code-to-word mapping, in one place.

Checked by `src/test/state-tracking.test.tsx`, `src/test/track-search.test.tsx` and the full suite.
The page wiring is covered by `src/test/page-tracking.test.tsx`, which renders `SearchPage` and
`CategoryPage` with a fake search manager and tracker and acts as a visitor.
Not checked in a browser: the events in the expert-mode panel and in the network calls.

## Tracking (required)

-   SEARCH and VIEW (category): `product_list.sort_order` and `sort_direction` now follow the page.
    No other field changes. `product_list.filters` was filled later, in `feature-tracking-filters.md`.

## MUST NOT change

-   `relevance` and `position` stay the names of the two default sorts, so the events already in Gally
    and the new ones group together.
-   A sort change is a new SEARCH on `/search` (key: query, page, total, sort) and a new VIEW on a
    category page (key: category, page, total, sort). `/vector-search` keeps one SEARCH per catalog and
    query.
-   The zero-result and settled-result rules of `bugfix-search-zero-result-tracking.md` are unchanged.
