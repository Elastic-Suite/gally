# Feature: Autocomplete panel (ACP) visual redesign

## Status: implemented
## Page/Component: src/components/SearchBar.tsx, src/components/SearchOverlay.tsx, src/styles.css

> **Superseded on two values:** the scrim's tint and blur are now `rgba(30,27,75,.72)` /
> `blur(28px)`, raised because this doc's own decision to strip the panel's background left the
> scrim as the only ground the light text gets. See
> `specs/feature-add-to-cart-feedback-everywhere.md`. Everything else here is current.

## Context
Follow-up to `specs/feature-search-header-redesign.md`, which shipped the original overlay. This spec
supersedes that doc's *exact visual values* (blur amount, panel background, grid column ratios, search bar
size, header-search-band behavior) — the mechanisms it describes (portal, `ResizeObserver` header-height,
keyboard nav, state-preservation) are unchanged and still accurate there. This doc is the current source of
truth for what the ACP actually looks like.

## Behaviour (testable)

### Search bar: bigger, fixed size
- [x] `.search-bar-wrapper` grew from `66.6667%`/`900px`/`260px` to `width: 80%`, `max-width: 1100px`,
      `min-width: 320px`. `.search-bar` padding/font-size grew to match (`0.85rem 1.5rem 0.85rem 3rem` /
      `1.05rem`).
- [x] The old `transform: scale(1 → 1.08)` grow-on-focus animation is gone entirely — the bar is one fixed
      size regardless of focus state. The coral focus-ring glow (`.expanded .search-bar { box-shadow: 0 0 0
      3px rgba(255,107,107,.25) }`) is kept as the only focus affordance.

### Overlay + panel merged into one frosted-glass surface
- [x] `.search-overlay-panel` no longer has its own `background`/`backdrop-filter`/`border-radius`/
      `box-shadow` — it's pure grid layout now. `.search-overlay-scrim` alone owns the blur (`8px → 20px`)
      and tint (`rgba(30,27,75,.45) → .55`, bumped for contrast now that the panel doesn't add its own
      lightening layer on top of it). The panel's default text color flipped from `var(--gray-900)` (dark,
      for the old white card) to `rgba(255,255,255,.92)` (light, since it now sits directly on the dark blur).
- [x] Product cards are the one exception: they keep an opaque `background: white` (readability call — see
      "readable on blur" below) and explicitly reset `color: var(--gray-900)`, since otherwise they'd
      inherit the panel's new light text color and go invisible on their own white background.

### Readable on the blur
- [x] Everything that sits directly on the blurred scrim (section titles, suggestion text, category text,
      empty-state notes, item hover/highlight backgrounds) moved from dark tokens tuned for a white card
      (`--gray-400`, `--indigo-600`, `--gray-700`, `--indigo-50` hover) to light/white values
      (`rgba(255,255,255,.85–.95)`, hover `rgba(255,255,255,.1)`, highlighted `rgba(255,255,255,.16)`).
      Section titles also dropped their now-meaningless `background: var(--gray-50)` pill.
- [x] Text sizes bumped for legibility given the extra room: section titles `0.7rem → 0.85rem`, suggestion/
      category text `0.85rem → 1.05rem` (weight `500 → 600`), product name `1rem → 1.1rem`, price
      `0.95rem → 1.05rem`, empty-state `0.8rem → 0.95rem`.
- [x] The non-product loading skeleton (suggestions/categories, which also now sit on the blur) gets its own
      lighter shimmer gradient (`rgba(255,255,255,.15/.32)`) scoped via
      `.autocomplete-skeleton-item:not(.autocomplete-skeleton-product) .skeleton-shimmer` — product skeletons
      keep the original shimmer since their white card background is unchanged.

### Column widths — products get the room
- [x] `.search-overlay-panel`'s `grid-template-columns` went `repeat(3, 1fr)` → `0.7fr 1.6fr 0.7fr`:
      Suggestions and Category both narrowed equally, Products absorbs the freed space. `max-width` grew
      `1200px → 1500px`, `min-height` `20rem → 24rem`.
- [x] Narrowed again to `minmax(12rem, 0.45fr) 2.6fr minmax(12rem, 0.45fr)`: Suggestions and Category are
      single-line text lists (one term per row, never wrapping content), so they don't need a proportional
      share — they're floored at `12rem`, enough for the longest seeded suggestion/category name, and
      Products takes everything else (~70% of the panel vs ~53% before). The `minmax()` floor matters at
      narrow desktop widths, where a pure `0.45fr` would squeeze terms into wrapping; the mobile
      single-column override is unaffected.

### Product cards: bigger, closer to square, but still horizontal
- [x] Products render into a new `.autocomplete-products-grid` (2-column CSS grid, `gap: 0.85rem`) instead
      of one item per row — each card gets roughly half the (now much wider) Products column.
- [x] Cards stayed horizontal (thumb left, name/price right) — a vertical/stacked layout was tried first
      but reverted per feedback ("too vertical"); the squarer feel comes from the 2-per-row grid + bigger
      thumb (`40px → 64px → 80px` across iterations) alone, not from stacking.
- [x] `margin-top: 0.75rem` on `.autocomplete-products-grid` so the first row doesn't touch the "Products"
      title/divider directly above it.

### Keyboard-highlight visibility on product cards
- [x] **Bugfix:** product cards are already opaque white at rest, so the original highlighted-state ring
      (`0 0 0 2px var(--indigo-600)`, no background change) had nothing to contrast against and was barely
      visible — unlike suggestions/categories, whose highlight is a background change on an otherwise-
      transparent row, which pops immediately. Fixed by adding a background tint alongside a thicker ring:
      first tried `rgba(255,107,107,.1)` + `3px coral-500` (rejected as "ugly" — too red/harsh on a white
      card), landed on `background: var(--indigo-50)` + `box-shadow: var(--shadow-md), 0 0 0 3px
      var(--indigo-600)`.

### `.header-search-band`: stays white, gains blur instead of a color change
- [x] **Bugfix:** the original design darkened `.header-search-band` to `rgba(30,27,75,.92)` while the ACP
      was open. Per feedback this should never change color — removed that override so it stays
      `var(--gray-50)` always.
- [x] Follow-up ask: it should also participate in the blur look. Literal "same color, has blur" is a
      contradiction — `backdrop-filter` is invisible on a fully opaque background, so showing *any* blur
      requires *some* translucency. Implemented as `background: rgba(250,250,250,.96)` +
      `backdrop-filter: blur(20px)` (matching the scrim) only while `.search-bar-wrapper.overlay-open` is
      present; base/closed state is untouched, fully opaque `var(--gray-50)`.
- [x] The alpha had to be tuned twice: `0.75` let enough of the dark scrim tint bleed through to read as a
      visible color shift (reported as "still see a color difference") — raised to `0.96` so the bleed-
      through is imperceptible while `backdrop-filter` is nominally still active.
- [x] No component restructuring was needed for this — `backdrop-filter` operates on composited pixels
      behind an element regardless of DOM tree, and `.header-sticky-group`'s z-index is already bumped above
      the scrim's when the overlay is open (see the z-index bugfix in the prior spec), so the band can see
      the scrim through its own translucency without any DOM changes.

## SDK contract used
- None — purely visual/CSS + one JSX restructure (`ProductsColumn`'s grid wrapper). No change to
  `useAutocomplete()`, `useCatalog()`, or any data-fetching contract.

## Tracking (required)
- No change — see `specs/feature-search-header-redesign.md`; item selection/navigation is untouched.

## UI constraints
- `formatPrice()` (from `CatalogContext`, see `specs/bugfix-...` currency work) is used for product card
  prices unchanged by this redesign — only the surrounding card markup/CSS moved.
- No new color tokens introduced — all new values are either existing CSS variables (`--indigo-50/600`,
  `--coral-400`, `--shadow-md`) or `rgba()` of existing hex tokens, same idiom as the rest of `styles.css`.

## MUST NOT change
- Keyboard navigation logic, the flattened cross-column `highlightedIndex`, portal-to-`document.body`
  requirement, and the `ResizeObserver`-driven `--header-height` offset — all from the original spec,
  untouched by this visual pass.
- `getSuggestionMatches`/`getCategoryMatches` matching logic — unchanged, only the DOM/CSS around their
  output changed.
