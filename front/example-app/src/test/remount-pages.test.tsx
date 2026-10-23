// Strict mode on the two listing pages: React mounts, unmounts and mounts again and runs every
// effect twice, as the dev server used to. The pages must still send exactly one event per change -
// SEARCH or VIEW, and DISPLAY - never doubled. Same harness as page-tracking.test.tsx.
// See specs/chore-strict-mode-in-tests.md.
import { act, render, waitFor } from '@testing-library/react'
import { useEffect, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  params: new URLSearchParams('q=robe'),
  route: { code: 'cat_1' } as Record<string, string>,
  track: vi.fn(),
  search: vi.fn(),
  ui: {} as { onFilterChange?: (field: string, value: unknown) => void },
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
vi.mock('../components/Facets', async () => {
  const { useEffect } = await import('react')
  return {
    default: function FacetsStub(p: {
      onFilterChange: (field: string, value: unknown) => void
    }) {
      useEffect(() => {
        fake.ui.onFilterChange = p.onFilterChange
      })
      return null
    },
  }
})
vi.mock('../components/SortSelect', () => ({ default: () => null }))
vi.mock('../components/Pagination', () => ({ default: () => null }))
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

type SearchOptions = {
  metadata: string
  filters?: unknown[]
  categoryId?: string
}

// One product per result, so DISPLAY fires too; a facet removes nothing here - the count is not
// the point, the number of events is.
async function answer(o: SearchOptions) {
  const products =
    o.metadata === 'cms_page' ? [] : [{ sku: o.filters?.length ? 'B' : 'A' }]
  return {
    getCollection: () => products,
    getTotalCount: () => products.length,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => (o.categoryId ? 'category__position' : '_score'),
    getSortDirection: () => 'asc',
  }
}

const count = (eventType: string) =>
  fake.track.mock.calls.filter(([e]) => e.eventType === eventType).length
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
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

const STRICT = { wrapper: Providers, reactStrictMode: true }

describe('listing pages under a double mount send each event once', () => {
  it('SearchPage: one SEARCH and one DISPLAY per state, a facet adds one of each', async () => {
    render(<SearchPage />, STRICT)
    await waitFor(() => expect(count('search')).toBe(1))
    await settle()
    expect([count('search'), count('display')]).toEqual([1, 1])

    act(() => fake.ui.onFilterChange!('fashion_color__value', ['5']))
    await waitFor(() => expect(count('search')).toBe(2))
    await settle()
    expect([count('search'), count('display')]).toEqual([2, 2])
  })

  it('CategoryPage: one VIEW and one DISPLAY per state, a facet adds one of each', async () => {
    render(<CategoryPage />, STRICT)
    await waitFor(() => expect(count('view')).toBe(1))
    await settle()
    expect([count('view'), count('display')]).toEqual([1, 1])

    act(() => fake.ui.onFilterChange!('price__price', { gte: 10, lte: 50 }))
    await waitFor(() => expect(count('view')).toBe(2))
    await settle()
    expect([count('view'), count('display')]).toEqual([2, 2])
  })
})

describe('strict mode is really on in this file', () => {
  it('runs a mount effect twice', () => {
    let runs = 0
    function Probe() {
      useEffect(() => {
        runs++
      }, [])
      return null
    }
    render(<Probe />, { reactStrictMode: true })
    expect(runs).toBe(2)
  })
})
