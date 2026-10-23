# Bugfix: the autocomplete was invisible to screen readers

## Status: implemented

## Page/Component: src/components/SearchBar.tsx (the input), src/components/SearchOverlay.tsx (columns and rows), src/locales/\*/search.json

## Problem

The search bar and its panel had no combobox semantics. The input had no `role="combobox"`,
`aria-expanded`, `aria-controls` or `aria-activedescendant`, and its only name was its placeholder; the
panel had no `listbox` or `option` roles, and every row was a clickable `<div>`. The arrow keys moved a
highlight a sighted keyboard user could see, but a screen reader announced nothing - not that a list
opened, not which item was highlighted. Found while planning the search bar tests
(`test-plan-search-bar.md`, decision 2, decided 2026-10-23: fix before the tests).

## Behaviour (testable)

-   [x] The input is a `combobox` with a name of its own (`search.bar.label`, en / fr / de) and
        `aria-autocomplete="list"`.
-   [x] While the columns are on screen (2 characters or more): `aria-expanded="true"`, and
        `aria-controls` lists the three column listboxes. Under 2 characters (the prompt, no list),
        or closed: `aria-expanded="false"` and no `aria-controls`.
-   [x] The keyboard highlight is `aria-activedescendant`: the id of the highlighted row, none when
        nothing is highlighted.
-   [x] Each column is a `listbox`, named like its mobile tab (suggestions, products, articles); each
        row is an `option` with a stable id (`acp-option-` + the encoded item key, shared by both
        components through `acpOptionId`) and `aria-selected` on the highlighted one.
-   [x] Rows whose visible content is noisy carry a clear name: an attribute value is
        "<attribute>: <value>", a product its name.
-   [x] Same look and same keys: the arrows, Enter, Escape and the mouse behave as before.

Checked by `src/test/search-bar.test.tsx`. Not checked with a real screen reader.

## Known limit

-   A product row holds its quick-add button, so the option contains a button - a nested control that
    screen readers do not announce well. The keyboard path to a product is Enter on its row, which
    opens the product page; restructuring the row was left out of this fix.
-   Section titles (popular terms, an attribute name, categories...) stay plain text inside the
    listboxes rather than `group`s: wrapping the sections would add boxes inside the column layout.
    The attribute options carry their attribute name instead.

## MUST NOT change

-   The highlight a screen reader hears is the highlight on screen: one source, `highlightedKey`,
    feeds both the CSS class and `aria-activedescendant` / `aria-selected`.
-   Option ids come from `acpOptionId`, in both components; never build them separately.
