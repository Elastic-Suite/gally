// Field selections shared by the client hooks and the server-side fetchers in
// ./server.ts. They live here, in one place, precisely because both sides MUST ask for
// the same shape: a server component that pre-fetches with a different selection than
// the hook that later refetches would make the page change under the user after
// hydration. The comments below are load-bearing — see ../../docs/sdk-reference.md.

// Fields to request from the API for product display.
// Object/array types need sub-selections (e.g. fashion_color { label value }).
// Note: price { price } and stock { status } are appended automatically by the SDK.
// `new` and `sale` are plain booleans on the GraphQL Product type (not `is_new`, and not
// `{ label value }` — they are boolean source fields, not selects). Both drive the badges
// overlaid on the card picture; `fashion_material` drives the third one, so it earns its
// place here twice over. See ../components/ProductCard.tsx and getProductBadges().
export const PRODUCT_FIELDS = [
  'sku', 'name', 'image', 'description', 'url_key',
  'fashion_color { label value }',
  'fashion_material { label value }',
  'visibility { label value }',
  'new', 'sale', 'cost',
  // What the quick-add overlay needs to offer a choice on a listing row, without `source`.
  // `configurable_attributes` names the axes; the four fields below carry their options —
  // `fashion_*` for the Venia catalogue, the bare pair for Luma. Asking for an axis a catalogue
  // does not use costs nothing: the GraphQL Product type is global, so it simply returns null.
  //
  // Beware: `configurable_attributes` comes back as a STRING, not a list — see parseAxisCodes()
  // in ./productFields.ts, which is the only place that copes with it.
  'configurable_attributes',
  'fashion_size { label value }',
  'color { label value }',
  'size { label value }',
  // The SDK appends a bare `price { price }` of its own (graphql/Request.ts), so a listing row
  // has never carried the two fields the discount UI needs — which is why the struck-through
  // original price on the card was dead code until now. Asking for them here is safe: GraphQL
  // merges two selections of the same field, so the query ends up with the union of both.
  'price { original_price is_discounted }',
];

// The product detail page needs two things no typed field exposes: `type_id` (is this a
// configurable?) and `configurable_attributes` (which attributes actually vary). Neither is a
// declared source field, so neither is stitched onto the GraphQL `Product` type — introspect it
// and they are absent among its 118 fields. `source` returns the whole raw `_source`, which is
// the only way to reach them, and it carries the option lists along for free.
//
// Deliberately NOT merged into PRODUCT_FIELDS: `source` is the entire document (~3 KB for a
// configurable like VSK12, description included), and the grid, the category listings and the
// autocomplete all ask for 20 products at a time.
export const PRODUCT_DETAIL_FIELDS = [...PRODUCT_FIELDS, 'source'];

// The SDK routes any non-`product` metadata to the generic `documents(entityType:)`
// query (see graphql/Request.ts:getEndpoint), so the whole cms_page section runs
// through the same SearchManager as the catalog — no bespoke GraphQL here.
export const CMS_METADATA = 'cms_page';

// For non-product entities selectedFields never reaches the query — the SDK hardcodes
// the selection to `id data` — but it is NOT ignored: Response projects `data._source`
// down to exactly these keys client-side (graphql/Response.ts). So they must be raw
// _source attribute names (`content_heading`, `published_at`, …), not the camelCase
// names of CmsPage nor invented ones: any key not listed here is dropped, and any key
// listed that the document doesn't have is simply absent.
// It must also not be EMPTY, or the SDK drops the `collection` block from the query
// and zero documents come back. Same trap as PRODUCT_FIELDS.
export const CMS_FIELDS = [
  'id',
  'title',
  'content_heading',
  'meta_description',
  'content',
  'url_key',
  'image',
  'content_type',
  'topic',
  'author',
  'published_at',
  'reading_time',
  'is_featured',
  'tags',
];
