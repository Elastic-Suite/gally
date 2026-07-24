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
      // When a searchQuery is provided (even empty string from ?q=), use product_search mode.
      // The SDK requires searchQuery to be a non-empty string to trigger product_search.
      // When no category and query is empty, pass '*' to force product_search mode.
      const isSearchMode = !hasCategory && searchQuery !== undefined;
      const effectiveQuery = isSearchMode
        ? (searchQuery || '*')
        : (searchQuery || undefined);
      // API requires currentCategoryId for product_catalog requests.
      // When no category is set, use searchQuery (even empty string) to trigger product_search mode.
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

  return { ...result, refetch: doSearch };
}

export function useAutocomplete() {
  const { selectedLocalizedCatalog } = useCatalog();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 2 || !selectedLocalizedCatalog) {
      setResults([]);
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
          pageSize: 5,
          currentPage: 1,
          selectedFields: PRODUCT_FIELDS,
          filters: [],
        });
        setResults(response.getCollection());
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedLocalizedCatalog]);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}
