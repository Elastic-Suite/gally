# Feature: keep shared UI mounted across same-type navigation

## Status: implemented
## Page/Component: `app/[locale]/category/layout.tsx`, `src/components/CategoryNav.tsx`

## Problem

`CategoryNav` was rendered **inside** `CategoryPage`, i.e. inside the page component. In the App
Router only the segments below the layouts that stay matched are re-rendered on navigation — so a
page-level component is torn down and rebuilt on every category → category click. Three consequences:

1. `CategoryItem`'s `useState(open)` (the submenu) was destroyed on every navigation.
2. The bar re-rendered even though its data (`categories`, from `CatalogContext`) had not changed.
3. Worse after `loading.tsx` landed: the nav sat *inside* the Suspense boundary, so it was replaced
   by a skeleton on every navigation — the shared chrome visibly blinked out and back.

## Fix

Moved it to `app/[locale]/category/layout.tsx`, above the `[code]` segment. It now renders once and
stays mounted across every `/category/*` navigation, and — being above `[code]/loading.tsx` — stays
on screen during the fetch instead of being skeletonised.

Placed above `[code]`, not at `[code]/layout.tsx`, so it unambiguously persists across different
category ids rather than relying on how Next reconciles a layout whose own params changed.

`CategoryNav` lost its `activeCode` prop and now reads `useParams()` itself, because this layout's
segment does not contain `[code]`. That also keeps the homepage's `<CategoryNav />` correct with no
prop and no active item.

`CategoryNavSkeleton` was deleted from `CategoryPageSkeleton`: drawing a skeleton for a component
that no longer unmounts would be a *second* nav appearing below the real one.

## Behaviour (testable)
- [x] Exactly one `<nav class="category-nav">` per page, server-rendered
- [x] The nav streams **before** the Suspense fallback, i.e. it is outside the boundary
- [x] The fallback region contains the 7 real nav items, not skeleton bars, and still contains the
      card grid and facets sidebar
- [x] Active highlight still correct via `useParams()`: `/category/cat_14` → `cat_14`,
      `/category/cat_11` → `cat_11`, `/com_fr/category/cat_14` → the `com_fr` URL, homepage → none
- [x] After hydration: 1 nav, 12 products, 0 leftover skeletons, no hydration mismatch
- [x] `/category/cat_9999` still 404s (the `[code]/layout.tsx` guard is unaffected)
- [ ] **The "no longer re-renders / submenu state survives" claim is not machine-verified.** It
      follows from where the component now sits in the tree, but confirming it needs React DevTools
      or opening a submenu and clicking another category in a real browser.

## Already correct, checked while here
`Header` and `Footer` live in `AppShell`, which is rendered from `app/[locale]/layout.tsx` — already
a layout, so they were never re-mounting per page. `Facets` legitimately re-renders: its
aggregations change with the query. Nothing else was shared across sibling routes; the homepage's
`CategoryNav` is on a different segment and cannot share this layout.

## MUST NOT change
- **Do not move `CategoryNav` back into a page component.** It looks equivalent and is not: it
  remounts per navigation, discards submenu state, and re-enters the Suspense boundary so it blinks
  out behind the skeleton.
- **Do not re-add a nav skeleton to `CategoryPageSkeleton`** — the nav is above the boundary and
  stays visible, so a skeleton there renders a duplicate bar.
- Keep `CategoryNav` prop-less. Reintroducing `activeCode` would force the layout to know `[code]`,
  which its segment does not have.

---

## Follow-up: stable shells for containers whose content changes

Same principle one level down. `Facets` did an early `return <FacetsSkeleton />` while loading,
which swapped the **entire `<aside>`** — box, shadow, padding, sticky offset and heading — for a
different `<aside>`, even though none of that depends on the results. This fires constantly: every
facet toggle, sort change and page change on both the category and search pages triggers a client
refetch.

Now the `<aside>` and its `<h3>` render unconditionally and only the rows below swap:

```
<aside className="facets-sidebar …">
  <h3>{t('title')}</h3>
  {showSkeleton ? <FacetsSkeletonBody /> : <>…chips + facet groups…</>}
</aside>
```

`FacetsSkeleton` (still used by `category/[code]/loading.tsx`, which runs before `Facets` exists at
all) now composes the same `FacetsSkeletonBody` inside an identical shell, so the two states are the
same height and the route-level fallback and the in-component one cannot drift.

The early-return's reasoning was preserved, not dropped: `showSkeleton` is still keyed on
`visibleAggregations` rather than raw `aggregations`, which is what stops the "no filters" message
flashing mid-request on a reload whose stale aggregations all turn out non-discriminant.

### Checked and deliberately left alone
- **`SearchPage` was already correct** — its `products-header` (count + sort) renders
  unconditionally and only the count text and the grid swap. It was the model for this change.
- **The product / blog grids are already stable.** `ProductGridSkeleton` and the real branch both
  render `<div className="products-grid">` at the same position, so React reconciles the container
  and replaces only its children. Same for `blog-grid`.
- **`ProductPage` and `BlogPostPage` keep their whole-page `if (loading)` early return.** Their
  shells are stable too, but since Phase 3 those branches are close to dead code: `sku` and `id`
  come from route params, so navigating between products is a route change served by the server
  with `loading.tsx`, not a client refetch. Restructuring a 175-line component for a branch that
  rarely runs is not worth the regression risk. **If either page ever gains a client-side way to
  change its entity without a navigation, revisit this.**

### Verified
Post-hydration: exactly one `<aside class="facets-sidebar">`, one `<nav class="category-nav">`,
12 product cards, 0 leftover skeletons, no hydration mismatch. All routes still 200,
`/category/cat_9999` still 404, `tsc --noEmit` clean.

**Not verified:** that the sidebar visibly stops remounting during a filter change — that needs
React DevTools or the eye, same limitation as the rest of the client-transition work here.

### MUST NOT change (additions)
- **Do not restore an early `return` from `Facets` for the loading state.** It reads as simpler and
  silently remounts the whole sidebar on every filter interaction.
- `FacetsSkeleton` and `Facets` must keep rendering the **same** `<aside>`/`<h3>` shell; if one
  gains a wrapper the other must too, or the route fallback and the component state will differ in
  height.
