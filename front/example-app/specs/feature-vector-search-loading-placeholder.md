# Feature: Loading placeholder on the vector search page

## Status: implemented
## Page/Component: src/views/VectorSearchPage.tsx (`RowsSkeleton`, loading state), src/styles.css (`.vector-list.is-stale`, `.vector-row--skeleton`)

## Problem
- On arrival, both panels started with loading off and no results. For an instant they showed their
  "no results" and "unavailable" messages, then the lists appeared and pushed the page down.
- On a new query or page, the previous rows stayed at full strength until the new ones arrived, with
  nothing but the count badge to show that a search was running.

## Behaviour (testable)
- [x] Both panels start in the loading state, so neither empty message shows before the first response.
      A catalog with no suggested query (empty box) turns loading off without sending a request.
- [x] A panel that is loading and has no rows yet shows 25 placeholder rows (`RowsSkeleton`, one page).
      They use the `.vector-row` grid and the 34px `.vector-row-thumb` box, so each is as tall as a real
      row. Bars use the existing `.skeleton` / `.skeleton-text` / `.skeleton-shimmer` classes.
- [x] A panel that is loading and already has rows keeps them in place at `opacity: 0.45`
      (`.vector-list.is-stale`) until the new rows replace them. The panel height does not change.
- [x] Placeholder rows are `aria-hidden` and get no hover tint.

## MUST NOT change
- The empty states still show once a response really comes back empty.
- Paging one panel still does not reload or dim the other.
- Search tracking is unchanged: it already waits for `kwLoading` to be false.
