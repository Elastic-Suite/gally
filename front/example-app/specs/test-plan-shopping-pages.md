# Test plan: the shopping pages

## Status: implemented - 73 tests in `src/test/product-page.test.tsx` (20), `cart-checkout.test.tsx` (19), `home-blog.test.tsx` (34), all passing

The shopping pages not covered yet: the product page, the cart, the checkout, the homepage, the blog
list and the blog article. About 900 untested lines (`src/views`), the largest remaining gap after
search and listing. Pages rendered in jsdom with the fake search manager, recommender, tracker and
router of the earlier tests; heavy children stubbed where tested elsewhere.

About 45 tests in 3 files (`product-page`, `cart-checkout`, `home-blog`). Most ticked spec lines match
the code; several specs have every box unticked although the code matches - these tests will tick them.

## Decisions

All four decided 2026-10-23: (b), and the tracked order total includes shipping.

1. **Checkout total leaves out shipping.** The cart shows items + 4.90 shipping under 180
   (`CartPage.tsx:187`); checkout shows, charges ("Place order <amount>") and tracks the items total
   only (`CheckoutPage.tsx`, `formatPrice(total)`, `trackOrder(orderId, total, ...)`), with no shipping
   line. The shopper sees a lower amount at checkout than on the cart.
    - (a) Pin it.
    - (b) Fix: one shipping rule shared by both pages; checkout shows the shipping line and the same
      total as the cart. Recommended.
    - If (b): should the ORDER tracking event's `order.total` include shipping (what the shopper pays)
      or stay the items total (merchandise revenue)?
    - **Done:** `bugfix-checkout-total-without-shipping.md`; the ORDER total includes shipping.
2. **Checkout with an empty cart** shows the form and a "Place order 0,00 €" button that "orders"
   nothing - reachable by opening `/checkout` directly or going back after an order.
    - (a) Pin it.
    - (b) Fix: an empty cart shows the cart's empty state (title, browse link) instead of the form.
      Recommended.
    - **Done:** `bugfix-checkout-empty-cart.md`.
3. **A dead wishlist button on the product page** (`ProductPage.tsx:295-298`): no click handler, no
   accessible name - it looks clickable and does nothing.
    - (a) Pin it. (b) Remove it. (c) Keep the look, but make it honest: disabled with a "coming soon"
      name. Recommended: (b).
    - **Done:** removed, `bugfix-product-wishlist-dead-button.md`.
4. **Accessibility gaps** of the same kind as the earlier fixes:
    - checkout inputs named only by their placeholder (`CheckoutPage.tsx:86-152`);
    - the checkout stepper has no `aria-current` on the active step;
    - the blog filter chips are buttons with no `aria-pressed`, and their row labels are not linked to
      them (`BlogPage.tsx:103-155`).
    - (a) Pin. (b) Fix all three, one spec, tests by role. Recommended: (b).
    - **Done:** `bugfix-checkout-blog-accessibility.md` (the checkout inputs got an `aria-label`, not a
      visible label, to keep the look).

All four checked on the running stack too: cart and checkout both show 48.00 + 4.90 = 52.90, the
ORDER event sent `total: 52.9`, an empty `/checkout` shows the empty cart, no wishlist button.

## A - Product page

-   Seeded by the server: no request; without a seed, the exact-SKU request, the skeleton, then the page
    or "not found".
-   What it shows: name, SKU, price with the struck original price only when discounted, badges,
    materials, the stock line (in stock with a count, in stock, out of stock), the breadcrumb ending on
    the product name.
-   Variants: nothing pre-selected; picking an option checks it. Add to cart is disabled only when
    unavailable, not gated on the variant choice - by spec (`feature-configurable-option-selection.md`).
-   Add to cart: SKU, name, price, image, the chosen labels joined with " / " (none chosen: no variant),
    no child SKU; then the "added" feedback.
-   One VIEW product event per SKU; recommendations: related products first, cross-sell when empty, 6,
    the block hidden when both are empty.

## B - Cart and checkout

-   The cart waits for the saved cart (`ready`) - no flash of the empty state; empty: the browse link to
    the catalog's default listing.
-   Lines: name, variant, quantity, line total; + / - / remove act on that line only, variant included
    (bugfix-cart-variant-line-identity); the buttons are named.
-   Summary: subtotal, shipping 4.90 or free from 180, total; the free-shipping bar; checkout button.
-   Cart recommendations: cross-sell seeded with the cart's SKUs, 8, hidden when empty.
-   Checkout: three steps, demo values prefilled; placing the order sends one ORDER event with the
    lines, empties the cart, shows the confirmation. Total and empty cart: decisions 1 and 2.

## C - Homepage and blog

-   Homepage: the hero per catalog and its call to action (a search for the shop's query, else the root
    category); two product rows (the root category, then the third or second category), 3 products, a
    skeleton while loading; the second row hidden when empty (the first is not - pinned, noted); promo
    cards; the vector block's example queries linking to `/vector-search?q=`; one DISPLAY for the first
    row only.
-   Blog list: 10 per page, newest first; type and topic filters from the aggregations; a filter change
    writes the URL and goes back to page 1, a selected chip clicked again clears it; pagination; the
    skeleton and empty state; one DISPLAY per page of articles.
-   Blog article: fetched by id, the content, tags and back link, "not found" with a back link, one VIEW.

## Outcome

-   34 deliberate breaks, run in `/tmp` copies, all caught in the end. Two needed a better test first:
    -   the product VIEW sent on every render: the guard only matters when the effect runs twice, so a
        strict-mode test now renders once with `reactStrictMode: true`;
    -   the vector block showing its control query: hidden by the cut to three on `com_en`; a `com_fr`
        test (three queries) now catches it.
-   The page hooks (`useSearch`, `useCmsSearch`, `useTracking`) are fakes in `home-blog`; they have
    their own tests.
-   Pinned as today, noted: the ORDER line's `child_sku` falls back to the parent SKU without a
    variant; the variant label follows axis order, not click order; clearing the only blog chip
    pushes `/blog?` with a trailing `?` (works, untidy).

## Out of scope here

-   Layout and look (sticky summary, image fill, badge stacking, hover states).
-   The demo screens (vector search page, closing page) and the disabled explain screen.

## Noted, pinned as today

-   The homepage's first row shows its heading even with no products; the second row hides.
