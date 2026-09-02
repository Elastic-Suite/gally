# Bugfix: Blog cards, ACP rows and post page rendered empty — `selectedFields` projects `_source`

## Status: implemented
## Page/Component: src/hooks/useCms.ts (consumed by src/components/BlogCard.tsx, src/views/BlogPage.tsx, src/views/BlogPostPage.tsx, src/components/SearchOverlay.tsx)

## Problem
Every `cms_page` field rendered blank — blog cards with no title/image/author, ACP blog rows
with an empty title line, `/blog/:id` falling through to the not-found state — while the
counts, pagination and facet chips were all correct. That split is the tell: pagination and
aggregations come off `paginationInfo`/`aggregations`, which never touch the collection.

Two mistakes, both from the same wrong assumption — that `selectedFields` is inert for
non-product entities (as `feature-blog-cms.md` and `../docs/sdk-reference.md` both stated):

1. `CMS_FIELDS` was `['id', 'author', 'label', 'image', 'title', 'summary', 'content']` — a
   mix of real `_source` attributes and view-model names (`label`, `summary`) that exist
   nowhere in the index.
2. `getCmsFields()` read `doc.data._source`, expecting the raw GraphQL envelope.

`Response`'s constructor (`graphql/Response.ts`) actually does *both* things the assumption
denied: for any collection item carrying `data._source` it **filters the source to the keys
in `selectedFields`** and **returns that flat object**, discarding the envelope. So
`doc.data._source` was `undefined`, `src` fell back to `{}`, and `getCmsFields()` returned an
all-empty `CmsPage` for every document. The server response itself was always complete —
verified by replaying the query with curl.

The failure is silent by construction: an unlisted key is dropped with no error, and a listed
key that isn't in `_source` is simply absent.

## Behaviour (testable)
- [x] `CMS_FIELDS` lists **raw `_source` attribute names only**: `id`, `title`,
      `content_heading`, `meta_description`, `content`, `url_key`, `image`, `content_type`,
      `topic`, `author`, `published_at`, `reading_time`, `is_featured`, `tags`.
- [x] `getCmsFields(doc)` reads the flat projected object (`doc ?? {}`), not
      `doc.data._source`.
- [x] The document id comes from the indexed `id` attribute, not `data._id` — `_id` and
      `_score` do not survive the projection, so `id` must stay in `CMS_FIELDS`.
- [x] Verified end to end against the live instance (SDK query → `Response` projection →
      `getCmsFields`) for all four call sites: `/blog` index (sorted `published_at desc`,
      paginated), `/blog/13` detail (`equalFilter` on `id`), autocomplete `"dress"`
      (pageSize 4), and a topic chip (`equalFilter` on `topic__value`). Every field the
      cards, the post page and the ACP rows read is populated in all four.
- [x] Debug `console.log`s removed from `useCms.ts` and `BlogCard.tsx`.

## SDK contract used
- Unchanged surface — same `SearchManager.search({ metadata: 'cms_page', ... })` call. Only
  the *contract understanding* changed; see the corrected "Non-product entities" section of
  ../docs/sdk-reference.md and the SDK contract block of `feature-blog-cms.md`, both of which
  documented the old wrong behaviour and were rewritten as part of this fix.

## Tracking (required)
- No change. `trackCmsPageView(post.id, post.title)` and the `/blog` list VIEW event fire from
  the same effects as before — but they now receive a real id and title instead of `''`, so
  `entityCode` is no longer empty on the detail event.

## MUST NOT change
- The product path. `Response` only projects items that carry `data._source`; product
  collections don't, so they fall through untouched and `PRODUCT_FIELDS` keeps its GraphQL
  field syntax (`fashion_color { label value }`).
- The `CmsPage` interface and every consumer of it — `BlogCard`, `BlogPage`, `BlogPostPage`,
  `SearchOverlay`, `SearchPage`'s blog tab are all unmodified. The fix is contained to the
  two ends of the mapping inside `useCms.ts`.

## Gotcha for next time
Adding a field to `CmsPage` without adding its `_source` name to `CMS_FIELDS` reads back as
`undefined` with no error anywhere in the stack. The two lists must move together.
