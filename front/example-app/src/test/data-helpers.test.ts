// @vitest-environment node
// Small data helpers: the category a product shows in its breadcrumb, variant axis labels,
// and the vector-search demo queries. See specs/test-plan-data-layer.md, part D.
import { describe, expect, it } from 'vitest'
import { axisLabel, humanizeAxisCode } from '../sdk/axisLabels'
import {
  defaultListingPath,
  findTrail,
  productCategoryTrail,
} from '../sdk/categoryTree'
import type { SearchDocument } from '../sdk/fields'
import { getVectorDemoQueries, VECTOR_DEMO_QUERIES } from '../sdk/vectorSearch'
import { AXIS_LABELS, OUT_OF_STOCK_DETAIL } from './fixtures/api'
import { category } from './fixtures'

// root > tops > shirts, root > sale. Shaped like the `com` catalog, ids included.
const shirts = category('cat_9', 'Blouses & Shirts')
const tops = category('cat_8', 'Tops', [shirts])
const sale = category('cat_15', 'Sale')
const TREE = [category('cat_2', 'Root', [tops, sale])]

const assigned = (...ids: (string | undefined)[]) =>
  ({ category: ids.map((id) => ({ id })) } as unknown as SearchDocument)
const names = (trail: { name: string }[]) => trail.map((n) => n.name)

describe('findTrail and defaultListingPath', () => {
  it('returns the whole chain down to the category', () => {
    expect(names(findTrail(TREE, 'cat_9')!)).toEqual([
      'Root',
      'Tops',
      'Blouses & Shirts',
    ])
  })

  it('returns null for an unknown id', () => {
    expect(findTrail(TREE, 'cat_404')).toBeNull()
  })

  it('points the default listing at the first category, or the homepage', () => {
    expect(defaultListingPath(TREE)).toBe('/category/cat_2')
    expect(defaultListingPath([])).toBe('/')
  })
})

describe('productCategoryTrail', () => {
  it('picks the deepest assigned category', () => {
    expect(
      names(productCategoryTrail(TREE, assigned('cat_2', 'cat_15', 'cat_9')))
    ).toEqual(['Root', 'Tops', 'Blouses & Shirts'])
  })

  it('keeps the first one on a tie', () => {
    expect(
      names(productCategoryTrail(TREE, assigned('cat_15', 'cat_8')))
    ).toEqual(['Root', 'Sale'])
  })

  it('skips ids missing from the tree and entries without id', () => {
    expect(
      names(productCategoryTrail(TREE, assigned('cat_404', undefined, 'cat_8')))
    ).toEqual(['Root', 'Tops'])
  })

  it('uses the root alone only when nothing deeper is assigned', () => {
    expect(names(productCategoryTrail(TREE, assigned('cat_2')))).toEqual([
      'Root',
    ])
  })

  it('gives [] with no source or no category', () => {
    expect(productCategoryTrail(TREE, undefined)).toEqual([])
    expect(productCategoryTrail(TREE, {} as SearchDocument)).toEqual([])
  })

  it('reads the categories of a captured product', () => {
    // VT10 is assigned to cat_2, cat_8, cat_9 and more; this tree only knows those three.
    expect(
      names(productCategoryTrail(TREE, OUT_OF_STOCK_DETAIL.source))
    ).toEqual(['Root', 'Tops', 'Blouses & Shirts'])
  })
})

describe('axis labels (feature-axis-labels-from-api)', () => {
  it('uses the API label when there is one', () => {
    expect(axisLabel(AXIS_LABELS, 'fashion_color')).toBe('Color')
  })

  it('capitalises the code when the label is missing or empty', () => {
    expect(axisLabel(AXIS_LABELS, 'fashion_material')).toBe('Fashion_material')
    expect(axisLabel({ size: '' }, 'size')).toBe('Size')
    expect(humanizeAxisCode('')).toBe('')
  })
})

describe('getVectorDemoQueries', () => {
  it('gives the queries of a known localized catalog', () => {
    expect(getVectorDemoQueries('com_fr')).toEqual(VECTOR_DEMO_QUERIES.com_fr)
    expect(getVectorDemoQueries('com_fr').length).toBeGreaterThan(0)
  })

  it('gives [] for an unknown or missing catalog', () => {
    expect(getVectorDemoQueries('xx_xx')).toEqual([])
    expect(getVectorDemoQueries(undefined)).toEqual([])
  })
})
