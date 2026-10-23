# Bugfix: add-to-cart missing from the on-screen event log

## Status: implemented

## Page/Component: src/contexts/CartContext.tsx, app/providers.tsx, src/components/AppShell.tsx

## Problem

The event log panel (expert mode) lists every tracking event the storefront sends - views,
searches, displays, orders - except add-to-cart. Adding a product sent ADD_TO_CART to the tracker
but never wrote the log entry, so a demo of the tracking story skipped its most visible step.

Root cause: `CartContext.addToCart` pushed the event to the SDK tracker itself
(`CartContext.tsx:105-119`) instead of going through `useTracking().trackAddToCart`, which sends the
same event and logs it. It could not do otherwise: `EventLogProvider` was mounted inside `AppShell`,
below `CartProvider` in `app/providers.tsx`, so the cart had no event log to write to.
`trackAddToCart` was left in `useTracking` with no caller. Found by the shared-state tests
(`test-plan-shared-state.md`).

## Behaviour (testable)

-   [x] Adding to the cart writes an `ADD_TO_CART` entry to the event log (`<sku> x<qty>`), as every
        other tracking event does.
-   [x] The event sent to the tracker is unchanged: same type, entity, catalog and payload
        (`cart.qty`, `child_sku` falling back to the SKU).
-   [x] `addToCart` sends it through `useTracking().trackAddToCart`; the cart no longer calls the SDK
        tracker itself.
-   [x] `EventLogProvider` is mounted once, in `app/providers.tsx` above `CartProvider`, and no longer
        in `AppShell`.

Verified by `src/test/state-cart.test.tsx` (the log entry, the unchanged event, the single provider)
and the full suite; the pages still render in the dev stack. Not checked in a browser: the entry
appearing in the expert-mode event panel.

## Tracking (required)

-   ADD_TO_CART: unchanged payload, still fired only from `CartContext.addToCart`.

## MUST NOT change

-   ADD_TO_CART still fires only from `addToCart` (`feature-cart-local-storage.md`), once per add.
-   `EventLogProvider` exists once in the tree. A second one inside `AppShell` would give the panel
    its own empty log, and the cart's entries would vanish again without an error.
