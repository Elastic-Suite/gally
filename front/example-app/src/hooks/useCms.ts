import { useCallback, useEffect, useRef, useState } from 'react';
import { getSearchManager } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';
import { CMS_FIELDS, CMS_METADATA } from '../sdk/fields';
import { CmsPage, getCmsFields } from '../sdk/cmsFields';

// Re-exported so the many existing importers of these names keep working unchanged.
export type { CmsOption, CmsPage } from '../sdk/cmsFields';
export { getCmsFields, cmsPageUrl, formatCmsDate } from '../sdk/cmsFields';



interface CmsSearchOptions {
  searchQuery?: string;
  filters?: any[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  currentPage?: number;
  // Lets a caller (the detail page) skip the request until it knows what to ask for.
  skip?: boolean;
  // Pages already fetched on the server for this exact query (Phase 3). Seeds the hook
  // and skips the mount request, so the server-rendered article and the hydrated one
  // come from a single fetch. Later option changes still refetch normally.
  initialPages?: CmsPage[];
}

interface CmsSearchResult {
  pages: CmsPage[];
  total: number;
  pageCount: number;
  aggregations: any[];
  loading: boolean;
  error: string | null;
}

function cmsKey(o: CmsSearchOptions): string {
  return JSON.stringify([
    o.searchQuery, o.currentPage, o.pageSize, o.sortField,
    o.sortDirection, o.skip, o.filters,
  ]);
}

export function useCmsSearch(options: CmsSearchOptions) {
  const { selectedLocalizedCatalog } = useCatalog();
  const [result, setResult] = useState<CmsSearchResult>(() => options.initialPages ? {
    pages: options.initialPages,
    total: options.initialPages.length,
    pageCount: 1,
    aggregations: [],
    loading: false,
    error: null,
  } : {
    pages: [],
    total: 0,
    pageCount: 0,
    aggregations: [],
    loading: true,
    error: null,
  });

  // See useSearch's serverFetchedKey — same reasoning: a one-shot skip is defeated by
  // StrictMode's double-invoked effects and ignores whether the query still matches.
  const serverFetchedKey = useRef<string | null>(
    options.initialPages ? cmsKey(options) : null
  );

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const doSearch = useCallback(async () => {
    if (!selectedLocalizedCatalog) return;
    if (optionsRef.current.skip) {
      setResult(prev => ({ ...prev, loading: false }));
      return;
    }
    setResult(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await getSearchManager().search({
        localizedCatalog: selectedLocalizedCatalog.code,
        metadata: CMS_METADATA,
        searchQuery: optionsRef.current.searchQuery || undefined,
        currentPage: optionsRef.current.currentPage ?? 1,
        pageSize: optionsRef.current.pageSize ?? 10,
        // Required by the SDK's option type, but inert for non-product entities:
        // it only ever feeds `requestType`, which `documents` neither takes nor sends.
        isAutocomplete: false,
        selectedFields: CMS_FIELDS,
        filters: optionsRef.current.filters ?? [],
        sortField: optionsRef.current.sortField,
        sortDirection: optionsRef.current.sortDirection,
      });
      setResult({
        pages: response.getCollection().map(getCmsFields),
        total: response.getTotalCount(),
        pageCount: response.getLastPage(),
        aggregations: response.getAggregations(),
        loading: false,
        error: null,
      });
    } catch (e: any) {
      setResult(prev => ({ ...prev, loading: false, error: e.message || 'CMS search failed' }));
    }
  }, [selectedLocalizedCatalog]);

  useEffect(() => {
    if (serverFetchedKey.current !== null) {
      if (serverFetchedKey.current === cmsKey(optionsRef.current)) return;
      serverFetchedKey.current = null;
    }
    doSearch();
  }, [
    doSearch,
    options.searchQuery,
    options.currentPage,
    options.pageSize,
    options.sortField,
    options.sortDirection,
    options.skip,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options.filters),
  ]);

  return result;
}

// Deliberately separate from useAutocomplete(): the product column must not wait on
// — or be blanked by — a slow or failing cms_page request, and vice versa. Both are
// driven by the same keystroke, they just resolve independently.
const ACP_CMS_PAGE_SIZE = 4;

export function useCmsAutocomplete() {
  const { selectedLocalizedCatalog } = useCatalog();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [termSuggestions, setTermSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 2 || !selectedLocalizedCatalog) {
      setPages([]);
      setTermSuggestions([]);
      return;
    }

    // Same 300ms as the product autocomplete, so both columns land together.
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getSearchManager().search({
          localizedCatalog: selectedLocalizedCatalog.code,
          metadata: CMS_METADATA,
          searchQuery: query,
          currentPage: 1,
          pageSize: ACP_CMS_PAGE_SIZE,
          isAutocomplete: false,
          selectedFields: CMS_FIELDS,
          filters: [],
        });
        setPages(response.getCollection().map(getCmsFields));
        setTermSuggestions(response.getTermSuggestions());
      } catch {
        setPages([]);
        setTermSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedLocalizedCatalog]);

  // Both, or picking a result leaves the blog terms behind in the merged
  // suggestions column (SearchBar clears the two autocomplete hooks together).
  const clear = useCallback(() => {
    setPages([]);
    setTermSuggestions([]);
  }, []);

  return { pages, termSuggestions, loading, search, clear };
}
