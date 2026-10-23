// @vitest-environment node
// Labels the API returns already translated for the requested catalog, and the few the app
// translates itself because the API sends them in English. See specs/test-plan-translations.md,
// part D.
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ fetch: vi.fn() }))

vi.mock('../sdk/index', () => ({ getBaseUri: () => 'http://api.test/api' }))
vi.mock('../sdk/server', () => ({ resolveLocale: vi.fn() }))
vi.mock('../views/CartPage', () => ({ default: () => null }))

import i18n from '../i18n'
import * as cartRoute from '../../app/[locale]/cart/page'
import { axisLabel } from '../sdk/axisLabels'
import { fetchCategoryTree, findLocalizedCatalog } from '../sdk/catalogs'
import { getProductFields } from '../sdk/productFields'
import { resolveLocale } from '../sdk/server'
import { getVariantAxes } from '../components/VariantSelector'
import {
  API_FIXED_LABEL_CODES,
  localizeSortOptions,
  type SortOption,
} from '../hooks/useSortOptions'
import { CATALOGS } from './fixtures'
import {
  AXIS_LABELS,
  AXIS_LABELS_FR,
  CONFIGURABLE_DETAIL,
  CONFIGURABLE_DETAIL_FR,
  PUBLIC_CONFIGURATION,
} from './fixtures/api'

const LOCALES = resolve(__dirname, '../locales')
const common = (lang: string) =>
  JSON.parse(readFileSync(join(LOCALES, lang, 'common.json'), 'utf8'))

beforeEach(() => {
  fake.fetch.mockReset()
  vi.stubGlobal('fetch', fake.fetch)
})

describe('each request names the visitor catalog', () => {
  it('the category tree asks for the localized catalog, so names come back in its language', async () => {
    fake.fetch.mockResolvedValue({
      json: async () => ({ data: { getCategoryTree: { categories: [] } } }),
    })
    await fetchCategoryTree(1, 12)
    const { query } = JSON.parse(fake.fetch.mock.calls[0][1].body)
    expect(query).toContain('catalogId: 1')
    expect(query).toContain('localizedCatalogId: 12')
  })
})

describe('French labels from the API survive the mapping (VA02 from com_fr)', () => {
  const source = CONFIGURABLE_DETAIL_FR.source

  it('variant options keep their French labels', () => {
    const axes = getVariantAxes(source)
    const color = axes.find((a) => a.code === 'fashion_color')
    // Colours are sorted by label in the visitor's language.
    expect(color?.options.map((o) => o.label)).toEqual([
      'Doré',
      'Kaki',
      'Lila',
      'Pêche',
      'Pluie',
    ])
    expect(
      axes.find((a) => a.code === 'fashion_size')?.options.map((o) => o.label)
    ).toEqual(['XS', 'S', 'M', 'L', 'XL'])
  })

  it('materials keep their French labels', () => {
    const fields = getProductFields(
      CONFIGURABLE_DETAIL_FR,
      PUBLIC_CONFIGURATION
    )
    expect(
      fields.attributes.fashion_material.map((m: { label: string }) => m.label)
    ).toEqual(['Coton bio', 'Spandex'])
  })

  it('option values are the same in both languages, only the labels change', () => {
    const options = (doc: typeof CONFIGURABLE_DETAIL) =>
      Object.fromEntries(
        getVariantAxes(doc.source)
          .find((a) => a.code === 'fashion_color')!
          .options.map((o) => [String(o.value), o.label])
      )
    const en = options(CONFIGURABLE_DETAIL)
    const fr = options(CONFIGURABLE_DETAIL_FR)
    expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort())
    expect(en['5']).toBe('Gold')
    expect(fr['5']).toBe('Doré')
  })

  it('axis names come from the API in the visitor language', () => {
    expect(axisLabel(AXIS_LABELS, 'fashion_color')).toBe('Color')
    expect(axisLabel(AXIS_LABELS_FR, 'fashion_color')).toBe('Couleur')
    expect(axisLabel(AXIS_LABELS_FR, 'fashion_size')).toBe('Taille')
  })
})

describe('sort labels: the app translates the four the API leaves in English', () => {
  const API_OPTIONS: SortOption[] = [
    { code: 'category__position', label: 'Position', type: 'int' },
    { code: 'name', label: 'Nom', type: 'text' },
    { code: 'price__price', label: 'Price', type: 'price' },
    { code: 'stock__status', label: 'Stock', type: 'stock' },
    { code: '_score', label: 'Relevance', type: 'float' },
  ]

  it('names the four codes, each translated in every language', () => {
    expect(API_FIXED_LABEL_CODES).toEqual([
      '_score',
      'category__position',
      'price__price',
      'stock__status',
    ])
    for (const lang of ['en', 'fr', 'de'])
      for (const code of API_FIXED_LABEL_CODES)
        expect(common(lang).sort.fields[code], `${lang} ${code}`).toBeTruthy()
  })

  it.each(['en', 'fr', 'de'])(
    '%s: fixed codes get the app label, merchant labels are untouched',
    (lang) => {
      const result = localizeSortOptions(
        API_OPTIONS,
        i18n.getFixedT(lang, 'common')
      )
      const labels = Object.fromEntries(result.map((o) => [o.code, o.label]))
      for (const code of API_FIXED_LABEL_CODES)
        expect(labels[code]).toBe(common(lang).sort.fields[code])
      expect(labels.name).toBe('Nom')
    }
  )

  it('puts relevance first and keeps the API order otherwise', () => {
    const result = localizeSortOptions(API_OPTIONS, (key) => key)
    expect(result.map((o) => o.code)).toEqual([
      '_score',
      'category__position',
      'name',
      'price__price',
      'stock__status',
    ])
  })
})

describe('page metadata follows the catalog language', () => {
  beforeEach(() => {
    vi.mocked(resolveLocale).mockImplementation(async (code: string) =>
      findLocalizedCatalog(CATALOGS, code)
    )
  })

  it.each([
    ['com_fr', 'fr'],
    ['com_en', 'en'],
  ])('%s gets the %s title', async (locale, lang) => {
    const meta = await cartRoute.generateMetadata({
      params: Promise.resolve({ locale }),
    })
    expect(meta.title).toBe(common(lang).meta.cart)
  })
})
