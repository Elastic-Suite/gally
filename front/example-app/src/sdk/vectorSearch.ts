import { BASE_URI } from './index';

// Vector (semantic) search — the one query in this app the SDK cannot make.
//
// `@elastic-suite/gally-sdk` only knows the `products` / `documents` endpoints; the
// premium GallyVectorSearchBundle adds a third, `vectorSearchProducts`, and nothing in
// SearchManager reaches it. So this is a raw POST to /api/graphql, exactly like
// fetchCategoryTree() in ./catalogs.ts. Search is public — no token needed, unlike the
// `explain` query the ExplainPage has to authenticate for.
//
// The payoff for using vectorSearchProducts rather than the older, generic
// vectorSearchDocuments(entityType:"product"): its collection is a `VectorProduct`, which
// carries the SAME fields as `Product` — measured, including the whole of PRODUCT_FIELDS.
// So the same field list and the same row component serve both panels, with no mapping
// layer (the old app needed transformVectorSearchDocumentsIntoProducts). That is what makes
// the two panels genuinely comparable rather than one grid of cards next to a table of SKUs.

// What ONE ROW of the comparison needs, and nothing else.
//
// Deliberately not PRODUCT_FIELDS. That list is built for `<ProductCard>` — badges, colour and
// size axes, discount arithmetic, `configurable_attributes` — and this page draws none of it: a
// row is a thumbnail, a name and a score. Asking for the full card selection to render a row
// costs ~15 extra fields per hit at 100 hits a panel, twice per query, for pixels nobody sees.
// That saving is what makes the page size affordable.
//
// Both panels use this same list, which is the point: the keyword panel and the vector panel must
// differ in their RANKING and in nothing else. It changes the projection only — never the query,
// the request type or the sort — so the ranking each engine produces is untouched.
//
// `score` is what makes a row a row. It is a real field on both `Product` and `VectorProduct`,
// but the two are NOT on the same scale — BM25 returns ~64 for a good keyword hit, cosine
// similarity returns ~0.56 — so each panel formats and labels its own, and the numbers are never
// compared across the gutter. See scoreLabel/formatScore in the view.
export const COMPARE_ROW_FIELDS = ['sku', 'name', 'image', 'url_key', 'score'];

// The backend's kNN `k`: `gally_vector_search.search_config.k_value`, default 100
// (gally-premium/VectorSearch/src/Resources/config/gally_vector_search.yaml).
//
// It is a HARD ceiling on how deep the vector list can be paged, and it is invisible in the
// response: `paginationInfo.totalCount` reports the whole corpus, so on a 1200-product
// catalogue the API would advertise `lastPage: 48` at 25 a page while only the first 100 rows
// exist — pages 5 and beyond would come back empty with a pager still offering them. Mirrored
// here so the pager can be clamped. If k_value is raised server-side, raise this to match.
export const VECTOR_MAX_RESULTS = 100;

export interface VectorSearchResult {
  products: any[];
  /** Similarity per SKU, 0..1 — cosine-ish, from OpenSearch kNN. Not on the product row. */
  scores: Record<string, number>;
  /** What the engine ranked. See the note in fetchVectorSearchProducts. */
  corpusSize: number;
  /** Pages actually reachable — already clamped to VECTOR_MAX_RESULTS. */
  pageCount: number;
}

const EMPTY: VectorSearchResult = { products: [], scores: {}, corpusSize: 0, pageCount: 0 };

/**
 * Rank the catalogue against `search` by embedding similarity.
 *
 * `requestType` is required by the schema even though it changes nothing here — the
 * vector provider is a parallel implementation of the product provider and inherits its
 * signature. product_search is the only value that makes sense for a query.
 */
export async function fetchVectorSearchProducts(
  localizedCatalog: string,
  search: string,
  pageSize = 25,
  currentPage = 1
): Promise<VectorSearchResult> {
  if (!search.trim()) return EMPTY;

  const query = `query vectorSearch($localizedCatalog: String!, $search: String, $pageSize: Int, $currentPage: Int) {
    vectorSearchProducts(
      localizedCatalog: $localizedCatalog,
      requestType: product_search,
      search: $search,
      pageSize: $pageSize,
      currentPage: $currentPage
    ) {
      paginationInfo { totalCount lastPage }
      collection { ... on VectorProduct { ${COMPARE_ROW_FIELDS.join(' ')} } }
    }
  }`;

  try {
    const res = await fetch(`${BASE_URI}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { localizedCatalog, search, pageSize, currentPage } }),
    });
    const json = await res.json();
    const payload = json?.data?.vectorSearchProducts;
    if (!payload) return EMPTY;

    const products = payload.collection || [];
    const corpusSize = payload.paginationInfo?.totalCount ?? products.length;
    const scores: Record<string, number> = {};
    for (const p of products) {
      if (p?.sku) scores[p.sku] = Number(p.score) || 0;
    }
    return {
      products,
      scores,
      // NOT a result count, and never label it as one. A kNN query RANKS, it does not
      // filter: totalCount is the size of the embedded corpus (every product, since the
      // ingest pipeline embeds them all), so it reads the same for a brilliant query and
      // a nonsense one. The panel shows how many rows it drew and calls this the
      // catalogue size — claiming "85 results" beside the keyword panel's honest "0"
      // would be the one lie that discredits the whole comparison.
      corpusSize,
      // The API's own lastPage is computed from totalCount and ignores k, so it over-reports
      // on any catalogue bigger than k. Take the stricter of the two.
      pageCount: Math.min(
        payload.paginationInfo?.lastPage ?? 1,
        Math.ceil(Math.min(corpusSize, VECTOR_MAX_RESULTS) / pageSize)
      ),
    };
  } catch {
    // Same contract as the fetchers in ./server.ts: degrade to empty, never throw. The
    // bundle is premium and optional — an instance without it 400s on this query, and
    // the page must still render its keyword panel and say so.
    return EMPTY;
  }
}

// Queries that make the point, measured against `com_en` on the Venia sample catalogue.
// Every one of them returns ZERO from keyword search, for three different reasons:
//
//   jewellery              vocabulary — the catalogue says "Necklace"/"Earrings" and
//                          never once says "jewellery" (nor "jewelry"); no thesaurus
//                          entry covers it, so BM25 has nothing to match on
//   wedding guest outfit   intent — the shopper describes the OCCASION, the catalogue
//                          describes the garment
//   something to wear      intent, phrased as a sentence — the words that carry the
//     to the beach         meaning ("beach") appear in no product field at all
//   gift for my wife       intent with no product noun whatsoever
//
// The embedding covers the product NAME only (the vector_configurations fixture marks
// `name` vectorisable, prompt "The product name is %s"), which makes the hit rate more
// impressive rather than less: "something to wear to the beach" reaches Tank Dresses and
// Shorts purely because the model knows what those garments are for.
//
// English only, deliberately. The deployed model is
// huggingface/sentence-transformers/all-MiniLM-L6-v2 — monolingual English — and the
// product names are English in every catalogue including com_fr. A French query returns
// confident nonsense (`bijoux` ranks a skirt first), which is why the view warns instead
// of pretending. See ENGLISH_LOCALES below.
// `cardigan` is last and is the CONTROL, not a fifth example of the same thing: it is a
// literal product noun, keyword search returns 7, and vector search returns the same three
// cardigans at the top. Without it this page is four rigged queries and an audience is right
// to distrust it; with it the claim narrows to the true one — semantic search does not beat
// keyword search everywhere, it covers the queries keyword search cannot answer at all.
// Do not drop it to make the demo tidier.
//
// Keyed by localized catalog, because a suggestion is only worth offering in the catalogue it was
// measured against. Four sample shops ship now, and one flat list meant the hardware shop invited
// visitors to try "wedding guest outfit" — nothing comes back, at the exact moment the page is
// meant to impress. See specs/feature-vector-demo-queries-per-catalog.md for every query's
// measured keyword count and vector top hit.
//
// English keys only, for the reason above: the other localized catalogs get no suggestions rather
// than suggestions the model cannot answer, which would contradict the warning below them.
//
// Each list ENDS WITH ITS CONTROL — `cardigan`, `drill`, `dress`, `fountain pen` — a literal
// product noun keyword search answers perfectly well. The rule is per catalogue now, and the
// reason has not changed: without it each list is rigged queries and an audience is right to
// distrust the page.
export const VECTOR_DEMO_QUERIES: Record<string, string[]> = {
  // The French and German lists were picked by running each candidate against the live index and
  // keeping those whose top vector hits are relevant, preferring ones the keyword side misses
  // (0 results): short phrases and synonyms work, long intent sentences mostly do not. The model
  // is English-first, so these are best effort. com's product names are English in every locale.
  com_fr: [
    'pantalon large',
    'tenue pour un mariage',
    'bracelet',
  ],
  com_en: [
    'jewellery',
    'wedding guest outfit',
    'something to wear to the beach',
    'gift for my wife',
    'cardigan',
  ],
  // Intent a hardware catalogue never words the way a customer does: nobody writes "protect my
  // eyes" on a pair of goggles.
  toolbox_en: [
    'protect my eyes while drilling',
    'something to cut metal pipes',
    'fix a shelf to a brick wall',
    'drill',
  ],
  toolbox_fr: [
    'lunettes de protection',
    'couper un tuyau en métal',
    'souder',
    'perceuse',
  ],
  toolbox_de: [
    'Akkuschrauber',
    'Wand streichen',
    'Schutzbrille',
    'Bohrmaschine',
  ],
  fashion_en: [
    'something to wear to the beach',
    'wedding guest outfit',
    'gift for my wife',
    'dress',
  ],
  fashion_fr: [
    'tenue de soirée',
    "pull chaud pour l'hiver",
    'cadeau pour ma femme',
    'robe',
  ],
  fashion_de: [
    'etwas für den Strand',
    'warmer Pullover für den Winter',
    'Abendkleid',
    'Kleid',
  ],
  // The first one is the best argument on this shop: it pulls the whole furniture range out of a
  // catalogue that also sells pencils, on intent alone.
  papershop_en: [
    'furnish a home office',
    'a present for a child',
    'fountain pen',
  ],
  papershop_fr: [
    'siège de bureau',
    'carnet de notes',
    'aménager un bureau à la maison',
    'stylo plume',
  ],
  // "Füllfederhalter" is the showcase: no product uses the word, so keyword search finds nothing,
  // and vector search returns every "Füllhalter".
  papershop_de: [
    'Füllfederhalter',
    'Notizbuch',
    'Märchen',
  ],
};

/** This catalogue's suggestions, or none. Never another catalogue's. */
export function getVectorDemoQueries(localizedCatalog: string | undefined): string[] {
  return (localizedCatalog && VECTOR_DEMO_QUERIES[localizedCatalog]) || [];
}
