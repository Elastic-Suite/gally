import { getRecommenderManager } from './index'
import { productFields, SearchDocument } from './fields'

// Product recommendations from Gally's premium Recommender module, through the SDK's
// RecommenderManager (the same call as the PHP SDK's RecommenderManager).
//
// The recommender is rule-based, not behavioural: each rule matches seed SKUs and names the
// products to offer for them. Nothing reads tracking events. See
// specs/feature-real-recommendations.md.
//
// The query returns a flat list of `Product` - the same type as search - so the card's field list
// works as the selection and ProductCard renders the results unchanged. Seed SKUs never come back.

export type RecommendationType = 'cross-sell' | 'upsell' | 'related_product'

export async function fetchProductRecommendations(
  localizedCatalog: string,
  catalogCode: string,
  type: RecommendationType,
  skus: string[],
  count: number
): Promise<SearchDocument[]> {
  const seeds = Array.from(new Set(skus.filter(Boolean)))
  if (seeds.length === 0) return []

  // `price { price }` and `stock { status }` are not in productFields(): the SDK appends them to
  // every search on its own (see fields.ts), but not to recommendations. Ask for them here, or every
  // card shows 0,00 €. GraphQL merges them with the `price { ... }` selection already in the list.
  const selection = [
    ...productFields(catalogCode),
    'price { price }',
    'stock { status }',
  ]
  try {
    return (await getRecommenderManager().getProductRecommendations(
      type,
      localizedCatalog,
      seeds,
      count,
      selection
    )) as SearchDocument[]
  } catch {
    // A missing block is better than a broken page: callers hide the section on [].
    return []
  }
}
