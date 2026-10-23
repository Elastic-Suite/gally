// @vitest-environment node
// The other helpers that call the API: axis labels, bundles, recommendations, vector search.
// `fetch` and the recommender are fakes. See specs/test-plan-data-layer.md, part F.
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  fetch: vi.fn(),
  recommend: vi.fn(),
}))

vi.mock('../sdk/index', () => ({
  getBaseUri: () => 'http://api.test/api',
  getRecommenderManager: () => ({ getProductRecommendations: fake.recommend }),
}))

import { fetchAxisLabels } from '../sdk/axisLabels'
import { productFields } from '../sdk/fields'
import { fetchProductRecommendations } from '../sdk/recommendations'
import {
  fetchVectorSearchProducts,
  VECTOR_MAX_RESULTS,
} from '../sdk/vectorSearch'

const json = (body: unknown, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  json: async () => body,
})

beforeEach(() => {
  fake.fetch.mockReset()
  fake.recommend.mockReset()
  vi.stubGlobal('fetch', fake.fetch)
})

describe('fetchAxisLabels (feature-axis-labels-from-api)', () => {
  it('asks for the catalog axis codes and maps code to label', async () => {
    fake.fetch.mockResolvedValue(
      json({
        'hydra:member': [
          { code: 'fashion_color', label: 'Couleur' },
          { label: 'no code' },
        ],
      })
    )
    expect(await fetchAxisLabels('com_fr', 'com')).toEqual({
      fashion_color: 'Couleur',
    })
    const url = new URL(fake.fetch.mock.calls[0][0])
    expect(url.pathname).toBe('/api/product_source_field_labels')
    expect(url.searchParams.getAll('codes[]')).toEqual([
      'fashion_color',
      'fashion_size',
    ])
    expect(url.searchParams.get('localizedCatalog')).toBe('com_fr')
  })

  it('sends nothing for a catalog without axes', async () => {
    expect(await fetchAxisLabels('toolbox_fr', 'toolbox')).toEqual({})
    expect(fake.fetch).not.toHaveBeenCalled()
  })

  it('gives {} on an HTTP error or a network failure', async () => {
    fake.fetch.mockResolvedValue(json({}, false))
    expect(await fetchAxisLabels('com_fr', 'com')).toEqual({})
    fake.fetch.mockRejectedValue(new Error('down'))
    expect(await fetchAxisLabels('com_fr', 'com')).toEqual({})
  })
})

describe('fetchBundles (feature-sdk-bundles)', () => {
  // The list is kept for the life of the process, so each test loads a fresh module.
  const load = async () => {
    vi.resetModules()
    return (await import('../sdk/bundles')).fetchBundles
  }

  it('asks once per process and returns the bundle names', async () => {
    const fetchBundles = await load()
    fake.fetch.mockResolvedValue(
      json({ data: { extraBundles: [{ name: 'GallyPremiumBundle' }] } })
    )
    expect(await fetchBundles()).toEqual(['GallyPremiumBundle'])
    expect(await fetchBundles()).toEqual(['GallyPremiumBundle'])
    expect(fake.fetch).toHaveBeenCalledTimes(1)
  })

  it('does not keep a failure: the next call asks again', async () => {
    const fetchBundles = await load()
    fake.fetch.mockResolvedValueOnce(json({}, false))
    expect(await fetchBundles()).toEqual([])
    fake.fetch.mockResolvedValueOnce(
      json({ data: { extraBundles: [{ name: 'B' }] } })
    )
    expect(await fetchBundles()).toEqual(['B'])
    expect(fake.fetch).toHaveBeenCalledTimes(2)
  })
})

describe('fetchProductRecommendations (feature-real-recommendations)', () => {
  it('sends each seed SKU once, with price and stock added to the selection', async () => {
    fake.recommend.mockResolvedValue([{ sku: 'R1' }])
    expect(
      await fetchProductRecommendations(
        'com_fr',
        'com',
        'cross-sell',
        ['A', 'B', 'A', ''],
        8
      )
    ).toEqual([{ sku: 'R1' }])
    expect(fake.recommend).toHaveBeenCalledWith(
      'cross-sell',
      'com_fr',
      ['A', 'B'],
      8,
      [...productFields('com'), 'price { price }', 'stock { status }']
    )
  })

  it('sends nothing without a seed', async () => {
    expect(
      await fetchProductRecommendations('com_fr', 'com', 'upsell', ['', ''], 4)
    ).toEqual([])
    expect(fake.recommend).not.toHaveBeenCalled()
  })

  it('gives [] when the recommender fails', async () => {
    fake.recommend.mockRejectedValue(new Error('module not installed'))
    expect(
      await fetchProductRecommendations('com_fr', 'com', 'upsell', ['A'], 4)
    ).toEqual([])
  })
})

describe('fetchVectorSearchProducts', () => {
  const EMPTY = { products: [], scores: {}, corpusSize: 0, pageCount: 0 }
  const payload = (
    totalCount: number,
    lastPage: number,
    collection: unknown[] = []
  ) =>
    json({
      data: {
        vectorSearchProducts: {
          paginationInfo: { totalCount, lastPage },
          collection,
        },
      },
    })

  it('sends nothing for a blank query', async () => {
    expect(await fetchVectorSearchProducts('com_fr', '   ')).toEqual(EMPTY)
    expect(fake.fetch).not.toHaveBeenCalled()
  })

  it('reads products and scores by SKU', async () => {
    fake.fetch.mockResolvedValue(
      payload(2, 1, [{ sku: 'A', score: '0.9' }, { sku: 'B' }])
    )
    const result = await fetchVectorSearchProducts('com_fr', 'robe', 25)
    expect(result.scores).toEqual({ A: 0.9, B: 0 })
    expect(result.corpusSize).toBe(2)
    expect(result.pageCount).toBe(1)
    const body = JSON.parse(fake.fetch.mock.calls[0][1].body)
    expect(body.variables).toEqual({
      localizedCatalog: 'com_fr',
      search: 'robe',
      pageSize: 25,
      currentPage: 1,
    })
  })

  it(`caps the page count at ${VECTOR_MAX_RESULTS} results`, async () => {
    fake.fetch.mockResolvedValue(payload(1000, 40))
    expect(
      (await fetchVectorSearchProducts('com_fr', 'robe', 25)).pageCount
    ).toBe(Math.ceil(VECTOR_MAX_RESULTS / 25))
  })

  it('gives the empty result on an error, a bad body or a missing payload', async () => {
    fake.fetch.mockRejectedValueOnce(new Error('down'))
    expect(await fetchVectorSearchProducts('com_fr', 'a')).toEqual(EMPTY)
    fake.fetch.mockResolvedValueOnce({
      json: async () => JSON.parse('not json'),
    })
    expect(await fetchVectorSearchProducts('com_fr', 'b')).toEqual(EMPTY)
    fake.fetch.mockResolvedValueOnce(
      json({ errors: [{ message: 'no premium' }] })
    )
    expect(await fetchVectorSearchProducts('com_fr', 'c')).toEqual(EMPTY)
  })
})
