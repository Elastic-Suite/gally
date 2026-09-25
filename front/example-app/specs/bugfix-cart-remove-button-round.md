# Bugfix: cart remove button is a circle, not an oval

## Status: implemented
## Page/Component: src/views/CartPage.tsx, src/styles.css (`.cart-item-remove`)

## Problem
The remove button on each cart line looked round but was an oval, about 37px wide and 31px tall.
Root cause: it reused `btn btn-outline btn-sm` as-is. `.btn-sm` pads 0.4rem top and bottom but
0.75rem on the sides, and with `--radius-pill` a single glyph in that box gives an oval. A pill
radius only makes a circle when the box is square.

## Behaviour (testable)
- [x] The remove button is a 2rem circle, the "✕" centred, coral.
- [ ] It does not shrink when a long product name takes the room on the line.
- [ ] Clicking it still removes that line (`removeFromCart(item.sku, item.variant)`).

Verified 2026-09-25 on a capture of the real cart at 1440px. Removing a line was not clicked; the
handler is unchanged.

## MUST NOT change
- `.btn-sm` and `.btn-outline` themselves - they are used across the app.
- The remove call and its `item.variant` argument (`specs/bugfix-cart-variant-line-identity.md`).
