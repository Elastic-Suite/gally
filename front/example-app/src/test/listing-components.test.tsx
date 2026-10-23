// The components of the listing pages, rendered on their own and driven like a visitor:
// Pagination, SortSelect, QuickAdd, ProductCard, ProductImage. See specs/test-plan-listing-pages.md, E.
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  addToCart: vi.fn(),
  sortFields: [] as { code: string; label: string; type: string }[],
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({
    getProductSortingOptions: async () =>
      fake.sortFields.map((f) => ({
        getCode: () => f.code,
        getDefaultLabel: () => f.label,
        getType: () => f.type,
      })),
  }),
}))
vi.mock('../contexts/CartContext', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../contexts/CartContext')>()),
  useCart: () => ({ addToCart: fake.addToCart }),
}))
vi.mock('../components/LocaleLink', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import '../i18n'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import QuickAdd from '../components/QuickAdd'
import SortSelect from '../components/SortSelect'
import { CatalogProvider } from '../contexts/CatalogContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import type { SearchDocument } from '../sdk/fields'
import { CATALOGS } from './fixtures'
import {
  CONFIGURABLE_DETAIL,
  CONFIGURABLE_LISTING,
  OUT_OF_STOCK_DETAIL,
  SIMPLE_LISTING,
} from './fixtures/api'

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

beforeEach(() => {
  fake.addToCart.mockReset()
})

describe('Pagination (bugfix-pagination-window-fixed-to-first-pages)', () => {
  const pager = (page: number, pageCount: number, windowSize?: number) => {
    const onPage = vi.fn()
    const view = render(
      <Pagination
        page={page}
        pageCount={pageCount}
        windowSize={windowSize}
        onPage={onPage}
        prevLabel="Previous"
        nextLabel="Next"
        ariaLabel="Pagination"
      />
    )
    // What a visitor sees, in order: page numbers and "…".
    const items = () =>
      [...view.container.querySelectorAll('nav > button, nav > span')]
        .map((el) => el.textContent?.trim())
        .filter((t) => t && t !== 'Previous' && t !== 'Next')
    return { ...view, onPage, items }
  }

  it('shows nothing for a single page', () => {
    expect(pager(1, 1).container.innerHTML).toBe('')
  })

  it.each([
    [6, 12, ['1', '…', '4', '5', '6', '7', '8', '…', '12']],
    [1, 12, ['1', '2', '3', '4', '5', '…', '12']],
    [12, 12, ['1', '…', '8', '9', '10', '11', '12']],
    [3, 12, ['1', '2', '3', '4', '5', '…', '12']],
  ])('page %i of %i, window 5: %j', (page, count, expected) => {
    expect(pager(page, count, 5).items()).toEqual(expected)
  })

  it('shows every page when they all fit the window', () => {
    expect(pager(2, 5).items()).toEqual(['1', '2', '3', '4', '5'])
  })

  it('marks the current page; previous and next are disabled at the ends', async () => {
    const first = pager(1, 4)
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(first.onPage.mock.calls).toEqual([[2], [3]])
    first.unmount()
    pager(4, 4)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })
})

describe('SortSelect (feature-dynamic-sort-options)', () => {
  const API = [
    { code: 'category__position', label: 'Position', type: 'int' },
    { code: 'name', label: 'Name', type: 'text' },
    { code: 'price__price', label: 'Price', type: 'price' },
    { code: 'tbx_brand', label: 'Toolbox brand', type: 'text' },
    { code: 'store_location', label: 'Distance', type: 'location' },
    { code: '_score', label: 'Relevance', type: 'float' },
  ]
  const select = async (
    context: 'search' | 'category',
    field: string,
    direction: 'asc' | 'desc' = 'asc'
  ) => {
    fake.sortFields = API
    const onChange = vi.fn()
    render(
      <SortSelect
        context={context}
        field={field}
        direction={direction}
        onChange={onChange}
      />,
      { wrapper: Providers }
    )
    await act(async () => {})
    return onChange
  }
  const options = () =>
    screen
      .getAllByRole('option')
      .map((o) => [o.textContent, (o as HTMLOptionElement).disabled])

  it('search: relevance first, no position, no other shop or location sort', async () => {
    await select('search', '_score', 'desc')
    expect(options()).toEqual([
      ['Relevance', false],
      ['Name', false],
      ['Price', false],
    ])
  })

  it('category: the position sort is offered', async () => {
    await select('category', 'category__position')
    expect(options().map((o) => o[0])).toContain('Position')
  })

  it('shows a placeholder when the current sort is not offered', async () => {
    await select('search', 'not_offered')
    expect(options()[0]).toEqual(['Default', true])
  })

  it('hides the direction button for relevance and position', async () => {
    await select('search', '_score', 'desc')
    expect(screen.queryByRole('button', { name: /Sort direction/ })).toBeNull()
  })

  it('a pick sends its natural direction; the button flips it', async () => {
    const onChange = await select('search', 'price__price', 'asc')
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Sort by' }),
      'name'
    )
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Sort by' }),
      '_score'
    )
    await userEvent.click(
      screen.getByRole('button', { name: /Sort direction/ })
    )
    expect(onChange.mock.calls).toEqual([
      ['name', 'asc'],
      ['_score', 'desc'],
      ['price__price', 'desc'],
    ])
  })
})

describe('QuickAdd (feature-quick-add-overlay, feature-add-to-cart-feedback-everywhere)', () => {
  const quickAdd = (product: SearchDocument) => {
    const onAdded = vi.fn()
    render(<QuickAdd product={product} onAdded={onAdded} />, {
      wrapper: Providers,
    })
    return onAdded
  }

  it('waits for every axis, then adds the parent SKU with the chosen labels and no child SKU', async () => {
    const onAdded = quickAdd(CONFIGURABLE_DETAIL)
    expect(
      screen.getByRole('button', { name: 'Choose options' })
    ).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'Gold' }))
    expect(
      screen.getByRole('button', { name: 'Choose options' })
    ).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: 'M' }))
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(fake.addToCart).toHaveBeenCalledTimes(1)
    const item = fake.addToCart.mock.calls[0][0]
    expect(item).toMatchObject({
      sku: 'VA02',
      name: 'Carola Infinity Scarf',
      price: 48,
      variant: 'Gold / M',
    })
    expect(item).not.toHaveProperty('childSku')
    expect(onAdded).toHaveBeenCalledWith('VA02')
    // The "added" feedback, and the selection cleared for the next add.
    expect(screen.getByRole('button', { name: /Added/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Gold' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('a simple product is added at once, with no variant', async () => {
    quickAdd(SIMPLE_LISTING)
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(fake.addToCart.mock.calls[0][0]).toMatchObject({
      sku: 'LLV-LIV-ALB-001',
      variant: undefined,
    })
  })

  it('an unavailable product shows no choice and cannot be added', () => {
    quickAdd(OUT_OF_STOCK_DETAIL)
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  })
})

describe('ProductCard (feature-product-picture-badges)', () => {
  const card = (product: SearchDocument) =>
    render(<ProductCard product={product} />, { wrapper: Providers })

  it('one badge, struck original price when discounted, the SKU, links to the product', () => {
    const { container } = card(SIMPLE_LISTING)
    expect(screen.getByText('On Sale')).toBeInTheDocument()
    const price = container.querySelector('.product-card-price')!
    expect(price.textContent).toMatch(/17,38\s€/u)
    expect(price.textContent).toMatch(/13,90\s€/u)
    expect(screen.getByText('SKU: LLV-LIV-ALB-001')).toBeInTheDocument()
    const links = [...container.querySelectorAll('a')].map((a) =>
      a.getAttribute('href')
    )
    expect(new Set(links)).toEqual(new Set(['/product/LLV-LIV-ALB-001']))
  })

  it('shows only the highest-priority badge', () => {
    card({
      ...SIMPLE_LISTING,
      new: true,
      fashion_material: [{ label: 'Wool' }],
    } as SearchDocument)
    expect(screen.getByText('On Sale')).toBeInTheDocument()
    expect(screen.queryByText('New')).toBeNull()
  })

  it('no struck price when the product is not discounted', () => {
    const { container } = card(CONFIGURABLE_LISTING)
    const price = container.querySelector('.product-card-price')!
    expect(price.textContent?.match(/48,00\s€/gu)).toHaveLength(1)
  })
})

describe('ProductImage (feature-product-image-placeholder)', () => {
  it('shows the placeholder, named by its alt, for an empty source or a load error; a new source tries again', () => {
    const view = render(<ProductImage src="" alt="Scarf" />)
    expect(screen.getByRole('img', { name: 'Scarf' }).tagName).toBe('SPAN')
    view.rerender(<ProductImage src="/a.jpg" alt="Scarf" />)
    const img = screen.getByRole('img', { name: 'Scarf' })
    expect(img.tagName).toBe('IMG')
    fireEvent.error(img)
    expect(screen.getByRole('img', { name: 'Scarf' }).tagName).toBe('SPAN')
    view.rerender(<ProductImage src="/b.jpg" alt="Scarf" />)
    expect(
      within(view.container).getByRole('img', { name: 'Scarf' }).tagName
    ).toBe('IMG')
  })
})
