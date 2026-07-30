# Feature: Hide non-discriminant (single-value) facets

## Status: implemented
## Page/Component: src/components/Facets.tsx (`Facets`, `visibleAggregations`)

## Behaviour (testable)
- [x] An aggregation with 0 or 1 option is filtered out of `visibleAggregations` before any facet-type
      dispatch — it never reaches `FacetGroup`/`CategoryFacet`/`SliderFacet`/`BooleanFacet`. Every product in
      the current result set already shares that one value, so showing it (a single checkbox/swatch/category
      row, or a slider whose min equals its max) offers no way to narrow anything — pure noise.
- [x] Applies uniformly across every facet type (checkbox, boolean, swatch, slider, category) — the check is
      on `agg.options.length`, done once at the top of `Facets`, not duplicated per facet-type component.
- [x] Confirmed against live data (`product_search` for "dress" on `com_en`): `category__id`,
      `stock__status`, and `manufacture_location` each returned exactly 1 option and are now hidden;
      `price__price`, `fashion_color__value`, `fashion_material__value`, `fashion_size__value`,
      `fashion_style__value`, `date_of_manufacture` (3+ options each) are unaffected.
- [x] A facet that's hidden this way but still has an *active* filter on it (edge case: filtering narrowed
      it down to 1 remaining option after the user already selected a value) is still removable via the
      active-filter chip row (`ActiveFilterChips` reads `activeFilters` directly, independent of
      `visibleAggregations`'s filtering) — hiding the facet group itself doesn't strand the user.

## SDK contract used
- No new SDK calls — filters the same `aggregations` array already returned by
  `SearchManager.search()`/`Response.getAggregations()`.

## Tracking (required)
- None — purely a rendering filter, doesn't change what gets searched or tracked.

## UI constraints
- No new CSS. Existing `IGNORED_FACETS` (currently just `name`) and the new option-count check are combined
  in one `.filter()` — see `docs/design-system.md`'s facet pattern note.

## MUST NOT change
- Facets with 2+ options must still render exactly as before (no change to `FacetGroup`/`CategoryFacet`/
  `SliderFacet`/`BooleanFacet` themselves — this is a pre-filter, not a per-type change).
