# Search falls back to `'*'`, which returns part of the catalog

## Status: open (bug)

## Observed

-   The code still sends `'*'` as a fallback query: `src/hooks/useSearch.ts:114`,
    `src/hooks/useSearch.ts:201` and `src/sdk/server.ts:135`.
-   The API reads `*` as query text. On `papershop_fr`, `search: "*"` returns 101 of 250
    products. An empty search returns all 250.

## Still works

`/search` with no query shows 250 results. The original symptom, zero results, is gone. The
fallback is still wrong wherever it runs.

## Possible fix

Send an empty search, or browse the root category with `product_catalog`, as
`docs/sdk-reference.md` already advises.

## Source

`bugfix-search-wildcard-empty-results.md`, a draft that was never decided (removed; see
`git show 2745ce7c:front/example-app/specs/bugfix-search-wildcard-empty-results.md`).
