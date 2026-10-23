# Feature: applied facets in the tracking events

## Status: implemented

## Page/Component: src/hooks/useTracking.ts, src/hooks/useTrackSearch.ts, src/views/SearchPage.tsx, src/views/CategoryPage.tsx, src/views/VectorSearchPage.tsx

## Problem

The SEARCH event and the category VIEW event both carry `product_list.filters`, and the storefront
always sent `[]`. Two consequences:

-   Gally could not tell a faceted listing from a plain one: the event after a facet looked like the
    same search run again with a different count.
-   Premium term suggestions use only plain searches - they skip events whose `product_list.filters`
    is not empty (`gally-doc/premium/term-suggestion.md`). With `[]` everywhere, every faceted search
    fed the suggestions as if it were plain.

A facet that left the result count unchanged also sent no event, because the tracking key was query
(or category), page, total and sort.

The format is fixed by Gally: a list of `{ name, value }`, both strings (the SDK's
`TrackingEventValidator` and the API's `AbstractEventValidator.php`), stored as keywords and never
parsed. The API's own test sends `{ "name": "fashion_material__value", "value": "47" }`.

## Behaviour (testable)

-   [x] `trackingFilters()` in `src/hooks/useTracking.ts` turns the page's facet state into pairs,
        `name` being the facet's field code:
    -   one option: one pair, the option value;
    -   several options of one facet: one pair per value;
    -   a yes/no facet: `'true'`;
    -   a range (slider facet), decided 2026-10-23: `MIN-MAX`, `MIN-` for "MIN and above", `-MAX`
        for "MAX and below", numbers as sent to the search API (`13.9-50`);
    -   a cleared facet: nothing.
-   [x] Pairs are sorted by name, then value, so the same facets always give the same list.
-   [x] SEARCH (`/search`) and VIEW (category page) send them in `product_list.filters`.
        `/vector-search` has no facets and sends `[]`.
-   [x] Every facet change sends a new event, even when the count does not change - decided
        2026-10-23. The facets are part of the tracking key on both pages.
-   [x] The events pass the SDK's own `TrackingEventValidator`.

Checked by `src/test/state-tracking.test.tsx`, `src/test/track-search.test.tsx` and the full suite.
The page wiring is covered by `src/test/page-tracking.test.tsx`, which renders `SearchPage` and
`CategoryPage` with a fake search manager and tracker and acts as a visitor.
Not checked in a browser.

## Tracking (required)

-   SEARCH and VIEW (category): `product_list.filters` now lists the applied facets. Nothing else
    changes.

## MUST NOT change

-   One pair per selected value, `name` = field code, `value` a string. A range is one pair.
-   Range format `MIN-MAX` / `MIN-` / `-MAX`, the same as the price ranges used elsewhere.
-   A facet change is a new event: query, page, total, sort and facets on `/search`; category, page,
    total, sort and facets on a category page.
