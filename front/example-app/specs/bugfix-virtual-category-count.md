# Bugfix: product count of virtual categories

## Status: implemented - hero checked in Chrome on 2026-10-12 (papershop_fr `cat_llv_54`, toolbox_fr `cat_tbx_85`); chips and nav not checked, the demo has no virtual subcategory

## Page/Component: src/views/CategoryPage.tsx, src/components/CategoryNav.tsx

## Problem

A virtual category (products picked by a rule, not assigned) showed "0 products in this category"
in its hero, and would show "(0)" in the nav flyout and be dropped from its parent's subcategory
chips.

Measured on 2026-10-12: `cat_llv_54` "Sélection éco-responsable" tree count 0, real total 104;
`cat_tbx_85` "Univers 18V sans fil" tree count 0, real total 45. Physical categories match.

**Root cause:** the category tree's `count` is one terms aggregation on `category.id` over all
products (`api/packages/gally-standard/src/Category/Service/CategoryTreeBuilder.php:172-193`). That
only counts products assigned to the category. A virtual category matches products at search time
through its rule, and those products do not carry its id, so its count is always 0. The wrong
belief was that the tree count is the size of the category's listing. The category facet is not
affected: it is computed at search time.

## Behaviour (testable)

-   [x] A virtual category's hero shows the listing's own total ("104 produits dans cette
        catégorie"), not 0.
-   [x] Applying a filter changes the grid count, not the hero count.
-   [ ] A virtual subcategory stays in its parent's chips, without a count.
-   [ ] A virtual subcategory has no count in the nav flyout.
-   [x] Physical categories keep the tree count, unchanged.

## SDK contract used

-   `isVirtual` and `count` from `getCategoryTree` (`src/sdk/catalogs.ts`). The listing total comes
    from `useSearch`, as before.

## Tracking (required)

-   None added or removed.

## UI constraints

-   No new markup or CSS: the count elements are omitted, not restyled.

## MUST NOT change

-   The hero count of a physical category stays the tree count, so it is right on the first
    server-rendered paint.
-   The hero count must not follow filters: it says "in this category". The virtual total is taken
    only from an unfiltered result and remembered per category code.
-   Remove this workaround once the API counts virtual categories (`missing-features.md`).
