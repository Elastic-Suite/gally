# Bugfix: a configurable could be added from its product page without choosing its options

## Status: implemented

## Page/Component: src/views/ProductPage.tsx

## Problem

On the product page, Add to cart was enabled before any option was picked, so a configurable went
to the cart with no colour or size - a line the shopper cannot have meant. The quick-add on the
grid cards and in the autocomplete already waited for every axis ("Choose options", disabled);
`feature-quick-add-overlay.md` listed the difference as open for a decision. Reported by the user on
2026-10-23. The old reason for not gating - the parent SKU is sent either way - is about tracking,
not about what the shopper is buying.

## Behaviour (testable)

-   [x] A configurable's Add to cart is disabled and reads "Choose options" until every axis has a
        choice; then it reads "Add to cart" and adds the line with its variant.
-   [x] A product with no axis (simple) is not affected: enabled at once, no variant.
-   [x] Out of stock still wins: disabled, "Out of stock", whatever is chosen.
-   [x] Same text as the quick-add (`product.card.chooseOptions`, en / fr / de).
-   [x] The disabled button is grey (`--gray-400`, `cursor: not-allowed`), like the quick-add's - not
        the enabled indigo. Hovering it changes nothing. The out-of-stock button gets the same look.

Checked by `src/test/product-page.test.tsx` and in a browser on `VA02`.

## MUST NOT change

-   No path adds a configurable without a full selection: product page, grid quick-add and
    autocomplete quick-add all gate on every axis.
-   Still no child SKU: the parent SKU is sent, the labels go in `variant`
    (`feature-configurable-option-selection.md`).
