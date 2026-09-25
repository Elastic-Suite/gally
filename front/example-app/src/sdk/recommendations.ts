import { BASE_URI } from './index';
import { productFields } from './fields';

// Product recommendations from Gally's premium Recommender module - the second query in this app
// the SDK cannot make (the first is vector search), so it is a raw GraphQL call like
// fetchVectorSearchProducts.
//
// The recommender is rule-based, not behavioural: each rule matches seed SKUs and names the
// products to offer for them. Nothing reads tracking events. See
// specs/feature-real-recommendations.md.
//
// The query returns a flat list of `Product` - the same type as search - so the card's field list
// works as the selection and ProductCard renders the results unchanged. Seed SKUs never come back.

export type RecommendationType = 'cross-sell' | 'upsell' | 'related_product';

export async function fetchProductRecommendations(
  localizedCatalog: string,
  catalogCode: string,
  type: RecommendationType,
  skus: string[],
  count: number,
): Promise<any[]> {
  const seeds = Array.from(new Set(skus.filter(Boolean)));
  if (seeds.length === 0) return [];

  // `price { price }` and `stock { status }` are not in productFields(): the SDK appends them to
  // every search on its own (see fields.ts). A raw query has to ask for them, or every card
  // shows 0,00 €. GraphQL merges them with the `price { ... }` selection already in the list.
  const selection = [...productFields(catalogCode), 'price { price }', 'stock { status }'];
  const query = `query productRecommendations($type: String!, $localizedCatalog: String!, $skus: [String!]!, $count: Int) {
    productRecommendations(
      recommendationType: $type,
      localizedCatalog: $localizedCatalog,
      productSkus: $skus,
      productCount: $count
    ) { ${selection.join(' ')} }
  }`;

  try {
    const res = await fetch(`${BASE_URI}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { type, localizedCatalog, skus: seeds, count } }),
    });
    const json = await res.json();
    return json?.data?.productRecommendations ?? [];
  } catch {
    // A missing block is better than a broken page: callers hide the section on [].
    return [];
  }
}
