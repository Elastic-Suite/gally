# Feature: Category trail — wrapped nav layout, ancestor highlight, clickable breadcrumb

## Status: implemented
## Page/Component: src/components/CategoryNav.tsx, src/views/CategoryPage.tsx, src/styles.css (`.category-nav-*`, `.breadcrumb`), src/locales/{en,fr,de}/{common,category}.json

The breadcrumb markup written here was extracted to `src/components/Breadcrumb.tsx` when the PDP
gained the same treatment — `feature-pdp-breadcrumb-trail.md`. The behaviour below is unchanged;
`CategoryPage` now hands its trail to that component.

Three faults reported together on the `toolbox` catalog, which is the first demo catalog with
twelve top-level categories and therefore the first one whose nav bar wraps to two rows.

## Problem

1. **Two rows of nav items overlapped.** `.category-nav-list` wraps (`flex-wrap: wrap`, from
   `feature-category-nav-root.md`, which moved the overflow handling here to stop the hover
   submenu being clipped), but `.category-nav-item a` was an **inline** element carrying
   `padding: 0.5rem 1rem`. Vertical padding on an inline box does not grow the line box, so each
   pill painted about 8px above and below its own row while the `<li>` flex item stayed one text
   line tall. With one row the `.category-nav` block padding absorbed it and it looked correct;
   with two rows the row-1 pills overlapped the row-2 text, and hover backgrounds bled across
   rows. `gap: 0` left no room either. The wrong belief was that the flex item's height accounted
   for the link's padding.
   The same wrap made the hover flyout open *inside* the bar: `top: 100%` of its own `<li>` puts
   it just under a first-row pill, on top of the second row's category names.
2. **No ancestor highlight.** `CategoryNav` compared `activeCode === cat.id` per item, which only
   ever matches the top-level item itself. Browsing `Power Tools > Drills & Drivers` lit up
   nothing in the bar, so the bar showed no trace of where the visitor was. The tree is two real
   levels deep after `fetchCategoryTree()` flattens the root, so this hits every subcategory page.
3. **Breadcrumb was one unclickable string** built from `category.breadcrumb`
   ("Home / Categories / {{name}}"). It named a "Categories" page that does not exist, skipped the
   parent category entirely, and disagreed with the `BreadcrumbList` JSON-LD the server route
   already emits from the real trail (`app/[locale]/category/[code]/page.tsx`).

`findTrail()` in `src/sdk/categoryTree.ts` already answered "what is the ancestor chain" for the
route guard, `generateMetadata` and the JSON-LD. All three fixes here reuse it, so the visible
breadcrumb, the nav highlight and the structured data now derive from one function.

## Behaviour (testable)
- [x] The nav bar wrapped over two (or more) rows draws one clear row per line: no pill overlaps a
      neighbouring row, and hovering an item in row 1 does not paint over row 2.
- [x] A flyout hangs directly off the item hovered (`top: 100%` of its `<li>`), on both rows. On a
      wrapped bar it therefore paints over part of the row underneath, which is accepted: a menu
      that is not attached to its own category is worse than one that covers a neighbour.
- [x] Hover is handled on the `<li>`, so moving the pointer from the pill into the flyout does not
      close it, and leaving the item closes it immediately.
- [x] Viewing a subcategory gives its ancestor in the top bar the same `--indigo-50` pill as an
      active item (class `in-trail`), so the section is visible without hovering.
- [x] The exact category being viewed is bolder than an ancestor (weight 600) and carries
      `aria-current="page"` — top-level item and submenu row alike.
- [x] Every subcategory row in an open submenu highlights when it is the one being viewed, at any
      depth, because membership is tested against the trail rather than one hardcoded level.
- [x] The category page breadcrumb reads `Home / <ancestors…> / <current>`, every part but the last
      a link: Home to the catalog home, each ancestor to its own category page.
- [x] The last part is not a link and carries `aria-current="page"`.
- [x] Breadcrumb links inherit the breadcrumb's grey rather than the global `--indigo-600` link
      colour, and underline on hover, so the line still reads as a breadcrumb and not as a row of
      buttons.
- [x] A category id that is in the URL but not in the tree (only reachable client-side, the route
      guard 404s otherwise) still renders `Home / <name-or-id>` rather than a bare "Home".

## SDK contract used
- No new SDK or GraphQL call. `findTrail(categories, code)` over the `ICategoryNode[]` that
  `CatalogProvider` already holds — the same array `CategoryNav` renders from. `CategoryPage`'s
  private `findCategory()` helper is gone: the trail's last entry is that node.

## Tracking (required)
- Unchanged. `trackCategoryView` still fires from `CategoryPage`'s effect on `code`, and every
  breadcrumb/nav link is a normal navigation to `/category/<id>`, which fires it on arrival.

## UI constraints
- Tokens only: `--indigo-50`, `--indigo-700`, `--coral-500`, `--gray-500`, `--gray-700`,
  `--radius-pill`. No new hex, px or font-size.
- No new visual primitive. The ancestor state reuses the existing active pill; the breadcrumb
  reuses the existing `.breadcrumb` class and adds only anchor and separator rules.
- Two new classes, both states of existing elements: `.category-nav-item a.in-trail` and
  `.breadcrumb-sep`.

## MUST NOT change
- `.category-nav`, `.category-nav-list` and `.category-nav-item` must keep `overflow` unset on
  both axes and the list must keep wrapping instead of scrolling — any non-`visible` axis on an
  ancestor re-clips the hover submenu (`feature-category-nav-root.md`, still the reason the bar
  wraps at all).
- The flat horizontal top-level bar, one `<CategoryItem>` per top-level entry, root category
  first as a childless link.
- Submenu rendering stays gated on `cat.children?.length > 0`, and stays hover-driven and closed
  by default. It is deliberately **not** auto-opened for the active branch: the panel is absolutely
  positioned over page content, and holding it open would cover the first row of products.
- **The flyout stays anchored to its own item.** `.category-nav-submenu` keeps `top: 100%` of the
  `<li>`; do not reposition it against the bar. Built and rejected on review: a variant measured
  the distance from the hovered item to the bar's bottom edge, published it as a `--submenu-drop`
  custom property and dropped the menu below the whole bar, with a transparent `::before` hover
  bridge over the gap so the pointer could still reach it. It did keep every category readable
  while a menu was open, and it was rejected anyway — reported as "the sub menu is not correctly
  positioned, it stays under the whole menu bar instead of the real highlighted item". Covering the
  row underneath is the accepted cost of the menu belonging visibly to the item hovered.
- The hover handlers stay on the `<li>`, whose subtree contains the flyout. On the `<a>` instead,
  moving into the menu fires mouseleave and closes it.
- The `.breadcrumb` rules are keyed on anchors and the new separator span, so the plain-text
  breadcrumbs on search, blog, CMS, product and vector-search pages keep rendering exactly as
  before. `.page-title .breadcrumb` keeps its `0.8rem` / `--gray-500` / one-line box, which is what
  `CategoryPageSkeleton`'s first line stands in for.
- `common:meta.home` is shared with the JSON-LD breadcrumb via `tServer`; it must stay in all three
  locales.
