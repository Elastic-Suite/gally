# Bugfix: Product page looked up SKU via full-text search, not an exact filter

## Status: implemented
## Page/Component: src/pages/ProductPage.tsx

## Problem
`ProductPage.tsx` found the product to display by calling `useSearch({ searchQuery: sku, pageSize: 5 })` — a
`product_search` full-text query using the SKU as query text, ranked by Elasticsearch relevance — then did a
client-side `.find(p => p.source.sku === sku)` over the top 5 results (falling back to `products[0]` if the
exact match wasn't among them). This works in practice because an exact SKU string usually ranks first, but
it's not guaranteed: another product whose text happens to score higher, or a SKU not in the top 5, would
silently show the wrong product or none at all.

## Behaviour (testable)
- [x] The lookup now uses a server-side exact filter: `filters: [{ sku: { eq: sku } }]`, `pageSize: 1`. This
      mirrors the pattern `CategoryPage.tsx` already uses for facet filtering (`{ field: { eq: value } }`).
      Confirmed via GraphQL introspection that `sku` is a valid field on `ProductFieldFilterInput`, and via a
      live query that `search: "VD08"` + `filter: [{sku:{eq:"VD08"}}]` returns exactly that product.
- [x] `searchQuery: sku` is still passed alongside the filter — not for relevance, but because `useSearch`'s
      `requestType` is picked purely by whether `searchQuery` is truthy (`product_search` if truthy, else
      `product_catalog`, which 400s without a `currentCategoryId`). An empty/absent `searchQuery` would flip
      the request back to `product_catalog` and break the no-category product-detail lookup. The `equalFilter`,
      not the query text, is what now guarantees the exact product.
- [x] The client-side `.find()`/fallback-to-`products[0]` logic is gone — `products[0]` is always the correct
      product now, since the filter can only ever match one SKU.

## SDK contract used
- `useSearch.ts`'s existing `filters` option, passed through to `SearchManager.search()`'s `filters` param —
  no SDK/hook changes needed, this was already supported and used elsewhere (`CategoryPage.tsx`).

## Tracking (required)
- No change — `trackProductView(sku)` still fires from the same `useEffect`, unaffected by how the product
  data itself is fetched.

## MUST NOT change
- The recommendations query lower in `ProductPage.tsx` (`useSearch({ pageSize: 8, categoryCode: rootCategory?.id })`)
  — a separate, legitimate category browse, not touched by this fix.
