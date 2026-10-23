# Test plan: the client search engine (search and listing, part 1)

## Status: implemented - 29 tests in `src/test/search-engine.test.tsx` and 9 in `src/test/search-races.test.tsx`, all passing

Part 1 of the search-and-listing aspect: the hooks every listing, the blog and the autocomplete run
on - `useSearch`, `useAutocomplete` (`src/hooks/useSearch.ts`), `useCmsSearch` and
`useCmsAutocomplete` (`src/hooks/useCms.ts`). The data-layer tests covered the server side; this is
the client side. Parts 2-4 (facets, listing pages, search bar) come after.

About 30 tests in 2 files, the hooks rendered with the fake search manager the tracking tests use.

Sources: `bugfix-ssr-product-list-behind-suspense.md`, `bugfix-search-wildcard-empty-results.md`
(draft), `feature-search-result-type-switch.md`, `feature-facet-load-more.md`,
`feature-blog-cms.md`, `feature-acp-real-term-suggestions.md`.

## Decisions needed before writing

1. **Out-of-order responses.** No hook checks that a response belongs to its latest request. If an
   earlier request is slower than a later one, it lands last and overwrites the newer result:
    - `useSearch` / `useCmsSearch`: the page shows the previous query's products under the new query
      (the tracking is not fooled - it checks `resultQuery` - but the visitor is);
    - `useAutocomplete` / `useCmsAutocomplete`: suggestions for "ro" can reappear after the box was
      cleared or the query changed, and `loading` turns false while another request still runs.
      Options:
    - (a) Pin today's behaviour.
    - (b) Fix first - each hook keeps only the response to its latest request - with a bugfix spec,
      then test the fixed behaviour.
    - Recommended: (b).
    - **Decided 2026-10-23: (b), done.** Fixed and tested in
      `bugfix-search-out-of-order-responses.md` (`src/test/search-races.test.tsx`, 9 tests).
2. **The seed-drift wording.** `bugfix-ssr-product-list-behind-suspense.md:219-220` says a server
   fetch that drifts from the client's options gets its seed "discarded" and the page "refetches".
   The code does not check: `useSearch` keys the seed from the options it is given, so a drifted seed
   is shown as is - which the next MUST NOT line of the same spec says ("`useSearch` now trusts the
   caller"). Options: (a) correct the spec wording to match the code (recommended); (b) make the hook
   verify the seed.
    - **Decided 2026-10-23: (a), done.** The MUST NOT line now says the drift is not detected.
3. **The `'*'` fallback** (`bugfix-search-wildcard-empty-results.md`, still a draft): with no
   category and no query, `useSearch` sends `search: "*"`, which the API answers with zero products.
   Recommended: pin the request as it is today and leave the fix to that spec. Same for
   `viewMoreOptions`, which sends no query at all in that case instead of `'*'`
   (`feature-facet-load-more.md` says "the same rules") - no listing page reaches it, both always pass
   a category or a query.
    - **Decided 2026-10-23: pinned as a very low case.** Only the `uk` catalog (no categories, no
      products) reaches it today; recorded in the draft spec.

## A - The request each hook builds

-   `useSearch`: a query searches it; a category with no query browses the category; no category and
    no query sends `'*'` (decision 3); page size 20, `isAutocomplete: false`, the catalog's
    `productFields()` unless the caller gives `selectedFields`, filters and sort passed through.
-   `useCmsSearch`: `cms_page`, `CMS_FIELDS`, an empty query sent as none, page size 10 by default.
-   `useAutocomplete`: page size 8, `isAutocomplete: true`; `useCmsAutocomplete`: 4 articles.
-   `viewMoreOptions(field, optionSearch)`: the current query, category and filters, page size 1, no
    fields; `[]` on an error or without a catalog (`feature-facet-load-more.md`).

## B - Server seed and refetch (bugfix-ssr-product-list-behind-suspense)

-   With `initialData`: shown at once, settled, and no request on mount.
-   A new seed for new options (`/search` re-navigating with another `?q=`) is used without a request.
-   Without a seed, a change of query, category, page, sort field or direction, page size or filters
    sends a new request; a re-render with the same options sends none. Changing catalog sends one.
-   `useCmsSearch` the same with `initialPages`; `skip` sends nothing and stops loading.

## C - States

-   Without a seed, `loading` starts true - never a false "no results" before the first request.
-   An error keeps the previous products and sets `error`; the next success clears it.
-   `useCmsSearch` with `skip` empties its result - changed by `bugfix-search-stale-articles-without-query.md`.

## D - Autocomplete hooks (feature-acp-real-term-suggestions, feature-blog-cms)

-   Fewer than 2 characters clears products, articles and term suggestions, without a request.
-   Typing waits 300 ms and sends only the last query.
-   Term suggestions come from the same request, no extra round trip.
-   `clear()` empties everything; an error empties everything.
-   Out-of-order responses: done, decision 1.

## Outcome

-   Ten deliberate breaks, each made a test fail: the `'*'` fallback changed, the default page size
    changed, the sort direction no longer refetching, the hook starting as settled, an error dropping
    the previous products, the autocomplete without its debounce, the autocomplete from one character,
    "load more" asking a full page, the blog page size changed.
-   One break was not caught, and cannot be: removing `useSearch`'s "seed key matches, skip" line
    changes nothing, because the branch below adopts the seed again whenever `initialData` is passed.
    The line only matters if a caller drops `initialData` while keeping the same options, which no
    page does. A redundant guard, not an untested behaviour.

## Out of scope here

-   What the views do with these results (parts 3 and 4), and the facet component (part 2).
-   The skeleton never flashing on a seeded page - a browser check.

## Noted, pinned as today

-   `useCmsSearch` with `skip` kept the articles of the previous query: fixed in
    `bugfix-search-stale-articles-without-query.md`.
