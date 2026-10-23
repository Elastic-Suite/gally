// @vitest-environment node
// What each server fetcher sends to the API, and what it returns when the API fails.
// The SDK search manager is replaced by a fake that records the request options.
// See specs/test-plan-data-layer.md, part E.
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  search: vi.fn(),
  fetch: vi.fn(),
}))

vi.mock('../sdk/index', () => ({
  getBaseUri: () => 'http://api.test/api',
  getSearchManager: () => ({ search: fake.search }),
}))
vi.mock('../sdk/catalogs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk/catalogs')>()),
  fetchCatalogs: vi.fn(async () => (await import('./fixtures')).CATALOGS),
}))

import {
  fetchCategoryProducts,
  fetchCmsPageById,
  fetchProductBySku,
  fetchPublicConfiguration,
  fetchSearchProducts,
} from '../sdk/server'
import { CMS_FIELDS, productDetailFields, productFields } from '../sdk/fields'
import { CMS_ARTICLE, CONFIGURABLE_DETAIL } from './fixtures/api'

// A canned SDK response.
function response(
  collection: unknown[],
  extra: Partial<Record<string, unknown>> = {}
) {
  return {
    getCollection: () => collection,
    getTotalCount: () => extra.total ?? collection.length,
    getLastPage: () => extra.lastPage ?? 1,
    getAggregations: () => extra.aggregations ?? [],
    getSortField: () => extra.sortField ?? 'category__position',
    getSortDirection: () => extra.sortDirection ?? 'asc',
  }
}

const sent = () => fake.search.mock.calls.at(-1)?.[0]

beforeEach(() => {
  fake.search.mockReset()
  vi.stubGlobal('fetch', fake.fetch)
  fake.fetch.mockReset()
})

// Each test uses its own arguments, so a memoising cache() could not hand one test another's
// result.
describe('fetchProductBySku (bugfix-product-sku-exact-filter)', () => {
  it('searches the SKU with an exact filter and the detail selection', async () => {
    fake.search.mockResolvedValue(response([CONFIGURABLE_DETAIL]))
    expect(await fetchProductBySku('com_fr', 'VA02')).toBe(CONFIGURABLE_DETAIL)
    expect(sent()).toEqual({
      localizedCatalog: 'com_fr',
      metadata: 'product',
      searchQuery: 'VA02',
      filters: [{ sku: { eq: 'VA02' } }],
      currentPage: 1,
      pageSize: 1,
      isAutocomplete: false,
      selectedFields: productDetailFields('com'),
    })
  })

  it('gives null when nothing matches or the API fails', async () => {
    fake.search.mockResolvedValue(response([]))
    expect(await fetchProductBySku('com_fr', 'NONE-1')).toBeNull()
    fake.search.mockRejectedValue(new Error('API down'))
    expect(await fetchProductBySku('com_fr', 'NONE-2')).toBeNull()
  })

  it('falls back to the common fields for an unknown localized catalog', async () => {
    fake.search.mockResolvedValue(response([]))
    await fetchProductBySku('xx_xx', 'ANY')
    expect(sent().selectedFields).toEqual(productDetailFields(''))
  })
})

describe('fetchCategoryProducts', () => {
  it('browses the category with the listing selection and no sort', async () => {
    fake.search.mockResolvedValue(response([], { total: 42, lastPage: 3 }))
    const result = await fetchCategoryProducts('com_en', 'cat_8')
    expect(sent()).toEqual({
      localizedCatalog: 'com_en',
      metadata: 'product',
      categoryId: 'cat_8',
      currentPage: 1,
      pageSize: 20,
      isAutocomplete: false,
      selectedFields: productFields('com'),
      filters: [],
    })
    expect(result).toEqual({
      products: [],
      total: 42,
      pageCount: 3,
      aggregations: [],
      appliedSort: { field: 'category__position', direction: 'asc' },
    })
  })

  it('gives an empty result, without appliedSort, when the API fails', async () => {
    fake.search.mockRejectedValue(new Error('API down'))
    expect(await fetchCategoryProducts('com_en', 'cat_down')).toEqual({
      products: [],
      total: 0,
      pageCount: 0,
      aggregations: [],
    })
  })
})

describe('fetchSearchProducts', () => {
  it('searches the query sorted by relevance', async () => {
    fake.search.mockResolvedValue(response([]))
    await fetchSearchProducts('fr_en', 'robe')
    expect(sent()).toMatchObject({
      localizedCatalog: 'fr_en',
      metadata: 'product',
      searchQuery: 'robe',
      currentPage: 1,
      pageSize: 20,
      selectedFields: productFields('fr'),
      filters: [],
      sortField: '_score',
      sortDirection: 'desc',
    })
    expect(sent()).not.toHaveProperty('categoryId')
  })

  it('gives an empty result when the API fails', async () => {
    fake.search.mockRejectedValue(new Error('API down'))
    expect(await fetchSearchProducts('fr_en', 'down')).toMatchObject({
      products: [],
      total: 0,
    })
  })
})

describe('fetchCmsPageById (bugfix-cms-selected-fields-projection)', () => {
  it('asks cms_page for one id with CMS_FIELDS', async () => {
    fake.search.mockResolvedValue(response([CMS_ARTICLE]))
    expect(await fetchCmsPageById('com_en', '9')).toBe(CMS_ARTICLE)
    expect(sent()).toEqual({
      localizedCatalog: 'com_en',
      metadata: 'cms_page',
      filters: [{ equalFilter: { field: 'id', eq: '9' } }],
      currentPage: 1,
      pageSize: 1,
      isAutocomplete: false,
      selectedFields: CMS_FIELDS,
    })
  })

  it('gives null when nothing matches or the API fails', async () => {
    fake.search.mockResolvedValue(response([]))
    expect(await fetchCmsPageById('com_en', 'none-1')).toBeNull()
    fake.search.mockRejectedValue(new Error('API down'))
    expect(await fetchCmsPageById('com_en', 'none-2')).toBeNull()
  })
})

describe('fetchPublicConfiguration (feature-public-configuration)', () => {
  it('asks for the localized catalog and turns the rows into a map', async () => {
    fake.fetch.mockResolvedValue({
      json: async () => ({
        'hydra:member': [
          { path: 'gally.base_url.media', value: 'https://media.test/' },
        ],
      }),
    })
    expect(await fetchPublicConfiguration('com_fr')).toEqual({
      'gally.base_url.media': 'https://media.test/',
    })
    expect(fake.fetch).toHaveBeenCalledWith(
      'http://api.test/api/public_configurations?localizedCatalogCode=com_fr',
      expect.anything()
    )
  })

  it('gives {} when the endpoint fails', async () => {
    fake.fetch.mockRejectedValue(new Error('down'))
    expect(await fetchPublicConfiguration('com_en')).toEqual({})
  })
})
