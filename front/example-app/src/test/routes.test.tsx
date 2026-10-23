// @vitest-environment node
// Route files called as plain async functions. The API fetchers, notFound()/redirect() and
// the client views are replaced by fakes, so these tests check what each route asks Next to
// do (404, redirect, which props reach the view) - not the HTTP status Next then sends.
// See specs/test-plan-routing.md, part C, and decision 2 there.
import { isValidElement, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fakes = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND')
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
  // A named component that renders nothing; the tests only look for it in the tree.
  view: (name: string) => {
    const View = () => null
    Object.defineProperty(View, 'name', { value: name })
    return { default: View }
  },
}))

vi.mock('next/navigation', () => ({
  notFound: fakes.notFound,
  redirect: fakes.redirect,
}))
vi.mock('next/server', () => ({ connection: vi.fn(async () => {}) }))

vi.mock('../sdk/server', () => ({
  resolveLocale: vi.fn(),
  fetchProductBySku: vi.fn(),
  fetchCategoryProducts: vi.fn(),
  fetchSearchProducts: vi.fn(),
  fetchCmsPageById: vi.fn(),
  fetchPublicConfiguration: vi.fn(),
  cachedCategoryTree: vi.fn(),
}))
vi.mock('../sdk/catalogs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk/catalogs')>()),
  fetchCatalogs: vi.fn(),
  fetchCategoryTree: vi.fn(),
}))
vi.mock('../sdk/axisLabels', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk/axisLabels')>()),
  fetchAxisLabels: vi.fn(),
}))
vi.mock('../sdk/bundles', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk/bundles')>()),
  fetchBundles: vi.fn(),
}))

vi.mock('../../app/providers', () => fakes.view('Providers'))
vi.mock('../views/Homepage', () => fakes.view('Homepage'))
vi.mock('../views/BlogPage', () => fakes.view('BlogPage'))
vi.mock('../views/BlogPostPage', () => fakes.view('BlogPostPage'))
vi.mock('../views/CartPage', () => fakes.view('CartPage'))
vi.mock('../views/CategoryPage', () => fakes.view('CategoryPage'))
vi.mock('../views/CheckoutPage', () => fakes.view('CheckoutPage'))
vi.mock('../views/ClosingPage', () => fakes.view('ClosingPage'))
vi.mock('../views/CmsPage', () => fakes.view('CmsPage'))
vi.mock('../views/ExplainPage', () => fakes.view('ExplainPage'))
vi.mock('../views/ProductPage', () => fakes.view('ProductPage'))
vi.mock('../views/SearchPage', () => fakes.view('SearchPage'))
vi.mock('../views/VectorSearchPage', () => fakes.view('VectorSearchPage'))

import RootRedirect from '../../app/page'
import LocaleLayout from '../../app/[locale]/layout'
import * as home from '../../app/[locale]/page'
import * as blog from '../../app/[locale]/blog/page'
import * as article from '../../app/[locale]/blog/[id]/page'
import ArticleGuard from '../../app/[locale]/blog/[id]/layout'
import * as cart from '../../app/[locale]/cart/page'
import * as categoryRoute from '../../app/[locale]/category/[code]/page'
import CategoryGuard from '../../app/[locale]/category/[code]/layout'
import * as checkout from '../../app/[locale]/checkout/page'
import * as closing from '../../app/[locale]/closing/page'
import * as cms from '../../app/[locale]/cms/[slug]/page'
import * as explain from '../../app/[locale]/explain/page'
import * as product from '../../app/[locale]/product/[sku]/page'
import ProductGuard from '../../app/[locale]/product/[sku]/layout'
import * as search from '../../app/[locale]/search/page'
import * as vectorSearch from '../../app/[locale]/vector-search/page'

import Providers from '../../app/providers'
import BlogPostPage from '../views/BlogPostPage'
import CategoryPage from '../views/CategoryPage'
import ProductPage from '../views/ProductPage'
import SearchPage from '../views/SearchPage'
import {
  fetchCatalogs,
  fetchCategoryTree,
  findLocalizedCatalog,
} from '../sdk/catalogs'
import { fetchAxisLabels } from '../sdk/axisLabels'
import { fetchBundles } from '../sdk/bundles'
import {
  cachedCategoryTree,
  fetchCategoryProducts,
  fetchCmsPageById,
  fetchProductBySku,
  fetchPublicConfiguration,
  fetchSearchProducts,
  resolveLocale,
} from '../sdk/server'
import type { RouteSearchParams } from '../sdk/catalogSwitch'
import { canonical, NOINDEX } from '../sdk/seo'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

type AnyProps = Record<string, unknown>

// The props of the first element of `type` in a returned tree, without rendering it.
function propsOf(node: ReactNode, type: unknown): AnyProps | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = propsOf(child, type)
      if (found) return found
    }
    return undefined
  }
  if (!isValidElement(node)) return undefined
  const props = node.props as AnyProps & { children?: ReactNode }
  if (node.type === type) return props
  return propsOf(props.children, type)
}

const params = <T extends object>(p: T) => Promise.resolve(p)
const noSearch = () => Promise.resolve({})

const PRODUCT = {
  id: 'VD10',
  sku: 'VD10',
  name: 'Dress',
  source: { sku: 'VD10', name: 'Dress' },
}
const ARTICLE = {
  id: '42',
  title: 'Hello',
  content: '<p>Body</p>',
  published_at: '2026-01-01',
}
const LISTING = { products: [], total: 0, pageCount: 0, aggregations: [] }

beforeEach(() => {
  vi.mocked(resolveLocale).mockImplementation(async (code: string) =>
    findLocalizedCatalog(CATALOGS, code)
  )
  vi.mocked(fetchCatalogs).mockResolvedValue(CATALOGS)
  vi.mocked(fetchCategoryTree).mockResolvedValue(CATEGORY_TREE)
  vi.mocked(cachedCategoryTree).mockResolvedValue(CATEGORY_TREE)
  vi.mocked(fetchAxisLabels).mockResolvedValue({})
  vi.mocked(fetchBundles).mockResolvedValue([])
  vi.mocked(fetchPublicConfiguration).mockResolvedValue({})
  vi.mocked(fetchProductBySku).mockResolvedValue(PRODUCT)
  vi.mocked(fetchCmsPageById).mockResolvedValue(ARTICLE)
  vi.mocked(fetchCategoryProducts).mockResolvedValue(LISTING)
  vi.mocked(fetchSearchProducts).mockResolvedValue(LISTING)
})

describe('/ (root)', () => {
  it('redirects to the default localized catalog', async () => {
    await expect(RootRedirect()).rejects.toThrow(/^REDIRECT:\/com_fr$/)
  })

  it('fails loudly when the API returns no catalog', async () => {
    vi.mocked(fetchCatalogs).mockResolvedValue([])
    await expect(RootRedirect()).rejects.toThrow('No catalogs returned')
  })
})

describe('[locale] layout', () => {
  it('is a 404 for an unknown locale', async () => {
    await expect(
      LocaleLayout({ children: null, params: params({ locale: 'xx_xx' }) })
    ).rejects.toThrow('NOT_FOUND')
  })

  it('hands the resolved catalog and its data to Providers', async () => {
    const tree = await LocaleLayout({
      children: null,
      params: params({ locale: 'fr_en' }),
    })
    const props = propsOf(tree, Providers)
    expect(props).toMatchObject({
      locale: 'fr_en',
      catalogs: CATALOGS,
      selectedCatalog: { code: 'fr' },
      selectedLocalizedCatalog: { code: 'fr_en' },
      categories: CATEGORY_TREE,
    })
    // The tree is fetched for the resolved catalog, so category names come in its language.
    // Through the per-request cache the pages use too, so the tree is fetched once per render
    // (bugfix-category-tree-fetched-twice).
    expect(cachedCategoryTree).toHaveBeenCalledWith(2, 22)
    expect(fetchCategoryTree).not.toHaveBeenCalled()
  })
})

describe('every route under [locale] is a 404 for an unknown locale', () => {
  const p = <T extends object = object>(extra?: T) =>
    params({ locale: 'xx_xx', ...extra } as { locale: string } & T)
  const cases: [string, () => Promise<unknown>][] = [
    ['home', () => home.default({ params: p() })],
    ['blog', () => blog.default({ params: p() })],
    [
      'blog article',
      () =>
        article.default({ params: p({ id: '42' }), searchParams: noSearch() }),
    ],
    [
      'blog article guard',
      () => ArticleGuard({ children: null, params: p({ id: '42' }) }),
    ],
    ['cart', () => cart.default({ params: p() })],
    [
      'category',
      () =>
        categoryRoute.default({
          params: p({ code: 'cat_1' }),
          searchParams: noSearch(),
        }),
    ],
    [
      'category guard',
      () => CategoryGuard({ children: null, params: p({ code: 'cat_1' }) }),
    ],
    ['checkout', () => checkout.default({ params: p() })],
    ['closing', () => closing.default({ params: p() })],
    ['cms', () => cms.default({ params: p({ slug: 'faq' }) })],
    ['explain', () => explain.default({ params: p() })],
    [
      'product',
      () =>
        product.default({
          params: p({ sku: 'VD10' }),
          searchParams: noSearch(),
        }),
    ],
    [
      'product guard',
      () => ProductGuard({ children: null, params: p({ sku: 'VD10' }) }),
    ],
    ['search', () => search.default({ params: p(), searchParams: noSearch() })],
    ['vector search', () => vectorSearch.default({ params: p() })],
  ]

  it.each(cases)('%s', async (_name, run) => {
    await expect(run()).rejects.toThrow('NOT_FOUND')
  })
})

describe('a missing product, category or article (feature-catalog-switch-missing-target)', () => {
  const fromOther = (): Promise<RouteSearchParams> =>
    Promise.resolve({ from: 'fr_fr' })

  beforeEach(() => {
    vi.mocked(fetchProductBySku).mockResolvedValue(null)
    vi.mocked(fetchCmsPageById).mockResolvedValue(null)
  })

  const routes = {
    product: (searchParams: Promise<RouteSearchParams>) =>
      product.default({
        params: params({ locale: 'com_fr', sku: 'NOPE' }),
        searchParams,
      }),
    productMetadata: (searchParams: Promise<RouteSearchParams>) =>
      product.generateMetadata({
        params: params({ locale: 'com_fr', sku: 'NOPE' }),
        searchParams,
      }),
    category: (searchParams: Promise<RouteSearchParams>) =>
      categoryRoute.default({
        params: params({ locale: 'com_fr', code: 'cat_404' }),
        searchParams,
      }),
    categoryMetadata: (searchParams: Promise<RouteSearchParams>) =>
      categoryRoute.generateMetadata({
        params: params({ locale: 'com_fr', code: 'cat_404' }),
        searchParams,
      }),
    article: (searchParams: Promise<RouteSearchParams>) =>
      article.default({
        params: params({ locale: 'com_fr', id: '404' }),
        searchParams,
      }),
    articleMetadata: (searchParams: Promise<RouteSearchParams>) =>
      article.generateMetadata({
        params: params({ locale: 'com_fr', id: '404' }),
        searchParams,
      }),
  }

  it.each(Object.entries(routes))(
    '%s: 404 without the switch marker',
    async (_name, run) => {
      await expect(run(noSearch())).rejects.toThrow('NOT_FOUND')
    }
  )

  it.each([
    ['product', '/com_fr/category/cat_1'],
    ['productMetadata', '/com_fr/category/cat_1'],
    ['category', '/com_fr/category/cat_1'],
    ['categoryMetadata', '/com_fr/category/cat_1'],
    ['article', '/com_fr/blog'],
    ['articleMetadata', '/com_fr/blog'],
  ] as const)(
    '%s: redirects to %s after a catalog switch',
    async (name, target) => {
      await expect(routes[name](fromOther())).rejects.toThrow(
        new RegExp(`^REDIRECT:${target}$`)
      )
    }
  )
})

describe('guard layouts', () => {
  it('render their children even when the entity is missing', async () => {
    // The existence check belongs to the page, which can read ?from= (MUST NOT in
    // feature-catalog-switch-missing-target). A guard 404ing would break the switch.
    vi.mocked(fetchProductBySku).mockResolvedValue(null)
    vi.mocked(fetchCmsPageById).mockResolvedValue(null)
    const child = <p>child</p>
    for (const run of [
      () =>
        ProductGuard({
          children: child,
          params: params({ locale: 'com_fr', sku: 'NOPE' }),
        }),
      () =>
        CategoryGuard({
          children: child,
          params: params({ locale: 'com_fr', code: 'cat_404' }),
        }),
      () =>
        ArticleGuard({
          children: child,
          params: params({ locale: 'com_fr', id: '404' }),
        }),
    ]) {
      await expect(run()).resolves.toBeTruthy()
    }
  })

  it('call the same fetch as the page, so the page gets a cache hit', async () => {
    await CategoryGuard({
      children: null,
      params: params({ locale: 'com_fr', code: 'cat_1' }),
    })
    await categoryRoute.default({
      params: params({ locale: 'com_fr', code: 'cat_1' }),
      searchParams: noSearch(),
    })
    const [guardCall, pageCall] = vi.mocked(fetchCategoryProducts).mock.calls
    expect(pageCall).toEqual(guardCall)
  })
})

describe('server data reaches the view', () => {
  it('product: the fetched document is initialProduct', async () => {
    const tree = await product.default({
      params: params({ locale: 'com_fr', sku: 'VD10' }),
      searchParams: noSearch(),
    })
    expect(propsOf(tree, ProductPage)?.initialProduct).toBe(PRODUCT)
    expect(fetchProductBySku).toHaveBeenCalledWith('com_fr', 'VD10')
  })

  it('category: the first listing page is initialData', async () => {
    const tree = await categoryRoute.default({
      params: params({ locale: 'com_fr', code: 'cat_11' }),
      searchParams: noSearch(),
    })
    expect(propsOf(tree, CategoryPage)?.initialData).toBe(LISTING)
    expect(fetchCategoryProducts).toHaveBeenCalledWith('com_fr', 'cat_11')
  })

  it('blog article: the mapped article is initialPost', async () => {
    const tree = await article.default({
      params: params({ locale: 'com_fr', id: '42' }),
      searchParams: noSearch(),
    })
    expect(propsOf(tree, BlogPostPage)?.initialPost).toMatchObject({
      id: '42',
      title: 'Hello',
    })
  })
})

describe('cms route', () => {
  it.each(['about', 'shipping-returns', 'faq'])('renders %s', async (slug) => {
    await expect(
      cms.default({ params: params({ locale: 'com_fr', slug }) })
    ).resolves.toBeTruthy()
  })

  it('is a 404 for any other slug', async () => {
    await expect(
      cms.default({ params: params({ locale: 'com_fr', slug: 'careers' }) })
    ).rejects.toThrow('NOT_FOUND')
  })
})

describe('search route: initialData is fetched only for a plain query', () => {
  const run = (sp: Record<string, string>) =>
    search.default({
      params: params({ locale: 'com_fr' }),
      searchParams: Promise.resolve(sp),
    })

  it('fetches when q is set and no filter is in the URL', async () => {
    const tree = await run({ q: 'robe' })
    expect(fetchSearchProducts).toHaveBeenCalledWith('com_fr', 'robe')
    expect(propsOf(tree, SearchPage)?.initialData).toBe(LISTING)
  })

  it('does not fetch with an empty query', async () => {
    const tree = await run({ q: '' })
    expect(fetchSearchProducts).not.toHaveBeenCalled()
    expect(propsOf(tree, SearchPage)?.initialData).toBeUndefined()
  })

  it('does not fetch when the URL carries an f_ filter', async () => {
    const tree = await run({ q: 'robe', f_color: 'red' })
    expect(fetchSearchProducts).not.toHaveBeenCalled()
    expect(propsOf(tree, SearchPage)?.initialData).toBeUndefined()
  })
})

describe('metadata (feature-metadata-all-routes)', () => {
  const p = <T extends object = object>(extra?: T) =>
    params({ locale: 'com_fr', ...extra } as { locale: string } & T)

  it.each([
    [
      'search',
      () => search.generateMetadata({ params: p(), searchParams: noSearch() }),
    ],
    ['cart', () => cart.generateMetadata({ params: p() })],
    ['checkout', () => checkout.generateMetadata({ params: p() })],
    ['closing', () => closing.generateMetadata({ params: p() })],
    ['explain', () => explain.generateMetadata({ params: p() })],
    ['vector search', () => vectorSearch.generateMetadata({ params: p() })],
  ] as const)(
    '%s is noindex, titled, with no canonical',
    async (_name, run) => {
      const meta = await run()
      expect(meta.robots).toEqual(NOINDEX.robots)
      expect(meta.title).toBeTruthy()
      expect(meta.alternates).toBeUndefined()
    }
  )

  it.each([
    ['home', () => home.generateMetadata({ params: p() }), ''],
    ['blog', () => blog.generateMetadata({ params: p() }), '/blog'],
    [
      'blog article',
      () =>
        article.generateMetadata({
          params: p({ id: '42' }),
          searchParams: noSearch(),
        }),
      '/blog/42',
    ],
    [
      'category',
      () =>
        categoryRoute.generateMetadata({
          params: p({ code: 'cat_11' }),
          searchParams: noSearch(),
        }),
      '/category/cat_11',
    ],
    [
      'product',
      () =>
        product.generateMetadata({
          params: p({ sku: 'VD10' }),
          searchParams: noSearch(),
        }),
      '/product/VD10',
    ],
    [
      'cms',
      () => cms.generateMetadata({ params: p({ slug: 'faq' }) }),
      '/cms/faq',
    ],
  ] as const)(
    '%s is indexable, titled, with canonical SITE/com_fr%s',
    async (_name, run, path) => {
      const meta = await run()
      expect(meta.robots).toBeUndefined()
      expect(meta.title).toBeTruthy()
      expect(meta.alternates?.canonical).toBe(canonical('com_fr', path))
    }
  )
})
