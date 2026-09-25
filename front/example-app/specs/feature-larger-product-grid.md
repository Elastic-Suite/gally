# Feature: Larger product cards, three per row

## Status: implemented
## Page/Component: src/views/SearchPage.tsx, src/views/CategoryPage.tsx (both via `.catalog-page` +
`.products-grid` in src/styles.css), src/components/ProductCard.tsx, src/components/skeletons.tsx

Search results and category listings showed four cards of about 244px per row inside a 1400px page.
The picture was 180px tall, which is small for the merchandising these two pages exist to show. This
widens the page to 1600px and makes the grid three columns of about 392px on a desktop screen.

## Behaviour (testable)
- [x] `.main-content`, `.header-inner` and `.header-search-row` all cap at `--layout-max-width`
      (1600px). They move together, so the brand/nav row and the search band stay aligned with the
      page content underneath.
- [x] `.products-grid` is `repeat(auto-fill, minmax(min(var(--product-grid-column), 100%), 1fr))`.
      The `min(…, 100%)` is load-bearing: a bare `minmax(340px, 1fr)` makes the track 340px wide on
      a 320px phone and the page scrolls sideways.
- [x] Above 1200px viewport the grid raises four variables on itself — column min 340px, picture
      300px, body padding 1.25rem, name 1rem, price 1.15rem. Three columns from about a 1450px
      viewport; the 1600px cap is what stops a fourth ever fitting.
- [x] At 1200px and below every one of those values falls back to the `:root` default, which is
      exactly what the grid had before this change (220px / 180px / 1rem / 0.9rem / 1rem). A tablet
      keeps two cards per row; a phone keeps one.
- [x] The size lives on `.products-grid`, not on `.product-card`. `ProductSlider` on the home page
      and the autocomplete popup render cards outside that grid and are visually unchanged.
- [ ] `.skeleton-card-image` and `.skeleton-card-body` read the same two variables as the real card,
      so `ProductGridSkeleton` grows with it and the loading state does not shift the layout when
      results arrive. **Read in the stylesheet, not observed** — the loading state was never on
      screen long enough to catch in a screenshot.
- [ ] The category page. Only `/search` was opened; the two pages share `.catalog-page` and
      `.products-grid` and nothing else was touched, but the category route was not looked at.

### How it was verified
`docker compose exec example npx tsc --noEmit` clean, container log shows `✓ Compiled` with no `⨯`.
Headless Chrome against `https://gally.localhost/example/com_en/search?q=top` at 1680px (three cards
per row, 392px wide), and at 560px and 390px (two cards and one card, no sideways scroll). The same
narrow shot was taken with the stylesheet stashed and is pixel-identical, which is what rules this
change out as the cause of the pre-existing bug below.

**Pre-existing, not caused here and not fixed here:** at 768px and below, the results start roughly
900px down the page, below an empty gap. Reproduced with this change stashed, so it is older than it.
Cause, found while verifying: the mobile drawer rules are at `src/styles.css:1368`, inside
`@media (max-width: 768px)`, and the base `.facets-sidebar` rule is at `src/styles.css:1387`, *after*
it. Both are `(0,1,0)`; a media query adds no specificity, so the later rule wins and the drawer
keeps `position: sticky` and `height: fit-content` on a phone. It still gets `transform:
translateX(-100%)` and `width: 300px`, which the base rule does not set — so it slides off-canvas as
intended while staying **in flow**, occupying the first row of `.catalog-page` and pushing the grid
below it. Moving the media block after the base rule is the fix. Needs its own bugfix spec.

## SDK contract used
None. This is a stylesheet and comment change only — no query, no `selectedFields`, no page size.
Category pages still request 20 products, which is now 6 rows and a bit instead of 5.

## Tracking (required)
Unchanged. No tracking call is added, removed or moved; `ProductCard`'s markup is untouched apart
from a comment.

## UI constraints
- Six new tokens in `:root`, documented in ../docs/design-system.md: `--layout-max-width`,
  `--product-grid-column`, `--product-card-image-height`, `--product-card-body-padding`,
  `--product-card-name-size`, `--product-card-price-size`. No raw px or font-size outside `:root`.
- No new visual primitive. Same card, same radius, shadow and hover lift, at a different size.
- The desktop block is a `min-width` media query, where the rest of the file uses `max-width`. That
  is deliberate: the small values are the base, so a viewport that was never measured gets today's
  proven layout rather than an untested large one.

## MUST NOT change
- **`.product-card` itself carries no size.** Put the picture height or the body padding back on
  `.product-card` and the home-page carousel and the autocomplete inherit it — the carousel becomes
  a wall of 300px pictures. The variables are set on `.products-grid` for this reason alone.
- **`.skeleton-card-image` and `.product-card-image` must keep reading the same variable.** They
  were both a literal 180px and drifting apart is what causes layout shift; skeletons.tsx says so at
  the top and lists the numbers it depends on.
- **`min(var(--product-grid-column), 100%)`** — do not simplify to `minmax(340px, 1fr)`.
- **The `:root` fallbacks are the pre-existing mobile layout.** Changing them changes phones and
  tablets, which this spec did not touch and did not verify.
- `.catalog-page`'s 280px sidebar, its 768px collapse to a drawer, and the facet responsiveness.
- `.vector-page` (1400px), `.blog-page` (1200px) and `.search-overlay-panel` (1500px) keep their own
  caps. They are set against their own content, not against the page.
- A card still shows exactly one badge (`getProductBadges(...).slice(0, 1)` in ProductCard.tsx).
  The picture got taller, but the reason for one badge is that a stack of pills covers the product.
