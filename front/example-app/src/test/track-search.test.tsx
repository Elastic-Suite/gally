// SEARCH tracking on the two search pages: sent once the result is settled, zero results included,
// never for a failed request or a result left over from the previous query.
// See specs/bugfix-search-zero-result-tracking.md.
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ track: vi.fn(), search: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr/search',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getTracker: () => ({ push: fake.track }),
  getSearchManager: () => ({ search: fake.search }),
}))

import '../i18n'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import { useSearch } from '../hooks/useSearch'
import {
  useTrackSearch,
  type SearchTrackingState,
} from '../hooks/useTrackSearch'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS } from './fixtures'

const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!

function Providers({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider
      catalogs={CATALOGS}
      selectedCatalog={comFr.catalog}
      selectedLocalizedCatalog={comFr.localizedCatalog}
      categories={[]}
    >
      <EventLogProvider>{children}</EventLogProvider>
    </CatalogProvider>
  )
}

// The SEARCH events sent, as [query, item_count, current_page].
const searches = () =>
  fake.track.mock.calls
    .map(([event]) => event)
    .filter((event) => event.eventType === 'search')
    .map((event) => {
      const payload = JSON.parse(event.payload)
      return [
        payload.search_query.query_text,
        payload.product_list.item_count,
        payload.product_list.current_page,
      ]
    })

// A page situation: what the hook used to receive. `settled` is derived from it as useSearch does
// (loaded, not failed, the result of the query on screen).
type Situation = Omit<SearchTrackingState, 'settled'> & {
  resultQuery: string | null
  loading: boolean
  failed: boolean
}

// SearchPage's rule by default: one SEARCH per (query, page, total, sort, facets).
const searchPage = (over: Partial<Situation> = {}): SearchTrackingState => {
  const s = {
    query: 'robe',
    resultQuery: 'robe' as string | null,
    total: 12,
    page: 1,
    pageCount: 1,
    loading: false,
    failed: false,
    sort: { field: '_score', direction: 'desc' },
    filters: [] as SearchTrackingState['filters'],
    ...over,
  }
  const { resultQuery, loading, failed, ...rest } = s
  // SearchPage's key: query, page, total, sort and facets (specs/feature-tracking-sort.md).
  return {
    ...rest,
    settled: !loading && !failed && resultQuery === s.query,
    dedupeKey:
      over.dedupeKey ??
      `${s.query}|${s.page}|${s.total}|${s.sort.field}|${
        s.sort.direction
      }|${JSON.stringify(s.filters)}`,
  }
}

function track(initial: SearchTrackingState) {
  return renderHook((state: SearchTrackingState) => useTrackSearch(state), {
    wrapper: Providers,
    initialProps: initial,
  })
}

beforeEach(() => {
  fake.track.mockReset()
  fake.search.mockReset()
})

describe('useTrackSearch', () => {
  it('waits for the result, then sends it once', () => {
    const view = track(
      searchPage({ loading: true, resultQuery: null, total: 0 })
    )
    expect(searches()).toEqual([])
    view.rerender(searchPage())
    view.rerender(searchPage())
    expect(searches()).toEqual([['robe', 12, 1]])
  })

  it('sends a zero-result search with item_count 0', () => {
    track(
      searchPage({
        query: 'xyzzy',
        resultQuery: 'xyzzy',
        total: 0,
        pageCount: 0,
      })
    )
    expect(searches()).toEqual([['xyzzy', 0, 1]])
  })

  it('sends nothing for a failed request', () => {
    track(searchPage({ total: 0, failed: true }))
    expect(searches()).toEqual([])
  })

  it('sends nothing for a result left over from the previous query', () => {
    // The render after the query changed: not loading yet, still showing "robe"'s 12 results.
    const view = track(
      searchPage({ query: 'jupe', resultQuery: 'robe', total: 12 })
    )
    expect(searches()).toEqual([])
    view.rerender(searchPage({ query: 'jupe', resultQuery: 'jupe', total: 3 }))
    expect(searches()).toEqual([['jupe', 3, 1]])
  })

  it('sends nothing without a query', () => {
    track(searchPage({ query: '  ', resultQuery: '  ' }))
    expect(searches()).toEqual([])
  })

  it('SearchPage rule: a new page or a new total is a new SEARCH', () => {
    const view = track(searchPage())
    view.rerender(searchPage({ page: 2, pageCount: 2 }))
    view.rerender(searchPage({ page: 2, pageCount: 2, total: 5 }))
    expect(searches()).toEqual([
      ['robe', 12, 1],
      ['robe', 12, 2],
      ['robe', 5, 2],
    ])
  })

  it('vector search rule: paging is not a new search, a new catalog is', () => {
    const vector = (page: number, catalog = 'com_fr') =>
      searchPage({ page, pageCount: 3, dedupeKey: `${catalog}|robe` })
    const view = track(vector(1))
    view.rerender(vector(2))
    view.rerender(vector(3))
    expect(searches()).toEqual([['robe', 12, 1]])
    view.rerender(vector(1, 'fr_fr'))
    expect(searches()).toHaveLength(2)
  })
})

describe('useSearch reports which query its result belongs to', () => {
  const run = (searchQuery: string) =>
    renderHook((q: string) => useSearch({ searchQuery: q, pageSize: 20 }), {
      wrapper: Providers,
      initialProps: searchQuery,
    })
  const response = (total: number) => ({
    getCollection: () => [],
    getTotalCount: () => total,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => '_score',
    getSortDirection: () => 'desc',
  })

  it('null before the first result, then the query it was fetched for', async () => {
    fake.search.mockResolvedValue(response(4))
    const view = run('robe')
    expect(view.result.current.resultQuery).toBeNull()
    await waitFor(() => expect(view.result.current.loading).toBe(false))
    expect(view.result.current).toMatchObject({ resultQuery: 'robe', total: 4 })
  })

  it('keeps the requested query on an error, with the error set', async () => {
    fake.search.mockRejectedValue(new Error('API down'))
    const view = run('robe')
    await waitFor(() => expect(view.result.current.loading).toBe(false))
    expect(view.result.current).toMatchObject({
      resultQuery: 'robe',
      error: 'API down',
    })
  })

  it('uses the server result as settled for its own query', () => {
    const initialData = {
      products: [],
      total: 7,
      pageCount: 1,
      aggregations: [],
    }
    const view = renderHook(
      () => useSearch({ searchQuery: 'robe', pageSize: 20, initialData }),
      { wrapper: Providers }
    )
    expect(view.result.current).toMatchObject({
      resultQuery: 'robe',
      loading: false,
      total: 7,
    })
  })
})

describe('the sort in the SEARCH event (feature-tracking-sort)', () => {
  const sortOf = () =>
    fake.track.mock.calls
      .map(([event]) => JSON.parse(event.payload).product_list)
      .map((list) => [list.sort_order, list.sort_direction])

  it('sends relevance by default and the picked sort after a change, as a new event', () => {
    const view = track(searchPage())
    view.rerender(
      searchPage({ sort: { field: 'price__price', direction: 'asc' } })
    )
    view.rerender(
      searchPage({ sort: { field: 'price__price', direction: 'desc' } })
    )
    expect(sortOf()).toEqual([
      ['relevance', 'desc'],
      ['price__price', 'asc'],
      ['price__price', 'desc'],
    ])
  })
})

describe('useSearch reports which category its result belongs to (bugfix-category-view-stale-count)', () => {
  const response = (total: number) => ({
    getCollection: () => [],
    getTotalCount: () => total,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => 'category__position',
    getSortDirection: () => 'asc',
  })

  it('names the category of the result, and still the old one right after a switch', async () => {
    fake.search
      .mockResolvedValueOnce(response(8))
      .mockResolvedValueOnce(response(3))
    const view = renderHook(
      (code: string) => useSearch({ categoryCode: code, pageSize: 20 }),
      { wrapper: Providers, initialProps: 'cat_1' }
    )
    expect(view.result.current.resultCategory).toBeNull()
    await waitFor(() => expect(view.result.current.loading).toBe(false))
    expect(view.result.current).toMatchObject({
      resultCategory: 'cat_1',
      total: 8,
    })

    // The render after the switch: the old result is still there. This is what the category
    // tracking must not report as the new category's view.
    view.rerender('cat_2')
    expect(view.result.current.resultCategory).not.toBe('cat_2')

    await waitFor(() =>
      expect(view.result.current.resultCategory).toBe('cat_2')
    )
    expect(view.result.current.total).toBe(3)
  })
})

describe('the facets in the SEARCH event (feature-tracking-filters)', () => {
  it('a facet change is a new event, even when the count stays the same', () => {
    const color = [{ name: 'fashion_color__value', value: '5' }]
    const view = track(searchPage())
    view.rerender(searchPage({ filters: color }))
    const lists = fake.track.mock.calls.map(
      ([event]) => JSON.parse(event.payload).product_list
    )
    expect(lists.map((l) => [l.item_count, l.filters])).toEqual([
      [12, []],
      [12, color],
    ])
  })
})
