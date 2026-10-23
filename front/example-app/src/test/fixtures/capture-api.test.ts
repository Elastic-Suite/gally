// @vitest-environment node
// Captures the real API documents in src/test/fixtures/api/ through the app's own fetchers and
// field selections. Skipped in a normal run; recapture with `yarn test:capture-fixtures` in the
// pwa container (it needs SSR_API_URL to reach the API, e.g. http://router/api locally).
// Each product is named by SKU and checked on its detail document, so a change in the sample
// data fails here instead of silently changing what the tests are about.
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { expect, it } from 'vitest'
import { getSearchManager } from '../../sdk'
import {
  axisCodes,
  CMS_FIELDS,
  CMS_METADATA,
  productFields,
} from '../../sdk/fields'
import { fetchAxisLabels } from '../../sdk/axisLabels'
import {
  fetchCmsPageById,
  fetchProductBySku,
  fetchPublicConfiguration,
} from '../../sdk/server'

const OUT = join(__dirname, 'api')

const PRODUCTS = [
  {
    file: 'configurable',
    lc: 'com_en',
    catalog: 'com',
    sku: 'VA02',
    type: 'configurable',
    inStock: true,
  },
  {
    // The same product from the French catalog: the API returns French option labels.
    file: 'configurable-fr',
    lc: 'com_fr',
    catalog: 'com',
    sku: 'VA02',
    type: 'configurable',
    inStock: true,
  },
  {
    file: 'configurable-out-of-stock',
    lc: 'com_en',
    catalog: 'com',
    sku: 'VT10',
    type: 'configurable',
    inStock: false,
  },
  {
    file: 'simple',
    lc: 'papershop_en',
    catalog: 'papershop',
    sku: 'LLV-LIV-ALB-001',
    type: 'simple',
    inStock: true,
  },
]

function save(name: string, data: unknown) {
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2) + '\n')
}

it.skipIf(!process.env.CAPTURE_FIXTURES)(
  'captures API fixtures',
  { timeout: 60_000 },
  async () => {
    mkdirSync(OUT, { recursive: true })

    for (const p of PRODUCTS) {
      const detail = await fetchProductBySku(p.lc, p.sku)
      expect(detail?.source?.type_id, p.sku).toBe(p.type)
      expect(detail?.source?.stock?.status, p.sku).toBe(p.inStock)
      // The listing row, as a grid asks for it: the listing selection, no `source`.
      const listing = await getSearchManager().search({
        localizedCatalog: p.lc,
        metadata: 'product',
        searchQuery: p.sku,
        filters: [{ sku: { eq: p.sku } }],
        currentPage: 1,
        pageSize: 1,
        isAutocomplete: false,
        selectedFields: productFields(p.catalog),
      })
      save(`product-listing-${p.file}.json`, listing.getCollection()[0])
      save(`product-detail-${p.file}.json`, detail)
    }

    const articles = await getSearchManager().search({
      localizedCatalog: 'com_en',
      metadata: CMS_METADATA,
      currentPage: 1,
      pageSize: 1,
      isAutocomplete: false,
      selectedFields: CMS_FIELDS,
      filters: [],
    })
    const first = articles.getCollection()[0]
    expect(first, 'a cms_page in com_en').toBeTruthy()
    save('cms-article.json', await fetchCmsPageById('com_en', String(first.id)))

    save('public-configuration.json', await fetchPublicConfiguration('com_en'))
    expect(axisCodes('com').length).toBeGreaterThan(0)
    save('axis-labels.json', await fetchAxisLabels('com_en', 'com'))
    save('axis-labels-fr.json', await fetchAxisLabels('com_fr', 'com'))
  }
)
