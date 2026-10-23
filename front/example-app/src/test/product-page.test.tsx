// The product page: seeded by the server or fetched by SKU, what it shows, the variant choice, what
// Add to cart puts in the real cart, the VIEW event and the recommendations. Rendered in jsdom with
// a fake search manager, recommender and tracker; the documents are real API captures.
// See specs/test-plan-shopping-pages.md, part A.
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type Seen = {
  breadcrumb?: { name: string; href?: string }[]
  slider?: { title: string; products: { sku?: string }[] }
}

const fake = vi.hoisted(() => ({
  route: { sku: 'VA02' } as Record<string, string>,
  search: vi.fn(),
  track: vi.fn(),
  recommend: vi.fn(),
  seen: {} as Seen,
}))

vi.mock('next/navigation', () => ({
  useParams: () => fake.route,
  usePathname: () => '/com_en/product/VA02',
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({ search: fake.search }),
  getTracker: () => ({ push: fake.track }),
}))
vi.mock('../sdk/recommendations', () => ({
  fetchProductRecommendations: fake.recommend,
}))

// Stubs that record their props, in an effect (writing outside during render breaks the
// react-hooks rules).
vi.mock('../components/Breadcrumb', async () => {
  const { useEffect } = await import('react')
  return {
    default: function BreadcrumbStub(p: { parts: Seen['breadcrumb'] }) {
      useEffect(() => {
        fake.seen.breadcrumb = p.parts
      })
      return null
    },
  }
})
vi.mock('../components/ProductSlider', async () => {
  const { useEffect } = await import('react')
  return {
    default: function SliderStub(p: NonNullable<Seen['slider']>) {
      useEffect(() => {
        fake.seen.slider = p
      })
      return <div data-testid="recommendations" />
    },
  }
})
vi.mock('../components/ProductImage', () => ({
  default: (p: { src?: string; alt?: string }) => (
    <img src={p.src ?? ''} alt={p.alt ?? ''} />
  ),
}))

import '../i18n'
import { CartProvider, useCart } from '../contexts/CartContext'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import type { SearchDocument } from '../sdk/fields'
import ProductPage from '../views/ProductPage'
import { CATALOGS, category } from './fixtures'
import {
  CONFIGURABLE_DETAIL,
  OUT_OF_STOCK_DETAIL,
  SIMPLE_DETAIL,
} from './fixtures/api'

const comEn = findLocalizedCatalog(CATALOGS, 'com_en')!

// VA02 sits in the root (cat_2), Accessories (cat_3) and Scarves (cat_6), as captured.
const TREE = [
  category('cat_2', 'Default Category'),
  category('cat_3', 'Accessories', [category('cat_6', 'Scarves')]),
]

// The real cart, shown as JSON so a test reads exactly what Add to cart stored.
function CartProbe() {
  const { items } = useCart()
  return <pre data-testid="cart">{JSON.stringify(items)}</pre>
}
const cartItems = () =>
  JSON.parse(screen.getByTestId('cart').textContent ?? '[]')

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="com_en">
      <CatalogProvider
        catalogs={CATALOGS}
        selectedCatalog={comEn.catalog}
        selectedLocalizedCatalog={comEn.localizedCatalog}
        categories={TREE}
      >
        <EventLogProvider>
          <CartProvider>
            {children}
            <CartProbe />
          </CartProvider>
        </EventLogProvider>
      </CatalogProvider>
    </LocaleProvider>
  )
}

// The captured document with some raw `source` fields replaced.
function withSource(
  doc: SearchDocument,
  changes: Record<string, unknown>
): SearchDocument {
  return {
    ...doc,
    source: { ...(doc.source as SearchDocument), ...changes },
  } as SearchDocument
}

function response(docs: SearchDocument[]) {
  return {
    getCollection: () => docs,
    getTotalCount: () => docs.length,
    getLastPage: () => 1,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => '_score',
    getSortDirection: () => 'desc',
  }
}

const views = () =>
  fake.track.mock.calls
    .map(([event]) => event)
    .filter((e) => e.eventType === 'view' && e.metadataCode === 'product')

const flush = () => act(async () => {})

async function renderPage(initialProduct?: SearchDocument) {
  const view = render(<ProductPage initialProduct={initialProduct} />, {
    wrapper: Providers,
  })
  await flush()
  return view
}

const addButton = () => screen.getByRole('button', { name: /add to cart/i })

beforeEach(() => {
  fake.route = { sku: 'VA02' }
  fake.seen = {}
  fake.search.mockReset()
  fake.search.mockResolvedValue(response([CONFIGURABLE_DETAIL]))
  fake.track.mockReset()
  fake.track.mockResolvedValue(undefined)
  fake.recommend.mockReset()
  fake.recommend.mockResolvedValue([])
  window.localStorage.clear()
})

describe('loading the product', () => {
  it('renders the server seed at once, without a request', async () => {
    const { container } = render(
      <ProductPage initialProduct={CONFIGURABLE_DETAIL} />,
      { wrapper: Providers }
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Carola Infinity Scarf' })
    ).toBeInTheDocument()
    expect(container.querySelector('.skeleton-shimmer')).toBeNull()
    await flush()
    expect(fake.search).not.toHaveBeenCalled()
  })

  it('without a seed: one exact-SKU request, the skeleton, then the page', async () => {
    let resolve: (r: ReturnType<typeof response>) => void = () => {}
    fake.search.mockReturnValue(new Promise((r) => (resolve = r)))
    const { container } = render(<ProductPage />, { wrapper: Providers })
    await flush()
    expect(container.querySelector('.skeleton-shimmer')).not.toBeNull()
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()

    expect(fake.search).toHaveBeenCalledTimes(1)
    const request = fake.search.mock.calls[0][0]
    expect(request).toMatchObject({
      localizedCatalog: 'com_en',
      metadata: 'product',
      searchQuery: 'VA02',
      pageSize: 1,
      filters: [{ sku: { eq: 'VA02' } }],
    })
    // The raw source rides along: the variant axes are read from it.
    expect(request.selectedFields).toContain('source')

    await act(async () => resolve(response([CONFIGURABLE_DETAIL])))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Carola Infinity Scarf' })
    ).toBeInTheDocument()
  })

  it('shows "not found" with the SKU when nothing comes back', async () => {
    fake.route = { sku: 'NOPE' }
    fake.search.mockResolvedValue(response([]))
    await renderPage()
    expect(
      screen.getByRole('heading', { name: 'Product not found' })
    ).toBeInTheDocument()
    expect(screen.getByText('SKU: NOPE')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add to cart/i })).toBeNull()
  })
})

describe('what the page shows', () => {
  it('name, SKU, type, price without a struck price, materials', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    expect(screen.getByText('SKU: VA02')).toBeInTheDocument()
    expect(screen.getByText('Configurable')).toBeInTheDocument()
    const price = document.querySelector('.product-detail-price')!
    expect(price.textContent).toMatch(/48\.00/)
    expect(price.querySelectorAll('span')).toHaveLength(1)
    expect(screen.getByText('Material:').parentElement).toHaveTextContent(
      'Material: Organic Cotton, Spandex'
    )
  })

  it('a discounted product: the original price struck, then the price', async () => {
    fake.route = { sku: 'LLV-LIV-ALB-001' }
    await renderPage(SIMPLE_DETAIL)
    const spans = document.querySelectorAll('.product-detail-price span')
    expect(spans).toHaveLength(2)
    expect(spans[0]).toHaveStyle({ textDecoration: 'line-through' })
    expect(spans[0].textContent).toMatch(/17\.38/)
    expect(spans[1].textContent).toMatch(/13\.90/)
    expect(screen.getByText('Simple')).toBeInTheDocument()
  })

  it('badges in priority order: sale, new, single material', async () => {
    await renderPage(
      withSource(CONFIGURABLE_DETAIL, {
        sale: true,
        new: true,
        fashion_material: [{ label: 'Cashmere', value: '1' }],
      })
    )
    const badges = [
      ...document.querySelectorAll('.product-detail-image .product-card-badge'),
    ].map((b) => b.textContent)
    expect(badges).toEqual(['On Sale', 'New', '100% Cashmere'])
  })

  it('no badge for the captured scarf (not new, not on sale, two materials)', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    expect(document.querySelector('.product-card-badge')).toBeNull()
  })

  it('the stock line: a count, a status alone, or out of stock', async () => {
    const { unmount } = await renderPage(CONFIGURABLE_DETAIL)
    expect(screen.getByText('In Stock (70 available)')).toBeInTheDocument()
    unmount()

    const { unmount: unmount2 } = await renderPage(
      withSource(CONFIGURABLE_DETAIL, { stock: { status: true } })
    )
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    unmount2()

    fake.route = { sku: 'VT10' }
    await renderPage(OUT_OF_STOCK_DETAIL)
    // The line and the disabled button say the same thing.
    expect(screen.getAllByText('Out of Stock')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled()
  })

  it('the breadcrumb follows the deepest category and ends on the product name', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    expect(fake.seen.breadcrumb).toEqual([
      { name: 'Accessories', href: '/category/cat_3' },
      { name: 'Scarves', href: '/category/cat_6' },
      { name: 'Carola Infinity Scarf' },
    ])
  })

  it('has no wishlist button: Add to cart is the only action (bugfix-product-wishlist-dead-button)', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    const actions = document.querySelector('.product-detail-actions')!
    expect(actions.querySelectorAll('button')).toHaveLength(1)
    expect(screen.queryByRole('button', { name: /wishlist/i })).toBeNull()
  })
})

describe('variants and Add to cart', () => {
  it('nothing is pre-selected; picking an option checks it, and only it', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBe(10)
    for (const r of radios) expect(r).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(screen.getByRole('radio', { name: 'M' }))
    expect(screen.getByRole('radio', { name: 'M' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    expect(screen.getByRole('radio', { name: 'L' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('a configurable waits for every axis: "Choose options", disabled (bugfix-pdp-add-without-options)', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    const button = () => screen.getByRole('button', { name: 'Choose options' })
    expect(button()).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'Peach' }))
    expect(button()).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'M' }))
    expect(screen.queryByRole('button', { name: 'Choose options' })).toBeNull()
    expect(addButton()).toBeEnabled()
    expect(cartItems()).toEqual([])
  })

  it('a product with no axis is added at once: the line has no variant and no child SKU', async () => {
    await renderPage(SIMPLE_DETAIL)
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    await userEvent.click(addButton())
    const [line] = cartItems()
    expect(line.sku).toBe(SIMPLE_DETAIL.sku)
    expect(line.variant).toBeUndefined()
    expect(line.childSku).toBeUndefined()
  })

  it('chosen options become the variant, in axis order, joined with " / "', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    // Size picked first, colour second: the line still reads colour / size.
    await userEvent.click(screen.getByRole('radio', { name: 'M' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Peach' }))
    await userEvent.click(addButton())
    const [line] = cartItems()
    expect(line.variant).toBe('Peach / M')
    expect(line.childSku).toBeUndefined()
  })

  it('confirms in place, and sends one ADD_TO_CART for the parent SKU', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    await userEvent.click(screen.getByRole('radio', { name: 'Peach' }))
    await userEvent.click(screen.getByRole('radio', { name: 'M' }))
    await userEvent.click(addButton())
    expect(screen.getByRole('button', { name: 'Added' })).toBeInTheDocument()
    const adds = fake.track.mock.calls
      .map(([e]) => e)
      .filter((e) => e.eventType === 'add_to_cart')
    expect(adds).toHaveLength(1)
    expect(adds[0].entityCode).toBe('VA02')
  })
})

describe('the VIEW event', () => {
  it('one VIEW per SKU: a re-render sends nothing more, a new SKU one more', async () => {
    const { rerender } = await renderPage(CONFIGURABLE_DETAIL)
    expect(views()).toHaveLength(1)
    expect(views()[0]).toMatchObject({
      localizedCatalogCode: 'com_en',
      entityCode: 'VA02',
    })

    rerender(<ProductPage initialProduct={CONFIGURABLE_DETAIL} />)
    await flush()
    expect(views()).toHaveLength(1)

    fake.route = { sku: 'VT10' }
    rerender(<ProductPage initialProduct={OUT_OF_STOCK_DETAIL} />)
    await flush()
    expect(views().map((e) => e.entityCode)).toEqual(['VA02', 'VT10'])
  })
  it('one VIEW even when the effect runs twice (strict mode remount)', async () => {
    render(<ProductPage initialProduct={CONFIGURABLE_DETAIL} />, {
      wrapper: Providers,
      reactStrictMode: true,
    })
    await flush()
    expect(views()).toHaveLength(1)
  })
})

describe('recommendations', () => {
  const recommended = (skus: string[]) => skus.map((sku) => ({ sku }))

  it('related products first, 6, seeded with this SKU', async () => {
    fake.recommend.mockResolvedValue(recommended(['R1', 'R2']))
    await renderPage(CONFIGURABLE_DETAIL)
    expect(fake.recommend).toHaveBeenCalledTimes(1)
    expect(fake.recommend).toHaveBeenCalledWith(
      'com_en',
      'com',
      'related_product',
      ['VA02'],
      6
    )
    expect(fake.seen.slider).toEqual({
      title: 'You May Also Like',
      products: recommended(['R1', 'R2']),
    })
  })

  it('cross-sell when there is no related product', async () => {
    fake.recommend.mockImplementation(async (_l, _c, type) =>
      type === 'cross-sell' ? recommended(['X1']) : []
    )
    await renderPage(CONFIGURABLE_DETAIL)
    expect(fake.recommend.mock.calls.map((c) => c[2])).toEqual([
      'related_product',
      'cross-sell',
    ])
    expect(fake.seen.slider?.products).toEqual(recommended(['X1']))
  })

  it('no block when both are empty', async () => {
    await renderPage(CONFIGURABLE_DETAIL)
    expect(fake.recommend).toHaveBeenCalledTimes(2)
    expect(screen.queryByTestId('recommendations')).toBeNull()
  })
})
