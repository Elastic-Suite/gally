---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Put the localized catalog code in the URL and resolve it on the server

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, and
[feature-locale-segment-phase2.md](../../specs/feature-locale-segment-phase2.md) records
it. Commit `db155913` (2026-08-13) added `useAppPathname()`, recorded in
`bugfix-nav-active-locale-pathname.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-nav-active-locale-pathname.md`).

Before, `CatalogProvider` owned the catalog choice. It mounted with nothing, fetched the
catalog list in a `useEffect`, picked a default and kept it in `useState`. The server sent a
page that did not know its catalog, currency or language. A crawler saw no catalog at all.

How does a page know its catalog before it renders?

## Decision Drivers

-   A crawler must get a page that already knows its catalog, currency and language.
-   The UI must never show one catalog while the URL says another.
-   An unknown catalog must not be served under a wrong URL.

## Considered Options

No alternative was recorded.

## Decision Outcome

The URL's first segment is the localized catalog code (`com_fr`, `com_en`, `fr_fr`, and so
on). One segment gives both the catalog and the language. `app/[locale]/layout.tsx` resolves
it on the server and passes the result down as props. Selecting a catalog is a navigation:
it swaps the segment and keeps the rest of the path.

Four rules follow:

-   `CatalogProvider` holds no `useState` for the selected catalog. Next reuses the layout
    across locale changes, so state seeded from props would go stale on a catalog switch.
-   Links go through `src/components/LocaleLink.tsx`, imported as `Link`. Imperative navigation
    uses `useLocaleHref()`. A raw `next/link` drops the segment and resets the visitor to the
    default catalog.
-   `withLocale()` stays idempotent. It runs in more than one layer, so a blind prefix would
    double the segment.
-   Route comparisons use `useAppPathname()`, which strips the segment. A raw `usePathname()`
    returns `/com_en/blog`, never `/blog`. The header nav compared it to `/blog` and never
    highlighted any item.

### Consequences

-   Good, because the server renders the right language: `curl` of `/com_fr/cart` returns
    "Votre Panier", `/com_en/cart` returns "Your Cart".
-   Good, because `/example/nope` returns 404 instead of the default catalog. A fallback would
    create duplicate content and soft 404s.
-   Bad, because every link and every route comparison must go through a helper. The raw Next
    APIs fail silently: the link works but lands on the default catalog, or the highlight is
    just missing.
-   Bad, because `<html lang="en">` in `app/layout.tsx` sits above the segment and is still
    wrong for French catalogs. The spec leaves it to a later SEO phase.

### Confirmation

-   `grep -rn "from 'next/link'" src app` lists only `LocaleLink.tsx`, and
    `NavigationContext.tsx` for `useLinkStatus`.
-   `grep -n useState src/contexts/CatalogContext.tsx` finds only comments.
-   `curl -sI https://gally.localhost/example/nope` returns 404.
-   On `/com_en/blog`, the Blog link in the header has `aria-current="page"`
    (set in `src/components/SectionLinks.tsx`).

## More Information

`CatalogContext`, `ScrollToTop` and `BlogPage` read the raw `usePathname()` on purpose. The
first rewrites segment 1, the second uses it as a change key, the third pushes it back into
the router.

`src/components/SearchExplain.tsx` still compares the raw pathname. The fix was left out
because it would switch a dormant panel back on.
