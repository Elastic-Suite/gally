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
// Every variant axis every catalogue uses, and the ONE list that names them. It feeds two
// things that used to be maintained apart and drifted: the GraphQL selection below, and the
// label request in ./axisLabels.ts. Adding a catalogue's axes here now both fetches their
// options and earns them a translated heading.
//
// `fashion_material` is deliberately absent: it drives the eco/material badge, it is not an
// axis. getVariantAxes() reads `configurable_attributes` rather than "every select attribute"
// for exactly that reason.
// Keyed by CATALOG code, mirroring how the fixtures are organised: `common/` holds what every
// catalogue has, and each catalogue folder holds its own attributes. A catalogue asks only for
// the fields its own fixtures declare.
//
// That is a correctness rule, not tidiness. Gally builds the GraphQL `Product` type from the
// source fields in the database, so a field belonging to a catalogue that was not loaded is not
// merely null — it does not exist, and GraphQL rejects the whole query at validation with
// `Cannot query field "llv_is_eco" on type "Product"`. Since you can only browse a catalogue
// that is loaded, keying the selection by catalogue makes that mismatch impossible instead of
// something to remember. See GALLY_SAMPLE_DATA_CATALOGS in the sample data package.
//
// An unknown catalogue code degrades to the common fields alone: fewer badges and no variant
// axes, but a page that renders.
export const CATALOG_AXIS_CODES: Record<string, string[]> = {
  // Venia
  com: ['fashion_color', 'fashion_size'],
  // Luma
  fr: ['color', 'size'],
  // No indexed products, so nothing to vary on.
  uk: [],
  // Toolbox Bricolage has no configurable products at all.
  toolbox: [],
  // Fiora Fashion. One colour axis, and a size axis per garment family — a shoe and a bra do
  // not share a size scale, so the catalogue models them as different attributes.
  fashion: [
    'fio_color',
    'fio_clothing_size',
    'fio_bottom_size',
    'fio_men_size',
    'fio_outerwear_size',
    'fio_shoe_size',
    'fio_lingerie_size',
    'fio_sport_size',
  ],
  // Le livre & le lièvre
  papershop: ['llv_color', 'llv_format', 'llv_material'],
};

// Non-axis fields a single catalogue owns. Both drive a badge and neither varies a variant, so
// they are not in CATALOG_AXIS_CODES: `fashion_material` feeds the material pill on Venia and
// `llv_is_eco` the sustainability mark on the paper shop (specs/feature-eco-badge.md).
export const CATALOG_EXTRA_FIELDS: Record<string, string[]> = {
  com: ['fashion_material { label value }'],
  papershop: ['llv_is_eco'],
};

/** Variant axes for one catalogue, empty for a catalogue that has none or is unknown. */
export function axisCodes(catalogCode: string): string[] {
  return CATALOG_AXIS_CODES[catalogCode] ?? [];
}

// Declared by common/ in the sample data, so present whatever the selection.
const COMMON_PRODUCT_FIELDS = [
  'sku', 'name', 'image', 'description', 'url_key',
  'visibility { label value }',
  'new', 'sale', 'cost',
  // What the quick-add overlay needs to offer a choice on a listing row, without `source`.
  // `configurable_attributes` names the axes; the per-catalogue fields carry their options.
  //
  // A catalogue's axes have to be named up front — GraphQL needs each field in the selection,
  // so this cannot follow whatever a product declares. Miss one and it does not error:
  // getVariantAxes() returns nothing and the card adds a configurable straight to the basket
  // without asking. That was the bug in the two newest catalogues; see
  // specs/bugfix-listing-axes-missing-for-new-catalogs.md. Add a catalogue's axes to
  // CATALOG_AXIS_CODES in the same change that adds the catalogue.
  //
  // Beware: `configurable_attributes` comes back as a STRING, not a list — see parseAxisCodes()
  // in ./productFields.ts, which is the only place that copes with it.
  'configurable_attributes',
  // The SDK appends a bare `price { price }` of its own (graphql/Request.ts), so a listing row
  // has never carried the two fields the discount UI needs — which is why the struck-through
  // original price on the card was dead code until now. Asking for them here is safe: GraphQL
  // merges two selections of the same field, so the query ends up with the union of both.
  'price { original_price is_discounted }',
];

/** The listing selection for one catalogue: the common fields plus whatever it owns. */
export function productFields(catalogCode: string): string[] {
  return [
    ...COMMON_PRODUCT_FIELDS,
    ...(CATALOG_EXTRA_FIELDS[catalogCode] ?? []),
    ...axisCodes(catalogCode).map(code => `${code} { label value }`),
  ];
}

// The product detail page needs two things no typed field exposes: `type_id` (is this a
// configurable?) and `configurable_attributes` (which attributes actually vary). Neither is a
// declared source field, so neither is stitched onto the GraphQL `Product` type — introspect it
// and they are absent among its 118 fields. `source` returns the whole raw `_source`, which is
// the only way to reach them, and it carries the option lists along for free.
//
// Deliberately NOT merged into productFields(): `source` is the entire document (~3 KB for a
// configurable like VSK12, description included), and the grid, the category listings and the
// autocomplete all ask for 20 products at a time.
export function productDetailFields(catalogCode: string): string[] {
  return [...productFields(catalogCode), 'source'];
}

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
