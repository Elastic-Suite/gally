# Bugfix: a wishlist button that did nothing

## Status: implemented

## Page/Component: src/views/ProductPage.tsx, src/locales/\*/product.json

## Problem

The product page had a "Wishlist" button beside Add to cart with no click handler: it looked
clickable and did nothing. The app has no wishlist. Found while planning the shopping-page tests
(`test-plan-shopping-pages.md`, decision 3, decided 2026-10-23: remove it).

## Behaviour (testable)

-   [x] The product page has no wishlist button; Add to cart is the only action.
-   [x] The unused `product.page.wishlist` key is gone from en, fr and de.

## MUST NOT change

-   No button without a working action on the product page. A wishlist comes back as a feature, with
    its own spec, or not at all.
