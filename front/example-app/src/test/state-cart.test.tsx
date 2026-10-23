// The cart: one saved cart per catalog, line identity, totals, and the ADD_TO_CART event.
// Rendered in jsdom with the real CatalogProvider; the router and the SDK tracker are fakes.
// See specs/test-plan-shared-state.md, part A.
import { act, render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  pathname: '/com_fr',
  push: vi.fn(),
  track: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => fake.pathname,
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getTracker: () => ({ push: fake.track }),
}))

import { readFileSync } from 'fs'
import { resolve } from 'path'
import '../i18n'
import { CartProvider, useCart, type CartItem } from '../contexts/CartContext'
import { EventLogProvider, useEventLog } from '../contexts/EventLogContext'
import { CatalogProvider } from '../contexts/CatalogContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS } from './fixtures'

// The catalog the provider sees; change it and rerender to switch catalog.
let locale = 'com_fr'

function Providers({ children }: { children: ReactNode }) {
  const resolved = findLocalizedCatalog(CATALOGS, locale)!
  return (
    <CatalogProvider
      catalogs={CATALOGS}
      selectedCatalog={resolved.catalog}
      selectedLocalizedCatalog={resolved.localizedCatalog}
      categories={[]}
    >
      <EventLogProvider>
        <CartProvider>{children}</CartProvider>
      </EventLogProvider>
    </CatalogProvider>
  )
}

const renderCart = () => renderHook(() => useCart(), { wrapper: Providers })
const stored = (catalog: string) =>
  JSON.parse(
    window.localStorage.getItem(`gally-example-cart:${catalog}`) ?? 'null'
  )
const save = (catalog: string, value: unknown) =>
  window.localStorage.setItem(
    `gally-example-cart:${catalog}`,
    JSON.stringify(value)
  )

const DRESS: Omit<CartItem, 'qty'> = { sku: 'VD10', name: 'Dress', price: 50 }

beforeEach(() => {
  locale = 'com_fr'
  window.localStorage.clear()
  fake.track.mockReset()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('saved cart per catalog (feature-cart-local-storage)', () => {
  it('reads the saved cart after mount, not during the first render', () => {
    save('com', [{ sku: 'A', name: 'A', price: 10, qty: 2 }])
    const renders: { count: number; ready: boolean }[] = []
    function Probe() {
      const cart = useCart()
      renders.push({ count: cart.items.length, ready: cart.ready })
      return null
    }
    render(<Probe />, { wrapper: Providers })
    expect(renders[0]).toEqual({ count: 0, ready: false })
    expect(renders.at(-1)).toEqual({ count: 1, ready: true })
  })

  it('saves every change under the catalog key', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS))
    expect(stored('com')).toEqual([{ ...DRESS, qty: 1 }])
  })

  it('shares one cart between the localized catalogs of a catalog', () => {
    const { result, rerender } = renderCart()
    act(() => result.current.addToCart(DRESS))
    locale = 'com_en'
    rerender()
    expect(result.current.items).toEqual([{ ...DRESS, qty: 1 }])
  })

  it('loads the other catalog cart on a switch, and never copies the old one into it', () => {
    save('fr', [{ sku: 'B', name: 'B', price: 5, qty: 1 }])
    const { result, rerender } = renderCart()
    act(() => result.current.addToCart(DRESS))
    locale = 'fr_fr'
    rerender()
    expect(result.current.items.map((i) => i.sku)).toEqual(['B'])
    expect(stored('fr').map((i: CartItem) => i.sku)).toEqual(['B'])
    expect(stored('com').map((i: CartItem) => i.sku)).toEqual(['VD10'])
    locale = 'com_fr'
    rerender()
    expect(result.current.items.map((i) => i.sku)).toEqual(['VD10'])
  })
})

describe('bad saved data', () => {
  it.each([
    ['broken JSON', '{not json'],
    ['not a list', JSON.stringify({ sku: 'A' })],
  ])('%s gives an empty cart', (_name, raw) => {
    window.localStorage.setItem('gally-example-cart:com', raw)
    const { result } = renderCart()
    expect(result.current.items).toEqual([])
    expect(result.current.ready).toBe(true)
  })

  it('drops entries without a string SKU, a numeric price or a positive quantity', () => {
    save('com', [
      { sku: 'OK', name: 'ok', price: 1, qty: 1 },
      { sku: 7, name: 'number sku', price: 1, qty: 1 },
      { sku: 'P', name: 'string price', price: '1', qty: 1 },
      { sku: 'Z', name: 'zero', price: 1, qty: 0 },
      null,
    ])
    expect(renderCart().result.current.items.map((i) => i.sku)).toEqual(['OK'])
  })

  it('keeps working when the storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full')
    })
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS))
    expect(result.current.items).toHaveLength(1)
  })
})

describe('line identity (bugfix-cart-variant-line-identity)', () => {
  it('adds up the same SKU and variant', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart({ ...DRESS, variant: 'Red / M' }))
    act(() => result.current.addToCart({ ...DRESS, variant: 'Red / M' }, 2))
    expect(result.current.items).toEqual([
      { ...DRESS, variant: 'Red / M', qty: 3 },
    ])
  })

  it('keeps another variant of the same SKU on its own line', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart({ ...DRESS, variant: 'Red / M' }))
    act(() => result.current.addToCart({ ...DRESS, variant: 'Blue / M' }))
    act(() => result.current.addToCart(DRESS))
    expect(result.current.items.map((i) => i.variant)).toEqual([
      'Red / M',
      'Blue / M',
      undefined,
    ])
  })

  it('keeps the first name, price and image on a repeated add', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart({ ...DRESS, image: 'a.jpg' }))
    act(() =>
      result.current.addToCart({
        ...DRESS,
        name: 'Renamed',
        price: 99,
        image: 'b.jpg',
      })
    )
    expect(result.current.items).toEqual([{ ...DRESS, image: 'a.jpg', qty: 2 }])
  })

  it('removes and updates one line only', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart({ ...DRESS, variant: 'Red' }))
    act(() => result.current.addToCart({ ...DRESS, variant: 'Blue' }))
    act(() => result.current.updateQty('VD10', 4, 'Blue'))
    expect(result.current.items.map((i) => [i.variant, i.qty])).toEqual([
      ['Red', 1],
      ['Blue', 4],
    ])
    act(() => result.current.removeFromCart('VD10', 'Red'))
    expect(result.current.items.map((i) => i.variant)).toEqual(['Blue'])
  })

  it('removes a line whose quantity goes to 0 or below', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS))
    act(() => result.current.updateQty('VD10', 0))
    expect(result.current.items).toEqual([])
    act(() => result.current.addToCart(DRESS))
    act(() => result.current.updateQty('VD10', -1))
    expect(result.current.items).toEqual([])
  })

  it('accepts a quantity of 0 in addToCart (today; no caller passes one)', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS, 0))
    expect(result.current.items).toEqual([{ ...DRESS, qty: 0 }])
  })
})

describe('totals and clearing', () => {
  it('sums price times quantity, and counts units', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS, 2))
    act(() =>
      result.current.addToCart({ sku: 'S', name: 'Scarf', price: 12.5 })
    )
    expect(result.current.total).toBe(112.5)
    expect(result.current.itemCount).toBe(3)
  })

  it('clearCart empties the cart and its storage', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(stored('com')).toEqual([])
  })
})

describe('ADD_TO_CART event', () => {
  const sent = () =>
    fake.track.mock.calls.map(([event]) => ({
      ...event,
      payload: JSON.parse(event.payload),
    }))

  it('sends one event per add, with the quantity, the catalog and the parent SKU as child', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS, 2))
    expect(sent()).toEqual([
      {
        eventType: 'add_to_cart',
        metadataCode: 'product',
        localizedCatalogCode: 'com_fr',
        entityCode: 'VD10',
        payload: { cart: { qty: 2 }, child_sku: 'VD10' },
      },
    ])
  })

  it('sends the child SKU when there is one', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart({ ...DRESS, childSku: 'VD10-RED-M' }))
    expect(sent()[0].payload.child_sku).toBe('VD10-RED-M')
  })

  it('adds the line even when the tracker throws', () => {
    fake.track.mockImplementation(() => {
      throw new Error('tracker down')
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderCart()
    act(() => result.current.addToCart(DRESS))
    expect(result.current.items).toHaveLength(1)
  })
})

describe('ADD_TO_CART in the event log (bugfix-add-to-cart-event-log)', () => {
  it('writes an entry for each add', () => {
    const { result } = renderHook(
      () => ({ cart: useCart(), log: useEventLog() }),
      { wrapper: Providers }
    )
    act(() => result.current.cart.addToCart(DRESS, 2))
    expect(result.current.log.entries.map((e) => [e.type, e.detail])).toEqual([
      ['ADD_TO_CART', 'VD10 x2'],
    ])
  })

  it('mounts EventLogProvider once, above CartProvider', () => {
    // A second provider inside AppShell would give the panel an empty log of its own, and the
    // cart entries would disappear again without any error.
    const root = resolve(__dirname, '../..')
    const providers = readFileSync(`${root}/app/providers.tsx`, 'utf8')
    const shell = readFileSync(`${root}/src/components/AppShell.tsx`, 'utf8')
    expect(providers.indexOf('<EventLogProvider>')).toBeGreaterThan(-1)
    expect(providers.indexOf('<EventLogProvider>')).toBeLessThan(
      providers.indexOf('<CartProvider>')
    )
    expect(shell).not.toContain('EventLogProvider')
  })
})
