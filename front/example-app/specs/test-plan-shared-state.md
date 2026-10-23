# Test plan: shared app state

## Status: implemented - 62 tests in `src/test/state-*.test.tsx`, all passing, no React warnings

Fourth aspect of the test suite: the state every page shares - the cart, the catalog switch, the
navigation feedback, the guided demo - and the tracking events state changes send. These are the
first tests that render: each provider is mounted in jsdom with `next/navigation`, `next/link`'s
`useLinkStatus` and the SDK tracker replaced by fakes, and driven through its hooks.

About 60-70 tests in 5 files. The specs agree with the code on every state line (checked
2026-10-22); the only drift is old line numbers in three specs.

Sources: `feature-cart-local-storage.md`, `bugfix-cart-variant-line-identity.md`,
`feature-add-to-cart-feedback-everywhere.md`, `feature-checkout-single-step.md`,
`feature-catalog-switch-missing-target.md`, `feature-navigation-loading-feedback.md` and its
successor `bugfix-ssr-product-list-behind-suspense.md`, `feature-quick-add-overlay.md`,
`feature-configurable-option-selection.md`, `feature-guided-demo-rebuild.md`.

## Decision

1. **Switching catalog on the search page drops the query.** The switch rebuilds the URL from
   the pathname only (`src/contexts/CatalogContext.tsx:58-75`), so `/com_fr/search?q=robe` becomes
   `/com_en/search`. No spec mentions it.
    - (a) Intended: results differ per catalog, start clean. The test pins it.
    - (b) A bug: keep `?q=` (and only `q`) across the switch. A code change and a spec line first.
    - Decided 2026-10-22: (a), intended. The test pins it.

## A - Cart (`src/contexts/CartContext.tsx`)

-   **Storage per catalog** (feature-cart-local-storage): the cart is read after mount, not during
    render; `ready` stays false until then; each catalog has its own key
    (`gally-example-cart:<catalog code>`, so `com_fr` and `com_en` share one cart); switching
    catalog loads the other cart and never copies the old one into it; every change is saved.
-   **Bad stored data**: broken JSON or a non-list gives an empty cart; entries without a string SKU,
    a numeric price or a positive quantity are dropped. A storage that throws does not break the cart.
-   **Line identity** (bugfix-cart-variant-line-identity): the same SKU and variant add up; another
    variant of the same SKU is its own line; a repeated add keeps the first line's name, price and
    image; remove and quantity change act on one line only; a quantity of 0 or less removes it.
-   **Totals and clearing**: total and item count; `clearCart` empties the cart and its storage.
-   **ADD_TO_CART event**: one event per add, from `addToCart` only, with the quantity, the
    localized catalog, and `child_sku` falling back to the parent SKU. A tracker that throws does
    not stop the add.
-   Pinned as today: `addToCart` has no guard against a quantity of 0. No caller passes one - both
    callers (`ProductPage.tsx:268`, `QuickAdd.tsx:96`) use the default of 1.

## B - Catalog switch (`src/contexts/CatalogContext.tsx`)

-   The switch keeps the page and replaces the locale segment: `/com_fr/blog` to `/com_en/blog`, the
    homepage to `/com_en`.
-   It adds `?from=<previous locale>` only where the target can be missing: category, product, blog
    article (feature-catalog-switch-missing-target). Not on `/blog`, the homepage or search.
-   It navigates through `useNavigate`, so the loading feedback shows.
-   `setCatalog(code)` goes to that catalog's default localized catalog; an unknown code does nothing.
-   On the search page the query is dropped: `/com_fr/search` goes to `/com_en/search` (decision 1).

## C - Navigation feedback (`src/contexts/NavigationContext.tsx`), with fake timers

-   `useNavigate` pushes the given href inside a transition.
-   Pending feedback appears only after 150 ms, never before (MUST NOT lower `SHOW_AFTER_MS`).
-   It clears when the pathname changes, when the link reports it settled, or after 10 s.
-   `LinkPendingReporter` reports a pending link, and does not clear it when it unmounts
    (bugfix-ssr-product-list-behind-suspense MUST NOT).
-   Pinned as today: a navigation to the same pathname (only the query changes) never counts as
    committed, so it relies on the settle report or the 10 s limit.

## D - Tracking events (`src/hooks/useTracking.ts`)

-   Each of the eight track functions sends its event type, entity type and payload: VIEW for a
    category, a product and an article; DISPLAY for product and article lists; SEARCH; ADD_TO_CART;
    ORDER.
-   Every event is also written to the on-screen event log.
-   An empty article list sends no DISPLAY event. An empty product list still sends one (see below).

## E - Smaller state

-   `useAddedFlash`: the "added" state lasts 1.6 s, restarts on a second add, and is cleared on
    unmount (feature-add-to-cart-feedback-everywhere).
-   Guided demo (`DemoContext`): starts with the intro already seen and the `direction` audience
    (guided-demo-rebuild); next and previous stay within the steps; skip and minimise.
-   Event log: newest first, at most 50 entries.
-   `useMounted`: false on the first render, true after.
-   `useLocale` and `useSearchBarRef` throw outside their provider instead of returning nothing.

## Outcome

-   Seven deliberate breaks, each made a test fail: cart lines merged across variants, a saved
    line with quantity 0 kept, `?from=` added on the blog list, the indicator shown after 100 ms,
    the give-up cut to 5 s, a changed search payload, the demo stepping past its last step.

## Found while writing - pinned as today, not changed

-   **Add-to-cart never reached the on-screen event log** - fixed the same day, see
    `bugfix-add-to-cart-event-log.md`.
-   **`trackDisplay` has no empty-list guard**, unlike `trackCmsDisplay` (`useTracking.ts:73`). No
    visitor triggers it: all four callers check `products.length > 0` first (`Homepage.tsx`,
    `CategoryPage.tsx`, `SearchPage.tsx`, `VectorSearchPage.tsx`). The SDK would refuse the event
    anyway (`non-empty-array` rule), by returning a rejected promise that the app does not catch.
-   `addToCart` accepts a quantity of 0; no caller passes one.
-   A navigation that changes only the query string never counts as committed; its indicator
    clears on the link's settle report or after 10 s.

## Out of scope here

-   The checkout page, the quick-add popup and the product page themselves - they belong to the
    component aspects. This plan tests the state they call.
-   Real navigation timing, browser back and forward, hydration: only a browser shows them.
-   The guided tour per catalog: planned in `feature-guided-tour-per-catalog.md`, not built.

## Spec housekeeping noticed (no test impact)

-   `feature-checkout-single-step.md` is marked implemented with every box unticked, though the code
    matches its lines.
-   Old line numbers in `bugfix-cart-variant-line-identity.md`, `feature-guided-demo-rebuild.md` and
    `feature-quick-add-overlay.md` - each spec says which commit it was checked at.
