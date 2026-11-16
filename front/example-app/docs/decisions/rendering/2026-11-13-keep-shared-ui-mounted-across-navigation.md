---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Keep shared UI mounted across navigation and refetches

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, and it is recorded
in
[feature-persist-shared-ui-across-navigation.md](../../specs/feature-persist-shared-ui-across-navigation.md).
Commit `ea293de4` (2026-09-25) later moved the nav into the header, recorded in
[feature-header-light-two-row.md](../../specs/feature-header-light-two-row.md).

In the App Router, a page component is torn down and rebuilt on every navigation. Only layouts
that stay matched are kept. `CategoryNav` was rendered inside `CategoryPage`, so on every
category click:

-   the open submenu (`useState` in `CategoryItem`) was lost;
-   the bar re-rendered with unchanged data;
-   it sat inside the `loading.tsx` boundary, so the shared bar blinked out behind a skeleton.

`Facets` had the same problem one level down. While loading, it returned `<FacetsSkeleton />`
early, which is a different `<aside>`. Every facet toggle, sort change and page change replaced
the whole sidebar.

## Considered Options

-   Render `CategoryNav` in the page component
-   Render `CategoryNav` in a layout above the page

No other alternative was recorded.

## Decision Outcome

Chosen option: "Render `CategoryNav` in a layout above the page", because a layout stays mounted
across category navigations. It went in `app/[locale]/category/layout.tsx`, above `[code]`, so it
does not depend on how Next handles a layout whose own params changed. `CategoryNav` reads the
active category from `useParams()` and takes no props.

Since `ea293de4` it lives in `Header`, in the app shell, so no navigation swaps it out. The
category layout is deleted.

`Facets` follows the same rule: the `<aside>` and its `<h3>` always render, and only the rows
inside swap to `FacetsSkeletonBody`.

### Consequences

-   Good, because the nav renders once, and the bar stays on screen during a navigation.
-   Good, because the facets sidebar keeps its box, heading and sticky offset during a refetch.
-   Bad, because the claims "submenu state survives" and "the sidebar no longer remounts" are not
    machine-verified. The spec says checking them needs React DevTools or a real browser.

### Confirmation

-   `grep -n 'return <FacetsSkeleton' front/example-app/src/components/Facets.tsx` prints nothing.
-   `CategoryNav` is rendered from `Header.tsx`, not from a page or view component.
-   By hand: open a submenu, click another category, and check it stays open.

## Pros and Cons of the Options

### Render `CategoryNav` in the page component

-   Bad, because it remounts on every navigation, drops submenu state, and blinks out behind the
    skeleton.

## More Information

`FacetsSkeleton` and `Facets` must keep the same `<aside>`/`<h3>` shell, or the two states will
differ in height.
