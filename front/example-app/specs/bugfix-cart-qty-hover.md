# Bugfix: cart quantity buttons react to hover

## Status: implemented
## Page/Component: src/styles.css (`.cart-item-qty button`)

## Problem
The - and + buttons on each cart line had no hover state, while the remove button beside them
(a `.btn-outline`) turns indigo on hover. The stepper was styled on its own
(`.cart-item-qty button`) and never got a `:hover` rule.

## Behaviour (testable)
- [x] Hovering - or + turns its border `--indigo-500` and its glyph `--indigo-600`, like `.btn-outline:hover`.
- [x] At rest the buttons are unchanged: white, `--gray-300` border, 28px circle.

Verified 2026-09-25 with Playwright on the real cart: border rgb(224,224,224) at rest,
rgb(63,81,181) border and rgb(57,73,171) glyph on hover.

## MUST NOT change
- The quantity handlers, which pass `item.variant` (`specs/bugfix-cart-variant-line-identity.md`).
