# Bugfix: the phone filter drawer stayed in the page

## Status: implemented

## Page/Component: src/styles.css, src/views/CategoryPage.tsx, src/views/SearchPage.tsx, src/components/Facets.tsx, src/components/skeletons.tsx

## Problem

On phones and tablets (768px and below), category and search pages showed a blank block of about
1000-1100px between the "Filters" button and the products. At exactly 768px a strip of the facet
list showed at the left edge.

Root cause: the `@media (max-width: 768px)` rule that turns `.facets-sidebar` into an off-canvas
drawer (`position: fixed`, `translateX(-100%)`) came **before** the base `.facets-sidebar` rule in
`styles.css`. Both have the same specificity, so the later base rule won and set
`position: sticky` back. The drawer was drawn off-screen but stayed in the flow, taking its full
height. The belief was "the media query overrides the base rule"; it only does when it comes
after it, or is more specific. `feature-larger-product-grid.md` had diagnosed this and left it for
its own spec.

Three more defects sat behind the gap:

-   The category page's "Filters" button had no `onClick`, so its drawer could never open.
    The search page wired it correctly.
-   The open drawer had no way to close: no close button, nothing behind it to tap.
-   On the category page the single phone column was `1fr`, which cannot shrink below its widest
    content, so the product grid ran 38px past the right edge at 390px.

## Behaviour (testable)

-   [x] At 768px and below, category and search pages show no gap: the product count and grid follow
        the "Filters" button directly.
-   [x] "Filters" opens the drawer on the category page and on the search page.
-   [ ] The open drawer has a close button and a dimmed backdrop; both close it.
-   [x] The category page's product grid fits the viewport at 360 and 390px (no horizontal scroll).
-   [ ] The loading skeleton of a category page shows the same: no in-flow sidebar on phones.
-   [ ] From 769px up, the 280px sticky sidebar is unchanged.

Verified 2026-10-09 with `mockups/mobile-layout-implemented` (screenshots of the running app,
catalog `com_en`) and a Playwright measure of `scrollWidth` against the viewport at 360, 390 and
768px. Not verified, hence unticked: the close button and the backdrop actually closing the drawer
(both render; neither was clicked), the loading skeleton on a phone, and the 769px-up sidebar
pixel for pixel (it was checked by eye at 1024 and 1280px; the earlier baseline used catalogs no
longer loaded).

## SDK contract used

-   None changed. The facets keep their requests and `aggregations`.

## Tracking (required)

-   None changed.

## UI constraints

-   The close button is an icon button with `standalone` and a `.visually-hidden`
    `common:actions.close` label (`docs/design-system.md`).
-   Backdrop colour is the existing `--scrim-light` token.

## MUST NOT change

-   The base `.facets-sidebar` rule keeps `position: sticky` with `top: 1rem`
    (`feature-header-scrolls-with-page.md`). Only the 768px drawer rule is made to win.
-   `.catalog-page` keeps its 280px sidebar column from 769px up, and the product grid keeps
    `minmax(min(var(--product-grid-column), 100%), 1fr)`. The `minmax(0, 1fr)` fix lives only in the
    768px `.catalog-page` rule; no token changes (`feature-larger-product-grid.md`).
-   `Facets` keeps its internal structure and its `open` prop; it only gains an optional `onClose`
    (supersedes in part `bugfix-facets-double-wrapper.md`, which recorded the category page's
    `<Facets>` usage as correct).
-   The active-filter chips still render in the empty state (`feature-facet-empty-state.md`).
-   The skeleton keeps the `.catalog-page` wrapper and a sidebar (`feature-navigation-loading-feedback.md`).
