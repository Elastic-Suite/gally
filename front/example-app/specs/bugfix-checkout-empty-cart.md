# Bugfix: checkout with an empty cart showed the order form

## Status: implemented

## Page/Component: src/views/CheckoutPage.tsx, src/components/CartEmptyState.tsx, src/views/CartPage.tsx

## Problem

Opening `/checkout` with an empty cart - directly, or with the back button after an order - showed
the form and a "Place order 0,00 €" button that sent an ORDER event with no lines. Found while
planning the shopping-page tests (`test-plan-shopping-pages.md`, decision 2, decided 2026-10-23:
show the cart's empty state).

## Behaviour (testable)

-   [x] While the saved cart is read (`ready` false), the checkout renders an empty page - no form,
        no empty-state flash. Same rule as the cart.
-   [x] With an empty cart, the checkout shows the cart's empty state (title, message, the link to the
        catalog's default listing) and no stepper, form or place-order button.
-   [x] The confirmation after an order still shows, although the order emptied the cart.
-   [x] The cart page and the checkout share one empty-state component, `CartEmptyState`.

## Tracking (required)

-   No ORDER event can be sent for an empty cart.

## MUST NOT change

-   The confirmation step is shown after the order, cart empty or not.
