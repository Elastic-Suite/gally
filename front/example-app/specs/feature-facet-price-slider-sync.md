# Feature: Price slider bounds re-sync (overflow fix)

## Status: implemented
## Page/Component: src/components/Facets.tsx (`SliderFacet`)

## Behaviour (testable)
- [x] `localMin`/`localMax` re-sync to the aggregation's current `[min, max]` whenever it changes (new search
      response — another filter changed, category/search query changed, or this filter was cleared), clamped
      via `Math.min(Math.max(v, min), max)`, preferring the committed `active.gte`/`active.lte` when set.
- [x] Fixes: previously `localMin`/`localMax` were only set once via `useState`'s initial value and never
      revisited, so `leftPct`/`rightPct` (`(localMin - min) / (max - min) * 100`) could land outside 0–100%
      once `min`/`max` shifted under a stale local selection — the colored track (`.price-slider-track-active`,
      absolutely positioned, container has no `overflow: hidden`) then visually spilled outside
      `.price-slider-track-container`.
- [x] Division-by-zero guard: `leftPct`/`rightPct` are computed from `range = max - min`, falling back to
      `0`/`100` when `range <= 0` instead of `NaN`. (Largely moot in practice since
      `specs/feature-facet-hide-single-value.md` already hides any facet with ≤1 option, which is the most
      common way `min === max` would occur — kept as a defensive fallback, not the primary fix.)

## SDK contract used
- None — pure client-side state sync against the existing `aggregation.options` already returned by
  `SearchManager.search()`.

## Tracking (required)
- None — this only affects the slider's visual position/local state, not what gets searched or tracked
  (the debounced `onChange` → `onFilterChange` path is unchanged).

## UI constraints
- No new CSS. No new hardcoded values — clamping is plain arithmetic against the existing `min`/`max` props.

## MUST NOT change
- The debounced drag → `onChange({ gte, lte })` commit behavior for user-initiated slider drags — the
  re-sync effect only reacts to `min`/`max`/`active.gte`/`active.lte` changing, not to every render.
