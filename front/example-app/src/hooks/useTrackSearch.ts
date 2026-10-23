import { useEffect, useRef } from 'react'
import {
  useTracking,
  type TrackedFilter,
  type TrackedSort,
} from './useTracking'

export interface SearchTrackingState {
  /** The query on screen. Nothing is sent without one. */
  query: string
  total: number
  page: number
  pageCount: number
  /** The result on screen answers the current options exactly: not loading, not failed, same
   * request (useSearch's `settled`; specs/bugfix-tracking-stale-count-after-facet.md). */
  settled: boolean
  /** The sort the result was produced with (specs/feature-tracking-sort.md). */
  sort: TrackedSort
  /** The applied facets, as trackingFilters() gives them (specs/feature-tracking-filters.md). */
  filters: TrackedFilter[]
  /** When a search counts as new. A SEARCH is sent at most once per key. */
  dedupeKey: string
}

// Sends the SEARCH event once the result on screen is settled: not loading, not failed, and the
// answer to exactly the current options. "Not loading" alone is not enough - after a query, facet,
// sort or page change there is one render where the flag is still false and the result is still
// the previous options' (specs/bugfix-tracking-stale-count-after-facet.md). A settled zero-result
// search IS sent, with item_count 0: it is the event merchandisers look for, and the SDK accepts it.
// See specs/bugfix-search-zero-result-tracking.md.
export function useTrackSearch(state: SearchTrackingState): void {
  const { trackSearch } = useTracking()
  const sentKey = useRef<string | null>(null)
  const { query, total, page, pageCount, settled, sort, filters, dedupeKey } =
    state
  const { field: sortField, direction: sortDirection } = sort

  useEffect(() => {
    if (!query.trim() || !settled) return
    if (sentKey.current === dedupeKey) return
    sentKey.current = dedupeKey
    trackSearch(
      query,
      total,
      page,
      pageCount,
      {
        field: sortField,
        direction: sortDirection,
      },
      filters
    )
  }, [
    query,
    total,
    page,
    pageCount,
    settled,
    sortField,
    sortDirection,
    filters,
    dedupeKey,
    trackSearch,
  ])
}
