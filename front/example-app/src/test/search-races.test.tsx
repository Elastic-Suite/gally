// Out-of-order responses in the four search hooks: the fake search manager returns promises the
// test resolves by hand, in the wrong order on purpose. The latest request must win.
// See specs/bugfix-search-out-of-order-responses.md.
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ search: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr/search',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({ search: fake.search }),
}))

import { CatalogProvider } from '../contexts/CatalogContext'
import { useCmsAutocomplete, useCmsSearch } from '../hooks/useCms'
import { useAutocomplete, useSearch } from '../hooks/useSearch'
import { findLocalizedCatalog } from '../sdk/catalogs'
import type { ServerSearchResult } from '../sdk/server'
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
      {children}
    </CatalogProvider>
  )
}

// A response for one query: its name in the first document's sku/id and title, so the test can
// tell whose answer is on screen.
function answerFor(query: string, total = 1) {
  const doc = { sku: query, id: query, title: query }
  return {
    getCollection: () => [doc],
    getTotalCount: () => total,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [{ term: query }],
    getSortField: () => '_score',
    getSortDirection: () => 'desc',
  }
}

type Pending = {
  query: string
  resolve: (r: unknown) => void
  reject: (e: unknown) => void
}
let pending: Pending[] = []

beforeEach(() => {
  pending = []
  fake.search.mockReset()
  fake.search.mockImplementation(
    (o: { searchQuery?: string }) =>
      new Promise((resolve, reject) =>
        pending.push({ query: o.searchQuery ?? '', resolve, reject })
      )
  )
})
afterEach(() => {
  vi.useRealTimers()
})

const answer = (i: number) =>
  act(async () => {
    pending[i].resolve(answerFor(pending[i].query, pending[i].query.length))
  })

describe('useSearch', () => {
  const render = (q: string) =>
    renderHook(
      (props: { q: string; initialData?: ServerSearchResult }) =>
        useSearch({
          searchQuery: props.q,
          pageSize: 20,
          initialData: props.initialData,
        }),
      {
        wrapper: Providers,
        initialProps: { q } as {
          q: string
          initialData?: ServerSearchResult
        },
      }
    )

  it('keeps the newer answer when the older one arrives last', async () => {
    const view = render('robe')
    await waitFor(() => expect(pending).toHaveLength(1))
    view.rerender({ q: 'jupe!' })
    await waitFor(() => expect(pending).toHaveLength(2))
    await answer(1)
    await answer(0)
    expect(view.result.current).toMatchObject({
      resultQuery: 'jupe!',
      total: 5,
      loading: false,
      error: null,
    })
    expect(view.result.current.products.map((p) => p.sku)).toEqual(['jupe!'])
  })

  it('ignores a late error from the older request', async () => {
    const view = render('robe')
    await waitFor(() => expect(pending).toHaveLength(1))
    view.rerender({ q: 'jupe' })
    await waitFor(() => expect(pending).toHaveLength(2))
    await answer(1)
    await act(async () => pending[0].reject(new Error('timeout')))
    expect(view.result.current).toMatchObject({
      resultQuery: 'jupe',
      error: null,
    })
  })

  it('a server seed makes the request in flight stale', async () => {
    const view = render('robe')
    await waitFor(() => expect(pending).toHaveLength(1))
    const seed = { products: [], total: 42, pageCount: 3, aggregations: [] }
    view.rerender({ q: 'jupe', initialData: seed })
    await answer(0)
    expect(view.result.current).toMatchObject({
      total: 42,
      resultQuery: 'jupe',
      loading: false,
    })
  })
})

describe('useCmsSearch', () => {
  const render = (q: string) =>
    renderHook(
      (props: { q: string; skip?: boolean }) =>
        useCmsSearch({ searchQuery: props.q, skip: props.skip }),
      {
        wrapper: Providers,
        initialProps: { q } as { q: string; skip?: boolean },
      }
    )

  it('keeps the newer answer when the older one arrives last', async () => {
    const view = render('robe')
    await waitFor(() => expect(pending).toHaveLength(1))
    view.rerender({ q: 'jupe!' })
    await waitFor(() => expect(pending).toHaveLength(2))
    await answer(1)
    await answer(0)
    expect(view.result.current.pages.map((p) => p.id)).toEqual(['jupe!'])
    expect(view.result.current).toMatchObject({ total: 5, loading: false })
  })

  it('skip makes the request in flight stale', async () => {
    const view = render('robe')
    await waitFor(() => expect(pending).toHaveLength(1))
    view.rerender({ q: '', skip: true })
    await answer(0)
    expect(view.result.current).toMatchObject({ pages: [], loading: false })
  })
})

describe('autocomplete hooks', () => {
  // Sends the query through the 300 ms debounce, so the request leaves.
  const type = async (search: (q: string) => void, q: string) => {
    act(() => search(q))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
  }

  it('useAutocomplete keeps the latest query, and only the latest request ends loading', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAutocomplete(), {
      wrapper: Providers,
    })
    await type(result.current.search, 'ro')
    await type(result.current.search, 'rob')
    expect(pending.map((p) => p.query)).toEqual(['ro', 'rob'])

    await answer(0)
    // The older request is done, the newer one is still running.
    expect(result.current.loading).toBe(true)
    expect(result.current.results).toEqual([])

    await answer(1)
    expect(result.current.results.map((p) => p.sku)).toEqual(['rob'])
    expect(result.current.termSuggestions).toEqual([{ term: 'rob' }])
    expect(result.current.loading).toBe(false)
  })

  it('useAutocomplete: an answer arriving after the box went under 2 characters is dropped', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAutocomplete(), {
      wrapper: Providers,
    })
    await type(result.current.search, 'ro')
    act(() => result.current.search('r'))
    expect(result.current.loading).toBe(false)
    await answer(0)
    expect(result.current).toMatchObject({
      results: [],
      termSuggestions: [],
      loading: false,
    })
  })

  it('useAutocomplete: an answer arriving after clear() is dropped', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAutocomplete(), {
      wrapper: Providers,
    })
    await type(result.current.search, 'ro')
    act(() => result.current.clear())
    await answer(0)
    expect(result.current).toMatchObject({ results: [], loading: false })
  })

  it('useCmsAutocomplete keeps the latest query, and drops an answer after clear()', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCmsAutocomplete(), {
      wrapper: Providers,
    })
    await type(result.current.search, 'ro')
    await type(result.current.search, 'rob')
    await answer(1)
    await answer(0)
    expect(result.current.pages.map((p) => p.id)).toEqual(['rob'])
    expect(result.current.loading).toBe(false)

    await type(result.current.search, 'robe')
    act(() => result.current.clear())
    await answer(2)
    expect(result.current).toMatchObject({
      pages: [],
      termSuggestions: [],
      loading: false,
    })
  })
})
