// Strict mode, on purpose and only here: each case renders with { reactStrictMode: true }, so React
// mounts, unmounts and mounts again and runs every effect twice - what the dev server used to do.
// The parts with a request, a timer or a saved state must come out of that exactly as from a single
// mount. See specs/chore-strict-mode-in-tests.md.
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import { useEffect, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  search: vi.fn(),
  track: vi.fn(),
  push: vi.fn(),
  pathname: '/com_fr',
  linkPending: false,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => fake.pathname,
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('next/link', () => ({
  useLinkStatus: () => ({ pending: fake.linkPending }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({ search: fake.search }),
  getTracker: () => ({ push: fake.track }),
}))

import '../i18n'
import Facets from '../components/Facets'
import { CartProvider, useCart } from '../contexts/CartContext'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import {
  LinkPendingReporter,
  NavigationProvider,
  useNavigationPending,
} from '../contexts/NavigationContext'
import { useAddedFlash } from '../hooks/useAddedFlash'
import { useCmsSearch } from '../hooks/useCms'
import { useSearch } from '../hooks/useSearch'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS } from './fixtures'

const STRICT = { reactStrictMode: true }
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

function answer(total: number) {
  return {
    getCollection: () => [{ sku: 'A' }],
    getTotalCount: () => total,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => '_score',
    getSortDirection: () => 'desc',
  }
}

const flush = () => act(async () => {})

beforeEach(() => {
  fake.search.mockReset()
  fake.search.mockResolvedValue(answer(3))
  fake.track.mockReset()
  fake.push.mockReset()
  fake.pathname = '/com_fr'
  fake.linkPending = false
  window.localStorage.clear()
})
afterEach(() => {
  vi.useRealTimers()
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
    render(<Probe />, STRICT)
    expect(runs).toBe(2)
  })
})

describe('search hooks under a double mount', () => {
  it('useSearch with a server seed sends no request', async () => {
    const seed = { products: [], total: 42, pageCount: 1, aggregations: [] }
    const { result } = renderHook(
      () => useSearch({ searchQuery: 'robe', initialData: seed }),
      { wrapper: Providers, ...STRICT }
    )
    await flush()
    expect(fake.search).not.toHaveBeenCalled()
    expect(result.current).toMatchObject({ total: 42, settled: true })
  })

  it('useSearch without a seed ends settled with its one result', async () => {
    const { result } = renderHook(() => useSearch({ searchQuery: 'robe' }), {
      wrapper: Providers,
      ...STRICT,
    })
    await flush()
    // The double mount may send the request twice; only the latest answer lands.
    expect(fake.search.mock.calls.length).toBeLessThanOrEqual(2)
    expect(result.current).toMatchObject({
      total: 3,
      loading: false,
      settled: true,
    })
  })

  it('useCmsSearch with a server seed sends no request', async () => {
    const pages = [{ id: '9' }] as unknown as Parameters<
      typeof useCmsSearch
    >[0]['initialPages']
    renderHook(
      () => useCmsSearch({ searchQuery: 'robe', initialPages: pages }),
      {
        wrapper: Providers,
        ...STRICT,
      }
    )
    await flush()
    expect(fake.search).not.toHaveBeenCalled()
  })
})

describe('cart under a double mount', () => {
  it('loads the saved cart once; an add gives one line and one ADD_TO_CART', async () => {
    window.localStorage.setItem(
      'gally-example-cart:com',
      JSON.stringify([{ sku: 'OLD', name: 'Old', price: 5, qty: 1 }])
    )
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <Providers>
          <CartProvider>{children}</CartProvider>
        </Providers>
      ),
      ...STRICT,
    })
    await flush()
    expect(result.current.items.map((i) => i.sku)).toEqual(['OLD'])
    act(() => result.current.addToCart({ sku: 'NEW', name: 'New', price: 10 }))
    await flush()
    expect(result.current.items.map((i) => [i.sku, i.qty])).toEqual([
      ['OLD', 1],
      ['NEW', 1],
    ])
    expect(
      fake.track.mock.calls.filter(([e]) => e.eventType === 'add_to_cart')
    ).toHaveLength(1)
    expect(
      JSON.parse(window.localStorage.getItem('gally-example-cart:com')!)
    ).toHaveLength(2)
  })
})

describe('timers under a double mount', () => {
  it('the navigation indicator shows after 150 ms, clears, and leaves no timer', async () => {
    vi.useFakeTimers()
    const seen: { pending: string | null } = { pending: null }
    function Probe() {
      const pending = useNavigationPending()
      // In an effect: writing to an outside object during render breaks the react-hooks rules.
      useEffect(() => {
        seen.pending = pending
      })
      return null
    }
    fake.linkPending = true
    const App = () => (
      <NavigationProvider>
        <Probe />
        <LinkPendingReporter href="/com_fr/blog" />
      </NavigationProvider>
    )
    const view = render(<App />, STRICT)
    act(() => vi.advanceTimersByTime(149))
    expect(seen.pending).toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(seen.pending).toBe('/com_fr/blog')
    fake.pathname = '/com_fr/blog'
    view.rerender(<App />)
    expect(seen.pending).toBeNull()
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('a navigation that ends before 150 ms leaves no timer behind', () => {
    // A leftover show-timer would fire later and make the next navigation's indicator appear at
    // once instead of after 150 ms.
    vi.useFakeTimers()
    fake.linkPending = true
    const App = () => (
      <NavigationProvider>
        <LinkPendingReporter href="/com_fr/cart" />
      </NavigationProvider>
    )
    const view = render(<App />, STRICT)
    act(() => vi.advanceTimersByTime(100))
    fake.pathname = '/com_fr/cart'
    view.rerender(<App />)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('the "added" flash ends once, after 1.6 s, and leaves no timer', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(() => useAddedFlash(), STRICT)
    act(() => result.current.flash('A'))
    act(() => vi.advanceTimersByTime(1599))
    expect(result.current.addedKey).toBe('A')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.addedKey).toBeNull()
    act(() => result.current.flash('B'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('the price slider commits once, 400 ms after the last move', () => {
    vi.useFakeTimers()
    const onFilterChange = vi.fn()
    render(
      <Facets
        aggregations={[
          {
            field: 'price__price',
            label: 'Price',
            type: 'slider',
            options: [
              { label: '10', value: '10', count: 1 },
              { label: '100', value: '100', count: 1 },
            ],
          },
        ]}
        activeFilters={{}}
        onFilterChange={onFilterChange}
        resultCount={2}
      />,
      STRICT
    )
    const [low] = screen.getAllByRole('slider')
    fireEvent.change(low, { target: { value: '20' } })
    fireEvent.change(low, { target: { value: '30' } })
    act(() => vi.advanceTimersByTime(399))
    expect(onFilterChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onFilterChange.mock.calls).toEqual([
      ['price__price', { gte: 30, lte: 100 }],
    ])
  })
})
