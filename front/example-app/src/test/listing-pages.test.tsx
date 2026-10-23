// The two listing pages beyond tracking: the /search URL, the products / articles switch, the
// loading and empty states, and the category page's breadcrumb, hero and resets. Pages rendered in
// jsdom with a fake search manager; children that are tested on their own are stubs that record
// their props. See specs/test-plan-listing-pages.md.
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type Seen = {
  facets?: {
    onFilterChange: (field: string, value: unknown) => void
    activeFilters: unknown
  }
  sort?: { onChange: (field: string, direction: 'asc' | 'desc') => void }
  pagers: { onPage: (page: number) => void }[]
  breadcrumb?: { parts: { name: string; href?: string }[] }
  images: string[]
}

const fake = vi.hoisted(() => ({
  params: new URLSearchParams('q=robe'),
  route: { code: 'cat_1' } as Record<string, string>,
  search: vi.fn(),
  seen: { pagers: [], images: [] } as unknown as Seen,
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
  getTracker: () => ({ push: vi.fn() }),
}))

// Stubs that record their props, in an effect (writing outside during render breaks the
// react-hooks rules).
vi.mock('../components/Facets', async () => {
  const { useEffect } = await import('react')
  return {
    default: function FacetsStub(p: NonNullable<Seen['facets']>) {
      useEffect(() => {
        fake.seen.facets = p
      })
      return null
    },
  }
})
vi.mock('../components/SortSelect', async () => {
  const { useEffect } = await import('react')
  return {
    default: function SortStub(p: NonNullable<Seen['sort']>) {
      useEffect(() => {
        fake.seen.sort = p
      })
      return null
    },
  }
})
vi.mock('../components/Pagination', async () => {
  const { useEffect } = await import('react')
  return {
    default: function PaginationStub(p: Seen['pagers'][number]) {
      useEffect(() => {
        fake.seen.pagers[0] = p
      })
      return null
    },
  }
})
vi.mock('../components/Breadcrumb', async () => {
  const { useEffect } = await import('react')
  return {
    default: function BreadcrumbStub(p: NonNullable<Seen['breadcrumb']>) {
      useEffect(() => {
        fake.seen.breadcrumb = p
      })
      return null
    },
  }
})
vi.mock('../components/ProductImage', () => ({
  default: function ProductImageStub(p: { src?: string }) {
    return <img data-testid="hero-image" src={p.src ?? ''} alt="" />
  },
}))
vi.mock('../components/ProductCard', () => ({
  default: () => <div data-testid="product-card" />,
}))
vi.mock('../components/BlogCard', () => ({
  default: () => <div data-testid="blog-card" />,
}))
vi.mock('../components/LocaleLink', () => ({
  default: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}))

import '../i18n'
import { CatalogProvider } from '../contexts/CatalogContext'
import { EventLogProvider } from '../contexts/EventLogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import type { ServerSearchResult } from '../sdk/server'
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

// Products per query or category, articles per query.
const PRODUCTS: Record<string, number> = {
  robe: 2,
  jupe: 1,
  xyzzy: 0,
  cat_1: 5,
  cat_11: 3,
  cat_2: 0,
}
const ARTICLES: Record<string, number> = { robe: 2, jupe: 0 }

type Request = {
  metadata: string
  searchQuery?: string
  categoryId?: string
  currentPage?: number
  filters?: unknown[]
  sortField?: string
}

async function answer(o: Request) {
  const blog = o.metadata === 'cms_page'
  const n = blog
    ? ARTICLES[o.searchQuery ?? ''] ?? 0
    : PRODUCTS[o.categoryId ?? o.searchQuery ?? ''] ?? 0
  const docs = Array.from({ length: n }, (_, i) => ({
    sku: `P${i}`,
    id: `A${i}`,
    title: `Article ${i}`,
    image: `/p${i}.jpg`,
  }))
  return {
    getCollection: () => docs,
    getTotalCount: () => n,
    getLastPage: () => 3,
    getAggregations: () => [],
    getTermSuggestions: () => [],
    getSortField: () => o.sortField ?? '_score',
    getSortDirection: () => 'asc',
  }
}

const productRequests = () =>
  fake.search.mock.calls
    .map(([o]) => o as Request)
    .filter((o) => o.metadata === 'product')
const lastProductRequest = () => productRequests().at(-1)!
const settle = () =>
  act(async () => {
    await new Promise((r) => setTimeout(r, 0))
  })
const scrolls = () => vi.mocked(window.scrollTo).mock.calls.length

beforeEach(() => {
  fake.search.mockReset()
  fake.search.mockImplementation(answer)
  fake.params = new URLSearchParams('q=robe')
  fake.route = { code: 'cat_1' }
  fake.seen = { pagers: [], images: [] } as unknown as Seen
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

describe('A - /search and its URL', () => {
  it('f_ params arrive as facets and reach the request (bugfix-acp-attribute-drops-query)', async () => {
    fake.params = new URLSearchParams('q=robe&f_color=5&f_color=7&f_size=33')
    render(<SearchPage />, { wrapper: Providers })
    await settle()
    expect(fake.seen.facets?.activeFilters).toEqual({
      color: ['5', '7'],
      size: ['33'],
    })
    expect(lastProductRequest()).toMatchObject({
      searchQuery: 'robe',
      filters: [{ color: { in: ['5', '7'] } }, { size: { in: ['33'] } }],
    })
  })

  it('a URL change resets the page, the facets and the result type', async () => {
    const view = render(<SearchPage />, { wrapper: Providers })
    await settle()
    act(() => fake.seen.pagers[0].onPage(2))
    act(() => fake.seen.facets!.onFilterChange('color', ['5']))
    await userEvent.click(screen.getByRole('tab', { name: /Articles/ }))
    await settle()
    fake.params = new URLSearchParams('q=jupe')
    view.rerender(<SearchPage />)
    await settle()
    expect(lastProductRequest()).toMatchObject({
      searchQuery: 'jupe',
      currentPage: 1,
      filters: [],
    })
    expect(fake.seen.facets?.activeFilters).toEqual({})
    expect(screen.getByRole('tab', { name: /Products/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('a sort goes back to page 1 without scrolling; a facet goes back to page 1, scrolls and keeps the others', async () => {
    render(<SearchPage />, { wrapper: Providers })
    await settle()
    act(() => fake.seen.pagers[0].onPage(2))
    const afterPage = scrolls()
    expect(afterPage).toBe(1)
    act(() => fake.seen.sort!.onChange('price__price', 'asc'))
    await settle()
    expect(lastProductRequest()).toMatchObject({
      currentPage: 1,
      sortField: 'price__price',
    })
    expect(scrolls()).toBe(afterPage)

    act(() => fake.seen.pagers[0].onPage(3))
    act(() => fake.seen.facets!.onFilterChange('color', ['5']))
    act(() => fake.seen.facets!.onFilterChange('size', ['33']))
    await settle()
    expect(lastProductRequest()).toMatchObject({
      currentPage: 1,
      filters: [{ color: { in: ['5'] } }, { size: { in: ['33'] } }],
    })
    expect(scrolls()).toBe(afterPage + 3)
  })

  it("uses the server's results only while the view matches them", async () => {
    const seed: ServerSearchResult = {
      products: [],
      total: 9,
      pageCount: 1,
      aggregations: [],
    }
    const first = render(<SearchPage initialData={seed} />, {
      wrapper: Providers,
    })
    await settle()
    expect(productRequests()).toHaveLength(0)
    first.unmount()
    fake.params = new URLSearchParams('q=robe&f_color=5')
    render(<SearchPage initialData={seed} />, { wrapper: Providers })
    await settle()
    expect(productRequests()).toHaveLength(1)
  })
})

describe('B - the products / articles switch (feature-search-result-type-switch)', () => {
  it('both tabs always show with their counts, "…" while loading', async () => {
    render(<SearchPage />, { wrapper: Providers })
    expect(screen.getByRole('tab', { name: /Products/ })).toHaveTextContent('…')
    await settle()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Products/ })).toHaveTextContent('2')
    expect(screen.getByRole('tab', { name: /Articles/ })).toHaveTextContent('2')
    expect(screen.getByRole('tab', { name: /Products/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('opening Articles shows the articles', async () => {
    render(<SearchPage />, { wrapper: Providers })
    await settle()
    await userEvent.click(screen.getByRole('tab', { name: /Articles/ }))
    expect(screen.getByRole('tab', { name: /Articles/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getAllByTestId('blog-card')).toHaveLength(2)
    expect(screen.queryAllByTestId('product-card')).toHaveLength(0)
  })

  it('without a query, the Articles tab shows 0, not the previous query (bugfix-search-stale-articles-without-query)', async () => {
    const view = render(<SearchPage />, { wrapper: Providers })
    await settle()
    expect(screen.getByRole('tab', { name: /Articles/ })).toHaveTextContent('2')
    fake.params = new URLSearchParams('')
    view.rerender(<SearchPage />)
    await settle()
    expect(screen.getByRole('tab', { name: /Articles/ })).toHaveTextContent('0')
    await userEvent.click(screen.getByRole('tab', { name: /Articles/ }))
    expect(screen.queryAllByTestId('blog-card')).toHaveLength(0)
  })
})

describe('C - loading and empty states', () => {
  it('products: the skeleton while loading, the empty text once settled, never both', async () => {
    fake.params = new URLSearchParams('q=xyzzy')
    const { container } = render(<SearchPage />, { wrapper: Providers })
    expect(container.querySelector('.skeleton-card')).not.toBeNull()
    expect(screen.queryByText('No results found')).toBeNull()
    await settle()
    expect(container.querySelector('.skeleton-card')).toBeNull()
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('articles: six skeleton cards while loading, then the empty text', async () => {
    fake.params = new URLSearchParams('q=jupe')
    let release!: () => void
    const gate = new Promise<void>((r) => (release = r))
    fake.search.mockImplementation(async (o: Request) => {
      if (o.metadata === 'cms_page') await gate
      return answer(o)
    })
    const { container } = render(<SearchPage />, { wrapper: Providers })
    await settle()
    await userEvent.click(screen.getByRole('tab', { name: /Articles/ }))
    expect(
      container.querySelectorAll('.blog-grid .skeleton-card')
    ).toHaveLength(6)
    await act(async () => release())
    await settle()
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('category: the skeleton while loading, the empty text once settled, never both', async () => {
    fake.route = { code: 'cat_2' }
    const { container } = render(<CategoryPage />, { wrapper: Providers })
    expect(container.querySelector('.skeleton-card')).not.toBeNull()
    expect(screen.queryByText('No products found')).toBeNull()
    await settle()
    expect(container.querySelector('.skeleton-card')).toBeNull()
    expect(screen.getByText('No products found')).toBeInTheDocument()
  })
})

describe('D - the category page', () => {
  it('builds the breadcrumb from the tree, with a fallback for an unknown code', async () => {
    fake.route = { code: 'cat_11' }
    const view = render(<CategoryPage />, { wrapper: Providers })
    await settle()
    expect(fake.seen.breadcrumb?.parts).toEqual([
      { name: 'Dresses', href: '/category/cat_1' },
      { name: 'Long dresses', href: '/category/cat_11' },
    ])
    fake.route = { code: 'cat_404' }
    view.rerender(<CategoryPage />)
    await settle()
    expect(fake.seen.breadcrumb?.parts).toEqual([{ name: 'cat_404' }])
  })

  it('picks 3 hero photos from the products, the same for the same seed (feature-category-hero-banner)', async () => {
    const pick = async (seed: number) => {
      const view = render(<CategoryPage heroSeed={seed} />, {
        wrapper: Providers,
      })
      await settle()
      const srcs = screen
        .getAllByTestId('hero-image')
        .map((i) => i.getAttribute('src'))
      view.unmount()
      return srcs
    }
    const first = await pick(42)
    expect(first).toHaveLength(3)
    expect(new Set(first).size).toBe(3)
    expect(await pick(42)).toEqual(first)
  })

  it('lists the sub-categories from the tree', async () => {
    render(<CategoryPage />, { wrapper: Providers })
    await settle()
    const chips = screen.getByRole('navigation', { name: 'Subcategories' })
    expect(within(chips).getByText('Long dresses')).toBeInTheDocument()
  })

  it('a new category resets the page and the facets, and keeps the sort (pinned as today)', async () => {
    const view = render(<CategoryPage />, { wrapper: Providers })
    await settle()
    act(() => fake.seen.sort!.onChange('price__price', 'desc'))
    act(() => fake.seen.pagers[0].onPage(2))
    act(() => fake.seen.facets!.onFilterChange('color', ['5']))
    await settle()
    fake.route = { code: 'cat_11' }
    view.rerender(<CategoryPage />)
    await settle()
    expect(lastProductRequest()).toMatchObject({
      categoryId: 'cat_11',
      currentPage: 1,
      filters: [],
      sortField: 'price__price',
    })
  })
})
