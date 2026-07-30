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

## Product Data Shape (from search `source`)
Products are wrapped: `{ id, source: { ... } }`. Key source fields:
- `sku` (string), `name` (string[]), `image` (string path like `/v/a/file.jpg` — prefix with `MEDIA_BASE_URL`)
- `price` (array of `{ price, original_price, is_discounted, group_id }`)
- `description` (string[] with HTML), `type_id` (raw source only, not a GraphQL field)
- `fashion_color` / `fashion_material` (array of `{ label, value }`) — require `{ label value }` sub-selection
- `stock` (`{ qty, status }`), `visibility` (array of `{ label, value }`)
- `new` (boolean), `url_key`, `cost`

**Media URL:** product images are relative paths. Prefix with `MEDIA_BASE_URL`
(`https://gally.localhost/media/catalog/product`) for full URLs. Exported from `sdk/index.ts`.