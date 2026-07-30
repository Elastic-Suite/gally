# Feature: Server-side facet "show more"

## Status: implemented
## Page/Component: src/hooks/useSearch.ts (`viewMoreOptions`), src/components/Facets.tsx (`FacetGroup`)

## Behaviour (testable)
- [x] The backend truncates each aggregation's option list to ~10 and signals more exist via
      `aggregation.hasMore`. Previously "Show more" only revealed already-loaded options past index 5 —
      it could never surface values 11+ that the backend never sent.
- [x] When `aggregation.hasMore` is true and the facet hasn't fetched the full list yet, clicking
      "Show more" calls `onLoadMore(aggregation.field)` (wired from the page via `useSearch`'s
      `viewMoreOptions`), which fetches the **complete** option list for that field and replaces the
      facet's working option set (`extraOptions`) with it, then expands.
- [x] Once fetched, the existing client-side search-within-facet input filters over the fuller set — no
      further server round-trips per keystroke.
- [x] When `aggregation.hasMore` is false, "Show more" behaves exactly as before (purely local expand of
      already-loaded options).
- [x] The search input itself must stay mounted regardless of how many options the current search term
      matches (see the "facet search input disappearing" bugfix — condition is `baseOptions.length > 5 ||
      canFetchFromServer`, not `filteredOptions.length`).

## SDK contract used
- `useSearch.ts` exposes `viewMoreOptions(field: string)`, calling the SDK's previously-unused
  `SearchManager.viewMoreProductFilterOption(request, field)` with the same `localizedCatalog`,
  `searchQuery` (using the same root-category/wildcard rules as the main search — see
  `docs/sdk-reference.md`), `filters`, and `categoryId` as the current search. Returns
  `{ label, value, count }[]`.
- Pages must pass `onLoadMore={viewMoreOptions}` to `<Facets>` (done in `CategoryPage.tsx`/`SearchPage.tsx`).

## Tracking (required)
- No new tracking event — this only affects which facet options are visible, not search/filter/view events.

## UI constraints
- No new CSS — reuses `.facet-search`/`.facet-show-more`.

## MUST NOT change
- Local-only "show more" behaviour for facets where `hasMore` is false (e.g. price slider bounds, boolean,
  and any checkbox facet whose full option list already fit under the backend's truncation limit).
