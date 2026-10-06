# Feature: category hero banner

## Status: implemented

## Page/Component: src/views/CategoryPage.tsx (and `CategoryPageSkeleton` in src/components/skeletons.tsx)

The title block of a category page used only the left third of the width. The rest of the band
stayed empty. Variant E of the mockup study `mockups/category-title-band` was chosen: the title
block becomes a small banner holding the subcategories and three product photos.

## Behaviour (testable)

- [x] The breadcrumb stays above the banner, as on every other page (`.page-title .breadcrumb`).
      The banner under it is a rounded card with a light indigo gradient: a larger title and the
      "N products in this category" line on the left.
- [x] Under the count, one chip per subcategory that has products, with its product count. Each
      chip is a link to that subcategory's page (`/category/<id>`, through `LocaleLink`).
- [x] A subcategory with 0 products gets no chip. A category with no subcategories shows no
      chip row at all. (Leaf seen on Littérature classique. No 0-product subcategory exists in the
      demo data, so the filter itself was not seen working.)
- [ ] The chips come from the category tree (`category.children`), not from the Catégorie
      facet. Applying a filter or a sort does not change them.
- [x] Three product photos are fanned on the right of the banner, picked at random from the
      products on screen. The route shell draws `heroSeed` per request and `seededPick()` uses
      it, so the server and the browser pick the same three (no hydration mismatch) and a reload
      shows a different three. Changing page, sort or filter picks from the new products; the
      old photos stay while the next page loads.
- [x] The three banner photos unfold from their top edge, 120ms apart, ending on their fan tilt
      (`--fan`, `heroPhotoUnfold`). It plays whenever a new pick mounts: category load, and a
      new page, sort or filter that changes the pick. The product grid itself does not animate.
      Off under `prefers-reduced-motion`.
- [x] The photos are decoration: `alt=""`, and the block is `aria-hidden`.
- [ ] The chip row has an accessible name in all three locales (`category.subcategories`).
- [x] At 768px and below, the photos are hidden and the chips scroll sideways in one row.
- [x] `CategoryPageSkeleton` draws the same banner with a chip row, so the page does not jump
      when the real one arrives.

## SDK contract used

- No new request. The chips read the tree `CatalogProvider` already holds (`ICategoryNode`:
  `id`, `name`, `count`, `children`). The photos read `initialData.products` through
  `getProductFields()`.

## Tracking (required)

- Unchanged: category view and display tracking fire exactly as before. The chips are plain
  links; the subcategory page they open tracks its own category view.

## UI constraints

- The chips are `.filter-chip` + `.filter-chip-count`, the browse-chip idiom the blog already
  uses (`docs/design-system.md`). No second chip style. They are light indigo, not the white
  chips of the mock.
- The photos go through `ProductImage`, so a missing file shows the shared placeholder.
- The banner styles hang off `.page-title.category-hero`. Tokens only.

## MUST NOT change

- Every other page's `.page-title` (search, blog, CMS, cart, product, explain, closing). The
  banner is scoped to `.category-hero`.
- The products toolbar above the grid (count + sort select) and its behaviour.
- The sidebar facets, the Catégorie facet included.
- Category view and display tracking.
- The JSON-LD (`BreadcrumbList`, `CollectionPage`) emitted by the route shell.
- The header category nav (`specs/feature-category-trail-nav-and-breadcrumb.md`).
- The `<h1>` stays the category name.
- The breadcrumb sits outside the banner, above it. It was inside in the first version and moved
  out on review, so it reads the same as on every other page.
- The product grid does not animate. An unfold on the cards was built and dropped on review:
  the animation belongs to the banner photos only.
- The photos' fan tilt stays in `--fan`: the unfold keyframes compose with it, so setting
  `transform` directly on a photo would make the animation end on the wrong tilt.

## Verification

- Captured Livres, Papeterie, Livres at 390px and a chip click against variant E of
  `mockups/category-title-band`: the layout matches it, apart from the chips being `.filter-chip`.
- The chip click opened Romans & littérature, which showed its own chips and photos.
- The skeleton banner ends within about 3px of the real one, with the breadcrumb above it.
- `tsc --noEmit` and eslint pass in the container; no new log errors.
- Random photos: over 8 loads the photo URLs in the server HTML and in the hydrated page were
  the same each time, a different three per load, and no hydration warning. A sort and page 2
  each picked new photos from the new products.
- Photo unfold, checked with `getAnimations()`: all three photos run `heroPhotoUnfold` after a
  chip click, the product cards run nothing, and at rest the photos sit on the same +-8deg fan as
  before. A capture with animations slowed tenfold shows them unfolding in turn. Reduced motion
  not checked.
- Two hydration warnings were seen in the first runs, while the dev server was recompiling these
  edits. None from the category page since, across 19 loads. The cause was not proven.
- **Not checked:** the chips staying unchanged after a sort or filter (follows from the code,
  not seen); the English and German `subcategories` strings (only French was seen in
  the server HTML).

## Not done

- A category with no subcategories still shrinks by one chip row when the page replaces the
  skeleton. The skeleton cannot know in advance whether the category has children.
- At 390px the category page was already broken before this change (header selects overflow,
  the filters sidebar bleeds in from the left, no product cards below "Filtres"). Not addressed.
