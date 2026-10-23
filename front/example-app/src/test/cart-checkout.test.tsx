// The cart and the checkout: the saved-cart gate, lines and their buttons, the shipping rule both
// pages share, cross-sell, and placing an order. Rendered in jsdom with the real CartProvider (seeded
// through localStorage, as a reload would); the router, the tracker and the recommender are fakes.
// See specs/test-plan-shopping-pages.md, part B.
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  push: vi.fn(),
  track: vi.fn(),
  recommend: vi.fn(),
  slider: [] as { title: string; products: unknown[] }[],
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_en/cart',
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getTracker: () => ({ push: fake.track }),
}))
vi.mock('../sdk/recommendations', () => ({
  fetchProductRecommendations: fake.recommend,
}))
vi.mock('../components/ProductSlider', async () => {
  const { useEffect } = await import('react')
  return {
    default: function SliderStub(p: { title: string; products: unknown[] }) {
      useEffect(() => {
        fake.slider.push(p)
      })
      return <section aria-label={p.title} />
    },
  }
})
vi.mock('../components/ProductImage', () => ({
  default: () => <img alt="" />,
}))
vi.mock('../components/LocaleLink', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import i18n from '../i18n'
import { CartProvider, type CartItem } from '../contexts/CartContext'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import {
  cartShipping,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from '../contexts/shipping'
import { findLocalizedCatalog } from '../sdk/catalogs'
import CartPage from '../views/CartPage'
import CheckoutPage from '../views/CheckoutPage'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

const comEn = findLocalizedCatalog(CATALOGS, 'com_en')!
const eur = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(
    n
  )

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="com_en">
      <CatalogProvider
        catalogs={CATALOGS}
        selectedCatalog={comEn.catalog}
        selectedLocalizedCatalog={comEn.localizedCatalog}
        categories={CATEGORY_TREE}
      >
        <EventLogProvider>
          <CartProvider>{children}</CartProvider>
        </EventLogProvider>
      </CatalogProvider>
    </LocaleProvider>
  )
}

const save = (items: CartItem[]) =>
  window.localStorage.setItem('gally-example-cart:com', JSON.stringify(items))
const stored = (): CartItem[] =>
  JSON.parse(window.localStorage.getItem('gally-example-cart:com') ?? '[]')

const show = async (page: ReactNode) => {
  const view = render(<Providers>{page}</Providers>)
  // Let the recommender's promise settle.
  await act(async () => {})
  return view
}

// Two lines of the same parent, told apart by their variant, and a second product.
const TOP_M: CartItem = {
  sku: 'VT01',
  name: 'Linen top',
  price: 30,
  qty: 2,
  variant: 'Rain / M',
  childSku: 'VT01-M',
}
const TOP_L: CartItem = {
  ...TOP_M,
  qty: 1,
  variant: 'Mint / L',
  childSku: 'VT01-L',
}
const BAG: CartItem = { sku: 'VB02', name: 'Straw bag', price: 25, qty: 1 }

const orderEvents = () =>
  fake.track.mock.calls.map(([e]) => e).filter((e) => e.eventType === 'order')

beforeEach(async () => {
  window.localStorage.clear()
  fake.push.mockReset()
  fake.track.mockReset()
  fake.recommend.mockReset().mockResolvedValue([])
  fake.slider = []
  await i18n.changeLanguage('en')
})

describe('the shipping rule', () => {
  it('charges the fee under the threshold and nothing from it', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(180)
    expect(SHIPPING_FEE).toBe(4.9)
    expect(cartShipping(179.99)).toMatchObject({
      free: false,
      fee: 4.9,
      total: 179.99 + 4.9,
    })
    expect(cartShipping(180)).toMatchObject({
      free: true,
      fee: 0,
      total: 180,
      remaining: 0,
      progress: 100,
    })
    expect(cartShipping(45)).toMatchObject({ remaining: 135, progress: 25 })
  })
})

describe('the cart page', () => {
  it('renders nothing until the saved cart is read - no empty-state flash', () => {
    save([BAG])
    const html = renderToString(
      <Providers>
        <CartPage />
      </Providers>
    )
    expect(html).not.toContain('Your cart is empty')
    expect(html).not.toContain('Straw bag')
  })

  it('shows the empty state with a link to the catalog default listing', async () => {
    await show(<CartPage />)
    expect(
      screen.getByRole('heading', { name: 'Your cart is empty' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse products' })
    ).toHaveAttribute('href', '/category/cat_1')
    expect(fake.recommend).not.toHaveBeenCalled()
  })

  it('lists each line with its name, variant, quantity and line total', async () => {
    save([TOP_M, BAG])
    await show(<CartPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Your Cart (3 items)' })
    ).toBeInTheDocument()
    const line = screen.getByRole('heading', { name: 'Linen top' })
      .parentElement!.parentElement!
    expect(within(line).getByText('Rain / M')).toBeInTheDocument()
    expect(within(line).getByText('2')).toBeInTheDocument()
    expect(within(line).getByText(eur(60))).toBeInTheDocument()
  })

  it('changes and removes one line only, variant included', async () => {
    save([TOP_M, TOP_L, BAG])
    await show(<CartPage />)
    const user = userEvent.setup()
    const lineOf = (variant: string) =>
      screen.getByText(variant).closest('.cart-item') as HTMLElement

    await user.click(
      within(lineOf('Mint / L')).getByRole('button', {
        name: 'Increase quantity',
      })
    )
    expect(stored().map((i) => [i.variant, i.qty])).toEqual([
      ['Rain / M', 2],
      ['Mint / L', 2],
      [undefined, 1],
    ])

    await user.click(
      within(lineOf('Rain / M')).getByRole('button', {
        name: 'Decrease quantity',
      })
    )
    expect(stored()[0].qty).toBe(1)
    expect(stored()[1].qty).toBe(2)

    await user.click(
      within(lineOf('Mint / L')).getByRole('button', { name: 'Remove' })
    )
    expect(stored().map((i) => i.variant)).toEqual(['Rain / M', undefined])
    expect(screen.queryByText('Mint / L')).not.toBeInTheDocument()
  })

  it('removes the line when its quantity goes below one', async () => {
    save([BAG])
    await show(<CartPage />)
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Decrease quantity' }))
    expect(stored()).toEqual([])
    expect(
      screen.getByRole('heading', { name: 'Your cart is empty' })
    ).toBeInTheDocument()
  })

  const summary = () => document.querySelector('.cart-summary') as HTMLElement
  const row = (label: string) =>
    within(summary()).getByText(label).parentElement as HTMLElement

  it('adds 4.90 shipping under 180 and shows what is left for free shipping', async () => {
    save([{ ...BAG, price: 179.99 }])
    await show(<CartPage />)
    expect(row('Subtotal')).toHaveTextContent(eur(179.99))
    expect(row('Shipping')).toHaveTextContent(eur(4.9))
    expect(row('Total')).toHaveTextContent(eur(184.89))
    expect(within(summary()).getByText(eur(0.01))).toBeInTheDocument()
    expect(
      within(summary()).queryByText('Free shipping unlocked!')
    ).not.toBeInTheDocument()
  })

  it('ships free from exactly 180', async () => {
    save([{ ...BAG, price: 90, qty: 2 }])
    await show(<CartPage />)
    expect(row('Shipping')).toHaveTextContent('Free')
    expect(row('Total')).toHaveTextContent(eur(180))
    expect(
      within(summary()).getByText('Free shipping unlocked!')
    ).toBeInTheDocument()
  })

  it('goes to the checkout in the current catalog', async () => {
    save([BAG])
    await show(<CartPage />)
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Checkout' }))
    expect(fake.push).toHaveBeenCalledWith('/com_en/checkout')
  })

  it('asks cross-sell for 8 products seeded with the cart SKUs, once per parent', async () => {
    const product = { sku: 'VX9', name: 'Hat' }
    fake.recommend.mockResolvedValue([product])
    save([TOP_M, TOP_L, BAG])
    await show(<CartPage />)
    expect(fake.recommend).toHaveBeenCalledTimes(1)
    expect(fake.recommend).toHaveBeenCalledWith(
      'com_en',
      'com',
      'cross-sell',
      ['VB02', 'VT01'],
      8
    )
    expect(fake.slider.at(-1)).toMatchObject({
      title: 'Goes well with your cart',
      products: [product],
    })
  })

  it('hides the recommendations when cross-sell finds nothing', async () => {
    save([BAG])
    await show(<CartPage />)
    expect(fake.recommend).toHaveBeenCalledTimes(1)
    expect(fake.slider).toEqual([])
  })
})

describe('the checkout page', () => {
  it('renders nothing until the saved cart is read', () => {
    save([BAG])
    const html = renderToString(
      <Providers>
        <CheckoutPage />
      </Providers>
    )
    expect(html).not.toContain('Your cart is empty')
    expect(html).not.toContain('Place Order')
  })

  it('shows the cart empty state, and no form or order button, for an empty cart', async () => {
    await show(<CheckoutPage />)
    expect(
      screen.getByRole('heading', { name: 'Your cart is empty' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse products' })
    ).toHaveAttribute('href', '/category/cat_1')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Place Order/ })
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/Delivery & payment/)).not.toBeInTheDocument()
  })

  it('shows three steps, the current one marked as such', async () => {
    save([BAG])
    await show(<CheckoutPage />)
    const steps = document.querySelectorAll('.checkout-step')
    expect([...steps].map((s) => s.textContent)).toEqual([
      'Cart',
      '2. Delivery & payment',
      '3. Confirmation',
    ])
    expect([...steps].map((s) => s.getAttribute('aria-current'))).toEqual([
      null,
      'step',
      null,
    ])
  })

  it('prefills every field with the demo customer, each named for itself', async () => {
    save([BAG])
    await show(<CheckoutPage />)
    const values: Record<string, string> = {
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john.doe@example.com',
      Address: '1 Main Street',
      City: 'Springfield',
      'ZIP Code': '12345',
      'Card Number': '4242 4242 4242 4242',
      'MM/YY': '12/30',
      CVC: '123',
    }
    for (const [name, value] of Object.entries(values)) {
      expect(screen.getByRole('textbox', { name })).toHaveValue(value)
    }
    expect(screen.getAllByRole('textbox')).toHaveLength(9)
  })

  it('shows the subtotal, the shipping and the same total as the cart', async () => {
    save([TOP_M, BAG])
    const cart = await show(<CartPage />)
    const cartTotal = (
      document.querySelector('.cart-summary-row.total') as HTMLElement
    ).textContent
    cart.unmount()

    await show(<CheckoutPage />)
    const summary = document.querySelector('.cart-summary') as HTMLElement
    expect(
      within(summary).getByText('Subtotal').parentElement
    ).toHaveTextContent(eur(85))
    expect(
      within(summary).getByText('Shipping').parentElement
    ).toHaveTextContent(eur(4.9))
    expect(
      within(summary).getByText('Total to Pay').parentElement
    ).toHaveTextContent(eur(89.9))
    expect(cartTotal).toContain(eur(89.9))
    expect(
      screen.getByRole('button', { name: `Place Order — ${eur(89.9)}` })
    ).toBeInTheDocument()
  })

  it('shows free shipping from 180', async () => {
    save([{ ...BAG, price: 180 }])
    await show(<CheckoutPage />)
    const summary = document.querySelector('.cart-summary') as HTMLElement
    expect(
      within(summary).getByText('Shipping').parentElement
    ).toHaveTextContent('Free')
    expect(
      screen.getByRole('button', { name: `Place Order — ${eur(180)}` })
    ).toBeInTheDocument()
  })

  it('places the order: one ORDER event with shipping in the total, then the confirmation and an empty cart', async () => {
    save([TOP_M, BAG])
    await show(<CheckoutPage />)
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: /Place Order/ }))

    const events = orderEvents()
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      metadataCode: 'product',
      localizedCatalogCode: 'com_en',
    })
    const payload = JSON.parse(events[0].payload)
    expect(payload.order.order_id).toMatch(/^ORD-/)
    expect(payload.order.total).toBeCloseTo(89.9)
    expect(payload.items).toEqual([
      {
        entityCode: 'VT01',
        child_sku: 'VT01-M',
        order: { price: 30, qty: 2, row_total: 60 },
      },
      {
        entityCode: 'VB02',
        child_sku: 'VB02',
        order: { price: 25, qty: 1, row_total: 25 },
      },
    ])

    // The order emptied the cart, and the confirmation stays on screen anyway.
    expect(stored()).toEqual([])
    expect(
      screen.getByRole('heading', { name: 'Order Confirmed!' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Your cart is empty' })
    ).not.toBeInTheDocument()
    const steps = document.querySelectorAll('.checkout-step')
    expect([...steps].map((s) => s.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'step',
    ])
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('tracks the items total alone when shipping is free', async () => {
    save([{ ...BAG, price: 200 }])
    await show(<CheckoutPage />)
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: /Place Order/ }))
    expect(JSON.parse(orderEvents()[0].payload).order.total).toBe(200)
  })
})
