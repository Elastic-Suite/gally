# Feature: Blog (cms_page) — ACP results + browsable index

## Status: implemented
## Page/Component: src/pages/BlogPage.tsx, src/pages/BlogPostPage.tsx, src/components/SearchOverlay.tsx

Renames the "CMS" top nav to "Blog" and turns it into a real, indexed content
section backed by the `cms_page` entity (57 documents per locale: 50 editorial
blog posts + 7 legacy buying guides).

## Behaviour (testable)
- [ ] Header nav item reads "Blog" and points at `/blog` (active on any `/blog*` path).
- [ ] `/blog` lists the **10 latest** posts, sorted `published_at desc`, 10 per page.
- [ ] Browsable by **content type** (Blog Post / Buying Guide) — a top-level toggle —
      and by **topic** (10 values) — a row of chips underneath. Both come from the
      API's own aggregations, never a hardcoded list.
- [ ] Filters and page live in the URL (`?type=`, `?topic=`, `?page=`) so the view
      is linkable and survives a reload. Changing a filter resets to page 1.
- [ ] Pagination reuses the existing `.pagination` markup from SearchPage/CategoryPage.
- [ ] `/blog/:id` renders one post: image, title, topic/author/date/reading-time meta,
      and the `content` HTML.
- [ ] The ACP shows a **Blog** section (right column, under Categories) with up to 4
      matching CMS pages for the current query. Searching "dress" surfaces blog posts
      alongside products.
- [ ] ACP blog rows join the existing arrow-key sequence (last, after categories) and
      accept the same `highlighted` treatment as every other row.
- [ ] Query terms are highlighted (`<mark>`) inside ACP blog titles.

## SDK contract used
- `SearchManager.search({ metadata: 'cms_page', ... })`. The SDK routes any non-`product`
  metadata to the generic `documents(entityType: ...)` GraphQL query — see
  `graphql/Request.ts:getEndpoint()`. No `requestType` is sent (or accepted) for
  non-product entities.
- `selectedFields` never reaches the query for non-product entities (the SDK hardcodes
  `id data`) but is **not** ignored: `Response` uses it to project `data._source`
  client-side. List the raw `_source` attribute names you need — anything omitted is
  dropped from every document. Non-empty is still mandatory, or the `collection` block
  is dropped from the query and zero documents come back. Same trap as products.
- Documents therefore arrive **flattened** — plain `{ <source attr>: value }`, with no
  `data`/`_source` envelope and no `_id`/`_score`. The id comes from the indexed `id`
  attribute, which is why `id` is in the selected field list.
- Sort shape differs from products: `{ field, direction }`, not `{ [field]: direction }`.
  The SDK handles this from `sortField`/`sortDirection`.
- Filters: `equalFilter` on `content_type__value`, `topic__value`, `id`.
  **`url_key` is NOT filterable** (keyword-analyzed text, no `untouched` sub-field —
  the API 500s with "Unable to identify the field property to use for filtering").
  That is why the detail route keys off `id`, not the slug.
- Images are product media paths (`/v/d/vd10-ly_main.jpg`) → prefix with `MEDIA_BASE_URL`.

The two `selectedFields` bullets above originally documented the opposite behaviour, and the
implementation was built against them — see `bugfix-cms-selected-fields-projection.md`.

## Tracking (required)
- `/blog` list view → `TrackingEventType.VIEW`, `metadataCode: 'cms_page'`, with the
  usual `product_list` payload (item count / page / page count) so the event log reads
  the same as a category listing.
- `/blog/:id` → `TrackingEventType.VIEW`, `metadataCode: 'cms_page'`, `entityCode` = doc id.
- Product tracking elsewhere is untouched.

## UI constraints
- Tokens only, from ../docs/design-system.md. No new hex/px/font-size literals.
- No new visual primitives: the chips reuse the facet/active-filter idiom, the
  pagination block is the existing `.pagination`, the ACP rows are `.autocomplete-item`.

## MUST NOT change
- The product ACP columns (suggestions, attributes, products, categories) and their
  keyboard order — blog rows are appended after categories, nothing is reordered.
- `useAutocomplete()`'s product behaviour; the CMS lookup is a separate hook so a slow
  or failing cms_page query can never stall or blank the product column.
- `/cms/:slug` and `CmsPage.tsx` (static about / shipping-returns / faq) stay reachable.
