// @vitest-environment node
// Turning a product document into what a card or a product page shows.
// See specs/test-plan-data-layer.md, part B.
import { describe, expect, it } from 'vitest'
import type { SearchDocument } from '../sdk/fields'
import {
  getProductBadges,
  getProductFields,
  isAvailable,
  parseAxisCodes,
} from '../sdk/productFields'
import {
  CONFIGURABLE_DETAIL,
  CONFIGURABLE_LISTING,
  OUT_OF_STOCK_DETAIL,
  OUT_OF_STOCK_LISTING,
  PUBLIC_CONFIGURATION,
  SIMPLE_DETAIL,
  SIMPLE_LISTING,
} from './fixtures/api'

const MEDIA = 'https://media.test/catalog/'
const config = { 'gally.base_url.media': MEDIA }
const map = (doc: object) => getProductFields(doc as SearchDocument, config)

describe('isAvailable (bugfix-stock-count-zero-on-parents)', () => {
  it.each([
    ['status false', { status: false }, false],
    ['status false with stock', { status: false, qty: 5 }, false],
    ['status true, quantity 0', { status: true, qty: 0 }, false],
    ['status true, quantity 3', { status: true, qty: 3 }, true],
    ['status true, quantity not requested', { status: true }, true],
    ['no stock at all', undefined, false],
  ])('%s', (_name, stock, expected) => {
    expect(isAvailable(stock)).toBe(expected)
  })
})

describe('parseAxisCodes', () => {
  it.each([
    [
      'an array',
      ['fashion_color', 'fashion_size'],
      ['fashion_color', 'fashion_size'],
    ],
    [
      'a JSON string, as on a listing row',
      '["fashion_color","fashion_size"]',
      ['fashion_color', 'fashion_size'],
    ],
    ['a plain string', 'fashion_color', ['fashion_color']],
    ['an empty string', '', []],
    ['bad JSON', '[fashion_color', []],
    ['a JSON list of numbers', '[1, 2]', []],
    ['null', null, []],
    ['an array with non-strings', ['a', 1, null], ['a']],
  ])('%s', (_name, value, expected) => {
    expect(parseAxisCodes(value)).toEqual(expected)
  })
})

describe('getProductFields on hand-written documents', () => {
  it('reads `source` when present, otherwise the document itself', () => {
    expect(map({ sku: 'TOP', source: { sku: 'RAW' } }).sku).toBe('RAW')
    expect(map({ sku: 'TOP' }).sku).toBe('TOP')
  })

  it('takes the first name of a list, and "Product" when there is none', () => {
    expect(map({ name: ['First', 'Second'] }).name).toBe('First')
    expect(map({ name: 'Plain' }).name).toBe('Plain')
    expect(map({}).name).toBe('Product')
    expect(map({ name: '' }).name).toBe('Product')
    // Today an empty list gives undefined, not the fallback.
    expect(map({ name: [] }).name).toBeUndefined()
  })

  it('falls back from source SKU to document SKU to "unknown"', () => {
    expect(map({ sku: 'DOC', source: {} }).sku).toBe('DOC')
    expect(map({}).sku).toBe('unknown')
  })

  it('reads the price, both spellings of the original price, and the discount flag', () => {
    expect(map({}).price).toBe(0)
    expect(
      map({ price: [{ price: 10, original_price: 12, is_discounted: true }] })
    ).toMatchObject({
      price: 10,
      originalPrice: 12,
      isDiscounted: true,
    })
    expect(
      map({ price: [{ price: 10, originalPrice: 12, isDiscounted: true }] })
    ).toMatchObject({
      originalPrice: 12,
      isDiscounted: true,
    })
    expect(map({ price: [{ price: 10 }] })).toMatchObject({
      originalPrice: undefined,
      isDiscounted: false,
    })
  })

  it('treats only a strict true as new, and sale or discount as on sale', () => {
    expect(map({ new: true }).isNew).toBe(true)
    expect(map({ new: 'true' }).isNew).toBe(false)
    expect(map({ new: 1 }).isNew).toBe(false)
    expect(map({ sale: true }).isOnSale).toBe(true)
    expect(map({ price: [{ price: 1, is_discounted: true }] }).isOnSale).toBe(
      true
    )
    expect(map({}).isOnSale).toBe(false)
  })

  it('shows a material only when there is exactly one', () => {
    expect(
      map({ fashion_material: [{ label: 'Wool', value: '1' }] }).pureMaterial
    ).toBe('Wool')
    expect(
      map({ fashion_material: [{ label: 'Wool' }, { label: 'Silk' }] })
        .pureMaterial
    ).toBeNull()
    expect(map({}).pureMaterial).toBeNull()
  })

  it('reads the eco flag, the type, the description and the image', () => {
    expect(map({ llv_is_eco: true }).isEco).toBe(true)
    expect(map({ llv_is_eco: null }).isEco).toBe(false)
    expect(map({}).typeId).toBe('simple')
    expect(map({ type_id: 'configurable' }).typeId).toBe('configurable')
    expect(map({ description: ['<p>A</p>'] }).description).toBe('<p>A</p>')
    expect(map({}).description).toBe('')
    expect(map({ image: '/a/b.jpg' }).image).toBe(`${MEDIA}a/b.jpg`)
  })

  it('assumes in stock when the document has no stock', () => {
    expect(map({})).toMatchObject({ stock: { status: true }, available: true })
    expect(map({ stock: { status: true, qty: 0 } }).available).toBe(false)
  })
})

describe('getProductFields on captured documents', () => {
  const realMap = (doc: SearchDocument) =>
    getProductFields(doc, PUBLIC_CONFIGURATION)
  const media = PUBLIC_CONFIGURATION['gally.base_url.media'].replace(/\/$/, '')

  it('maps a configurable listing row (VA02)', () => {
    expect(realMap(CONFIGURABLE_LISTING)).toMatchObject({
      name: 'Carola Infinity Scarf',
      sku: 'VA02',
      image: `${media}/default/v/a/va02-pe_main.jpg`,
      price: 48,
      originalPrice: 48,
      isDiscounted: false,
      isNew: false,
      isOnSale: false,
      // Two materials (Organic Cotton, Spandex), so no material badge.
      pureMaterial: null,
      // A listing row has no type_id: every listing product maps to 'simple'.
      typeId: 'simple',
      // A listing row carries the status only, no quantity.
      stock: { status: true },
      available: true,
    })
    expect(
      parseAxisCodes(CONFIGURABLE_LISTING.configurable_attributes)
    ).toEqual(['fashion_color', 'fashion_size'])
  })

  it('maps the same product from its detail document, through `source`', () => {
    const fields = realMap(CONFIGURABLE_DETAIL)
    expect(fields).toMatchObject({
      name: 'Carola Infinity Scarf',
      sku: 'VA02',
      typeId: 'configurable',
      price: 48,
      stock: { qty: 70, status: true },
      available: true,
    })
    expect(parseAxisCodes(fields.attributes.configurable_attributes)).toEqual([
      'fashion_color',
      'fashion_size',
    ])
  })

  it('maps an out-of-stock configurable (VT10) as unavailable, listing and detail alike', () => {
    expect(realMap(OUT_OF_STOCK_LISTING)).toMatchObject({
      sku: 'VT10',
      stock: { status: false },
      available: false,
    })
    expect(realMap(OUT_OF_STOCK_DETAIL)).toMatchObject({
      sku: 'VT10',
      typeId: 'configurable',
      stock: { qty: 0, status: false },
      available: false,
    })
  })

  it('maps a discounted simple book, listing and detail alike', () => {
    for (const doc of [SIMPLE_LISTING, SIMPLE_DETAIL]) {
      expect(realMap(doc)).toMatchObject({
        sku: 'LLV-LIV-ALB-001',
        name: 'Snow White - illustrated picture book',
        price: 13.9,
        originalPrice: 17.38,
        isDiscounted: true,
        isOnSale: true,
        isNew: false,
        isEco: false,
        available: true,
      })
    }
    expect(realMap(SIMPLE_DETAIL)).toMatchObject({
      typeId: 'simple',
      stock: { qty: 753 },
    })
  })

  it('gives the discounted book a single sale badge', () => {
    expect(getProductBadges(realMap(SIMPLE_LISTING))).toEqual([
      { key: 'card.onSale', variant: 'sale' },
    ])
  })
})

describe('getProductBadges', () => {
  it('orders badges sale, new, material, so callers can cut the list', () => {
    const fields = map({
      new: true,
      sale: true,
      fashion_material: [{ label: 'Wool' }],
    })
    expect(getProductBadges(fields).map((b) => b.variant)).toEqual([
      'sale',
      'new',
      'material',
    ])
    expect(getProductBadges(fields)[2].params).toEqual({ material: 'Wool' })
  })

  it('gives no badge to a plain product', () => {
    expect(getProductBadges(map({}))).toEqual([])
  })
})
