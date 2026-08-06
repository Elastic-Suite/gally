import { useState, useEffect, useCallback, useRef } from 'react';
import { getSearchManager } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';

// Fields to request from the API for product display.
// Object/array types need sub-selections (e.g. fashion_color { label value }).
// Note: price { price } and stock { status } are appended automatically by the SDK.
const PRODUCT_FIELDS = [
  'sku', 'name', 'image', 'description', 'url_key',
  'fashion_color { label value }',
  'fashion_material { label value }',
  'visibility { label value }',
  'new', 'cost',
];

interface SearchOptions {
  searchQuery?: string;
  categoryCode?: string;
  filters?: any[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  currentPage?: number;
  isAutocomplete?: boolean;
}

interface SearchResult {
  products: any[];
  total: number;
  currentPage: number;
  pageCount: number;
  aggregations: any[];
  loading: boolean;
  error: string | null;
}

export function useSearch(options: SearchOptions) {
  const { selectedLocalizedCatalog } = useCatalog();
  const [result, setResult] = useState<SearchResult>({
    products: [],
    total: 0,
    currentPage: 1,
    pageCount: 0,
    aggregations: [],
    loading: false,
    error: null,
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const doSearch = useCallback(async () => {
    if (!selectedLocalizedCatalog) return;
    setResult(prev => ({ ...prev, loading: true, error: null }));
    try {
      const sm = getSearchManager();
      const hasCategory = !!optionsRef.current.categoryCode;
      const searchQuery = optionsRef.current.searchQuery;
      // product_catalog requires currentCategoryId (API 400s otherwise), so whenever
      // there's no category — regardless of whether the caller passed searchQuery as
      // '', undefined, or omitted it entirely — force product_search mode via '*'.
      const effectiveQuery = hasCategory
        ? (searchQuery || undefined)
        : (searchQuery || '*');
      const response = await sm.search({
        localizedCatalog: selectedLocalizedCatalog.code,
        metadata: 'product',
        searchQuery: effectiveQuery,
        currentPage: optionsRef.current.currentPage ?? 1,
        pageSize: optionsRef.current.pageSize ?? 20,
        isAutocomplete: optionsRef.current.isAutocomplete ?? false,
        selectedFields: PRODUCT_FIELDS,
        filters: optionsRef.current.filters ?? [],
        categoryId: optionsRef.current.categoryCode,
        sortField: optionsRef.current.sortField,
        sortDirection: optionsRef.current.sortDirection,
      });

      setResult({
        products: response.getCollection(),
        total: response.getTotalCount(),
        currentPage: optionsRef.current.currentPage ?? 1,
        pageCount: response.getLastPage(),
        aggregations: response.getAggregations(),
        loading: false,
        error: null,
      });
    } catch (e: any) {
      setResult(prev => ({ ...prev, loading: false, error: e.message || 'Search failed' }));
    }
  }, [selectedLocalizedCatalog]);

  useEffect(() => {
    doSearch();
  }, [
    doSearch,
    options.searchQuery,
    options.categoryCode,
    options.currentPage,
    options.sortField,
    options.sortDirection,
    options.pageSize,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options.filters),
  ]);

  // Fetches the full option list for one facet field, bypassing the backend's
  // default ~10-option truncation (aggregation.hasMore). Used by the facet
  // sidebar's "Show more" action.
  const viewMoreOptions = useCallback(async (field: string) => {
    if (!selectedLocalizedCatalog) return [];
    const sm = getSearchManager();
    const hasCategory = !!optionsRef.current.categoryCode;
    const searchQuery = optionsRef.current.searchQuery;
    const isSearchMode = !hasCategory && searchQuery !== undefined;
    const effectiveQuery = isSearchMode
      ? (searchQuery || '*')
      : (searchQuery || undefined);
    try {
      return await sm.viewMoreProductFilterOption({
        localizedCatalog: selectedLocalizedCatalog.code,
        metadata: 'product',
        searchQuery: effectiveQuery,
        filters: optionsRef.current.filters ?? [],
        categoryId: optionsRef.current.categoryCode,
        isAutocomplete: false,
        selectedFields: [],
        currentPage: 1,
        pageSize: 1,
      }, field);
    } catch {
      return [];
    }
  }, [selectedLocalizedCatalog]);

  return { ...result, refetch: doSearch, viewMoreOptions };
}

export function useAutocomplete() {
  const { selectedLocalizedCatalog } = useCatalog();
  const [results, setResults] = useState<any[]>([]);
  // Aggregations on an autocomplete request are NOT the facet configuration —
  // the backend builds them from the source fields flagged "Displayed in
  // autocomplete" (isUsedInAutocomplete), see AutocompleteSourceFields.php.
  // Whatever comes back is what the merchandiser flagged; the front doesn't pick.
  const [aggregations, setAggregations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 2 || !selectedLocalizedCatalog) {
      setResults([]);
      setAggregations([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const sm = getSearchManager();
        const response = await sm.search({
          localizedCatalog: selectedLocalizedCatalog.code,
          metadata: 'product',
          searchQuery: query,
          isAutocomplete: true,
          pageSize: 8,
          currentPage: 1,
          selectedFields: PRODUCT_FIELDS,
          filters: [],
        });
        setResults(response.getCollection());
        setAggregations(response.getAggregations());
      } catch {
        setResults([]);
        setAggregations([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedLocalizedCatalog]);

  const clear = useCallback(() => {
    setResults([]);
    setAggregations([]);
  }, []);

  return { results, aggregations, loading, search, clear };
}
