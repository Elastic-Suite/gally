# Bugfix: Facets sidebar had a double border on the search results page

## Status: implemented
## Page/Component: src/views/SearchPage.tsx, src/components/Facets.tsx

## Problem
`Facets.tsx` already renders its own root element as `<aside className="facets-sidebar">` (both in the loading
skeleton and the main return). `SearchPage.tsx` additionally wrapped its `<Facets>` usage in
`<div className={`facets-sidebar ${facetsOpen ? 'open' : ''}`}>`, nesting two elements carrying the same
`.facets-sidebar` class. Since that class sets `background`, `border-radius`, `padding`, and `box-shadow`
(used to simulate a border), stacking it twice produced a visibly doubled border/shadow line around the
sidebar — only on the search results page. `CategoryPage.tsx` renders `<Facets>` directly with no wrapper and
never had this problem.

## Behaviour (testable)
- [x] `SearchPage.tsx` no longer wraps `<Facets>` in an extra `.facets-sidebar` div — it renders `<Facets>`
      directly, matching `CategoryPage.tsx`.
- [x] The mobile off-canvas toggle (`facetsOpen` state, was applying the `.open` class to the now-removed
      wrapper div) is passed through a new `open` prop on `Facets`, which applies `open ? 'open' : ''` to the
      actual `<aside className="facets-sidebar">` element in both its render paths (loading skeleton and main
      return) — so `.facets-sidebar.open`'s mobile slide-in transform still works.

## UI constraints
- No new CSS — reuses the existing `.facets-sidebar`/`.facets-sidebar.open` rules exactly as before, just
  applied to one element instead of two nested ones.

## MUST NOT change
- `CategoryPage.tsx`'s `<Facets>` usage — already correct, untouched.
- `Facets.tsx`'s internal structure/behavior (facet groups, active-filter chips, show-more) — only the root
  element's className gained the `open` prop, nothing else.
