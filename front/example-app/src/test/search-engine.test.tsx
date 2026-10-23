// The client search engine: the request each hook builds, the server seed and when a new request
// goes out, the loading and error states, and the autocomplete hooks. The SDK search manager is a
// fake that records each request and answers at once.
// See specs/test-plan-search-engine.md (out-of-order answers are in search-races.test.tsx).
import { act, render, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  search: vi.fn(),
  viewMore: vi.fn(),
  locale: 'com_fr',
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr/search',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({
    search: fake.search,
    viewMoreProductFilterOption: fake.viewMore,
  }),
}))

import { CatalogProvider } from '../contexts/CatalogContext'
import { useCmsAutocomplete, useCmsSearch } from '../hooks/useCms'
import { useAutocomplete, useSearch } from '../hooks/useSearch'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CMS_FIELDS, productFields } from '../sdk/fields'
import type { ServerSearchResult } from '../sdk/server'
import { CATALOGS } from './fixtures'

function Providers({ children }: { children: ReactNode }) {
  const resolved = findLocalizedCatalog(CATALOGS, fake.locale)!
  return (
    <CatalogProvider
      catalogs={CATALOGS}
      selectedCatalog={resolved.catalog}
      selectedLocalizedCatalog={resolved.localizedCatalog}
      categories={[]}
    >
      {children}
    </CatalogProvider>
  )
}

function answer(total = 2) {
  return {
    getCollection: () => [{ sku: 'A', id: 'A', title: 'A' }],
    getTotalCount: () => total,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [{ term: 'robe' }],
    getSortField: () => '_score',
    getSortDirection: () => 'desc',
  }
}

const requests = () => fake.search.mock.calls.map(([options]) => options)
const lastRequest = () => requests().at(-1)

beforeEach(() => {
  fake.locale = 'com_fr'
  fake.search.mockReset()
  fake.search.mockResolvedValue(answer())
  fake.viewMore.mockReset()
})
afterEach(() => {
  vi.useRealTimers()
})

type Options = Parameters<typeof useSearch>[0]
const search = (options: Options) =>
  renderHook((o: Options) => useSearch(o), {
    wrapper: Providers,
    initialProps: options,
  })

describe('A - the request useSearch builds', () => {
  const BASE = {
    localizedCatalog: 'com_fr',
    metadata: 'product',
    currentPage: 1,
    pageSize: 20,
    isAutocomplete: false,
    selectedFields: productFields('com'),
    filters: [],
  }

  it('a query searches it', async () => {
    search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    expect(lastRequest()).toEqual({
      ...BASE,
      searchQuery: 'robe',
      categoryId: undefined,
      sortField: undefined,
      sortDirection: undefined,
    })
  })

  it('a category with no query browses the category', async () => {
    search({ categoryCode: 'cat_1' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    expect(lastRequest()).toMatchObject({
      searchQuery: undefined,
      categoryId: 'cat_1',
    })
  })

  it("no category and no query sends '*' (pinned, very low case: bugfix-search-wildcard-empty-results)", async () => {
    search({})
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    expect(lastRequest()).toMatchObject({
      searchQuery: '*',
      categoryId: undefined,
    })
  })

  it('passes page, page size, fields, filters and sort through', async () => {
    const filters = [{ fashion_color__value: { in: ['5'] } }]
    search({
      searchQuery: 'robe',
      currentPage: 3,
      pageSize: 12,
      selectedFields: ['sku'],
      filters,
      sortField: 'price__price',
      sortDirection: 'asc',
    })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    expect(lastRequest()).toMatchObject({
      currentPage: 3,
      pageSize: 12,
      selectedFields: ['sku'],
      filters,
      sortField: 'price__price',
      sortDirection: 'asc',
    })
  })
})

describe('A - viewMoreOptions (feature-facet-load-more)', () => {
  it('asks for one facet with the current query, category and filters', async () => {
    fake.viewMore.mockResolvedValue([{ label: 'Red', value: '5', count: 3 }])
    const filters = [{ fashion_size__value: { in: ['33'] } }]
    const view = search({ searchQuery: 'robe', filters })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    const options = await view.result.current.viewMoreOptions(
      'fashion_color__value',
      'gr'
    )
    expect(options).toEqual([{ label: 'Red', value: '5', count: 3 }])
    expect(fake.viewMore).toHaveBeenCalledWith(
      {
        localizedCatalog: 'com_fr',
        metadata: 'product',
        searchQuery: 'robe',
        filters,
        categoryId: undefined,
        isAutocomplete: false,
        selectedFields: [],
        currentPage: 1,
        pageSize: 1,
      },
      'fashion_color__value',
      'gr'
    )
  })

  it("browsing a category sends no query; an empty search sends '*'", async () => {
    fake.viewMore.mockResolvedValue([])
    const category = search({ categoryCode: 'cat_1' })
    await category.result.current.viewMoreOptions('f')
    expect(fake.viewMore.mock.calls[0][0]).toMatchObject({
      searchQuery: undefined,
      categoryId: 'cat_1',
    })
    const empty = search({ searchQuery: '' })
    await empty.result.current.viewMoreOptions('f')
    expect(fake.viewMore.mock.calls[1][0]).toMatchObject({ searchQuery: '*' })
  })

  it('gives [] when the API fails', async () => {
    fake.viewMore.mockRejectedValue(new Error('down'))
    const view = search({ searchQuery: 'robe' })
    expect(await view.result.current.viewMoreOptions('f')).toEqual([])
  })
})

describe('A - the other hooks', () => {
  it('useCmsSearch asks cms_page with CMS_FIELDS, 10 per page, and sends an empty query as none', async () => {
    renderHook(() => useCmsSearch({ searchQuery: '' }), { wrapper: Providers })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    expect(lastRequest()).toMatchObject({
      localizedCatalog: 'com_fr',
      metadata: 'cms_page',
      searchQuery: undefined,
      pageSize: 10,
      currentPage: 1,
      isAutocomplete: false,
      selectedFields: CMS_FIELDS,
      filters: [],
    })
  })

  it('useAutocomplete asks 8 products as an autocomplete; useCmsAutocomplete 4 articles', async () => {
    vi.useFakeTimers()
    const products = renderHook(() => useAutocomplete(), { wrapper: Providers })
    const articles = renderHook(() => useCmsAutocomplete(), {
      wrapper: Providers,
    })
    act(() => products.result.current.search('robe'))
    act(() => articles.result.current.search('robe'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(requests()).toEqual([
      expect.objectContaining({
        metadata: 'product',
        searchQuery: 'robe',
        pageSize: 8,
        isAutocomplete: true,
        selectedFields: productFields('com'),
      }),
      expect.objectContaining({
        metadata: 'cms_page',
        searchQuery: 'robe',
        pageSize: 4,
        selectedFields: CMS_FIELDS,
      }),
    ])
  })
})

describe('B - server seed and new requests (bugfix-ssr-product-list-behind-suspense)', () => {
  const SEED: ServerSearchResult = {
    products: [],
    total: 42,
    pageCount: 3,
    aggregations: [],
  }

  it('a seeded hook shows the seed at once and sends no request', async () => {
    const view = search({ searchQuery: 'robe', initialData: SEED })
    expect(view.result.current).toMatchObject({
      total: 42,
      loading: false,
      error: null,
    })
    await act(async () => {})
    expect(fake.search).not.toHaveBeenCalled()
  })

  it('a re-render with the same options sends nothing new', async () => {
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    view.rerender({ searchQuery: 'robe' })
    await act(async () => {})
    expect(fake.search).toHaveBeenCalledTimes(1)
  })

  it.each<[string, Options]>([
    ['the query', { searchQuery: 'jupe' }],
    ['the category', { searchQuery: 'robe', categoryCode: 'cat_1' }],
    ['the page', { searchQuery: 'robe', currentPage: 2 }],
    ['the sort field', { searchQuery: 'robe', sortField: 'price__price' }],
    ['the sort direction', { searchQuery: 'robe', sortDirection: 'asc' }],
    ['the page size', { searchQuery: 'robe', pageSize: 40 }],
    ['the filters', { searchQuery: 'robe', filters: [{ a: { eq: '1' } }] }],
  ])('changing %s sends a new request', async (_name, next) => {
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    view.rerender(next)
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(2))
  })

  it('changing only the fields sends nothing new (they are not part of the key)', async () => {
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    view.rerender({ searchQuery: 'robe', selectedFields: ['sku'] })
    await act(async () => {})
    expect(fake.search).toHaveBeenCalledTimes(1)
  })

  it('leaving the seeded options sends a request; a new seed for new options is used as is', async () => {
    const view = search({ searchQuery: 'robe', initialData: SEED })
    view.rerender({ searchQuery: 'robe', currentPage: 2 })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    const jupe = { ...SEED, total: 7 }
    view.rerender({ searchQuery: 'jupe', initialData: jupe })
    await act(async () => {})
    expect(fake.search).toHaveBeenCalledTimes(1)
    expect(view.result.current).toMatchObject({
      total: 7,
      resultQuery: 'jupe',
      loading: false,
    })
  })

  it('switching catalog sends a new request for the new catalog', async () => {
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    fake.locale = 'com_en'
    view.rerender({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(2))
    expect(lastRequest()).toMatchObject({ localizedCatalog: 'com_en' })
  })

  it('useCmsSearch: a seed sends no request, a change does, skip sends none and stops loading', async () => {
    const pages = [{ id: '9' }] as unknown as Parameters<
      typeof useCmsSearch
    >[0]['initialPages']
    const view = renderHook(
      (o: Parameters<typeof useCmsSearch>[0]) => useCmsSearch(o),
      {
        wrapper: Providers,
        initialProps: {
          searchQuery: 'robe',
          initialPages: pages,
        } as Parameters<typeof useCmsSearch>[0],
      }
    )
    await act(async () => {})
    expect(fake.search).not.toHaveBeenCalled()
    view.rerender({ searchQuery: 'jupe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    view.rerender({ searchQuery: '', skip: true })
    await act(async () => {})
    expect(fake.search).toHaveBeenCalledTimes(1)
    expect(view.result.current.loading).toBe(false)
  })
})

describe('C - states', () => {
  it('without a seed, loading is true from the first render - never a false "no results"', async () => {
    const seen: boolean[] = []
    function Probe() {
      seen.push(useSearch({ searchQuery: 'robe' }).loading)
      return null
    }
    render(<Probe />, { wrapper: Providers })
    await waitFor(() => expect(seen.at(-1)).toBe(false))
    expect(seen[0]).toBe(true)
  })

  it('an error keeps the previous products and sets error; the next success clears it', async () => {
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(view.result.current.total).toBe(2))
    fake.search.mockRejectedValueOnce(new Error('API down'))
    view.rerender({ searchQuery: 'jupe' })
    await waitFor(() => expect(view.result.current.error).toBe('API down'))
    expect(view.result.current).toMatchObject({ total: 2, loading: false })
    expect(view.result.current.products).toHaveLength(1)
    view.rerender({ searchQuery: 'jupes' })
    await waitFor(() => expect(view.result.current.error).toBeNull())
  })

  it('useCmsSearch with skip empties its result (bugfix-search-stale-articles-without-query)', async () => {
    const view = renderHook(
      (o: Parameters<typeof useCmsSearch>[0]) => useCmsSearch(o),
      {
        wrapper: Providers,
        initialProps: { searchQuery: 'robe' } as Parameters<
          typeof useCmsSearch
        >[0],
      }
    )
    await waitFor(() => expect(view.result.current.pages).toHaveLength(1))
    view.rerender({ searchQuery: '', skip: true })
    await act(async () => {})
    expect(view.result.current).toMatchObject({
      pages: [],
      total: 0,
      loading: false,
      error: null,
    })
  })
})

describe('D - autocomplete hooks (feature-acp-real-term-suggestions, feature-blog-cms)', () => {
  const setup = () => {
    vi.useFakeTimers()
    return {
      products: renderHook(() => useAutocomplete(), { wrapper: Providers }),
      articles: renderHook(() => useCmsAutocomplete(), { wrapper: Providers }),
    }
  }
  const wait = (ms: number) =>
    act(async () => {
      await vi.advanceTimersByTimeAsync(ms)
    })

  it('fewer than 2 characters clears everything without a request', async () => {
    const { products, articles } = setup()
    act(() => products.result.current.search('robe'))
    act(() => articles.result.current.search('robe'))
    await wait(300)
    expect(products.result.current.results).toHaveLength(1)
    act(() => products.result.current.search('r'))
    act(() => articles.result.current.search('r'))
    await wait(300)
    expect(fake.search).toHaveBeenCalledTimes(2)
    expect(products.result.current).toMatchObject({
      results: [],
      aggregations: [],
      termSuggestions: [],
    })
    expect(articles.result.current).toMatchObject({
      pages: [],
      termSuggestions: [],
    })
  })

  it('waits 300 ms and sends only the last query', async () => {
    const { products } = setup()
    for (const q of ['ro', 'rob', 'robe']) {
      act(() => products.result.current.search(q))
      await wait(100)
    }
    expect(fake.search).not.toHaveBeenCalled()
    await wait(200)
    expect(requests().map((r) => r.searchQuery)).toEqual(['robe'])
  })

  it('term suggestions come from the same request, no extra round trip', async () => {
    const { products, articles } = setup()
    act(() => products.result.current.search('robe'))
    act(() => articles.result.current.search('robe'))
    await wait(300)
    expect(fake.search).toHaveBeenCalledTimes(2)
    expect(products.result.current.termSuggestions).toEqual([{ term: 'robe' }])
    expect(articles.result.current.termSuggestions).toEqual([{ term: 'robe' }])
  })

  it('clear() and an error empty everything', async () => {
    const { products } = setup()
    act(() => products.result.current.search('robe'))
    await wait(300)
    act(() => products.result.current.clear())
    expect(products.result.current).toMatchObject({
      results: [],
      termSuggestions: [],
    })
    fake.search.mockRejectedValueOnce(new Error('down'))
    act(() => products.result.current.search('jupe'))
    await wait(300)
    expect(products.result.current).toMatchObject({
      results: [],
      termSuggestions: [],
      loading: false,
    })
  })
})

describe('skip (bugfix-story-companion-requests)', () => {
  it('sends no request and never shows loading', async () => {
    const seen: boolean[] = []
    function Probe() {
      seen.push(useSearch({ pageSize: 0, skip: true }).loading)
      return null
    }
    render(<Probe />, { wrapper: Providers })
    await act(async () => {})
    expect(fake.search).not.toHaveBeenCalled()
    expect(seen.every((loading) => loading === false)).toBe(true)
  })

  it('turning skip off sends the request', async () => {
    const view = search({ searchQuery: 'robe', skip: true })
    await act(async () => {})
    expect(fake.search).not.toHaveBeenCalled()
    view.rerender({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
  })

  it('drops a request already in flight', async () => {
    let resolve!: (r: unknown) => void
    fake.search.mockImplementationOnce(() => new Promise((r) => (resolve = r)))
    const view = search({ searchQuery: 'robe' })
    await waitFor(() => expect(fake.search).toHaveBeenCalledTimes(1))
    view.rerender({ searchQuery: 'robe', skip: true })
    await act(async () => resolve(answer(9)))
    expect(view.result.current).toMatchObject({ total: 0, loading: false })
  })
})

describe('settled (bugfix-tracking-stale-count-after-facet)', () => {
  it('is never true while the result still answers the previous facets', async () => {
    fake.search.mockImplementation(async (o: { filters?: unknown[] }) =>
      answer(o.filters?.length ? 1 : 2)
    )
    const seen: { facets: number; total: number; settled: boolean }[] = []
    function Probe({ filters }: { filters?: Options['filters'] }) {
      const r = useSearch({ searchQuery: 'robe', filters })
      seen.push({
        facets: filters?.length ?? 0,
        total: r.total,
        settled: r.settled,
      })
      return null
    }
    const view = render(<Probe />, { wrapper: Providers })
    await waitFor(() => expect(seen.at(-1)?.settled).toBe(true))
    view.rerender(<Probe filters={[{ a: { eq: '1' } }]} />)
    await waitFor(() =>
      expect(seen.at(-1)).toMatchObject({ settled: true, total: 1 })
    )
    // The stale render happens: the new facet is on screen with the old count...
    expect(seen).toContainEqual({ facets: 1, total: 2, settled: false })
    // ...and every settled render shows the count of its own facets.
    for (const r of seen.filter((r) => r.settled)) {
      expect(r.total).toBe(r.facets ? 1 : 2)
    }
  })
})
