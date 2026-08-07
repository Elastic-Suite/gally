import { cache } from 'react';
import { getSearchManager } from './index';
import { fetchCatalogs, findLocalizedCatalog, fetchCategoryTree } from './catalogs';
import { PRODUCT_FIELDS, CMS_FIELDS, CMS_METADATA } from './fields';

// Server-side data fetching for the three crawlable routes. These run in Server
// Components, so `getSearchManager()` resolves to the internal base URI (see ./index) —
// the public gally.localhost host is unreachable from inside the container.
//
// Each of these deliberately mirrors the corresponding client hook's request shape
// exactly: same metadata, same selectedFields, same filter syntax. If they drift, the
// page rendered on the server and the page the hook refetches after hydration disagree,
// and the content visibly changes under the user.
//
// They all swallow errors into null/empty rather than throwing. A failed fetch should
// degrade to the client-side path that existed before Phase 3, not 500 the whole route.

export const fetchProductBySku = cache(async (
  localizedCatalog: string,
  sku: string
): Promise<any | null> => {
  try {
    // searchQuery is passed (rather than left empty) purely to make the SDK pick
    // product_search over product_catalog, which 400s without a currentCategoryId — the
    // equal filter is what actually guarantees this exact product. Same reasoning, and
    // the same shape, as ProductPage's useSearch call.
    const response = await getSearchManager().search({
      localizedCatalog,
      metadata: 'product',
      searchQuery: sku,
      filters: [{ sku: { eq: sku } }],
      currentPage: 1,
      pageSize: 1,
      isAutocomplete: false,
      selectedFields: PRODUCT_FIELDS,
    });
    return response.getCollection()[0] ?? null;
  } catch {
    return null;
  }
});

export interface ServerSearchResult {
  products: any[];
  total: number;
  pageCount: number;
  aggregations: any[];
}

export const fetchCategoryProducts = cache(async (
  localizedCatalog: string,
  categoryId: string,
  pageSize = 20
): Promise<ServerSearchResult> => {
  try {
    const response = await getSearchManager().search({
      localizedCatalog,
      metadata: 'product',
      categoryId,
      currentPage: 1,
      pageSize,
      isAutocomplete: false,
      selectedFields: PRODUCT_FIELDS,
      filters: [],
    });
    return {
      products: response.getCollection(),
      total: response.getTotalCount(),
      pageCount: response.getLastPage(),
      aggregations: response.getAggregations(),
    };
  } catch {
    return { products: [], total: 0, pageCount: 0, aggregations: [] };
  }
});

export const fetchCmsPageById = cache(async (
  localizedCatalog: string,
  id: string
): Promise<any | null> => {
  try {
    // Fetched by `id`, not by slug: url_key is keyword-analyzed text with no `untouched`
    // sub-field, so it cannot be filtered on exactly. Mirrors BlogPostPage's filter.
    const response = await getSearchManager().search({
      localizedCatalog,
      metadata: CMS_METADATA,
      filters: [{ equalFilter: { field: 'id', eq: id } }],
      currentPage: 1,
      pageSize: 1,
      isAutocomplete: false,
      selectedFields: CMS_FIELDS,
    });
    return response.getCollection()[0] ?? null;
  } catch {
    return null;
  }
});

// generateMetadata() and the page component both need the resolved catalog, and each
// route re-resolves it independently of the layout. cache() collapses all of that into
// one request per render pass.
export const resolveLocale = cache(async (locale: string) => {
  const catalogs = await fetchCatalogs();
  return findLocalizedCatalog(catalogs, locale);
});


// The category tree is now read three times per request — the route guard, its
// generateMetadata and the page body. Uncached that is three identical GraphQL calls.
export const cachedCategoryTree = cache(async (catalogId: number, localizedCatalogId: number) =>
  fetchCategoryTree(catalogId, localizedCatalogId)
);
