---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Seed client hooks with the server's data, fetched with the same request

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, in phase 3 of
the SSR plan. It is recorded in
[feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md). The skip
mechanism was later changed, as recorded in
[feature-navigation-loading-feedback.md](../../specs/feature-navigation-loading-feedback.md).

The product, category and blog article routes fetch their data on the server. The client
views below them use hooks that fetch the same data again on mount. How do we avoid the
second fetch, and make sure the hydrated page shows the same thing as the server page?

## Decision Drivers

-   If the server request and the hook request differ, content changes under the user after
    hydration. This is invisible in review.
-   The hydrated page should not fetch again what the server already sent.
-   Sorting, filtering or paging must still hit the API.

## Considered Options

No alternative was recorded for the overall approach. For `CategoryPage`, the spec records
one rejected option: pass the server data to the hook in every case.

## Decision Outcome

Chosen option: server fetchers mirror the hooks, and their result seeds the hooks.

-   The fetchers in `src/sdk/server.ts` send the same request as the matching client hook:
    same metadata, same `selectedFields`, same filter syntax.
-   The field lists both sides use live in one place, `src/sdk/fields.ts`.
-   `useSearch` takes `initialData` and `useCmsSearch` takes `initialPages`. The seed fills the
    hook's state, and the mount fetch is skipped.
-   `CategoryPage` passes `initialData` only when the view matches what the server fetched:
    page 1, no sort, no filter. Passing it in every case was rejected: it would show stale
    results as soon as a user touched a facet.

The first version skipped the mount fetch with a one-shot `skipMountFetch` ref. It was
replaced by `serverFetchedKey`, a key of the options the seed belongs to. React StrictMode
runs effects twice in dev, so the one-shot flag was used up and the second run fetched again.
The flag also did not say which query the seed belonged to.

### Consequences

-   Good, because the hydrated page shows the server's content with no second fetch.
-   Good, because one edit to `fields.ts` changes both sides at once.
-   Bad, because that same edit can break both sides at once. An empty `selectedFields` makes
    the SDK return zero rows.
-   Bad, because the mirroring is a rule, not a type. Nothing fails if a fetcher drifts.

### Confirmation

-   `grep -n isServerFetchedView front/example-app/src/views/CategoryPage.tsx` shows the
    condition `page === 1 && !sortField && filterArray.length === 0`.
-   `grep -n serverFetchedKey front/example-app/src/hooks/useSearch.ts` shows the key, not a
    boolean flag.
-   In review, a change to a hook's request in `src/hooks/` comes with the same change in
    `src/sdk/server.ts`.
