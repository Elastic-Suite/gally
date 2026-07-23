import { describe, expect, it } from 'vitest'
import {
  applyFilters,
  computeFacets,
  emptyFilters,
  getCompatibleProducts,
  getProduct,
  getProductsForCategory,
  getSimilarProducts,
  searchProducts,
} from './catalogService'

describe('getProductsForCategory', () => {
  it('returns the leaf category products', () => {
    const products = getProductsForCategory('fr', 'cat_10')
    expect(products.length).toBe(12)
  })

  it('returns the union of children for a parent category', () => {
    const parent = getProductsForCategory('fr', 'cat_8')
    const sweats = getProductsForCategory('fr', 'cat_10')
    const blouses = getProductsForCategory('fr', 'cat_9')
    expect(parent.length).toBe(sweats.length + blouses.length)
  })
})

describe('getProduct', () => {
  it('finds a product by its url key', () => {
    const product = getProduct('fr', 'carina-cardigan')
    expect(product?.sku).toBe('VSW01')
  })
})

describe('applyFilters', () => {
  it('filters by an active color', () => {
    const sweats = getProductsForCategory('fr', 'cat_10')
    const filtered = applyFilters(sweats, { ...emptyFilters(), colors: ['5'] })
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((p) => p.colors.some((c) => c.value === '5'))).toBe(
      true,
    )
  })

  it('filters by price range', () => {
    const sweats = getProductsForCategory('fr', 'cat_10')
    const filtered = applyFilters(sweats, { ...emptyFilters(), maxPrice: 70 })
    expect(filtered.every((p) => p.price <= 70)).toBe(true)
  })
})

describe('computeFacets', () => {
  it('builds a size facet with sticky counts', () => {
    const sweats = getProductsForCategory('fr', 'cat_10')
    const facets = computeFacets(sweats, emptyFilters(), [])
    const sizeFacet = facets.find((f) => f.field === 'sizes')
    expect(sizeFacet).toBeDefined()
    expect(sizeFacet!.options.length).toBeGreaterThan(0)
  })
})

describe('searchProducts', () => {
  it('finds products in the Robes/Dresses category by name match', () => {
    const results = searchProducts('fr', 'robe')
    expect(results.some((p) => p.sku === 'VD01')).toBe(true)
  })

  it('returns nothing for an empty query', () => {
    expect(searchProducts('fr', '')).toHaveLength(0)
  })
})

describe('recommendations', () => {
  it('similar products stay within the same leaf category', () => {
    const similar = getSimilarProducts('fr', 'VSW01')
    expect(similar.length).toBeGreaterThan(0)
    expect(similar.every((p) => p.sku !== 'VSW01')).toBe(true)
    expect(
      similar.every((p) => p.categories.some((c) => c.id === 'cat_10')),
    ).toBe(true)
  })

  it('compatible products come from the complementary category', () => {
    const compatible = getCompatibleProducts('fr', 'VSW01')
    expect(compatible.length).toBeGreaterThan(0)
    expect(
      compatible.every((p) => p.categories.some((c) => c.id === 'cat_11')),
    ).toBe(true)
  })
})
