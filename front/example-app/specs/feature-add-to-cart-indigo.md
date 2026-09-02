# Feature: Add-to-cart buttons switch from coral to indigo

## Status: implemented
## Page/Component: src/components/ProductCard.tsx, src/views/ProductPage.tsx, src/components/SearchOverlay.tsx, src/views/CartPage.tsx, src/styles.css (comments only)

Every button whose action is "put this in the cart" is now `--indigo-800` instead of
coral. Implemented as a class swap, `.btn-coral` → `.btn-primary`; `.btn-primary` was
already `--indigo-800` with an `--indigo-700` hover, so **no CSS rule was added or
changed** — only two stale comments.

## Behaviour (testable)
- [x] Add-to-cart is indigo in all four places it appears:
      - `ProductCard.tsx` — grid card (`btn-sm`)
      - `ProductPage.tsx` — product detail (`btn-lg`)
      - `SearchOverlay.tsx` — autocomplete product row (`autocomplete-add-to-cart`)
      - `CartPage.tsx` — the bundle "Add pack" button
- [x] Verified computed style in a real browser: `rgb(40, 53, 147)` = `#283593` =
      `--indigo-800`, on both the card and the detail page.
- [x] The autocomplete "added" confirmation still wins over the button's hover state.
      (Since `specs/feature-add-to-cart-feedback-everywhere.md` the green itself lives in a shared
      `.btn.added`, which ties with `.btn-primary:hover` at (0,2,0) and wins on source order
      instead; the four-class ACP selector remains, for its `opacity`/`transform` overrides.)
      Its selector is four classes (0,4,0) and `.btn-primary:hover` is (0,2,0), so it
      beats it on specificity alone — the previous ordering argument against
      `.btn-coral:hover` is no longer load-bearing. Comment in `styles.css` corrected.

## Scope decision
- The **cart bundle** button ("Add pack" / "Ajouter le pack") was included. It adds to
  the cart, and it sat directly beside the frequently-bought-together button, which was
  *already* `.btn-primary`. Leaving it coral would have kept two adjacent add-to-cart
  buttons in different colours on the same page.
- Coral is **kept** for marketing and flow CTAs, which are not add-to-cart: homepage
  hero, cart "Checkout", "Place order", the intro screen and the closing page.

## Design system
- This contradicts the palette table's "coral = primary accent / CTAs", so
  ../docs/design-system.md now records the split explicitly: coral is the *marketing*
  CTA, indigo is the *transactional* one. Without that note the next session would read
  the table and revert these buttons.

## SDK contract used
- None. Presentation only; `addToCart()` calls are untouched.

## Tracking (required)
- No change. `ADD_TO_CART` still fires from the same `useCart().addToCart()` calls in
  all four components — only the className changed.

## UI constraints
- No new token, no new hex, no new CSS rule; an existing button variant is reused.
- Disabled state unchanged: `.autocomplete-add-to-cart:disabled` (0,2,0) still overrides
  `.btn-primary` (0,1,0) with `--gray-400`.

## MUST NOT change
- The out-of-stock/disabled grey and the green `--success` "added" confirmation. Both
  sit on top of the button background and were verified to still win after the swap.
- Coral on the hero, checkout and place-order buttons — the point of this change is the
  distinction between marketing and transactional CTAs, which collapses if everything
  becomes indigo.
