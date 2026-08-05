# Feature: Category nav — root category link + hover submenu fix

## Status: implemented
## Page/Component: src/components/CategoryNav.tsx, src/sdk/catalogs.ts (`fetchCategoryTree`), src/styles.css (`.category-nav`)

## Behaviour (testable)
- [x] The nav bar's leading item is the catalog's root/default category (e.g. "Default Category", whatever
      `getCategoryTree`'s single root node is named) — a plain link to `/category/<rootId>`, no submenu
      (the root's own children are surfaced as the *following* nav items, not nested under it — see below).
- [x] `fetchCategoryTree()` no longer discards the API's root node. When the tree is the usual single-root
      shape (`[{ ...root, children: [...] }]`), it now returns `[rootWithoutChildren, ...rootChildren]` — the
      root as its own childless entry, followed by its former children as siblings. This matches the flat
      top-level nav bar this app already renders (`CategoryNav` maps one `<CategoryItem>` per top-level
      entry) while still exposing the root as a browsable link, unlike `main`'s app which nested everything
      under a single collapsible root menu item (different nav paradigm — see the sidebar-drawer vs
      horizontal-bar difference already tracked in `missing-features.md` §4).
- [x] Hovering any nav item that still has real children (e.g. Bottoms, Accessories, Tops, Shop The Look)
      shows its submenu fully — previously the dropdown was invisible/clipped on hover.
- [x] Every subcategory in an open submenu is fully visible on hover, not just the first line — the submenu
      must never be truncated by a scrolling/clipping ancestor, regardless of how many top-level categories
      are in the nav bar or how narrow the viewport is.
- [x] `Homepage.tsx`'s "Trending Now" (`categories[0]`) and `ProductPage.tsx`'s recommendations
      (`categories[0]`) now browse the *true* root category rather than whatever first real subcategory
      happened to be at index 0 before this fix — no code change needed there, this was an intended side
      effect of restoring the root to the array (see `docs/sdk-reference.md`'s root-category-browse gotcha).

## Root cause (submenu hidden)
`.category-nav` set `overflow-x: auto` without an explicit `overflow-y`. Per the CSS overflow spec, leaving
one axis at its default (`visible`) while the other is non-`visible` makes the browser compute the default
axis as `auto` too — so the container clipped anything extending below it, including the absolutely
positioned `.category-nav-submenu` dropdown (`position: absolute; top: 100%`). This is a clipping bug, not a
stacking-order one — raising `z-index` alone would not fix it.

A first attempted fix (explicitly declaring `overflow-y: visible` alongside `overflow-x: auto`) does **not**
work: the spec quirk above still forces `overflow-y` back to `auto` whenever `overflow-x` is non-`visible` on
the same element, no matter how `overflow-y` is declared. The dropdown was still clipped.

Actual fix: removed `overflow-x`/`overflow-y` from `.category-nav` entirely (no axis on this element is ever
non-`visible`), and moved the "too many categories" handling to `.category-nav-list` via `flex-wrap: wrap`
instead of horizontal scrolling. Wrapping to a second line avoids overflow clipping altogether, since the
submenu is a DOM descendant of `.category-nav-list`/`.category-nav-item` — any scrolling ancestor at any level
would still have clipped it, so removing the scroll behavior (rather than relocating it) was required.

## SDK contract used
- No new SDK/GraphQL calls. `getCategoryTree(catalogId, localizedCatalogId)` response shape is unchanged;
  only how `fetchCategoryTree()` maps it changed.

## Tracking (required)
- No new tracking event. Clicking the root category link navigates to `/category/<rootId>`, which fires the
  existing `trackCategoryView` on `CategoryPage.tsx` exactly like any other category.

## UI constraints
- No new CSS classes. `.category-nav` carries no `overflow` declaration on either axis. `.category-nav-list`
  uses `flex-wrap: wrap` (not `overflow-x: auto`/scroll) so an overflowing row of categories wraps to a second
  line instead of scrolling.

## MUST NOT change
- The flat horizontal top-level nav bar layout (not reverting to a single collapsible root menu item, which
  was `main`'s different, sidebar-drawer-based paradigm).
- Submenu rendering for categories that have real children — still gated on `cat.children?.length > 0`.
- No ancestor of `.category-nav-submenu` (`.category-nav`, `.category-nav-list`, `.category-nav-item`) may
  set `overflow-x`/`overflow-y` to anything other than `visible` — any non-`visible` axis on an ancestor
  re-clips the hover submenu, regardless of which element it's declared on.
