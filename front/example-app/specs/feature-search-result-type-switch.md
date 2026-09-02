# Feature: Search results type selector — centered segmented switch, "Products / Articles"

## Status: implemented
## Page/Component: src/views/SearchPage.tsx, src/styles.css, src/locales/{en,fr,de}/search.json

The selector that chooses which of the two indices a query's results come from was a
left-aligned pair of underline tabs labelled "Products / Blog". It is now a centered
segmented switch with icons, labelled "Products / Articles".

## Behaviour (testable)
- [x] Centered above the results, via a `.result-type-switch-row` flex wrapper.
- [x] Reads as a switch: pill track in `--gray-100`, selected segment raised as a
      `--white` pill with `--shadow-sm` and `--indigo-800` text; unselected is
      transparent with `--gray-600` text.
- [x] **The thumb slides between the two segments** (280ms,
      `cubic-bezier(0.4, 0, 0.2, 1)`) instead of appearing instantly.
- [x] Each segment carries an icon — 🛍️ Products, 📰 Articles — following the app's
      existing emoji idiom (🛒 ☰ 🔍 ✎ are already in use). Icons are
      `aria-hidden`, so the accessible name stays the label alone.
- [x] Labels are "Products" / "Articles" in all three locales (`page.typeProducts`,
      `page.typeBlog`).
- [x] The count badge stays on both segments, including a `0` — see MUST NOT change.
      Inactive badge moved `--gray-100` → `--gray-200`, because the track is now
      `--gray-100` and the badge would otherwise vanish into it.
- [x] Selected segment keeps its colour on hover: `.result-type-tab.active` is
      declared after `.result-type-tab:hover` and they have equal specificity.
- [x] Verified rendered in the container at 1400px and 420px — centered and intact at
      both, no wrap. One screenshot covers both visual states at once (Products
      selected, Articles not).

## The slide
- The moving part is a single `.result-type-tabs::before` pseudo-element behind both
  segments. The selected segment deliberately paints **no** background or shadow of its
  own — with a background per segment there is nothing continuous to animate, only two
  things cross-fading.
- Animated with `transform: translateX()` only, never `left`/`width`, so it runs on the
  compositor and cannot reflow the results row beneath it.
- **The track is `inline-grid` with `1fr 1fr` columns, so both segments are the same
  width** (that of the wider one). This is what makes the slide a pure-CSS, one-column
  translate — `translateX(calc(100% + 0.25rem))`, where `100%` is the thumb's own width
  — and it stays exact in every locale, with no JS measurement. Equal-width segments are
  a visible consequence of the effect, not an independent styling choice.
- `data-active={resultType}` on the track is the only React involvement; the animation
  is entirely CSS.
- `@media (prefers-reduced-motion: reduce)` drops the transition to `none`.
- Verified by driving real Chrome with Playwright and sampling the computed transform
  each frame: `0 → 1.3 → 33.2 → 129.8 → 153.7 → 158.9px` over ~300ms — interpolated
  along the ease curve, not a jump. Measured segment widths `[155, 155]`, and
  `translateX` tracked `thumb width + 0.25rem gap` at both ends. Reduced-motion context
  reported `transition-duration: 0s`. The Articles side rendered 10 blog cards.

## i18n
- Only `page.typeBlog` changed value: "Blog" → "Articles" in en, fr and de.
- **French is deliberately "Articles"** even though it can read as merchandise next to
  "Produits". Chosen over "Actualités" and over keeping "Blog": *article de blog* is the
  standard French term, and it is literally what the index returns —
  `content_type.label` is "Article de blog" in the fr catalog.
- `de` mirrors English per the placeholder-locale convention
  (see `feature-nav-products-label.md`).
- Not touched, and still saying "Blog": the ACP section title `overlay.blogTitle`
  ("📝 Blog") and the `/blog` nav item. Those are the blog *section*; this switch names
  a *result set*. Worth revisiting together if the section is ever renamed.

## SDK contract used
- None changed. Both result sets were already fetched on every query — `useSearch` for
  products and `useCmsSearch` for `cms_page` — because the switch shows both counts and
  therefore needs both totals before either side is opened. This change is presentation
  only.

## Tracking (required)
- No change. Switching segments fires no event; the `SEARCH` event fires from the query
  itself, and both index queries already ran regardless of which segment is selected.

## UI constraints
- Tokens only: `--gray-100`, `--gray-200`, `--gray-600`, `--white`, `--indigo-50`,
  `--indigo-700`, `--indigo-800`, `--radius-pill`, `--shadow-sm`, `--font-sans`.
  No new hex, no new token.
- **No new primitive.** The switch is the existing pill idiom; the underline-tab style
  it replaced was used nowhere else, so the app now has one fewer visual idiom, not one
  more. Recorded under "Component patterns" in ../docs/design-system.md.

## MUST NOT change
- **Both segments always render, including a zero count.** A `0` on Articles is
  information ("nothing written about this"), not a reason to hide the segment. This
  predates the redesign and is the reason both totals are always fetched.
- `role="tablist"` / `role="tab"` / `aria-selected` on the switch and its segments. The
  visual is a switch, but the semantics are still a tab set and assistive tech relies
  on them.
- Resetting to the Products segment on a new query (`setResultType('product')` in the
  query effect) — it avoids landing on an empty Articles side.
- The count badges. They are the only place the *other* index's result count is
  visible, so removing them hides that a query matched editorial content at all.
- **Do not give `.result-type-tab.active` a background or box-shadow again.** It would
  sit on top of the thumb and the slide would read as a flicker instead of a movement.
- **Do not switch the track back to `inline-flex` or to auto-width columns.** Unequal
  segments break the one-column translate, and the thumb stops lining up with the
  segment it is meant to be under. Either keep `1fr 1fr`, or replace the whole
  mechanism with JS-measured offsets.
- The `prefers-reduced-motion` override.
