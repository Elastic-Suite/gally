# Bugfix: category VIEW sent with the previous category's count

## Status: implemented

## Page/Component: src/views/CategoryPage.tsx, src/hooks/useSearch.ts

## Problem

Moving from one category to another, there is one render where the page already has the new
category code but still shows the previous category's result: `useSearch` only sets
`loading: true` inside its own effect. The category tracking effect ran in that render, so Gally
could receive a VIEW for the new category with the previous category's `item_count` and sort,
followed by the correct VIEW once the results arrived - two events for one page view, the first
wrong. Same fault as `bugfix-search-zero-result-tracking.md` on the search pages.

## Behaviour (testable)

-   [x] `useSearch` reports which category its result belongs to (`resultCategory`), next to
        `resultQuery`.
-   [x] The category VIEW is sent only when the result is settled: not loading, no error, and
        produced for the category on screen.
-   [x] Unchanged on purpose - decided 2026-10-23: a listing with zero results still sends no VIEW
        (`total > 0`). Option facets cannot produce zero results, since every option shown has a
        count above zero; the price slider (a range in a price gap) and an empty category can, and are
        left untracked.

Checked by `src/test/track-search.test.tsx` (`resultCategory` in `useSearch`) and the full suite.
The page wiring is covered by `src/test/page-tracking.test.tsx`, which renders `SearchPage` and
`CategoryPage` with a fake search manager and tracker and acts as a visitor.
Not checked in a browser.

## Tracking (required)

-   VIEW (category): same payload. No longer sent with a result left over from the previous
    category, nor for a failed request.

## MUST NOT change

-   The category key stays category, page, total and sort (`feature-tracking-sort.md`).
-   The `total > 0` guard stays until someone decides empty listings should be tracked.
