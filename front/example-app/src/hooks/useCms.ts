import { useState, useEffect, useCallback, useRef } from 'react';
import { getSearchManager, MEDIA_BASE_URL } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';

// The SDK routes any non-`product` metadata to the generic `documents(entityType:)`
// query (see graphql/Request.ts:getEndpoint), so the whole cms_page section runs
// through the same SearchManager as the catalog — no bespoke GraphQL here.
const CMS_METADATA = 'cms_page';

// For non-product entities selectedFields never reaches the query — the SDK hardcodes
// the selection to `id data` — but it is NOT ignored: Response projects `data._source`
// down to exactly these keys client-side (graphql/Response.ts). So they must be raw
// _source attribute names (`content_heading`, `published_at`, …), not the camelCase
// names of CmsPage nor invented ones: any key not listed here is dropped, and any key
// listed that the document doesn't have is simply absent.
// It must also not be EMPTY, or the SDK drops the `collection` block from the query
// and zero documents come back. Same trap as PRODUCT_FIELDS.
const CMS_FIELDS = [
  'id',
  'title',
  'content_heading',
  'meta_description',
  'content',
  'url_key',
  'image',
  'content_type',
  'topic',
  'author',
  'published_at',
  'reading_time',
  'is_featured',
  'tags',
];

export interface CmsOption {
  value: string;
  label: string;
}

export interface CmsPage {
  id: string;
  title: string;
  summary: string;
  content: string;
  urlKey: string;
  image: string;
  contentType: CmsOption | null;
  topic: CmsOption | null;
  author: CmsOption | null;
  publishedAt: string;
  readingTime: number | null;
  isFeatured: boolean;
  tags: CmsOption[];
}

// getCollection() hands back the _source already flattened and projected to CMS_FIELDS
// — no { data: { _source } } envelope survives, and `_id`/`_score` are not reachable.
// The document's own `id` attribute is indexed, so it comes through CMS_FIELDS instead.
export function getCmsFields(doc: any): CmsPage {
  const src = doc ?? {};
  return {
    id: String(src.id ?? ''),
    title: src.title ?? '',
    summary: src.content_heading ?? src.meta_description ?? '',
    content: src.content ?? '',
    urlKey: src.url_key ?? '',
    // CMS illustrations are product media paths, so they need the same prefixing
    // as a product image.
    image: src.image ? `${MEDIA_BASE_URL}${src.image}` : '',
    contentType: src.content_type ?? null,
    topic: src.topic ?? null,
    author: src.author ?? null,
    publishedAt: src.published_at ?? '',
    readingTime: src.reading_time ?? null,
    isFeatured: !!src.is_featured,
    tags: src.tags ?? [],
  };
}

export const cmsPageUrl = (id: string) => `/blog/${encodeURIComponent(id)}`;

export function formatCmsDate(value: string, language: string): string {
  if (!value) return '';
  // published_at comes back as "2026-08-05 15:14:01" — Safari won't parse that with a
  // space, so normalize to ISO before handing it to Date.
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
}

interface CmsSearchOptions {
  searchQuery?: string;
  filters?: any[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  currentPage?: number;
  // Lets a caller (the detail page) skip the request until it knows what to ask for.
  skip?: boolean;
}

interface CmsSearchResult {
  pages: CmsPage[];
  total: number;
  pageCount: number;
  aggregations: any[];
  loading: boolean;
  error: string | null;
}

export function useCmsSearch(options: CmsSearchOptions) {
  const { selectedLocalizedCatalog } = useCatalog();
  const [result, setResult] = useState<CmsSearchResult>({
    pages: [],
    total: 0,
    pageCount: 0,
    aggregations: [],
    loading: true,
    error: null,
  });

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
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 2 || !selectedLocalizedCatalog) {
      setPages([]);
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
      } catch {
        setPages([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedLocalizedCatalog]);

  const clear = useCallback(() => setPages([]), []);

  return { pages, loading, search, clear };
}
