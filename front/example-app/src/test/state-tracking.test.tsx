// The tracking events sent by useTracking, and their copy in the on-screen event log.
// The SDK tracker is a fake. See specs/test-plan-shared-state.md, part D.
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ track: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getTracker: () => ({ push: fake.track }),
}))

import '../i18n'
import { TrackingEventValidator } from '@elastic-suite/gally-sdk/browser'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider, useEventLog } from '../contexts/EventLogContext'
import {
  categoryTrackedSort,
  trackingFilters,
  trackingSortOrder,
  useTracking,
} from '../hooks/useTracking'
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

const setup = () =>
  renderHook(() => ({ track: useTracking(), log: useEventLog() }), {
    wrapper: Providers,
  })

const sent = () =>
  fake.track.mock.calls.map(([event]) => ({
    ...event,
    payload:
      event.payload === undefined ? undefined : JSON.parse(event.payload),
  }))

beforeEach(() => {
  fake.track.mockReset()
})

type Track = ReturnType<typeof useTracking>

describe('each track function sends its event', () => {
  const list = (n: number) => ({
    item_count: n,
    current_page: 1,
    page_count: 2,
    filters: [],
  })

  it.each<[string, (t: Track) => void, object, string]>([
    [
      'category view',
      (t) => t.trackCategoryView('cat_1', 20, 1, 2),
      {
        eventType: 'view',
        metadataCode: 'category',
        entityCode: 'cat_1',
        payload: {
          product_list: {
            ...list(20),
            sort_order: 'position',
            sort_direction: 'asc',
          },
        },
      },
      'VIEW:category',
    ],
    [
      'product view',
      (t) => t.trackProductView('VA02'),
      { eventType: 'view', metadataCode: 'product', entityCode: 'VA02' },
      'VIEW:product',
    ],
    [
      'article view',
      (t) => t.trackCmsPageView('9', 'Layering'),
      { eventType: 'view', metadataCode: 'cms_page', entityCode: '9' },
      'VIEW:cms_page',
    ],
    [
      'article list',
      (t) => t.trackCmsDisplay([{ id: '9', position: 0 }]),
      {
        eventType: 'display',
        metadataCode: 'cms_page',
        payload: { items: [{ entityCode: '9', display: { position: 0 } }] },
      },
      'DISPLAY:cms_page',
    ],
    [
      'product list',
      (t) => t.trackDisplay([{ sku: 'VA02', position: 3 }]),
      {
        eventType: 'display',
        metadataCode: 'product',
        payload: { items: [{ entityCode: 'VA02', display: { position: 3 } }] },
      },
      'DISPLAY',
    ],
    [
      'search',
      (t) => t.trackSearch('robe', 12, 1, 2),
      {
        eventType: 'search',
        metadataCode: 'product',
        payload: {
          search_query: { is_spellchecked: false, query_text: 'robe' },
          product_list: {
            ...list(12),
            sort_order: 'relevance',
            sort_direction: 'desc',
          },
        },
      },
      'SEARCH',
    ],
    [
      'add to cart',
      (t) => t.trackAddToCart('VA02', 2),
      {
        eventType: 'add_to_cart',
        metadataCode: 'product',
        entityCode: 'VA02',
        payload: { cart: { qty: 2 }, child_sku: 'VA02' },
      },
      'ADD_TO_CART',
    ],
    [
      'order',
      (t) => t.trackOrder('1001', 60, [{ sku: 'VA02', price: 20, qty: 3 }]),
      {
        eventType: 'order',
        metadataCode: 'product',
        payload: {
          order: { order_id: '1001', total: 60 },
          items: [
            {
              entityCode: 'VA02',
              child_sku: 'VA02',
              order: { price: 20, qty: 3, row_total: 60 },
            },
          ],
        },
      },
      'ORDER',
    ],
  ])('%s', (_name, call, expected, logType) => {
    const { result } = setup()
    act(() => call(result.current.track))
    expect(sent()).toEqual([
      { localizedCatalogCode: 'com_fr', payload: undefined, ...expected },
    ])
    expect(result.current.log.entries.map((e) => e.type)).toEqual([logType])
  })
})

describe('empty lists', () => {
  it('an empty article list sends nothing', () => {
    const { result } = setup()
    act(() => result.current.track.trackCmsDisplay([]))
    expect(fake.track).not.toHaveBeenCalled()
    expect(result.current.log.entries).toEqual([])
  })

  it('an empty product list is still sent (today: no guard, unlike the article list)', () => {
    const { result } = setup()
    act(() => result.current.track.trackDisplay([]))
    expect(sent()[0].payload).toEqual({ items: [] })
  })
})

describe('sort in the events (feature-tracking-sort)', () => {
  it('names the two default sorts as Gally already stores them, others by field code', () => {
    expect(trackingSortOrder('_score')).toBe('relevance')
    expect(trackingSortOrder('category__position')).toBe('position')
    expect(trackingSortOrder('price__price')).toBe('price__price')
    expect(trackingSortOrder('name')).toBe('name')
  })

  it('category: the pick, else the sort the API applied, else position', () => {
    expect(
      categoryTrackedSort('price__price', 'desc', {
        field: 'name',
        direction: 'asc',
      })
    ).toEqual({
      field: 'price__price',
      direction: 'desc',
    })
    expect(
      categoryTrackedSort('', 'asc', { field: 'name', direction: 'desc' })
    ).toEqual({
      field: 'name',
      direction: 'desc',
    })
    expect(categoryTrackedSort('', 'asc', undefined)).toEqual({
      field: 'category__position',
      direction: 'asc',
    })
  })

  it('sends the given sort in a category view and a search', () => {
    const { result } = setup()
    act(() =>
      result.current.track.trackCategoryView('cat_1', 20, 1, 2, {
        field: 'price__price',
        direction: 'desc',
      })
    )
    act(() =>
      result.current.track.trackSearch('robe', 12, 1, 2, {
        field: 'name',
        direction: 'asc',
      })
    )
    expect(
      sent().map((e) => [
        e.payload.product_list.sort_order,
        e.payload.product_list.sort_direction,
      ])
    ).toEqual([
      ['price__price', 'desc'],
      ['name', 'asc'],
    ])
  })
})

describe('facets in the events (feature-tracking-filters)', () => {
  it('one pair per selected value, field code as name, value as a string', () => {
    expect(
      trackingFilters({
        fashion_size__value: ['36', '33'],
        fashion_color__value: '5',
        is_eco: true,
        cleared: undefined,
      })
    ).toEqual([
      { name: 'fashion_color__value', value: '5' },
      { name: 'fashion_size__value', value: '33' },
      { name: 'fashion_size__value', value: '36' },
      { name: 'is_eco', value: 'true' },
    ])
  })

  it.each([
    ['both bounds', { gte: 10, lte: 50 }, '10-50'],
    ['MIN and above', { gte: 10 }, '10-'],
    ['MAX and below', { lte: 50 }, '-50'],
    ['decimals as sent to the API', { gte: 13.9, lte: 50 }, '13.9-50'],
  ])('a range, %s: one pair', (_name, range, value) => {
    expect(trackingFilters({ price__price: range })).toEqual([
      { name: 'price__price', value },
    ])
  })

  it('a range with no bound gives nothing', () => {
    expect(trackingFilters({ price__price: {} })).toEqual([])
  })

  it('sends the facets in a category view and a search, and Gally accepts both', () => {
    const filters = trackingFilters({
      fashion_color__value: '5',
      price__price: { gte: 10, lte: 50 },
    })
    const { result } = setup()
    act(() =>
      result.current.track.trackCategoryView(
        'cat_1',
        20,
        1,
        2,
        { field: 'price__price', direction: 'asc' },
        filters
      )
    )
    act(() =>
      result.current.track.trackSearch(
        'robe',
        12,
        1,
        2,
        { field: '_score', direction: 'desc' },
        filters
      )
    )
    expect(sent().map((e) => e.payload.product_list.filters)).toEqual([
      filters,
      filters,
    ])
    // The SDK's own validator, the one push() runs before sending. push() adds the session ids
    // first (TrackingEventManager), so they are added here the same way.
    const validator = new TrackingEventValidator()
    for (const [event] of fake.track.mock.calls) {
      const pushed = { ...event, sessionUid: 'session', sessionVid: 'visitor' }
      expect(() => validator.validate(pushed)).not.toThrow()
    }
  })
})
