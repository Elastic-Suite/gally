# SDK layer
Read `../../docs/sdk-reference.md` FIRST — it owns every SDK fact and wins over this file.

Two things restated here because they fail silently, with no error to follow:
- `selectedFields` must be non-empty, or the query returns nothing.
- Use `product_search` (not `product_catalog`) when there is no category.

Do not change singleton signatures in `index.ts` without checking all hooks/contexts.
