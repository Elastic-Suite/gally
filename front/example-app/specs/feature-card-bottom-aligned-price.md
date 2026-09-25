# Feature: Reference and price aligned at the bottom of product cards

## Status: implemented
## Page/Component: src/components/ProductCard.tsx, src/styles.css (`.product-card`, `.product-card-body`, `.product-card-name-link`)

## Problem
A card's height follows its grid row, but its content stacked from the top. A card whose name fit on one
line had its reference and price one line higher than a neighbour whose name wrapped to two lines, so the
prices in a row did not line up.

## Behaviour (testable)
- [x] `.product-card` is a vertical flex box (`display: flex; flex-direction: column`).
- [x] `.product-card-body` fills the height left under the picture (`flex: 1`) and is itself a vertical flex box.
- [x] The name link (`.product-card-name-link`, new class) has `flex: 1` and takes the spare height, so the
      reference (`.product-card-sku`) and price (`.product-card-price`) always sit on the card's bottom edge.
- [x] In one row, a one-line name and a two-line name give reference and price lines at the same height.

## MUST NOT change
- The name is not clamped or truncated. A long name still wraps.
- Picture height, body padding, font sizes and the quick-add band are unchanged.
- Cards in the search results, category page and homepage sliders all get the same behaviour, since they
  share `ProductCard`.
