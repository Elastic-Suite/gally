---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Answer a real 404 for a missing page, checked in page.tsx

## Context and Problem Statement

This decision is older than this ADR. It was made in two steps:

-   Commit `43f5c64e` (2026-08-07) made missing entities and unknown locales answer 404. It is
    recorded in [feature-locale-segment-phase2.md](../../specs/feature-locale-segment-phase2.md)
    and [feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md).
-   Commit `e0dfe675` (2026-09-11) moved the existence check from the guard layouts into
    `page.tsx` and `generateMetadata`. It is recorded in
    [feature-catalog-switch-missing-target.md](../../specs/feature-catalog-switch-missing-target.md).

The example app is an SEO demo. What should a URL answer when the product, category, blog
article or locale it names does not exist?

## Decision Drivers

-   A 200 that shows a "not found" view is a soft 404. An SEO demo must not ship one.
-   Serving the default catalog under a wrong URL creates duplicate content.
-   A catalog switch must redirect, not 404, when the page does not exist in the new catalog.
    That decision needs the `?from=` marker, which is a search param.

## Considered Options

-   Real 404 with `notFound()` versus a client "not found" view under a 200
-   Unknown locale: 404 versus a fallback to the default catalog
-   Where to check: guard layouts, `page.tsx` plus `generateMetadata`, or a
    `not-found.tsx` boundary that redirects

## Decision Outcome

Chosen option: a real 404 in every case, decided in `page.tsx` and `generateMetadata`.

-   A missing product, category or blog article calls `notFound()`. A client "not found" view
    under a 200 was rejected as a soft 404.
-   An unknown locale segment answers 404. Falling back to the default catalog was rejected: it
    serves other content under a wrong URL, which gives duplicate content and soft 404s.
-   The existence check lives in `page.tsx` and its `generateMetadata`, through
    `missingInCatalog()` in `src/sdk/catalogSwitch.ts`. A layout cannot read search params,
    because layouts do not rerender on navigation. So it cannot see the switch marker. The guard
    layouts keep the locale check only.
-   A `not-found.tsx` under `app/[locale]` that redirects was tried first. It never rendered.

### Consequences

-   Good, because crawlers get a real 404 status for every missing page.
-   Good, because a catalog switch can redirect, while a direct visit to a junk URL still 404s.
-   Bad, because `page.tsx` and `generateMetadata` must both call `missingInCatalog`. If they
    disagree, one redirects and the other answers 404.
-   Bad, because a `loading.tsx` or Suspense boundary above these routes would stream the
    response, and a streamed response cannot set 404 afterwards.

### Confirmation

These must answer 404 (status from `curl -s -o /dev/null -w '%{http_code}'`):

-   `/example/nope`
-   `/example/com_en/product/NOPE`, `/example/com_en/blog/99999`
-   `/example/com_fr/category/cat_9999?from=not_a_catalog`

`/example/com_fr/category/cat_9999?from=com_en` must answer 307.

## More Information

The app still has no custom 404 page. Adding one means `app/not-found.tsx` at the root or
Next's experimental `global-not-found.js`, not a file under `[locale]`.
