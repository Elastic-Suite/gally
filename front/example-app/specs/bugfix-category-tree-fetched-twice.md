# Bugfix: two `getCategoryTree` requests per category or product page

## Status: implemented

## Page/Component: app/[locale]/layout.tsx

## Problem

Every category and product page asked the API for the same category tree twice on the server. The
locale layout called the plain `fetchCategoryTree` (`app/[locale]/layout.tsx`), while the category and
product pages - and `missingInCatalog` - call `cachedCategoryTree`, React's per-request `cache()`
around the same function (`src/sdk/server.ts`). Two different functions, so `cache()` could not share
the answer.

Measured from the router access log, one page load, requests sent by the example server:

| Page                                            | GraphQL POSTs before     | after |
| ----------------------------------------------- | ------------------------ | ----- |
| `/com_en/category/cat_8`                        | 3 (tree, tree, products) | 2     |
| `/com_en/product/VA02`                          | 3 (tree, tree, product)  | 2     |
| `/com_en/cart` (only the layout needs the tree) | 1                        | 1     |

Reported by another working session on 2026-10-23; confirmed and fixed here.

## Behaviour (testable)

-   [x] The locale layout fetches the tree through `cachedCategoryTree`, like every other server caller,
        so one page render sends one `getCategoryTree`.
-   [x] Checked by `src/test/routes.test.tsx` (the layout uses `cachedCategoryTree` with the resolved
        ids, never the plain `fetchCategoryTree`) and by the router-log count above.

## Tracking (required)

-   No change.

## MUST NOT change

-   Server code reads the category tree only through `cachedCategoryTree`. A direct `fetchCategoryTree`
    call on the server is a second request per page.
