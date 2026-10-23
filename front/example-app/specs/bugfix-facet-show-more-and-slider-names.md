# Bugfix: "Show more" unreachable by keyboard, slider handles without a name

## Status: implemented

## Page/Component: src/components/Facets.tsx (`FacetGroup`, `SliderFacet`), src/styles.css (`.facet-show-more`), src/locales/\*/facets.json

## Problem

Two accessibility gaps left after `bugfix-facet-swatches-keyboard.md`, found by the facet tests
(`test-plan-facets.md`) and decided 2026-10-23: fix both.

-   "Show more" and "Show less" were `<div>`s with a click handler: not in the tab order, not
    announced as buttons, so a keyboard user could not open a long facet list.
-   The slider's two range inputs had no accessible name: a screen reader announced two unnamed
    sliders, with no way to tell the minimum from the maximum.

## Behaviour (testable)

-   [x] "Show more" / "Show more (N)" / "Show less" are `<button type="button">`, reachable with Tab
        and activated with Enter or Space; same text, same action.
-   [x] `.facet-show-more` keeps its text-link look: the button's default background, border, padding
        and font are removed, it stays a block; keyboard focus shows the same outline as the swatches.
-   [x] The range inputs are named from the facet label: "Minimum {{label}}" / "Maximum {{label}}"
        (`facets.rangeMin` / `facets.rangeMax`, in en, fr and de - "{{label}} minimum",
        "{{label}}: Minimum", ...).

Checked by `src/test/facets.test.tsx` (by role and name now) and the translation tests.

## UI constraints

-   Existing tokens only (`--indigo-600` for the focus outline).

## MUST NOT change

-   Every clickable control in the facet sidebar is a real button, checkbox or range input with a
    name. A clickable `<div>` or `<span>` is the bug this spec fixed, twice.
