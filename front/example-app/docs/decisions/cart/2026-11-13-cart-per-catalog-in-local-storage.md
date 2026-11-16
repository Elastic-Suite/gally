---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Keep the cart per catalog in localStorage, one line per sku and variant

## Context and Problem Statement

This decision is older than this ADR. It was made in two commits:

-   Commit `5370d2a3` (2026-08-14): a cart line is identified by sku plus variant. See
    `bugfix-cart-variant-line-identity.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-cart-variant-line-identity.md`).
-   Commit `5f21ce78` (2026-09-25): the cart is kept in localStorage. See
    [feature-cart-local-storage.md](../../specs/feature-cart-local-storage.md).

The cart lived only in React state. A reload, a typed URL or a new tab emptied it, which loses
a live demo halfway through.

Separately, `addToCart` deduped lines on sku plus variant, and the cart page keyed rows the same
way. But `removeFromCart` and `updateQty` matched on the sku alone. Removing "Pluie / M" also
deleted "Menthe / L". The bug was hidden until the variant selector started working.

Where should the cart live, and what identifies one line?

## Considered Options

-   Read the stored cart in `useState`'s initializer
-   Read the stored cart in an effect after mount

No alternative storage to localStorage was recorded.

## Decision Outcome

Chosen option: "Read the stored cart in an effect after mount", because the cart provider also
renders on the server. A first client render that differs from the server is a hydration
mismatch.

-   Each catalog has its own cart, under `gally-example-cart:<catalog code>`. The French, English
    and German stores of one catalog share it.
-   Saving waits until the current catalog's cart has been read (`ready`). The empty first render
    never overwrites a cart, and a catalog switch does not copy items across.
-   Stored data is validated. Anything malformed is dropped.
-   Add, remove and quantity change all match a line on sku plus variant. `variant` stays optional.

### Consequences

-   Good, because a reload or a new tab keeps the cart.
-   Good, because two variants of one product can be removed and changed on their own. The
    spec leaves the two-variant browser check unticked, so this is not verified in a browser.
-   Bad, because the cart is empty for one render. The cart page shows an empty container until
    `ready`, so it does not flash "your cart is empty".
-   Neutral, because a fourth notion of line identity, such as a line id, would have to replace all
    three at once.

### Confirmation

-   `grep -n "localStorage" src/contexts/CartContext.tsx` finds reads only inside a `useEffect`.
-   `grep -n "i.sku" src/contexts/CartContext.tsx`: every match also compares `variant`.
-   In the browser, add `VSK12` in two variants, remove one, and the other stays.
