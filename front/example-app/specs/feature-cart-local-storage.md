# Feature: Cart kept in localStorage

## Status: implemented
## Page/Component: src/contexts/CartContext.tsx, src/views/CartPage.tsx

## Problem
The cart lived only in React state. A full page reload, a typed URL or a new tab emptied it, which in a
live demo loses the story halfway through.

## Behaviour (testable)
- [x] Each catalog has its own cart, saved to `localStorage` under `gally-example-cart:<catalog code>` on
      every change. The French, English and German stores of one catalog share it.
- [x] It is read back in an effect, after mount and on each catalog switch. Not in `useState`'s initializer: the provider also
      renders on the server, and a different first client render would be a hydration mismatch.
- [x] Saving waits until the stored cart of the current catalog has been read (`ready` = the loaded
      catalog is the selected one). The empty first render never overwrites a cart, and right after a
      catalog switch the previous catalog's items are not copied into the new one.
- [x] Switching catalog loads that catalog's cart. Switching back finds the first cart as it was left.
- [x] Stored data is validated (array of lines with a string `sku`, a numeric `price` and `qty > 0`).
      Anything else is dropped, and unreadable JSON gives an empty cart.
- [x] `useCart()` exposes `ready`. The cart page renders an empty container until then, so a reload does not
      flash "your cart is empty".
- [x] Placing an order still clears the cart, which now also clears storage.
- [x] If storage is unavailable (private mode, full quota), the cart still works for the current page view.

## MUST NOT change
- The add-to-cart tracking event fires as before, and only from `addToCart`. Loading the saved cart sends
  no event.
