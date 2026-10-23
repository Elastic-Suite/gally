// Real API responses, captured from the local stack (sample data) through the app's own fetchers
// and field selections. They catch document shapes the hand-written test documents miss.
// Recapture with `yarn test:capture-fixtures` (see capture-api.test.ts) when the sample data or
// the selections change.
// See specs/test-plan-data-layer.md.
import type { SearchDocument } from '../../sdk/fields'
import type { GallyConfig } from '../../sdk/config'
import configurableListing from './api/product-listing-configurable.json'
import configurableDetail from './api/product-detail-configurable.json'
import outOfStockListing from './api/product-listing-configurable-out-of-stock.json'
import outOfStockDetail from './api/product-detail-configurable-out-of-stock.json'
import simpleListing from './api/product-listing-simple.json'
import simpleDetail from './api/product-detail-simple.json'
import cmsArticle from './api/cms-article.json'
import publicConfiguration from './api/public-configuration.json'
import axisLabels from './api/axis-labels.json'

/** VA02, an in-stock configurable scarf from the `com` catalog, as a listing row (no `source`). */
export const CONFIGURABLE_LISTING =
  configurableListing as unknown as SearchDocument
/** VA02 as the product page fetches it: listing fields plus the raw `source`. */
export const CONFIGURABLE_DETAIL =
  configurableDetail as unknown as SearchDocument
/** VT10, a configurable top the sample data marks out of stock, as a listing row. */
export const OUT_OF_STOCK_LISTING =
  outOfStockListing as unknown as SearchDocument
/** VT10 as the product page fetches it. */
export const OUT_OF_STOCK_DETAIL = outOfStockDetail as unknown as SearchDocument
/** A discounted simple book from the `papershop` catalog, as a listing row. */
export const SIMPLE_LISTING = simpleListing as unknown as SearchDocument
/** The same book as the product page fetches it. */
export const SIMPLE_DETAIL = simpleDetail as unknown as SearchDocument
/** A blog article (`cms_page`) projected to CMS_FIELDS. */
export const CMS_ARTICLE = cmsArticle as unknown as SearchDocument
/** The public configuration of com_en: the media base URL. */
export const PUBLIC_CONFIGURATION = publicConfiguration as GallyConfig
/** The axis labels of the `com` catalog in English. */
export const AXIS_LABELS = axisLabels as Record<string, string>

// The same configurable from the French catalog: French option labels, same option values.
import configurableListingFr from './api/product-listing-configurable-fr.json'
import configurableDetailFr from './api/product-detail-configurable-fr.json'
import axisLabelsFr from './api/axis-labels-fr.json'

/** VA02 from com_fr, as a listing row. */
export const CONFIGURABLE_LISTING_FR =
  configurableListingFr as unknown as SearchDocument
/** VA02 from com_fr, as the product page fetches it. */
export const CONFIGURABLE_DETAIL_FR =
  configurableDetailFr as unknown as SearchDocument
/** The axis labels of the `com` catalog in French. */
export const AXIS_LABELS_FR = axisLabelsFr as Record<string, string>
