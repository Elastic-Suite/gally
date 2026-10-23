# Bugfix: `/search` without a query showed the previous query's articles

## Status: implemented

## Page/Component: src/hooks/useCms.ts (`useCmsSearch`), src/views/SearchPage.tsx

## Problem

The products / articles switch on `/search` always shows both tabs, with their counts
(`feature-search-result-type-switch.md`, by design). With no query, `SearchPage` skips the blog search
(`skip: !query`), and a skipped `useCmsSearch` only stopped loading: it kept its previous result. So
after searching "robe", reaching `/search` without `q` in the same visit - browser back, an edited
URL, an autocomplete attribute picked with no query - showed robe's article count on the Articles
tab, and robe's articles when it was opened.

Found while planning the listing-page tests (`test-plan-listing-pages.md`, decision 1, decided
2026-10-23: fix). The part 1 test had pinned the old behaviour on purpose
(`test-plan-search-engine.md`).

## Behaviour (testable)

-   [x] A skipped `useCmsSearch` empties its result: no articles, count 0, one page count of 0, no
        aggregations, not loading, no error. A request in flight is dropped
        (`bugfix-search-out-of-order-responses.md`).
-   [x] `/search` without a query therefore shows 0 on the Articles tab and the empty articles state.

Checked by `src/test/search-engine.test.tsx` and `src/test/listing-pages.test.tsx`.

## Tracking (required)

-   No change: no query means no blog search and no DISPLAY event for articles.

## MUST NOT change

-   Both tabs still always render (`feature-search-result-type-switch.md`); a skipped search shows a
    real 0, never another query's results.
