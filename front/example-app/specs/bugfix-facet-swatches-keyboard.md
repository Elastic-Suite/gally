# Bugfix: colour swatches could not be reached with the keyboard

## Status: implemented

## Page/Component: src/components/Facets.tsx (colour branch of `FacetGroup`), src/styles.css (`.swatch`)

## Problem

Each colour swatch in the facet sidebar was a `<div>` with a click handler: no button role, not in the
tab order, no pressed state, and a name only in its `title` tooltip. A keyboard user could not reach
it, and a screen reader announced nothing useful. Every other facet type already used real
checkboxes. Found while planning the facet tests (`test-plan-facets.md`, decision 1, decided
2026-10-23: fix).

## Behaviour (testable)

-   [x] Each swatch is a `<button type="button">`, in the tab order, so Tab reaches it and Enter or
        Space toggles it.
-   [x] `aria-pressed` says whether the colour is selected; its accessible name is the colour label;
        the tooltip keeps "label (count)".
-   [x] Same values as before: the list with the value added or removed, `undefined` when the last goes.
-   [x] Same look: `.swatch` gains `padding: 0` (a button's default padding is the only visual
        difference) and a focus ring for the keyboard only (`:focus-visible`, a 2px `--indigo-600`
        outline offset by 2px - an outline, because the selected state already uses the indigo
        border).

Checked by `src/test/facets.test.tsx`. Not checked in a browser: the look of the focus ring.

## UI constraints

-   Existing tokens only (`--indigo-600`); no new value.

## MUST NOT change

-   Swatches stay real buttons with `aria-pressed`; never back to a clickable `<div>`.
-   The selected state keeps the indigo border and ring; focus stays an outline, so the two remain
    distinguishable.
