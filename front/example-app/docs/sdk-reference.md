# SDK & API Reference (authoritative — do NOT contradict)

These facts were found the hard way. Never "simplify" them away.

## Gally API
- **Base URL:** `https://gally.localhost/api`
- **REST endpoints:** `/api/catalogs`, `/api/localized_catalogs`, `/api/categories`, `/api/category_configurations`
- **GraphQL endpoint:** `/api/graphql` (no auth required for public queries)
- **Search:** `products(localizedCatalog, requestType, currentPage, pageSize, search, currentCategoryId, sort, filter)`
- **Category tree:** `getCategoryTree(catalogId, localizedCatalogId) { categories }` — nested `{ id, name, level, path, isVirtual, count, children }`
- **Tracking:** `createTrackingEvent` mutation via `TrackingEventManager`
- **RequestType enum:** `product_catalog` (requires `currentCategoryId`), `product_search` (works without category), `product_autocomplete`
- **⚠️ Gotcha:** `product_catalog` requests **fail** if `currentCategoryId` is not provided. When browsing without a category, use `product_search` with an empty search string instead.
- **⚠️ Gotcha:** Don't fake a `product_search` wildcard (`'*'`) just to get "some products" with no real query — `requestType` is purely a client-side declaration (the backend just validates it), so prefer a genuine `product_catalog` browse of the root/default category instead. It returns catalog/merchandising order, not relevance-scored noise against `'*'`. Only fall back to the wildcard when no category tree is available at all (e.g. transiently before `CatalogContext` finishes its first fetch). See `Homepage.tsx`'s "Trending Now" slider and `ProductPage.tsx`'s recommendations for the pattern, and `useSearch.ts`'s `doSearch` for the fallback.

### The catalogs the demo data defines

Three catalogs, six localized catalogs. The `[locale]` URL segment is the **localized** code (right
column), which is what every SDK call wants — a parent catalog code is never a valid segment.

| Catalog | Localized catalog | Locale | Currency | |
|---|---|---|---|---|
| `com` — COM Catalog | `com_fr` | fr_FR | EUR | **landing default** |
| | `com_en` | en_US | EUR | |
| `fr` — FR Catalog | `fr_fr` | fr_FR | EUR | |
| | `fr_en` | en_US | EUR | |
| `uk` — UK Catalog | `en_fr` | fr_FR | GBP | no documents indexed |
| | `en_en` | en_US | GBP | no documents indexed |

⚠️ **The `uk` catalog's localized codes start with `en_`, not `uk_`** — so `en_en` / `en_fr` are the
*British* catalog, not an "English" one, and they are the two with **no indexed documents at all**:
they render an empty storefront. Confirmed against
`api/packages/gally-sample-data/src/DataFixtures/{catalogs,localized_catalogs}.yaml`.

The app also ships German UI strings (`src/locales/de/`, mapped in `src/sdk/catalogs.ts`) even
though no `de_DE` localized catalog exists — German is reachable only if one is added to the data.

## SDK Usage (`@elastic-suite/gally-sdk`)
- `SearchManager` — wraps GraphQL product search. Accepts `SearchRequestOptions` with `localizedCatalog` (e.g. `"com_en"`), `metadata` (e.g. `"product"`), `categoryId`, `search`, etc.
- **⚠️ `selectedFields` MUST NOT be empty.** The SDK skips the `collection` field entirely when `selectedFields` is `[]`, returning only pagination/aggregation metadata with **zero products**. Always pass a non-empty list.
- **GraphQL field syntax for `selectedFields`:** object/array-typed fields require sub-selections (e.g. `fashion_color { label value }`, not `fashion_color`). Scalar fields are plain names.
- **⚠️ Field name differences:** the GraphQL field is `new` (NOT `is_new`). There is no `type_id` GraphQL field (it exists only in the raw `source` blob from REST).
- `Response` — `getCollection()` returns product objects with `source` wrapper; `getAggregations()` returns facets; `getTotalCount()`, `getLastPage()`.
- **Aggregations** carry a `type` (`checkbox`, `slider`, `boolean`, `category`, plus others like `date_histogram` that fall through to the generic checkbox rendering) and a `hasMore` boolean — `hasMore: true` means the backend truncated that facet's option list (~10 max) and more values exist server-side.
- `SearchManager.viewMoreProductFilterOption(request, aggregationField)` — fetches the **complete** option list for one facet field, bypassing the `hasMore` truncation. Takes the same request shape as `.search()` (metadata, localizedCatalog, searchQuery, filters, categoryId) plus the field name; returns `{ label, value, count }[]`.
- `TrackingEventManager.init({ baseUri })` — singleton tracker. `.push({ eventType, metadataCode, localizedCatalogCode, entityCode?, payload? })`
- `TrackingEventType` — `VIEW`, `DISPLAY`, `SEARCH`, `ADD_TO_CART`, `ORDER`
- `Client` + `Configuration` — low-level HTTP/GraphQL client for direct API calls.

## Non-product entities (`cms_page` — the blog)
`SearchManager` is not product-only. Any `metadata` other than `'product'` is routed by
the SDK to the generic `documents(entityType: ...)` GraphQL query (`graphql/Request.ts:getEndpoint()`).
`cms_page` is the entity the Blog section runs on (57 documents per locale: 50 blog
posts + 7 legacy buying guides). Everything below differs from the product path:

- **No `requestType`.** `getRequestType()` returns `undefined` for non-product entities and
  the variable is stripped. `documents` doesn't take a product request type at all.
- **⚠️ `selectedFields` never reaches the query, but it is NOT ignored — it projects the
  result.** The SDK hardcodes the GraphQL selection to `id data` for non-product entities,
  so the server always returns the whole document; `Response` then filters `data._source`
  down to exactly the keys you listed (`graphql/Response.ts`). List **raw `_source`
  attribute names** (`content_heading`, `published_at`, `content_type`, …) — not GraphQL
  field syntax, not the camelCase names of your own view model. Any key you omit is
  silently dropped from every document; any key you list that isn't in `_source` is just
  absent. An empty array still drops the whole `collection` block from the query — zero
  documents, pagination only. Same trap as products.
- **`isAutocomplete` is required by the TS option type** and inert here (it only ever feeds
  `requestType`). Pass `false`.
- **⚠️ Documents come back flattened, not wrapped.** After that projection
  `getCollection()` returns plain `{ <source attr>: value }` objects — the
  `{ id, data: { _id, _score, _source } }` envelope of the raw GraphQL response does
  **not** survive, so `_id` and `_score` are unreachable and there is no `source` wrapper
  like products have. Read the document id from the indexed `id` attribute (include `id`
  in `selectedFields`); the collection item's GraphQL `id` was the IRI
  (`/api/documents/18`) anyway, not the id.
- **⚠️ Filters use a different input type.** Products take `{ field: { eq: v } }`;
  `documents` takes `FieldFilterInput`, which names the field *inside* the filter:
  `{ equalFilter: { field: 'topic__value', eq: 'materials' } }`. Also available:
  `matchFilter`, `rangeFilter`, `boolFilter`, `existFilter`.
- **⚠️ Not every field is filterable.** `url_key` is keyword-analyzed text with no `untouched`
  sub-field, so filtering on it 500s with *"Unable to identify the field property to use for
  filtering on \"url_key\", possible invalid mapping"*. `id` **is** filterable
  (`equalFilter` on `id`) — that's why `/blog/:id` keys off the id, not the slug.
- Sort variable shape differs (`{ field, direction }` vs the product `{ [field]: direction }`),
  but `sortField`/`sortDirection` are the same SDK options — the Request builds the right one.
- Select fields aggregate under a `__value` suffix: `content_type__value`, `topic__value`,
  `author__value`, `tags__value`. A facet **excludes its own active filter** from its own
  aggregation (picking a content type keeps both content types listed) while narrowing the
  others — so browse chips can be rendered straight from the response.
- **⚠️ Source-field changes need a cache flush, not just a reindex.** The filterable-field list
  is cached per entity (`MetadataSourceFieldProviderCache`). After loading new source fields,
  `bin/console cache:pool:clear --all` — from the host, `make sf c="cache:pool:clear --all"`.
  Otherwise the new facets silently never appear in `aggregations`, even though the documents
  and mapping are correct.
- CMS `image` values are product media paths → prefix with `MEDIA_BASE_URL`, like a product image.

## Product Data Shape

**Product collection items are FLAT, not wrapped.** The stitched fields you listed in
`selectedFields` come back at the top level: `{ sku, name, price, stock, … }`. There is no `source`
envelope unless you ask for one. This is the opposite of non-product entities, where `Response`
projects `data._source` for you (see above) — and it is why `products[0].source.<x>` reads
`undefined` and fails silently. `getProductFields` (`src/sdk/productFields.ts`) accepts either shape
via `product.source || product`, which is what hid the difference.

`source` **is** a real field on the GraphQL `Product` type, but you must select it, and it returns
the entire raw `_source`. Only the PDP does (`PRODUCT_DETAIL_FIELDS` in `src/sdk/fields.ts`), because
it is the only way to reach two things the stitching does not expose:

- `type_id` — is this a configurable?
- `configurable_attributes` — which attributes vary (`['fashion_color','fashion_size']`).

Neither is a declared source field, so neither is stitched onto `Product`; introspecting the type
returns 118 fields and both are absent. Don't add `source` to the shared `PRODUCT_FIELDS`: it is the
whole document, and listings request 20 at a time. See
`specs/feature-configurable-option-selection.md`.

**Configurable children are not usable for variant resolution.** The parent document carries
`children_ids` and `children.sku` (real child SKUs, e.g. `VSK12-RN-8`), but the other `children.*`
keys are **deduplicated value sets, not per-child arrays** — `VSK12` has 20 skus and 1
`children.url_key` — and no per-child attribute values are indexed at all, despite
`children_attributes` listing `fashion_color`/`fashion_size`. There is therefore no
(colour × size) → child SKU mapping to read. Nor can the typed GraphQL path help: a nested source
field goes through `NestedAttribute`, whose `getSanitizedData()` calls `current($value)` on a list
and returns only the first child.

Key source fields:
- `sku` (string), `name` (string[]), `image` (string path like `/v/a/file.jpg` — prefix with `MEDIA_BASE_URL`)
- `price` (array of `{ price, original_price, is_discounted, group_id }`)
- `description` (string[] with HTML), `type_id` (raw source only, not a GraphQL field)
- `fashion_color` / `fashion_material` (array of `{ label, value }`) — require `{ label value }` sub-selection
- `stock` (`{ qty, status }`) — **the SDK auto-appends only `stock { status }`**, so `qty` is
  `undefined` unless you select `source`. And on any product with children `qty` is genuinely `0`
  while `status` is `true` (true for exactly the 72 `com` documents that have `children.sku`, and
  none of the 13 that don't): a configurable's own stock item holds no quantity, and no child stock
  is indexed to fall back on. **Read availability through `isAvailable()` / `getProductFields().available`
  (`src/sdk/productFields.ts`), never `stock.status` directly** — it treats `status: true` + `qty: 0`
  as out of stock, and distinguishes `qty === undefined` ("not requested", so `status` governs) from
  `qty === 0`. See `specs/bugfix-stock-count-zero-on-parents.md`.
- `visibility` (array of `{ label, value }`)
- `new` (boolean), `url_key`, `cost`

**Media URL:** product images are relative paths. Prefix with `MEDIA_BASE_URL`
(`https://gally.localhost/media/catalog/product`) for full URLs. Exported from `sdk/index.ts`.