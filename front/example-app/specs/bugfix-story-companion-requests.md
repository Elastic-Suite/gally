# Bugfix: the story companion sent a useless search on every page

## Status: implemented

## Page/Component: src/hooks/useStoryActions.ts, src/hooks/useSearch.ts

## Problem

`StoryCompanion` is mounted by `AppShell` on every page, story running or not, and runs
`useStoryActions`, which prefetches products for the demo's `add_to_cart_flow` step through
`useSearch`. For every other step, and with no story running at all, it still called `useSearch` -
with no query and `pageSize: 0`. With neither query nor category, `useSearch` sends `search: "*"`
(`bugfix-search-wildcard-empty-results.md`), so every page load sent one `products` request that
asked for nothing and that nothing read; two in development, where strict mode runs effects twice.
Found with a browser trace of the GraphQL calls while looking for duplicate search requests.

## Behaviour (testable)

-   [x] `useSearch` takes a `skip` option: no request, not loading, the previous result kept. A request
        in flight when `skip` turns on is dropped (`bugfix-search-out-of-order-responses.md`).
-   [x] The story companion sends no request at all, whatever the step - decided 2026-10-23, "for now".
        `useStoryActions` passes `skip: true`.
-   [x] Consequence, accepted for now: the demo's `add_to_cart_flow` step ("tank dress") finds no
        prefetched products; it keeps its existing fallback - it waits 6 s (20 x 300 ms) for products
        and then goes to the cart without adding one (`useStoryActions.ts`, `tryFlow`).

Checked by `src/test/search-engine.test.tsx` (`skip`), `src/test/story-companion.test.tsx` (no
request from the companion, with the real `add_to_cart_flow` step) and a browser trace of a page load.

## Tracking (required)

-   No change.

## MUST NOT change

-   Until someone decides otherwise, the story companion sends no search request. Turning the prefetch
    back on means passing `skip: !searchQuery` (or the story's active flag) instead of `true` - never
    an unconditional `useSearch` again, which is the empty `'*'` request on every page.
