// @vitest-environment node
// What the app asks the API for: the field selections. An empty selection returns zero
// results with no error, and a field a catalog does not declare fails the whole query.
// See specs/test-plan-data-layer.md, part A.
import { describe, expect, it } from 'vitest'
import {
  axisCodes,
  CATALOG_AXIS_CODES,
  CATALOG_EXTRA_FIELDS,
  CMS_FIELDS,
  productDetailFields,
  productFields,
} from '../sdk/fields'
import {
  CMS_ARTICLE,
  CONFIGURABLE_DETAIL,
  CONFIGURABLE_LISTING,
} from './fixtures/api'

// The catalogs the sample data defines, as the local API listed them on 2026-10-22.
const SAMPLE_CATALOGS = ['com', 'fashion', 'fr', 'papershop', 'toolbox', 'uk']
const COMMON = productFields('not_a_catalog')

describe('productFields', () => {
  it('is never empty, for every catalog and for an unknown one', () => {
    for (const code of [...SAMPLE_CATALOGS, 'not_a_catalog', '']) {
      expect(productFields(code).length, code).toBeGreaterThan(0)
    }
  })

  it('always contains the common fields', () => {
    expect(COMMON).toContain('sku')
    expect(COMMON).toContain('configurable_attributes')
    expect(COMMON).toContain('price { original_price is_discounted }')
    for (const code of SAMPLE_CATALOGS) {
      expect(productFields(code), code).toEqual(expect.arrayContaining(COMMON))
    }
  })

  it('names the variant axes of every sample catalog (bugfix-listing-axes-missing-for-new-catalogs)', () => {
    expect(Object.keys(CATALOG_AXIS_CODES).sort()).toEqual(SAMPLE_CATALOGS)
  })

  it('adds one `<axis> { label value }` per axis and the catalog extra fields', () => {
    for (const code of SAMPLE_CATALOGS) {
      const fields = productFields(code)
      for (const axis of axisCodes(code)) {
        expect(fields, code).toContain(`${axis} { label value }`)
      }
      for (const extra of CATALOG_EXTRA_FIELDS[code] ?? []) {
        expect(fields, code).toContain(extra)
      }
    }
    expect(productFields('com')).toContain('fashion_material { label value }')
    expect(productFields('papershop')).toContain('llv_is_eco')
  })

  it('gives an unknown catalog the common fields only (bugfix-product-fields-assume-every-catalog-loaded)', () => {
    expect(axisCodes('not_a_catalog')).toEqual([])
    expect(productFields('uk')).toEqual(COMMON)
    // No field of another catalog leaks in: GraphQL would reject the whole query.
    expect(COMMON.join(' ')).not.toMatch(/fashion_|llv_|fio_/)
  })

  it('never asks for `source` on a listing', () => {
    for (const code of SAMPLE_CATALOGS) {
      expect(productFields(code), code).not.toContain('source')
    }
    expect(CONFIGURABLE_LISTING).not.toHaveProperty('source')
  })
})

describe('productDetailFields', () => {
  it('is the listing selection plus `source`', () => {
    for (const code of [...SAMPLE_CATALOGS, 'not_a_catalog']) {
      expect(productDetailFields(code), code).toEqual([
        ...productFields(code),
        'source',
      ])
    }
    expect(CONFIGURABLE_DETAIL).toHaveProperty('source')
  })
})

describe('CMS_FIELDS (bugfix-cms-selected-fields-projection)', () => {
  it('is not empty and selects the id', () => {
    expect(CMS_FIELDS.length).toBeGreaterThan(0)
    expect(CMS_FIELDS).toContain('id')
  })

  it('uses raw _source names, not GraphQL syntax or camelCase', () => {
    for (const field of CMS_FIELDS) expect(field).toMatch(/^[a-z][a-z_]*$/)
    expect(CMS_FIELDS).toEqual(
      expect.arrayContaining(['content_heading', 'published_at'])
    )
  })

  it('is what a real article is projected to', () => {
    expect(CMS_FIELDS).toEqual(expect.arrayContaining(Object.keys(CMS_ARTICLE)))
  })
})
