# Bugfix: Active-filter chips lose their labels when the facet leaves the response

## Status: implemented

## Page/Component: src/components/Facets.tsx (`Facets`, `ActiveFilterChips`)

## Problem

Select a category in the category facet, then add another filter that leaves every matching product in
that one category. The category chip turns from "Category: Shoes" into the raw field code and option value
(e.g. "category\_\_id: cat_12").

Root cause: `ActiveFilterChips` looked up labels in `visibleAggregations`, the list already stripped of every
facet with 0 or 1 option (see `feature-facet-hide-single-value.md`). Once the second filter narrows the
category facet to the selected value only, that facet is removed from the list and the lookup misses. The
wrong belief, written into that spec, was that the chips read independently of that filtering - they read
`activeFilters` independently, but took their labels from the filtered list. The same miss happens when the
API leaves the aggregation out of the response altogether.

## Behaviour (testable)

-   [x] Chips take labels from the full `aggregations` list, not `visibleAggregations`: a facet hidden for
        having a single option still labels its chip.
-   [x] `Facets` remembers every facet label and option label it has seen while mounted. When the current
        response has no aggregation (or no option) for an active filter, the chip uses the remembered label.
-   [x] Labels from the current response always take precedence over remembered ones.
-   [x] A value that was never seen in any response still falls back to the raw code, as before.

## SDK contract used

-   No new SDK calls. Same `aggregations` from `SearchManager.search()`.

## Tracking (required)

-   No change.

## UI constraints

-   No CSS change.

## Follow-up (2026-10-23)

-   [x] The remembered labels are seeded with the first `aggregations` the sidebar mounts with. They
        were only stored when `aggregations` changed, so a page that mounts with the server's results
        (a category page does) forgot those labels, and a facet that then left the response showed
        its raw code - the case this fix was for. Found by `src/test/facets.test.tsx`.
-   [x] The four behaviour lines above are checked by `src/test/facets.test.tsx` (part D).

## MUST NOT change

-   `visibleAggregations` still hides 0/1-option facets from the facet list and still drives the skeleton
    and the empty-state message.
-   Chip removal and "Clear all" behaviour (`feature-facet-active-filters.md`).
-   The remembered labels are kept in state, updated during render when `aggregations` changes - not in a
    ref read during render, and not via setState in an effect (both are flagged by the react-hooks rules in
    eslint-config-next 16, and the effect version would flash the raw code for one frame).
