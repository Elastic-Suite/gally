# Bugfix: the checkout total left out shipping

## Status: implemented

## Page/Component: src/views/CheckoutPage.tsx, src/views/CartPage.tsx, src/contexts/shipping.ts

## Problem

The cart adds 4.90 shipping under 180 and shows that in its total. The checkout showed, charged
("Place order <amount>") and tracked the items total only, with no shipping line. The shopper saw a
lower amount at checkout than on the cart, and the ORDER event told Gally less than was paid. Found
while planning the shopping-page tests (`test-plan-shopping-pages.md`, decision 1, decided
2026-10-23: fix, and the tracked total includes shipping).

## Behaviour (testable)

-   [x] One shipping rule, `cartShipping(subtotal)` in `src/contexts/shipping.ts`: 4.90 under 180, free
        from 180. Both pages read it; neither holds its own number.
-   [x] The cart: subtotal, shipping (4.90 or "Free"), total = subtotal + shipping - as before.
-   [x] The checkout shows the same three rows; "Total to pay" and the place-order button show the
        same total as the cart.
-   [x] The ORDER event's `order.total` is the amount paid, shipping included. The lines keep their
        item prices.

## Tracking (required)

-   `trackOrder(orderId, total, lines)`: `total` now includes shipping. Changed on purpose; this
    replaces the "payload unchanged" line of `feature-checkout-single-step.md` for the total only.

## MUST NOT change

-   The cart and the checkout always show the same total for the same cart.
-   The free-shipping threshold and the fee live only in `src/contexts/shipping.ts`.
