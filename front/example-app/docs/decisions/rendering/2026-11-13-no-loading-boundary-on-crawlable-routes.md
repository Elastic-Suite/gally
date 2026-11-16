---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Give navigation feedback from the client, not from loading.tsx

## Context and Problem Statement

This decision is older than this ADR. Commit `db155913` (2026-08-13) made it. It is recorded in
`bugfix-ssr-product-list-behind-suspense.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-ssr-product-list-behind-suspense.md`),
and it reverses the mechanism of
[feature-navigation-loading-feedback.md](../../specs/feature-navigation-loading-feedback.md).

The category, product, blog post and search routes had a `loading.tsx` each. It was added so a
click showed a skeleton instead of a frozen page. But `loading.tsx` is a Suspense boundary, and a
boundary changes how the first HTML document is built. React sends the fallback first, streams
the real page at the end of the response inside `<div hidden id="S:0">`, and swaps them with an
inline script.

With JavaScript disabled, the category page showed a title, a breadcrumb and JSON-LD for 20
products, but no products. A crawler that does not run JavaScript saw the same thing.

How do we keep click feedback without hiding crawlable content behind a boundary?

## Decision Drivers

-   Product lists must be in `<main>` of the first response, visible without JavaScript.
-   A click must still give feedback while the server fetches the next page.
-   Fast navigations must show no placeholder at all.

## Considered Options

-   Keep `loading.tsx` on each route
-   Keep the boundary, but render its fallback only on the client
-   Remove the boundaries and show the pending state from the client

## Decision Outcome

Chosen option: "Remove the boundaries and show the pending state from the client", because it is
the only option that puts the product list inline in the first response.

The pending state lives in `src/contexts/NavigationContext.tsx`:

-   `LinkPendingReporter` calls `useLinkStatus()`. It must sit inside a `<Link>`; `LocaleLink` puts
    one in every link.
-   `useNavigate()` wraps `router.push` in `startTransition`, so imperative navigation (header
    search, catalog switch) also has a pending state.
-   `AppShell` swaps the children of `<main>` for `RouteSkeleton` and sets `data-navigating`.
-   The skeleton shows only after `SHOW_AFTER_MS = 150`.

### Consequences

-   Good, because the four routes send zero skeleton bytes, no `<div hidden>` and no `$RC` script.
-   Good, because a click still shows a skeleton: 253 ms category to category, 1591 ms for a
    header search.
-   Bad, because back and forward show no feedback. `useLinkStatus()` cannot see them.
-   Bad, because the layout shift of the skeleton swap was never measured.
-   Neutral, because nothing in the build or the types fails if a `loading.tsx` comes back.

### Confirmation

-   `find front/example-app/app -name loading.tsx` prints nothing.
-   `curl -s https://gally.localhost/example/com_fr/category/cat_11 | grep -c 'hidden id="S:'`
    prints 0.

## Pros and Cons of the Options

### Keep `loading.tsx` on each route

-   Good, because a click shows a skeleton with no client code.
-   Bad, because the page body moves into a hidden div, so it is invisible without JavaScript.

### Keep the boundary, but render its fallback only on the client

Tried first, as `RouteFallback`.

-   Bad, because the hidden-div swap stays. The grid was still at byte 22256, outside `<main>`.

## More Information

The same change gave `/search` a server fetch (`fetchSearchProducts`), which it never had.
`RouteSkeleton` first redrew `CategoryNav` for category targets. That stopped when the nav moved
into the header; see
[2026-11-13-keep-shared-ui-mounted-across-navigation.md](2026-11-13-keep-shared-ui-mounted-across-navigation.md).
