// The homepage, the blog list and the blog article: what each page asks for, what it shows from
// the answer, the URL the blog filters write, and the tracking events. The data hooks are fakes -
// they are tested on their own in the data-layer and search-engine tests; children tested
// elsewhere are stubs that print their props. See specs/test-plan-shopping-pages.md, part C.
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type Cms = {
  pages: unknown[]
  total: number
  pageCount: number
  aggregations: unknown[]
  loading: boolean
  error: unknown
}

const fake = vi.hoisted(() => ({
  params: new URLSearchParams(),
  route: {} as Record<string, string>,
  push: vi.fn(),
  rows: {} as Record<string, { products: unknown[]; loading: boolean }>,
  useSearch: vi.fn(),
  cms: {} as Cms,
  useCmsSearch: vi.fn(),
  tracking: {
    trackDisplay: vi.fn(),
    trackCmsDisplay: vi.fn(),
    trackCmsPageView: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => fake.params,
  useParams: () => fake.route,
  usePathname: () => '/com_en/blog',
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('../hooks/useSearch', () => ({
  useSearch: (opts: { categoryCode?: string }) => {
    fake.useSearch(opts)
    return (
      fake.rows[opts.categoryCode ?? ''] ?? { products: [], loading: false }
    )
  },
}))
vi.mock('../hooks/useCms', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../hooks/useCms')>()),
  useCmsSearch: (opts: unknown) => {
    fake.useCmsSearch(opts)
    return fake.cms
  },
}))
vi.mock('../hooks/useTracking', () => ({
  useTracking: () => fake.tracking,
}))

// Stubs that print their props, so the tests read the page's choices from the DOM.
vi.mock('../components/LocaleLink', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))
vi.mock('../components/ProductSlider', () => ({
  default: (p: {
    products: { sku: string }[]
    title: string
    panel?: { seeAllHref: string | null }
  }) => (
    <section
      data-testid="slider"
      data-title={p.title}
      data-see-all={p.panel?.seeAllHref ?? ''}
      data-skus={p.products.map((x) => x.sku).join(',')}
    />
  ),
}))
vi.mock('../components/HomeHero', () => ({
  default: (p: { title: string; ctaHref: string | null; ctaLabel: string }) => (
    <div data-testid="home-hero">
      <h1>{p.title}</h1>
      {p.ctaHref && <a href={p.ctaHref}>{p.ctaLabel}</a>}
    </div>
  ),
}))
vi.mock('../components/HomePromoCards', () => ({
  default: (p: { cards: { key: string; title: string; href: string }[] }) => (
    <div data-testid="promo-cards">
      {p.cards.map((c) => (
        <a key={c.key} href={c.href}>
          {c.title}
        </a>
      ))}
    </div>
  ),
}))
vi.mock('../components/BlogCard', () => ({
  default: (p: { post: { title: string } }) => (
    <article data-testid="blog-card">{p.post.title}</article>
  ),
}))
vi.mock('../components/Pagination', () => ({
  default: (p: {
    page: number
    pageCount: number
    onPage: (page: number) => void
  }) => (
    <nav data-testid="pagination" data-page={p.page} data-count={p.pageCount}>
      <button onClick={() => p.onPage(3)}>to page 3</button>
      <button onClick={() => p.onPage(1)}>to page 1</button>
    </nav>
  ),
}))
vi.mock('../components/skeletons', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../components/skeletons')>()),
  BlogPostSkeleton: () => <div data-testid="post-skeleton" />,
}))

import i18n from '../i18n'
import { CatalogProvider } from '../contexts/CatalogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import type { ICatalog, ICategoryNode } from '../sdk/catalogs'
import type { CmsPage } from '../sdk/cmsFields'
import Homepage from '../views/Homepage'
import BlogPage from '../views/BlogPage'
import BlogPostPage from '../views/BlogPostPage'
import { CATALOGS, CATEGORY_TREE, category } from './fixtures'

// The fixtures' com plus two shops: one with the wide hero and promo cards (fashion), one with
// neither a hero query nor vector examples (misc).
function shop(id: number, code: string): ICatalog {
  return {
    id,
    code,
    name: code,
    localizedCatalogs: [
      {
        id: id * 10 + 1,
        code: `${code}_en`,
        name: `${code}_en`,
        locale: 'en_US',
        currency: 'EUR',
        isDefault: true,
        catalogId: id,
      },
    ],
  }
}
const ALL = [...CATALOGS, shop(3, 'fashion'), shop(4, 'misc')]
const THREE = [...CATEGORY_TREE, category('cat_3', 'Bags')]

type Where = {
  catalog?: string
  localized?: string
  categories?: ICategoryNode[]
}

function tree(
  ui: ReactNode,
  {
    catalog = 'com',
    localized = 'com_en',
    categories = CATEGORY_TREE,
  }: Where = {}
) {
  const c = ALL.find((x) => x.code === catalog)!
  const l = c.localizedCatalogs.find((x) => x.code === localized)!
  return (
    <LocaleProvider locale={localized}>
      <CatalogProvider
        catalogs={ALL}
        selectedCatalog={c}
        selectedLocalizedCatalog={l}
        categories={categories}
      >
        {ui}
      </CatalogProvider>
    </LocaleProvider>
  )
}

const renderIn = (ui: ReactNode, where?: Where) => render(tree(ui, where))

const products = (...skus: string[]) =>
  skus.map((sku) => ({ sku, source: { sku } }))

function post(id: string, extra: Partial<CmsPage> = {}): CmsPage {
  return {
    id,
    title: `Post ${id}`,
    summary: '',
    content: '',
    urlKey: `post-${id}`,
    image: '',
    contentType: null,
    topic: null,
    author: null,
    publishedAt: '',
    readingTime: null,
    isFeatured: false,
    tags: [],
    ...extra,
  }
}

const AGGREGATIONS = [
  {
    field: 'content_type__value',
    options: [
      { value: 'post', label: 'Post', count: 5 },
      { value: 'guide', label: 'Guide', count: 2 },
    ],
  },
  {
    field: 'topic__value',
    options: [{ value: 'care', label: 'Care', count: 3 }],
  },
]

function cms(over: Partial<Cms> = {}): Cms {
  return {
    pages: [post('1'), post('2')],
    total: 12,
    pageCount: 2,
    aggregations: AGGREGATIONS,
    loading: false,
    error: null,
    ...over,
  }
}

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

beforeEach(() => {
  fake.params = new URLSearchParams()
  fake.route = {}
  fake.push.mockReset()
  fake.useSearch.mockReset()
  fake.useCmsSearch.mockReset()
  Object.values(fake.tracking).forEach((f) => f.mockReset())
  fake.rows = {}
  fake.cms = cms()
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
})

const sliders = () => screen.queryAllByTestId('slider')

describe('Homepage - the hero', () => {
  it('a sample shop gets the wide hero, its search call to action and its promo cards', () => {
    renderIn(<Homepage />, { catalog: 'fashion', localized: 'fashion_en' })
    const hero = screen.getByTestId('home-hero')
    expect(within(hero).getByRole('heading')).toHaveTextContent(
      'The autumn collection'
    )
    expect(
      within(hero).getByRole('link', { name: 'Shop dresses' })
    ).toHaveAttribute('href', '/search?q=dress')
    const cards = within(screen.getByTestId('promo-cards')).getAllByRole('link')
    expect(cards.map((a) => a.getAttribute('href'))).toEqual([
      '/category/cat_fio_50',
      '/category/cat_fio_44',
    ])
  })

  it('a shop without blocks keeps the text hero, with its own search query', () => {
    renderIn(<Homepage />)
    expect(screen.queryByTestId('home-hero')).not.toBeInTheDocument()
    expect(screen.queryByTestId('promo-cards')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Shop dresses' })).toHaveAttribute(
      'href',
      '/search?q=dress'
    )
  })

  it('a shop with no hero query gets a browse link to its root category', () => {
    renderIn(<Homepage />, { catalog: 'misc', localized: 'misc_en' })
    expect(
      screen.getByRole('link', { name: 'Browse all products' })
    ).toHaveAttribute('href', '/category/cat_1')
  })
})

describe('Homepage - the two product rows', () => {
  it('row 1 browses the root category, row 2 the third category, 3 products each', () => {
    renderIn(<Homepage />, { categories: THREE })
    expect(fake.useSearch).toHaveBeenCalledWith({
      pageSize: 3,
      categoryCode: 'cat_1',
    })
    expect(fake.useSearch).toHaveBeenCalledWith({
      pageSize: 3,
      categoryCode: 'cat_3',
    })
  })

  it('row 2 falls back to the second category when there is no third', () => {
    renderIn(<Homepage />)
    expect(fake.useSearch).toHaveBeenCalledWith({
      pageSize: 3,
      categoryCode: 'cat_2',
    })
    expect(fake.useSearch).not.toHaveBeenCalledWith(
      expect.objectContaining({ categoryCode: 'cat_3' })
    )
  })

  it('shows at most 3 products per row; row 2 is titled with its category', () => {
    fake.rows = {
      cat_1: { products: products('A', 'B', 'C', 'D'), loading: false },
      cat_3: { products: products('X', 'Y'), loading: false },
    }
    renderIn(<Homepage />, { categories: THREE })
    const [first, second] = sliders()
    expect(first).toHaveAttribute('data-title', 'Our selection')
    expect(first).toHaveAttribute('data-skus', 'A,B,C')
    expect(first).toHaveAttribute('data-see-all', '/category/cat_1')
    expect(second).toHaveAttribute('data-title', 'Bags')
    expect(second).toHaveAttribute('data-skus', 'X,Y')
    expect(second).toHaveAttribute('data-see-all', '/category/cat_3')
  })

  it('shows a 3-card skeleton per row while loading', () => {
    fake.rows = {
      cat_1: { products: [], loading: true },
      cat_2: { products: [], loading: true },
    }
    const { container } = renderIn(<Homepage />)
    expect(sliders()).toHaveLength(0)
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(6)
  })

  it('an empty row 2 is hidden; an empty row 1 still shows (pinned as today)', () => {
    renderIn(<Homepage />)
    expect(sliders()).toHaveLength(1)
    expect(sliders()[0]).toHaveAttribute('data-title', 'Our selection')
    expect(sliders()[0]).toHaveAttribute('data-skus', '')
  })
})

describe('Homepage - the vector block', () => {
  it("links the shop's first three example queries, never the control query", () => {
    renderIn(<Homepage />)
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('/vector-search'))
    expect(hrefs).toEqual([
      '/vector-search?q=jewellery',
      '/vector-search?q=wedding%20guest%20outfit',
      '/vector-search?q=something%20to%20wear%20to%20the%20beach',
      '/vector-search',
    ])
  })

  it('a short list loses its last entry, the control query', () => {
    renderIn(<Homepage />, { localized: 'com_fr' })
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('/vector-search?q='))
    expect(hrefs).toEqual([
      '/vector-search?q=pantalon%20large',
      '/vector-search?q=tenue%20pour%20un%20mariage',
    ])
  })

  it('a shop with no examples keeps only the call to action', () => {
    renderIn(<Homepage />, { catalog: 'misc', localized: 'misc_en' })
    expect(
      screen.getByRole('link', { name: 'Describe what you want' })
    ).toHaveAttribute('href', '/vector-search')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

describe('Homepage - tracking', () => {
  it('sends one DISPLAY for row 1 only, again only when its products change', () => {
    fake.rows = {
      cat_1: { products: products('A', 'B'), loading: false },
      cat_2: { products: products('X'), loading: false },
    }
    const view = renderIn(<Homepage />)
    expect(fake.tracking.trackDisplay).toHaveBeenCalledTimes(1)
    expect(fake.tracking.trackDisplay).toHaveBeenCalledWith([
      { sku: 'A', position: 0 },
      { sku: 'B', position: 1 },
    ])

    fake.rows.cat_1 = { products: products('A', 'B'), loading: false }
    view.rerender(tree(<Homepage />))
    expect(fake.tracking.trackDisplay).toHaveBeenCalledTimes(1)

    fake.rows.cat_1 = { products: products('C'), loading: false }
    view.rerender(tree(<Homepage />))
    expect(fake.tracking.trackDisplay).toHaveBeenCalledTimes(2)
    expect(fake.tracking.trackDisplay).toHaveBeenLastCalledWith([
      { sku: 'C', position: 0 },
    ])
  })

  it('sends nothing while row 1 is empty', () => {
    fake.rows = { cat_2: { products: products('X'), loading: false } }
    renderIn(<Homepage />)
    expect(fake.tracking.trackDisplay).not.toHaveBeenCalled()
  })
})

describe('Blog list - the request', () => {
  it('asks for 10 articles, newest first, page and filters from the URL', () => {
    fake.params = new URLSearchParams('type=post&topic=care&page=2')
    renderIn(<BlogPage />)
    expect(fake.useCmsSearch).toHaveBeenLastCalledWith({
      filters: [
        { equalFilter: { field: 'content_type__value', eq: 'post' } },
        { equalFilter: { field: 'topic__value', eq: 'care' } },
      ],
      sortField: 'published_at',
      sortDirection: 'desc',
      pageSize: 10,
      currentPage: 2,
    })
  })

  it('no filter and a bad page give page 1 of everything', () => {
    fake.params = new URLSearchParams('page=abc')
    renderIn(<BlogPage />)
    expect(fake.useCmsSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: [], currentPage: 1 })
    )
  })
})

describe('Blog list - the filter chips', () => {
  it('two groups named Type and Topic, chips from the aggregations', () => {
    renderIn(<BlogPage />)
    const type = screen.getByRole('group', { name: 'Type' })
    const topic = screen.getByRole('group', { name: 'Topic' })
    expect(
      within(type)
        .getAllByRole('button')
        .map((b) => b.textContent)
    ).toEqual(['All', 'Post 5', 'Guide 2'])
    expect(
      within(topic)
        .getAllByRole('button')
        .map((b) => b.textContent)
    ).toEqual(['All', 'Care 3'])
  })

  it('"All" is pressed when nothing is selected', () => {
    renderIn(<BlogPage />)
    const type = screen.getByRole('group', { name: 'Type' })
    expect(within(type).getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(within(type).getByRole('button', { name: /Post/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('the selected chip is pressed, and it is the one that looks selected', () => {
    fake.params = new URLSearchParams('type=post')
    renderIn(<BlogPage />)
    const type = screen.getByRole('group', { name: 'Type' })
    for (const b of within(type).getAllByRole('button')) {
      const pressed = b.getAttribute('aria-pressed') === 'true'
      expect(b.classList.contains('filter-chip-selected')).toBe(pressed)
    }
    expect(within(type).getByRole('button', { name: /Post/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(within(type).getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('a filter change writes the URL, keeps the other filter and drops the page', async () => {
    fake.params = new URLSearchParams('type=post&page=2')
    renderIn(<BlogPage />)
    await userEvent.click(
      within(screen.getByRole('group', { name: 'Topic' })).getByRole('button', {
        name: /Care/,
      })
    )
    expect(fake.push).toHaveBeenCalledWith('/com_en/blog?type=post&topic=care')
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('clicking the selected chip clears it', async () => {
    fake.params = new URLSearchParams('type=post&topic=care')
    renderIn(<BlogPage />)
    await userEvent.click(
      within(screen.getByRole('group', { name: 'Type' })).getByRole('button', {
        name: /Post/,
      })
    )
    expect(fake.push).toHaveBeenCalledWith('/com_en/blog?topic=care')
  })

  it('"All" clears its own row only', async () => {
    fake.params = new URLSearchParams('type=post&topic=care')
    renderIn(<BlogPage />)
    await userEvent.click(
      within(screen.getByRole('group', { name: 'Topic' })).getByRole('button', {
        name: 'All',
      })
    )
    expect(fake.push).toHaveBeenCalledWith('/com_en/blog?type=post')
  })
})

describe('Blog list - pages and states', () => {
  it('pagination writes the page, keeps the filters; page 1 drops the parameter', async () => {
    fake.params = new URLSearchParams('type=post&page=2')
    renderIn(<BlogPage />)
    const nav = screen.getByTestId('pagination')
    expect(nav).toHaveAttribute('data-page', '2')
    expect(nav).toHaveAttribute('data-count', '2')
    await userEvent.click(screen.getByRole('button', { name: 'to page 3' }))
    expect(fake.push).toHaveBeenLastCalledWith('/com_en/blog?type=post&page=3')
    await userEvent.click(screen.getByRole('button', { name: 'to page 1' }))
    expect(fake.push).toHaveBeenLastCalledWith('/com_en/blog?type=post')
  })

  it('shows the count and one card per article', () => {
    renderIn(<BlogPage />)
    expect(screen.getByText('12 articles')).toBeInTheDocument()
    expect(
      screen.getAllByTestId('blog-card').map((c) => c.textContent)
    ).toEqual(['Post 1', 'Post 2'])
  })

  it('shows a 6-card skeleton while loading', () => {
    fake.cms = cms({ loading: true, pages: [] })
    const { container } = renderIn(<BlogPage />)
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(6)
    expect(screen.queryByTestId('blog-card')).not.toBeInTheDocument()
  })

  it('no article, or an error, shows the empty state', () => {
    fake.cms = cms({ pages: [], total: 0 })
    const view = renderIn(<BlogPage />)
    expect(
      screen.getByRole('heading', { name: 'No article matches those filters' })
    ).toBeInTheDocument()
    view.unmount()
    fake.cms = cms({ error: new Error('down') })
    renderIn(<BlogPage />)
    expect(
      screen.getByRole('heading', { name: 'No article matches those filters' })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('blog-card')).not.toBeInTheDocument()
  })
})

describe('Blog list - tracking', () => {
  it('one DISPLAY per page of articles, positions counted across pages', () => {
    fake.params = new URLSearchParams('page=2')
    const view = renderIn(<BlogPage />)
    expect(fake.tracking.trackCmsDisplay).toHaveBeenCalledTimes(1)
    expect(fake.tracking.trackCmsDisplay).toHaveBeenCalledWith([
      { id: '1', position: 10 },
      { id: '2', position: 11 },
    ])
    fake.cms = cms()
    view.rerender(tree(<BlogPage />))
    expect(fake.tracking.trackCmsDisplay).toHaveBeenCalledTimes(1)
  })

  it('nothing while loading or empty', () => {
    fake.cms = cms({ loading: true })
    const view = renderIn(<BlogPage />)
    view.unmount()
    fake.cms = cms({ pages: [] })
    renderIn(<BlogPage />)
    expect(fake.tracking.trackCmsDisplay).not.toHaveBeenCalled()
  })
})

describe('Blog article', () => {
  const full = post('42', {
    title: 'How to fold a shirt',
    content: '<p>Fold it <strong>twice</strong>.</p>',
    topic: { value: 'care', label: 'Care' },
    contentType: { value: 'guide', label: 'Guide' },
    tags: [
      { value: 'cotton', label: 'Cotton' },
      { value: 'linen', label: 'Linen' },
    ],
  })

  it('asks for the one article with the id from the URL', () => {
    fake.route = { id: '42' }
    fake.cms = cms({ pages: [full] })
    renderIn(<BlogPostPage />)
    expect(fake.useCmsSearch).toHaveBeenLastCalledWith({
      filters: [{ equalFilter: { field: 'id', eq: '42' } }],
      pageSize: 1,
      currentPage: 1,
      skip: false,
      initialPages: undefined,
    })
  })

  it('hands a server-fetched article to the hook as its first result', () => {
    fake.route = { id: '42' }
    fake.cms = cms({ pages: [full] })
    renderIn(<BlogPostPage initialPost={full} />)
    expect(fake.useCmsSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ initialPages: [full] })
    )
  })

  it('no id: no request', () => {
    fake.cms = cms({ pages: [] })
    renderIn(<BlogPostPage />)
    expect(fake.useCmsSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: [], skip: true })
    )
  })

  it('shows the title, the content, the tags, the topic and the way back', () => {
    fake.route = { id: '42' }
    fake.cms = cms({ pages: [full] })
    const { container } = renderIn(<BlogPostPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'How to fold a shirt' })
    ).toBeInTheDocument()
    expect(container.querySelector('.blog-post-content')?.innerHTML).toBe(
      '<p>Fold it <strong>twice</strong>.</p>'
    )
    expect(
      [...container.querySelectorAll('.blog-post-tags .filter-chip')].map(
        (t) => t.textContent
      )
    ).toEqual(['Cotton', 'Linen'])
    expect(container.querySelector('.breadcrumb')).toHaveTextContent(
      'Blog / Care'
    )
    expect(
      screen.getByRole('link', { name: 'Back to the blog' })
    ).toHaveAttribute('href', '/blog')
  })

  it('shows the skeleton while loading', () => {
    fake.route = { id: '42' }
    fake.cms = cms({ pages: [], loading: true })
    renderIn(<BlogPostPage />)
    expect(screen.getByTestId('post-skeleton')).toBeInTheDocument()
  })

  it('an unknown id shows "not found" with a link back to the blog', () => {
    fake.route = { id: '404' }
    fake.cms = cms({ pages: [] })
    renderIn(<BlogPostPage />)
    expect(
      screen.getByRole('heading', { name: 'Article not found' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Back to the blog' })
    ).toHaveAttribute('href', '/blog')
    expect(fake.tracking.trackCmsPageView).not.toHaveBeenCalled()
  })

  it('sends one VIEW per article', () => {
    fake.route = { id: '42' }
    fake.cms = cms({ pages: [full] })
    const view = renderIn(<BlogPostPage />)
    fake.cms = cms({ pages: [{ ...full }] })
    act(() => {
      view.rerender(tree(<BlogPostPage />))
    })
    expect(fake.tracking.trackCmsPageView).toHaveBeenCalledTimes(1)
    expect(fake.tracking.trackCmsPageView).toHaveBeenCalledWith(
      '42',
      'How to fold a shirt'
    )
  })
})
