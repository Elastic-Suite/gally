import { useCallback, useEffect, useRef, useState } from 'react'
import { getSearchManager } from '../sdk'
import { useCatalog } from '../contexts/CatalogContext'
import { useGallyConfig } from '../contexts/ConfigContext'
import type { Aggregation } from '@elastic-suite/gally-sdk'
import {
  CMS_FIELDS,
  CMS_METADATA,
  SearchFilter,
  TermSuggestion,
} from '../sdk/fields'
import { CmsPage, getCmsFields } from '../sdk/cmsFields'

// Re-exported so the many existing importers of these names keep working unchanged.
export type { CmsOption, CmsPage } from '../sdk/cmsFields'
export { getCmsFields, cmsPageUrl, formatCmsDate } from '../sdk/cmsFields'

interface CmsSearchOptions {
  searchQuery?: string
  filters?: SearchFilter[]
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  pageSize?: number
  currentPage?: number
  // Lets a caller (the detail page) skip the request until it knows what to ask for.
  skip?: boolean
  // Pages already fetched on the server for this exact query (Phase 3). Seeds the hook
  // and skips the mount request, so the server-rendered article and the hydrated one
  // come from a single fetch. Later option changes still refetch normally.
  initialPages?: CmsPage[]
}

interface CmsSearchResult {
  pages: CmsPage[]
  total: number
  pageCount: number
  aggregations: Aggregation[]
  loading: boolean
  error: string | null
}

function cmsKey(o: CmsSearchOptions): string {
  return JSON.stringify([
    o.searchQuery,
    o.currentPage,
    o.pageSize,
    o.sortField,
    o.sortDirection,
    o.skip,
    o.filters,
  ])
}

export function useCmsSearch(options: CmsSearchOptions) {
  const { selectedLocalizedCatalog } = useCatalog()
  const config = useGallyConfig()
  const [result, setResult] = useState<CmsSearchResult>(() =>
    options.initialPages
      ? {
          pages: options.initialPages,
          total: options.initialPages.length,
          pageCount: 1,
          aggregations: [],
          loading: false,
          error: null,
        }
      : {
          pages: [],
          total: 0,
          pageCount: 0,
          aggregations: [],
          loading: true,
          error: null,
        }
  )

  // See useSearch's serverFetchedKey — same reasoning: a one-shot skip is defeated by
  // StrictMode's double-invoked effects and ignores whether the query still matches.
  const serverFetchedKey = useRef<string | null>(
    options.initialPages ? cmsKey(options) : null
  )

  const optionsRef = useRef(options)
  optionsRef.current = options
  // Only the latest request may write the result (specs/bugfix-search-out-of-order-responses.md).
  const latestRequest = useRef(0)

  const doSearch = useCallback(async () => {
    if (!selectedLocalizedCatalog) return
    const requestId = ++latestRequest.current
    if (optionsRef.current.skip) {
      // Empty, not the previous query's articles: /search shows the count on its Articles tab
      // even without a query (specs/bugfix-search-stale-articles-without-query.md).
      setResult({
        pages: [],
        total: 0,
        pageCount: 0,
        aggregations: [],
        loading: false,
        error: null,
      })
      return
    }
    setResult((prev) => ({ ...prev, loading: true, error: null }))
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
      })
      // Stale when a newer request (or a seed, a skip, a clear) came after it: drop it.
      if (requestId !== latestRequest.current) return
      setResult({
        pages: response.getCollection().map((doc) => getCmsFields(doc, config)),
        total: response.getTotalCount(),
        pageCount: response.getLastPage(),
        aggregations: response.getAggregations(),
        loading: false,
        error: null,
      })
    } catch (e: unknown) {
      if (requestId !== latestRequest.current) return
      setResult((prev) => ({
        ...prev,
        loading: false,
        error: (e as Error).message || 'CMS search failed',
      }))
    }
  }, [selectedLocalizedCatalog, config])

  useEffect(() => {
    if (serverFetchedKey.current !== null) {
      if (serverFetchedKey.current === cmsKey(optionsRef.current)) return
      serverFetchedKey.current = null
    }
    doSearch()
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
  ])

  return result
}

// Deliberately separate from useAutocomplete(): the product column must not wait on
// — or be blanked by — a slow or failing cms_page request, and vice versa. Both are
// driven by the same keystroke, they just resolve independently.
const ACP_CMS_PAGE_SIZE = 4

export function useCmsAutocomplete() {
  const { selectedLocalizedCatalog } = useCatalog()
  const config = useGallyConfig()
  const [pages, setPages] = useState<CmsPage[]>([])
  const [termSuggestions, setTermSuggestions] = useState<TermSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  // The debounce only cancels a request not yet sent; this drops answers to requests that were
  // superseded after they left (specs/bugfix-search-out-of-order-responses.md).
  const latestRequest = useRef(0)

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      const requestId = ++latestRequest.current

      if (!query || query.length < 2 || !selectedLocalizedCatalog) {
        setPages([])
        setTermSuggestions([])
        setLoading(false)
        return
      }

      // Same 300ms as the product autocomplete, so both columns land together.
      debounceRef.current = setTimeout(async () => {
        setLoading(true)
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
          })
          // Stale when a newer request (or a seed, a skip, a clear) came after it: drop it.
          if (requestId !== latestRequest.current) return
          setPages(
            response.getCollection().map((doc) => getCmsFields(doc, config))
          )
          setTermSuggestions(response.getTermSuggestions())
        } catch {
          if (requestId !== latestRequest.current) return
          setPages([])
          setTermSuggestions([])
        } finally {
          // Only the latest request ends the loading state; a newer one is still running.
          if (requestId === latestRequest.current) setLoading(false)
        }
      }, 300)
    },
    [selectedLocalizedCatalog, config]
  )

  // Both, or picking a result leaves the blog terms behind in the merged
  // suggestions column (SearchBar clears the two autocomplete hooks together).
  const clear = useCallback(() => {
    latestRequest.current++
    setLoading(false)
    setPages([])
    setTermSuggestions([])
  }, [])

  return { pages, termSuggestions, loading, search, clear }
}
