# Bugfix: a slower earlier search response overwrote the newer one

## Status: implemented

## Page/Component: src/hooks/useSearch.ts (`useSearch`, `useAutocomplete`), src/hooks/useCms.ts (`useCmsSearch`, `useCmsAutocomplete`)

## Problem

None of the four search hooks checked that a response belonged to its latest request. When an earlier
request was slower than a later one, it landed last and overwrote the newer result:

-   `useSearch` / `useCmsSearch`: type "robe" then "jupe" on `/search`; if "robe" answered last, the
    page showed robe's products under "jupe". The SEARCH tracking was not fooled (it checks
    `resultQuery`, `bugfix-search-zero-result-tracking.md`); the visitor was. A late error did the
    same with the error message.
-   `useAutocomplete` / `useCmsAutocomplete`: the 300 ms debounce only cancels a request not yet
    sent. A request already in flight still wrote its suggestions - after the query changed, after
    the box went under 2 characters, after `clear()` - and its `finally` set `loading` to false while
    a newer request was still running.

Found while planning the search engine tests (`test-plan-search-engine.md`, decision 1).

## Behaviour (testable)

-   [x] Each hook numbers its requests; a response, success or error, is applied only if it belongs
        to the latest one.
-   [x] `useSearch` / `useCmsSearch`: adopting a server seed, and `useCmsSearch`'s `skip`, also make any
        request in flight stale.
-   [x] Autocomplete hooks: going under 2 characters and `clear()` make any request in flight stale and
        set `loading` to false. A stale request never changes `loading`.

Checked by `src/test/search-races.test.tsx` and the full suite. Not checked in a browser.

## Tracking (required)

-   No change.

## MUST NOT change

-   One rule in all four hooks: the latest request wins, whatever order the answers arrive in.
-   A stale response never sets `loading`, `error`, results or term suggestions.
