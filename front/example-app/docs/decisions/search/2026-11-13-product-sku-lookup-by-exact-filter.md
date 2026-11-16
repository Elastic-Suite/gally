---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Look up a product by its SKU with an exact filter, and keep a search query

## Context and Problem Statement

This decision is older than this ADR. It was made in commit `e8646b29` (2026-08-05). See
`bugfix-product-sku-exact-filter.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-product-sku-exact-filter.md`).

The product page found its product with a full-text search on the SKU, `pageSize: 5`, ranked by
relevance. It then picked the exact SKU among those 5 results, or fell back to the first one.
This usually worked, because an exact SKU tends to rank first. It was not guaranteed: another
product could score higher, or the SKU could fall outside the top 5. The page would then show the
wrong product, or none.

How should the product page find exactly one product from its SKU?

## Considered Options

-   A full-text search on the SKU, then a pick among the top 5 results
-   An exact filter on `sku`

## Decision Outcome

Chosen option: "An exact filter on `sku`", because only a filter guarantees the product.

-   The lookup sends `filters: [{ sku: { eq: sku } }]` with `pageSize: 1`. The first product is
    always the right one, so the client-side pick and fallback are gone.
-   `searchQuery: sku` is still sent, but not for relevance. The SDK picks `product_search` when
    `searchQuery` is truthy, and `product_catalog` otherwise. `product_catalog` answers 400 without
    a `currentCategoryId`, and the product page has no category.
-   Both lookups follow it: `ProductPage.tsx`'s `useSearch` call and the server fetch in
    `src/sdk/server.ts`.

### Consequences

-   Good, because the product page can no longer show another product with a similar SKU.
-   Bad, because `searchQuery: sku` looks redundant. Removing it breaks the page with a 400.

### Confirmation

-   `grep -n "eq: sku" src/views/ProductPage.tsx src/sdk/server.ts` finds one match in each.
-   In both files, the same call passes `searchQuery: sku`.
-   Open a product page by SKU. It shows that product, with no fallback in the code.
