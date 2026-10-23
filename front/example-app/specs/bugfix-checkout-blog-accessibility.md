# Bugfix: checkout fields, checkout steps and blog filters for assistive technology

## Status: implemented

## Page/Component: src/views/CheckoutPage.tsx, src/views/BlogPage.tsx

## Problem

Three gaps of the same kind as `bugfix-facet-swatches-keyboard.md`, found while planning the
shopping-page tests (`test-plan-shopping-pages.md`, decision 4, decided 2026-10-23: fix all three):

-   the checkout inputs were named only by their placeholder, which disappears as soon as a field
    holds a value - and every field is prefilled;
-   the checkout stepper did not say which step is the current one;
-   the blog filter chips did not say which one is selected, and the "Type" / "Topic" labels were not
    tied to their chips.

## Behaviour (testable)

-   [x] Every checkout input has a name of its own (`aria-label`, the same translated text as its
        placeholder), so it is found by role and name with a value in it.
-   [x] The active checkout step carries `aria-current="step"`; the others carry none.
-   [x] Each blog chip row is a `group` named by its visible label (Type, Topic).
-   [x] Each blog chip has `aria-pressed`: true on the selected one ("All" when nothing is selected).
-   [x] Same look: no visible change on any of the three.

## MUST NOT change

-   The selected chip a screen reader hears is the selected chip on screen: one condition feeds both
    the `filter-chip-selected` class and `aria-pressed`.
