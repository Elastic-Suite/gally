# Feature: Real recommendations from Gally's Recommender

## Status: implemented
## Page/Component: src/sdk/recommendations.ts (new), src/hooks/useRecommendations.ts (new), src/views/ProductPage.tsx, src/views/CartPage.tsx, src/views/Homepage.tsx, src/locales/{en,fr,de}/{cart,category,demo,scenarios}.json, src/styles.css, DEMO.md

## Problem
An audit found that no product block in the storefront used Gally's recommendation feature:

| Block | Was | Now |
|---|---|---|
| Homepage "Trending Now" | Browse of the root category, first 8. No popularity data exists | Same listing, renamed "Our selection" |
| Homepage second row | First 8 of the first top-level category (variable called `newArrivals`, no date sort) | Unchanged listing, variable `categoryRow`, honest comment |
| PDP "You May Also Like" | The same root-category browse, current SKU removed. Ignored the product | Related products for this SKU, then cross-sell |
| Cart "Complete your look" | A `'*'` search, 4 items. Ignored the cart | Cross-sell for the SKUs in the cart, titled "Goes well with your cart" |
| Cart "Accessory Pack -20%" | 3 fake SKUs with fixed prices | Deleted |
| Cart "Frequently bought together" | 3 fake SKUs | Deleted |

The demo and story texts also claimed that tracking events and orders feed "frequently bought together",
"frequently viewed together" and personalized recommendations. Gally's recommender reads no tracking data
(`api/packages/gally-sample-data/src/DataFixtures/01_fashion/premium/recommenders.yaml:6-7`).

## The API
Premium GraphQL query:

```graphql
productRecommendations(recommendationType: String!, localizedCatalog: String!, productSkus: [String!]!, productCount: Int)
```

- It returns a flat list of `Product`, the same type as search, so `productFields(catalogCode)` works as
  the selection and `ProductCard` renders the results unchanged.
- Seed SKUs are never returned.
- Types: `cross-sell`, `upsell`, `related_product`. Rules are fixed SKU-to-SKU lists in the fixtures.
  Papershop has no `related_product` rules.
- The SDK has no method for it, so `fetchProductRecommendations` calls it with a raw `fetch`, like vector
  search does.
- The raw query must add `price { price }` and `stock { status }` itself. The SDK appends them to every
  search, so `productFields()` leaves them out. Without them every recommended card showed 0,00 €.

## Behaviour (testable)
- [x] The PDP asks for `related_product` seeded with its SKU, then `cross-sell` if that is empty, up to 6
      products. The block is hidden when both are empty.
- [x] The cart asks for `cross-sell` seeded with the parent SKU of every line (`CartItem.sku`, not
      `childSku`), up to 8 products. The block is hidden when empty.
- [x] The accessory pack and the "frequently bought together" block are gone, with their constants, state,
      summary row, locale keys (`bundle.*`, `fbt.*`, `summary.frequentlyBoughtTogether`) and CSS
      (`.cart-bundle*`, `.fbt-*`). The cart total is the item subtotal plus shipping.
- [x] The demo and story texts no longer say that tracking or orders feed recommendations. The closing
      timeline says recommendations come from cross-sell, upsell and related-product rules.
- [x] Any API error returns `[]`, which hides the block rather than breaking the page.

## MUST NOT change
- Recommended cards add to the cart through `ProductCard`/`QuickAdd`, so add-to-cart tracking is unchanged.
- The free-shipping bar and threshold are unchanged.
- The homepage rows are still plain listings. They are not presented as recommendations.
