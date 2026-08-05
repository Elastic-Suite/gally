# Bugfix: `'*'` wildcard fallback returns zero results

## Status: draft
## Page/Component: src/hooks/useSearch.ts (`doSearch`, `viewMoreOptions`)

## Problem
`useSearch.ts` forces `product_search` mode (instead of `product_catalog`, which 400s without a
`currentCategoryId`) whenever there's no category by falling back to a literal `'*'` search string:
```
const effectiveQuery = hasCategory
  ? (searchQuery || undefined)
  : (searchQuery || '*');
```
This is flagged in `src/sdk/AGENTS.md` and `docs/sdk-reference.md` as a known anti-pattern ("prefer a real
`product_catalog` browse... only fall back to the wildcard when no category tree is available"), but it's
worse than just non-ideal: verified directly against the live GraphQL API that `search: "*"` returns an
**empty collection**, every time, regardless of any `filter` passed alongside it. The backend does not treat
`*` as a wildcard/match-all — it's matched as literal query text against indexed fields, and nothing
contains a literal `*`.
```
query { products(localizedCatalog:"com_fr", requestType: product_search, currentPage:1, pageSize:2,
  search:"*") { collection { id source } } }
→ {"data":{"products":{"collection":[]}}}
```
`search: ""` (empty string) does return the expected match-all-style result set — but the SDK's
`getRequestType()` picks `product_catalog` vs `product_search` based on `searchQuery` truthiness, so passing
`''` flips it back to `product_catalog` and re-triggers the missing-`currentCategoryId` 400. `docs/
sdk-reference.md` separately notes `requestType` is a purely client-side declaration the backend just
validates — so `product_search` can be forced explicitly without an SDK API that currently exposes a way to
do that independent of `searchQuery`'s truthiness.

## Behaviour (testable)
- [ ] Any `useSearch()` call with no `categoryCode` and no real `searchQuery` currently returns zero products
      silently (no error, no loading-forever — just an empty list), which reads as "no products" rather than
      the intended "browse everything."
- [ ] Fix must preserve `product_search` mode without a category (still required — `product_catalog` 400s
      without `currentCategoryId`).
- [ ] Fix must not literally send `search: "*"` (or any other non-empty placeholder the backend will treat as
      real query text) to the API.

## Where this bites today
- `useSearch.ts`'s two `'*'` fallback sites (`doSearch` line ~64, `viewMoreOptions` line ~117).
- `ProductPage.tsx`'s SKU lookup avoided this entirely by always passing a real `searchQuery` (the SKU
  itself) — see `feat-new-example` history / current code, which pairs `searchQuery: sku` with an
  `equalFilter` (`filters: [{ sku: { eq: sku } }]`) instead of relying on the wildcard.
- Not yet confirmed which other call sites (if any) hit the no-category/no-query branch at runtime — needs a
  pass over `Homepage.tsx`, `SearchPage.tsx`, `VectorSearchPage.tsx` call sites to `useSearch`/`useAutocomplete`.

## Candidate fix
Options worth comparing before implementing:
1. Change the SDK request's `requestType` to be settable independent of `searchQuery` truthiness (would need
   an SDK-level change or a documented low-level `Request`/`Client` escape hatch, if one exists).
2. Wherever the wildcard fallback is hit, do the "genuine `product_catalog` browse of the root/default
   category" the docs already recommend, instead of `product_search` at all — requires plumbing a root
   category id into every call site that currently has none.

## SDK contract used
- `SearchManager.search()` / `getRequestType()` — see `docs/sdk-reference.md`.

## Tracking (required)
- N/A — no tracking event involved, this only affects which products come back.

## MUST NOT change
- `ProductPage.tsx`'s SKU lookup, which already sidesteps this bug by pairing a real `searchQuery` with an
  `equalFilter` rather than using the `'*'` fallback.
