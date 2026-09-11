# Feature: PDP breadcrumb — the product's real category path, clickable

## Status: implemented
## Page/Component: src/views/ProductPage.tsx, src/components/Breadcrumb.tsx (new), src/sdk/categoryTree.ts (`productCategoryTrail`), app/[locale]/product/[sku]/page.tsx (BreadcrumbList), src/locales/{en,fr,de}/product.json

Follows `feature-category-trail-nav-and-breadcrumb.md`, which made the category page's
breadcrumb clickable. The PDP was still the flat string
`page.breadcrumb` = "Home / Products / {{name}}": nothing to click, and it named a "Products"
page that does not exist — the header's Products tab goes to the first category. The route's
`BreadcrumbList` JSON-LD said the same short thing (`Home > <product>`), with "Home"
hardcoded in English.

## Behaviour (testable)
- [x] The PDP breadcrumb reads `Home / <category path> / <product name>`, e.g.
      `Home / Accessories & Consumables / Drill Bits / HSS step drill bit 4-32 mm`.
- [x] Home and every category part is a link; the product name is not, and carries
      `aria-current="page"`.
- [x] Clicking a part opens that category page — verified with Playwright: the last part of
      `TBX-ACC-FO-012`'s breadcrumb lands on `/toolbox_en/category/cat_tbx_25`, h1 "Drill Bits".
- [x] Identical whether the PDP is server-rendered (full reload) or reached by clicking a product
      card (client navigation): both read `source.category` and the tree
      `CatalogProvider`/`cachedCategoryTree` already hold. No hydration warning either way.
- [x] The route's `BreadcrumbList` JSON-LD lists exactly the same path, from the same function,
      with "Home" translated through `tServer` like the category route already did.
- [x] All three locales: `Startseite / Zubehör & Verbrauchsmaterial / Bohrer / …` on `toolbox_de`,
      `Accueil / Robes / …` on `com_fr`.

## Which category, when a product has several
`productCategoryTrail()` picks the **deepest** assignment — the one with the longest ancestor
chain — because `source.category` lists every category a product is in, ancestors included, in
index order.

The root is held back as a fallback rather than compared on depth, and that is the part worth
keeping: **every** product is assigned to the root, and `fetchCategoryTree()` lifts the root's
children to the top level (`feature-category-nav-root.md`), so a top-level category has a trail
one node long — exactly like the root. The root then won the tie by coming first in the index
order, and a dress assigned to both read "Home / Default Category / Claudia Crochet Dress" while
"Dresses" sat right there in the same list. It is used only when the product has no other
category in the tree.

## SDK contract used
- No new SDK or GraphQL call. `source.category` comes from the raw `_source`, which this route
  already requests via `PRODUCT_DETAIL_FIELDS` (both `fetchProductBySku` and `ProductPage`'s
  `useSearch`) for `type_id` and `configurable_attributes`. Anywhere `source` is absent the
  function returns `[]` and the breadcrumb is just `Home / <product>`.
- The route reads the tree through `cachedCategoryTree()`, a `cache()`d fetch the locale layout
  has already made, so the PDP costs no extra request.

## Tracking (required)
- Unchanged. `trackProductView` still fires from `ProductPage`'s effect on the sku; breadcrumb
  parts are ordinary navigations to `/category/<id>`, which fire `trackCategoryView` on arrival.

## UI constraints
- No new visual primitive and no new CSS: the same `.breadcrumb` / `.breadcrumb-sep` rules the
  category page uses.
- `src/components/Breadcrumb.tsx` is the shared component both pages now render — the second
  copy of that markup was the signal to extract it (golden rule 3). It renders the Home link
  itself, since every path starts there, and takes the rest as `{ name, href? }` parts.

## MUST NOT change
- `Breadcrumb` renders the **last** part as plain text even when it carries an `href`. Both call
  sites rely on it: `CategoryPage` maps its whole trail to links and lets the component drop the
  last one.
- The pages with no path to build from — search, blog, CMS, vector search — keep their
  `<div className="breadcrumb">{t(...)}</div>` and their own translated strings. Do not "finish
  the job" by pushing them through `Breadcrumb`: `Home / Search` has no second part, and a blog
  post's path is not a category trail.
- The root-as-fallback rule above. Removing it silently returns the app to
  "Home / Default Category / <product>" on every product that sits in a top-level category.
- `product.page.breadcrumb` is gone from all three locales. `search.page.breadcrumb` is a
  different key in a different namespace and is still in use by `SearchPage`.
- `.page-title` on the PDP still holds the breadcrumb and no `h1`, which is what
  `ProductPageSkeleton`'s single first line stands in for (`src/components/skeletons.tsx`).
