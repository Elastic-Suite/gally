# Test plan: the facet sidebar (search and listing, part 2)

## Status: implemented - 28 tests in `src/test/facets.test.tsx`, all passing

Part 2 of the search-and-listing aspect: `src/components/Facets.tsx`, rendered in jsdom with its
props (`aggregations`, `activeFilters`, `onFilterChange`, `loading`, `onLoadMore`, `open`,
`onClose`, `resultCount`) and driven like a visitor - click, type, move a range input. The test
checks what is shown and what `onFilterChange` receives.

About 30 tests in 1 file. Every behaviour line of the facet specs matches the code today (checked
2026-10-23); the layout lines (drawer position, 769 px sidebar, spacing) need a browser and stay out.

Sources: `feature-facet-active-filters.md`, `feature-facet-category.md`, `feature-facet-empty-state.md`,
`feature-facet-hide-single-value.md`, `feature-facet-load-more.md`, `feature-facet-price-slider-sync.md`,
`bugfix-facet-chip-labels-lost.md`, `bugfix-facets-double-wrapper.md`, `bugfix-facets-drawer-in-flow.md`.

## Decision

1. **Colour swatches cannot be reached with the keyboard.** Each swatch is a `<div>` with a click
   handler (`Facets.tsx`, the colour branch of `FacetGroup`): no button or checkbox role, no focus,
   no pressed state, so a keyboard or screen-reader user cannot pick a colour. Every other facet type
   uses real checkboxes.
    - (a) Pin it: the test clicks the `<div>` as it is, and the gap is recorded.
    - (b) Fix first: each swatch becomes a `<button aria-pressed>` with the colour name as its label,
      same look, same `onFilterChange` values - a bugfix spec, then the tests use the button.
    - Recommended: (b).
    - **Decided 2026-10-23: (b), done** - `bugfix-facet-swatches-keyboard.md`. Checked in a browser too:
      the swatches are 28 x 28 buttons named by colour, Enter selects one, the focus ring shows.

## A - Which facets show, and the empty states

-   Facets with 0 or 1 option are hidden, whatever their type; `name` is never shown
    (feature-facet-hide-single-value).
-   Loading with nothing to show: the skeleton, never the empty message.
-   Nothing to show once settled: "no results", "no result with these filters", or "results too
    uniform" with the count - the three cases of `feature-facet-empty-state.md`.
-   The close button appears only with `onClose`, and calls it; `open` reaches the sidebar
    (bugfix-facets-drawer-in-flow, bugfix-facets-double-wrapper).

## B - Each facet type: what a click sends

| Type          | Action            | `onFilterChange` receives                                               |
| ------------- | ----------------- | ----------------------------------------------------------------------- |
| Checkbox      | tick / untick     | the list with the value added / removed; `undefined` when the last goes |
| Colour swatch | click             | same as checkbox (decision 1 decides how the test clicks)               |
| Category      | tick / tick again | that one value / `undefined` (feature-facet-category)                   |
| Yes/no        | tick / untick     | `true` / `undefined`                                                    |
| Slider        | move a handle     | `{ gte, lte }` 400 ms after the last move, never before                 |

-   Slider (feature-facet-price-slider-sync): bounds from the first and last option; the handles keep
    one unit apart; it re-syncs to new bounds or a new active range, clamped; an empty range draws
    full width.

## C - Show more and option search (feature-facet-load-more)

-   5 options, then "show N more" when more are known locally; "show less" folds back.
-   When the API has more (`hasMore`): "show more" calls `onLoadMore(field)` once and shows what
    comes back; nothing is called when everything is already local.
-   The search box appears from 6 options, or when the server can be asked; it filters by label.
-   Before the full list is loaded, typing waits 300 ms and asks `onLoadMore(field, term)`; an answer
    for an older term is dropped.

## D - Active-filter chips (feature-facet-active-filters, bugfix-facet-chip-labels-lost)

-   No chip without an active value; one chip per selected value, one for a range, one for yes/no.
-   Clicking a chip removes only its value; "Clear all" appears from 2 chips and clears each field
    once.
-   Labels: from the full aggregations, so a facet hidden for having one option still names its chip;
    remembered from an earlier response when the facet disappears; the current response wins; a
    value never seen falls back to its raw code. These tick the four boxes of
    `bugfix-facet-chip-labels-lost.md`.

## Outcome

-   **A bug in the chip-label fix, found and fixed:** the remembered labels were never seeded with the
    first `aggregations`, so a page mounting with the server's results forgot them - see the follow-up
    in `bugfix-facet-chip-labels-lost.md`, whose four boxes these tests now tick.
-   Nine deliberate breaks, each made a test fail: the swatch's pressed state removed, single-value
    facets shown, "Clear all" needing 3 chips, the first labels not remembered, the slider committing
    after 300 ms, the search box from 7 options, 6 options before "show more", an older search answer
    applied, the category facet impossible to untick.

## Found and fixed afterwards

-   "Show more" / "Show less" were clickable `<div>`s, and the slider's range inputs had no name.
    Both fixed on 2026-10-23 in `bugfix-facet-show-more-and-slider-names.md`; the tests now reach
    them by role and name, and a browser check confirmed the look and the names.

## Out of scope here

-   Layout: the drawer position and backdrop, the 769 px sidebar, spacing (browser).
-   What the pages do with the values (part 3), the search hooks (part 1).

## Noted, pinned as today

-   The slider's 400 ms timer is not cancelled when the slider unmounts, so a drag can still commit
    just after the facet disappears (for instance when a new response hides it). It applies the
    range the visitor chose, which is arguably right; a test records it.
