// The tracking wiring of the two listing pages, end to end in jsdom: SearchPage and CategoryPage
// are rendered with a fake search manager and a fake tracker, the test acts as a visitor (search,
// facet, sort, page, switch), and checks exactly which events go out.
// Facets, SortSelect and Pagination are stubs that hand their callbacks to the test.
// See specs/feature-tracking-sort.md, feature-tracking-filters.md,
// bugfix-search-zero-result-tracking.md and bugfix-category-view-stale-count.md.
import { act, render, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type Callbacks = {
  onFilterChange?: (field: string, value: unknown) => void
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  onPage?: (page: number) => void
}

const fake = vi.hoisted(() => ({
  params: new URLSearchParams('q=robe'),
  route: { code: 'cat_1' } as Record<string, string>,
  track: vi.fn(),
  search: vi.fn(),
  ui: {} as Callbacks,
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => fake.params,
  useParams: () => fake.route,
  usePathname: () => '/com_fr/search',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({ search: fake.search }),
  getTracker: () => ({ push: fake.track }),
}))

// Stubs that hand their callback to the test. Set in an effect: writing to an outside object
// during render breaks the react-hooks rules.
vi.mock('../components/Facets', async () => {
  const { useEffect } = await import('react')
  return {
    default: function FacetsStub(p: {
      onFilterChange: Callbacks['onFilterChange']
    }) {
      useEffect(() => {
        fake.ui.onFilterChange = p.onFilterChange
      })
      return null
    },
  }
})
vi.mock('../components/SortSelect', async () => {
  const { useEffect } = await import('react')
  return {
    default: function SortStub(p: { onChange: Callbacks['onSort'] }) {
      useEffect(() => {
        fake.ui.onSort = p.onChange
      })
      return null
    },
  }
})
vi.mock('../components/Pagination', async () => {
  const { useEffect } = await import('react')
  return {
    default: function PaginationStub(p: { onPage: Callbacks['onPage'] }) {
      useEffect(() => {
        fake.ui.onPage = p.onPage
      })
      return null
    },
  }
})
vi.mock('../components/ProductCard', () => ({ default: () => null }))
vi.mock('../components/BlogCard', () => ({ default: () => null }))
vi.mock('../components/ProductImage', () => ({ default: () => null }))
vi.mock('../components/Breadcrumb', () => ({ default: () => null }))
vi.mock('../components/LocaleLink', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}))

import '../i18n'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import SearchPage from '../views/SearchPage'
import CategoryPage from '../views/CategoryPage'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="com_fr">
      <CatalogProvider
        catalogs={CATALOGS}
        selectedCatalog={comFr.catalog}
        selectedLocalizedCatalog={comFr.localizedCatalog}
        categories={CATEGORY_TREE}
      >
        <EventLogProvider>{children}</EventLogProvider>
      </CatalogProvider>
    </LocaleProvider>
  )
}

// Result counts per query and per category; a facet removes one (see answer()). Facets in the
// tracking key with an unchanged count are covered by track-search.test.tsx.
const TOTALS: Record<string, number> = {
  robe: 12,
  jupe: 3,
  xyzzy: 0,
  cat_1: 8,
  cat_2: 4,
}

function response(total: number, sortField: string, sortDirection: string) {
  return {
    getCollection: () => [],
    getTotalCount: () => total,
    getLastPage: () => 3,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => sortField,
    getSortDirection: () => sortDirection,
  }
}

type SearchOptions = {
  metadata: string
  searchQuery?: string
  categoryId?: string
  sortField?: string
  sortDirection?: string
  filters?: unknown[]
}

async function answer(o: SearchOptions) {
  if (o.metadata === 'cms_page') return response(0, '_score', 'desc')
  const key = o.categoryId ?? o.searchQuery ?? ''
  // A category with no sort picked gets its own default from the API.
  const sortField =
    o.sortField ?? (o.categoryId ? 'category__position' : '_score')
  // A facet removes one product, like a real facet changes the count. This is what made the stale
  // event visible: the page used to send the new facets with the old count first
  // (specs/bugfix-tracking-stale-count-after-facet.md).
  const total = (TOTALS[key] ?? 0) - (o.filters?.length ? 1 : 0)
  return response(total, sortField, o.sortDirection ?? 'asc')
}

type Sent = {
  what: string
  count: number
  page: number
  sort: string
  direction: string
  filters: { name: string; value: string }[]
}

function sent(eventType: 'search' | 'view'): Sent[] {
  return fake.track.mock.calls
    .map(([event]) => event)
    .filter(
      (e) =>
        e.eventType === eventType &&
        (eventType === 'search' || e.metadataCode === 'category')
    )
    .map((e) => {
      const payload = JSON.parse(e.payload)
      const list = payload.product_list
      return {
        what:
          eventType === 'search'
            ? payload.search_query.query_text
            : e.entityCode,
        count: list.item_count,
        page: list.current_page,
        sort: list.sort_order,
        direction: list.sort_direction,
        filters: list.filters,
      }
    })
}

// Lets every pending search resolve and every effect run.
const settle = () =>
  act(async () => {
    await new Promise((r) => setTimeout(r, 0))
  })

beforeEach(() => {
  fake.track.mockReset()
  fake.search.mockReset()
  fake.search.mockImplementation(answer)
  fake.ui = {}
  fake.params = new URLSearchParams('q=robe')
  fake.route = { code: 'cat_1' }
  // The pages scroll to the top on a facet or page change; jsdom has no scrolling.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

const BASE: Omit<Sent, 'what' | 'count'> = {
  page: 1,
  sort: 'relevance',
  direction: 'desc',
  filters: [],
}

describe('SearchPage tracking', () => {
  it('sends one SEARCH for a search, then one per facet, sort and page change', async () => {
    render(<SearchPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('search')).toHaveLength(1))

    act(() => fake.ui.onFilterChange!('fashion_color__value', ['5']))
    await waitFor(() => expect(sent('search')).toHaveLength(2))

    act(() => fake.ui.onSort!('price__price', 'asc'))
    await waitFor(() => expect(sent('search')).toHaveLength(3))

    act(() => fake.ui.onPage!(2))
    await waitFor(() => expect(sent('search')).toHaveLength(4))
    await settle()

    const color = [{ name: 'fashion_color__value', value: '5' }]
    expect(sent('search')).toEqual([
      { ...BASE, what: 'robe', count: 12 },
      // One event per change, each with the count of its own options - never the previous count.
      { ...BASE, what: 'robe', count: 11, filters: color },
      {
        ...BASE,
        what: 'robe',
        count: 11,
        filters: color,
        sort: 'price__price',
        direction: 'asc',
      },
      {
        ...BASE,
        what: 'robe',
        count: 11,
        filters: color,
        sort: 'price__price',
        direction: 'asc',
        page: 2,
      },
    ])
  })

  it('sends a zero-result search with count 0', async () => {
    fake.params = new URLSearchParams('q=xyzzy')
    render(<SearchPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('search')).toHaveLength(1))
    expect(sent('search')[0]).toMatchObject({ what: 'xyzzy', count: 0 })
  })

  it('never sends the new query with the previous count', async () => {
    const view = render(<SearchPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('search')).toHaveLength(1))
    fake.params = new URLSearchParams('q=jupe')
    view.rerender(<SearchPage />)
    await waitFor(() => expect(sent('search')).toHaveLength(2))
    await settle()
    expect(sent('search').map((e) => [e.what, e.count])).toEqual([
      ['robe', 12],
      ['jupe', 3],
    ])
  })

  it('sends nothing for a failed search', async () => {
    fake.search.mockImplementation(async (o: SearchOptions) => {
      if (o.metadata === 'cms_page') return answer(o)
      throw new Error('API down')
    })
    render(<SearchPage />, { wrapper: Providers })
    await settle()
    await settle()
    expect(sent('search')).toEqual([])
  })
})

describe('CategoryPage tracking', () => {
  const CAT: Omit<Sent, 'what' | 'count'> = {
    page: 1,
    sort: 'position',
    direction: 'asc',
    filters: [],
  }

  it('sends one VIEW, then one per facet, sort and page change', async () => {
    render(<CategoryPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('view')).toHaveLength(1))

    act(() => fake.ui.onFilterChange!('price__price', { gte: 10, lte: 50 }))
    await waitFor(() => expect(sent('view')).toHaveLength(2))

    act(() => fake.ui.onSort!('price__price', 'desc'))
    await waitFor(() => expect(sent('view')).toHaveLength(3))

    act(() => fake.ui.onPage!(2))
    await waitFor(() => expect(sent('view')).toHaveLength(4))
    await settle()

    const price = [{ name: 'price__price', value: '10-50' }]
    expect(sent('view')).toEqual([
      // No sort picked: the sort the API reports it applied.
      { ...CAT, what: 'cat_1', count: 8 },
      { ...CAT, what: 'cat_1', count: 7, filters: price },
      {
        ...CAT,
        what: 'cat_1',
        count: 7,
        filters: price,
        sort: 'price__price',
        direction: 'desc',
      },
      {
        ...CAT,
        what: 'cat_1',
        count: 7,
        filters: price,
        sort: 'price__price',
        direction: 'desc',
        page: 2,
      },
    ])
  })

  it('never sends the new category with the previous count', async () => {
    const view = render(<CategoryPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('view')).toHaveLength(1))
    fake.route = { code: 'cat_2' }
    view.rerender(<CategoryPage />)
    await waitFor(() => expect(sent('view')).toHaveLength(2))
    await settle()
    expect(sent('view').map((e) => [e.what, e.count])).toEqual([
      ['cat_1', 8],
      ['cat_2', 4],
    ])
  })
})

// SortSelect calls onChange(field, naturalDirection) on a pick - '_score' desc, anything else asc -
// and onChange(field, opposite) on the direction toggle (SortSelect.tsx).
describe('sort changes in detail', () => {
  const pairs = (events: Sent[]) =>
    events.map((e) => [e.page, e.sort, e.direction])

  it('search: a sort change on page 2 goes back to page 1, toggling the direction and going back to relevance each send an event', async () => {
    render(<SearchPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('search')).toHaveLength(1))
    act(() => fake.ui.onPage!(2))
    await waitFor(() => expect(sent('search')).toHaveLength(2))
    act(() => fake.ui.onSort!('price__price', 'asc'))
    await waitFor(() => expect(sent('search')).toHaveLength(3))
    act(() => fake.ui.onSort!('price__price', 'desc'))
    await waitFor(() => expect(sent('search')).toHaveLength(4))
    act(() => fake.ui.onSort!('_score', 'desc'))
    await waitFor(() => expect(sent('search')).toHaveLength(5))
    await settle()
    expect(pairs(sent('search'))).toEqual([
      [1, 'relevance', 'desc'],
      [2, 'relevance', 'desc'],
      [1, 'price__price', 'asc'],
      [1, 'price__price', 'desc'],
      [1, 'relevance', 'desc'],
    ])
  })

  it('category: the same, back to position', async () => {
    render(<CategoryPage />, { wrapper: Providers })
    await waitFor(() => expect(sent('view')).toHaveLength(1))
    act(() => fake.ui.onPage!(2))
    await waitFor(() => expect(sent('view')).toHaveLength(2))
    act(() => fake.ui.onSort!('name', 'asc'))
    await waitFor(() => expect(sent('view')).toHaveLength(3))
    act(() => fake.ui.onSort!('name', 'desc'))
    await waitFor(() => expect(sent('view')).toHaveLength(4))
    act(() => fake.ui.onSort!('category__position', 'asc'))
    await waitFor(() => expect(sent('view')).toHaveLength(5))
    await settle()
    expect(pairs(sent('view'))).toEqual([
      [1, 'position', 'asc'],
      [2, 'position', 'asc'],
      [1, 'name', 'asc'],
      [1, 'name', 'desc'],
      [1, 'position', 'asc'],
    ])
  })
})
