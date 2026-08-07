// Field selections shared by the client hooks and the server-side fetchers in
// ./server.ts. They live here, in one place, precisely because both sides MUST ask for
// the same shape: a server component that pre-fetches with a different selection than
// the hook that later refetches would make the page change under the user after
// hydration. The comments below are load-bearing — see ../../docs/sdk-reference.md.

// Fields to request from the API for product display.
// Object/array types need sub-selections (e.g. fashion_color { label value }).
// Note: price { price } and stock { status } are appended automatically by the SDK.
export const PRODUCT_FIELDS = [
  'sku', 'name', 'image', 'description', 'url_key',
  'fashion_color { label value }',
  'fashion_material { label value }',
  'visibility { label value }',
  'new', 'cost',
];

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
