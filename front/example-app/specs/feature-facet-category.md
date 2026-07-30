# Feature: Category facet

## Status: implemented
## Page/Component: src/components/Facets.tsx (`CategoryFacet`)

## Behaviour (testable)
- [x] When `aggregations` includes an entry with `type === 'category'`, it renders as its own facet group
      (label from `aggregation.label`, e.g. "Category") instead of falling into the generic checkbox facet.
- [x] Each option is a checkbox row (`facet-option`/`count`, reusing existing styling) showing category name
      and product count.
- [x] Single-select: clicking an unselected option sets it active and deselects any other value for this
      field; clicking the already-active option clears the filter. `active` is compared as `active === opt.value`
      (a plain string), not an array — this field only supports one value at a time.
- [x] Selecting an option calls `onFilterChange(field, value)` same as any other facet; the page's existing
      filter-array builder (`CategoryPage.tsx`/`SearchPage.tsx`) already falls through to `{ [field]: { eq: value } }`
      for non-array/non-range/non-boolean values — no page-level changes were needed.

## SDK contract used
- No new SDK calls. Consumes `aggregation.type === 'category'` and `aggregation.options[].{label,value,count}`
  already returned by `SearchManager.search()` via `Response.getAggregations()`.
- Filter sent to the API: `{ category__id: { eq: <categoryId> } }` — confirmed via live GraphQL query and the
  Gally wiki ("Category: Uses `eq` operator on `category__id`"). `in` is not used/confirmed for this field.

## Tracking (required)
- No new tracking event. Selecting a category facet value re-triggers the existing search, which re-fires
  `trackDisplay`/`trackCategoryView`/`trackSearch` exactly as any other filter change does today.

## UI constraints
- Reuses `.facet-group`/`.facet-title`/`.facet-option`/`.count` — no new CSS classes, no new visual primitive.

## MUST NOT change
- Other facet types (`slider`, `boolean`, `checkbox`/generic, color swatch) — `CategoryFacet` is dispatched
  before the generic branch and returns early, so it cannot affect their rendering.
