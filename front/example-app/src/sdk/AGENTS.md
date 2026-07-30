# SDK layer
Read `../../docs/sdk-reference.md` FIRST. Non-negotiable gotchas:
- `selectedFields` must be non-empty.
- Use `product_search` (not `product_catalog`) when there is no category.
- Prefer a real `product_catalog` browse (root/default category) over a fake `product_search` wildcard
  (`'*'`) when you just want "some products" with no category — only use `'*'` as a transient fallback
  before the category tree has loaded.
- GraphQL field is `new`, not `is_new`; there is no `type_id` GraphQL field.
- Aggregations carry `type` (`checkbox`/`slider`/`boolean`/`category`/...) and `hasMore`.
  `SearchManager.viewMoreProductFilterOption(request, field)` fetches a facet's full option list when
  `hasMore` is true.
Do not change singleton signatures in `index.ts` without checking all hooks/contexts.