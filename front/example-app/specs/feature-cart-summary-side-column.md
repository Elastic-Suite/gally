# Feature: cart totals in a right-hand column

## Status: implemented
## Page/Component: src/views/CartPage.tsx, src/styles.css (Cart block)

The totals recap sat below the cart lines, so with a few products the visitor had to scroll to see
the total and the checkout button. It now sits in a column to the right of the lines, level with
the first one. Chosen from the `cart-summary-float` mockup study (variant A), without the sticky
behaviour the mock tried: the recap stays at the top of the column and scrolls away with the page.

## Behaviour (testable)
- [x] Above 900px wide, the lines fill the left column and the recap card (shipping bar, subtotal,
      shipping, total, checkout button) sits in a 20rem right column, its top level with the first line.
- [x] The cart page is 1100px wide (was 900px), and the recap card is lifted: `--shadow-lg` and
      `--radius-lg`, as in mockup variant C, without its tinted band.
- [x] The recap is not sticky: scrolling moves it with the lines.
- [x] The "Complete your cart" recommendations stay below both columns, full width.
- [ ] At 900px wide and below, the recap drops back under the lines, as before. Not seen: the
      390px capture ends before the recap.
- [ ] The empty cart and the pre-load blank state are unchanged. Not seen; their markup was not
      touched.

Verified 2026-09-25 with the gally-mockup capture (`mockups/cart-summary-implemented`, 1440px
and 390px) and `tsc --noEmit` in the container.

## SDK contract used
- None changed. The cross-sell recommendations request is untouched.

## Tracking (required)
- None on this page changed. Add-to-cart from the recommendations slider still tracks through
  `ProductSlider`.

## UI constraints
- Existing `.cart-item` and `.cart-summary` idioms, no new token or primitive.
- The layout rules sit on the new `.cart-layout` wrapper. `.cart-summary` itself is untouched,
  because `CheckoutPage.tsx` reuses it for the total to pay.

## MUST NOT change
- `.cart-summary`'s and `.cart-page`'s own rules - the checkout page uses both. The width and the
  lift are scoped to `.cart-layout`.
- Cart line identity: rows keyed on `sku` + `variant`, and every call passes `item.variant`
  (`specs/bugfix-cart-variant-line-identity.md`).
- The total animation, the free-shipping bar and the coral checkout button.
- Not sticky. It was tried in the mockup and rejected.
