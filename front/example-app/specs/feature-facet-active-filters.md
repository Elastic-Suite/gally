# Feature: Active-filter chip row

## Status: implemented
## Page/Component: src/components/Facets.tsx (`ActiveFilterChips`)

## Behaviour (testable)
- [x] Rendered above the facet list whenever `activeFilters` has at least one defined value. Renders nothing
      (`null`) when there are no active filters.
- [x] One pill per active value: for array-valued fields (checkbox/color swatch multi-select), one chip per
      selected value; for range (slider), boolean, and category (single-value) fields, one chip for the field.
      Chip text is `"<facet label>: <option label or raw value>"` (boolean fields show just the label).
- [x] Clicking an individual chip removes only that value — for array fields it filters the one value out of
      the array (clearing the field entirely if it was the last one); for scalar fields it clears the field.
- [x] "Clear all" appears only when there's more than one chip. It clears every active field **once each**
      directly from `activeFilters` (not by replaying each chip's `onRemove`) — replaying per-chip removal
      would race for multi-value fields, since every chip's closure captures the pre-clear array and computes
      "remove just my one value," so the last dispatched `setActiveFilters` call would win and leave stale
      values instead of clearing. See the fixed bug in git history for the concrete failure case.

## SDK contract used
- No new SDK calls — purely a derived view over the same `aggregations` + `activeFilters` already passed
  into `<Facets>`, used to look up human-readable labels for values.

## Tracking (required)
- No new tracking event — removing a chip calls the same `onFilterChange` as unchecking the option directly,
  which re-triggers the existing search and its existing tracking.

## UI constraints
- New CSS: `.active-filters` (flex row), `.filter-chip` (pill, `--radius-pill`/`--indigo-50`/`--indigo-700`/
  `--font-sans`), `.filter-chip-clear` (neutral variant). Built only from existing tokens in
  `docs/design-system.md` — no new hex/px added.

## MUST NOT change
- Existing per-facet toggle behaviour (checkbox/swatch/slider/boolean/category) — chips only call the same
  `onFilterChange`/`onChange` callbacks those already use.
